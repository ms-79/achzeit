/**
 * Build-time prerendering for the SPA.
 *
 * Vite ships a client-rendered app: crawlers reliably see only the static <head>,
 * not the body content. This script renders each known route in a headless browser
 * after `vite build` and writes the fully-rendered HTML back into dist/, so every
 * crawler receives complete, indexable markup (incl. the per-route <Seo> tags that
 * react-helmet-async injects into the live DOM).
 *
 * Design notes:
 * - Third-party requests (analytics, Cookiebot, fonts) and all /api/ calls are
 *   aborted. The live page never reaches network idle otherwise, and none of that
 *   is needed for the indexable text content.
 * - Failure is non-fatal: any error logs a warning and exits 0 so the deploy still
 *   ships (the app falls back to normal client-side rendering for that route).
 * - Set PRERENDER=false to skip entirely (e.g. local quick builds).
 */
import http from 'node:http';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '..', 'dist');
const PORT = 4321;
const BASE = `http://127.0.0.1:${PORT}`;

// Routes to prerender. Keep in sync with the <Routes> in src/App.tsx.
const ROUTES = [
  '/',
  '/impressum',
  '/datenschutz',
  '/cookies',
  '/buchungsbedingungen',
  '/kurbeitrag-danke',
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Minimal static file server for dist/ with SPA fallback to index.html. */
function startServer() {
  const indexPath = path.join(DIST, 'index.html');
  const server = http.createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent(new URL(req.url, BASE).pathname);
      let filePath = path.join(DIST, urlPath);
      let info = await stat(filePath).catch(() => null);

      // Directory or unknown route → SPA fallback to the built index.html.
      if (!info || info.isDirectory()) {
        const ext = path.extname(urlPath);
        if (ext && ext !== '.html') {
          res.statusCode = 404;
          res.end('Not found');
          return;
        }
        filePath = indexPath;
        info = await stat(filePath).catch(() => null);
        if (!info) {
          res.statusCode = 404;
          res.end('Not found');
          return;
        }
      }

      res.setHeader('Content-Type', MIME[path.extname(filePath)] || 'application/octet-stream');
      createReadStream(filePath).pipe(res);
    } catch {
      res.statusCode = 500;
      res.end('Server error');
    }
  });
  return new Promise((resolve) => server.listen(PORT, '127.0.0.1', () => resolve(server)));
}

async function autoScroll(page) {
  // Scroll through the page so IntersectionObserver-based reveals settle to their
  // visible state before we serialize.
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let total = 0;
      const step = 600;
      const timer = setInterval(() => {
        window.scrollBy(0, step);
        total += step;
        if (total >= document.body.scrollHeight + window.innerHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 50);
    });
  });
}

async function run() {
  if (process.env.PRERENDER === 'false') {
    console.log('[prerender] skipped (PRERENDER=false)');
    return;
  }

  // Imported lazily so a missing/broken puppeteer install never blocks the build.
  const { default: puppeteer } = await import('puppeteer');

  const server = await startServer();
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    for (const route of ROUTES) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 900 });
      await page.setRequestInterception(true);
      page.on('request', (reqI) => {
        const url = reqI.url();
        const sameOrigin = url.startsWith(BASE);
        const isApi = url.includes('/api/');
        if (!sameOrigin || isApi) reqI.abort().catch(() => {});
        else reqI.continue().catch(() => {});
      });

      try {
        await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
        // Wait until React has mounted content into #root.
        await page.waitForFunction(
          () => document.querySelector('#root')?.children.length > 0,
          { timeout: 15000 },
        );
        await autoScroll(page);
        // Home page: wait for the last lazy section (contact) to confirm all
        // Suspense chunks resolved.
        if (route === '/') {
          await page.waitForSelector('#contact', { timeout: 15000 }).catch(() => {});
        }
        await sleep(700);

        const html = await page.content();
        const outDir = route === '/' ? DIST : path.join(DIST, route);
        await mkdir(outDir, { recursive: true });
        await writeFile(path.join(outDir, 'index.html'), html, 'utf-8');
        console.log(`[prerender] ✓ ${route}`);
      } catch (err) {
        console.warn(`[prerender] ✗ ${route} — ${err.message} (left as SPA)`);
      } finally {
        await page.close().catch(() => {});
      }
    }
  } finally {
    await browser.close().catch(() => {});
    server.close();
  }
}

run().catch((err) => {
  console.warn(`[prerender] skipped due to error: ${err.message}`);
  process.exit(0); // never fail the build because of prerendering
});
