import { Helmet } from 'react-helmet-async';

/**
 * Per-route SEO head management. Single source of truth for title, description,
 * canonical, robots, Open Graph and Twitter tags. Because the site is a SPA that
 * is prerendered at build time (see scripts/prerender.mjs), the tags this renders
 * into the live DOM are serialized into the static HTML each crawler receives.
 *
 * The dynamic SEO tags were removed from index.html so this component owns them
 * exclusively — otherwise the static tags and Helmet's tags would duplicate.
 */

const SITE_URL = 'https://achzeit.de';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

interface SeoProps {
  /** Full <title> text. */
  title: string;
  /** Meta description; omit on noindex utility pages. */
  description?: string;
  /** Path part of the canonical URL, e.g. "/impressum". Defaults to "/". */
  path?: string;
  /** Absolute OG/Twitter image URL. Defaults to the site OG image. */
  image?: string;
  /** Emit noindex,follow (legal pages, 404, utility routes). */
  noindex?: boolean;
  /** Open Graph object type. */
  type?: 'website' | 'article';
  /** Optional JSON-LD structured data injected into <head>. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const Seo = ({
  title,
  description,
  path = '/',
  image = DEFAULT_OG_IMAGE,
  noindex = false,
  type = 'website',
  jsonLd,
}: SeoProps) => {
  const canonical = `${SITE_URL}${path}`;
  const isDefaultImage = image === DEFAULT_OG_IMAGE;

  return (
    <Helmet prioritizeSeoTags>
      <html lang="de" />
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow'} />

      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      {isDefaultImage && <meta property="og:image:width" content="1448" />}
      {isDefaultImage && <meta property="og:image:height" content="1051" />}
      <meta property="og:locale" content="de_DE" />
      <meta property="og:locale:alternate" content="en_US" />
      <meta property="og:site_name" content="ACHZEIT Family & Friends Retreat" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@ACHZEIT" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={image} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default Seo;
