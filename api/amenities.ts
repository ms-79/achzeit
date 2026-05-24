export const config = { runtime: 'edge' };

const LISTING_ID = '463607';
let cachedToken = '';
let tokenExpiresAt = 0;
let cachedAmenities: string[] | null = null;
let amenitiesCachedAt = 0;
const cachedDescriptions: Record<string, string> = {};
const cachedSummaries: Record<string, string> = {};
const CACHE_TTL = 6 * 60 * 60 * 1000;

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;
  const accountId = process.env.HOSTAWAY_ACCOUNT_ID;
  const apiKey = process.env.HOSTAWAY_API_KEY;
  if (!accountId || !apiKey) throw new Error('Missing Hostaway credentials');
  const res = await fetch('https://api.hostaway.com/v1/accessTokens', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: accountId, client_secret: apiKey, scope: 'general' }),
  });
  if (!res.ok) throw new Error(`Token request failed: ${await res.text()}`);
  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in - 120) * 1000;
  return cachedToken;
}

function detectLang(text: string): 'de' | 'en' | 'other' {
  const sample = text.toLowerCase().slice(0, 2000);
  if (!sample.trim()) return 'other';
  const deHits = (sample.match(/\b(und|der|die|das|mit|für|ist|nicht|auch|sich|ein|eine|sind|wir|sie|ihr|im|zum|zur|bei|sehr|haus|wohnung|küche|schlafzimmer|gäste|aussicht|berge|gemütlich|ferienhaus)\b/g) || []).length;
  const enHits = (sample.match(/\b(the|and|with|for|you|your|our|are|this|that|from|have|will|kitchen|bedroom|guests|mountain|view|cozy|house|apartment|vacation)\b/g) || []).length;
  const umlauts = (sample.match(/[äöüß]/g) || []).length;
  const deScore = deHits + umlauts * 2;
  if (deScore > enHits && deScore >= 3) return 'de';
  if (enHits > deScore && enHits >= 3) return 'en';
  return 'other';
}

async function aiFormat(text: string, targetLang: 'de' | 'en', needsTranslation: boolean): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || !text.trim()) return text;
  const langName = targetLang === 'de' ? 'Deutsch (Du-Form)' : 'English';
  const sys = `Du formatierst Ferienhaus-Beschreibungen für eine hochwertige Website.\n\nAUFGABE:\n1. ${needsTranslation ? `Übersetze den Text vollständig nach ${langName}.` : `Der Text ist bereits ${langName} — behalte die Sprache exakt bei.`}\n2. Erkenne logische Abschnitte und gib ihnen kurze, klare Überschriften.\n3. Strukturiere den Output als sauberes HTML mit <h3> für Überschriften und <p> für Absätze.\n4. Erlaubte Tags NUR: <h3>, <p>, <strong>, <em>, <br>, <ul>, <li>. Keine anderen Tags.\n5. Keine Inhalte hinzuerfinden oder weglassen.\n6. Antworte ausschließlich mit dem HTML.`;
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 4096, system: sys, messages: [{ role: 'user', content: text }] }),
    });
    if (!res.ok) return text;
    const data = await res.json();
    let out = data?.content?.[0]?.text;
    if (typeof out !== 'string' || !out.trim()) return text;
    return out.trim().replace(/^```(?:html)?\s*/i, '').replace(/```$/i, '').trim();
  } catch { return text; }
}

export default async function handler(req: Request): Promise<Response> {
  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

  try {
    const url = new URL(req.url);
    const bypass = url.searchParams.get('refresh') === '1';
    let locale: 'de' | 'en' = 'en';
    if (req.method === 'POST') {
      try { const body = await req.json(); locale = body?.locale === 'de' ? 'de' : 'en'; } catch { /* ignore */ }
    } else {
      locale = url.searchParams.get('locale') === 'de' ? 'de' : 'en';
    }

    if (!bypass && cachedAmenities && Date.now() - amenitiesCachedAt < CACHE_TTL && cachedDescriptions[locale]) {
      return json({ amenities: cachedAmenities, description: cachedDescriptions[locale] || '', summary: cachedSummaries[locale] || '', locale });
    }

    const token = await getToken();
    const res = await fetch(`https://api.hostaway.com/v1/listings/${LISTING_ID}?includeResources=1`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error(`Listing fetch failed: ${res.status}`);
    const data = await res.json();
    const listing = data.result || {};

    const raw = listing.listingAmenities || [];
    let names: string[] = raw.map((a: any) => a.amenityName || a.name || '').filter((s: string) => !!s);
    if (names.length === 0 && raw.length > 0) {
      try {
        const catRes = await fetch('https://api.hostaway.com/v1/amenities', { headers: { Authorization: `Bearer ${token}` } });
        if (catRes.ok) {
          const catData = await catRes.json();
          const catalog: Record<string, string> = {};
          for (const c of (catData.result || [])) catalog[String(c.id)] = c.name;
          names = raw.map((a: any) => catalog[String(a.amenityId ?? a.id)] || '').filter((s: string) => !!s);
        }
      } catch { /* ignore */ }
    }
    cachedAmenities = Array.from(new Set(names));
    amenitiesCachedAt = Date.now();

    const defaultDesc = String(listing.description || listing.descriptionLong || listing.summary || '');
    const defaultSum = String(listing.summary || '');
    const storeAs = detectLang(defaultDesc) === 'de' ? 'de' : 'en';
    cachedDescriptions[storeAs] = defaultDesc;
    cachedSummaries[storeAs] = defaultSum;

    const translations: any[] = Array.isArray(listing.listingTranslations) ? listing.listingTranslations : [];
    for (const tr of translations) {
      const lang = String(tr.language || tr.languageCode || '').toLowerCase().slice(0, 2);
      if (!lang) continue;
      const desc = String(tr.description || tr.descriptionLong || tr.summary || '');
      const sum = String(tr.summary || '');
      if (desc) {
        const actual = detectLang(desc);
        if (actual === 'other' || actual === lang) cachedDescriptions[lang] = desc;
      }
      if (sum) cachedSummaries[lang] = sum;
    }

    const have = cachedDescriptions[locale];
    const haveLang = have ? detectLang(have) : 'other';
    if (!have || (haveLang !== 'other' && haveLang !== locale)) {
      const source = cachedDescriptions[locale === 'de' ? 'en' : 'de'] || cachedDescriptions.en || cachedDescriptions.de || defaultDesc;
      cachedDescriptions[locale] = await aiFormat(source, locale, detectLang(source) !== locale);
    } else if (have && !/<h3|<p/i.test(have)) {
      cachedDescriptions[locale] = await aiFormat(have, locale, false);
    }

    return json({ amenities: cachedAmenities, description: cachedDescriptions[locale] || '', summary: cachedSummaries[locale] || '', locale });
  } catch (error) {
    return json({ error: String(error), amenities: [], description: '', summary: '' }, 500);
  }
}
