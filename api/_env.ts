// Shared helpers for reading environment variables in Edge functions.
//
// Vercel env values are sometimes stored with a leading UTF-8 BOM or stray
// whitespace (e.g. when pasted from a file). An invisible BOM in front of a
// URL makes `fetch()` throw "Invalid URL string."; in an API key it breaks
// auth. Always read env vars through `env()` so they are sanitized.
//
// Files in `api/` whose name starts with `_` are not treated as routes by
// Vercel, so this module is import-only.

/** Read an env var with the BOM stripped and surrounding whitespace trimmed. */
export const env = (name: string): string | undefined => {
  let v = process.env[name];
  if (v == null) return undefined;
  // Strip a leading UTF-8 BOM (U+FEFF, char code 65279) if present, then trim.
  if (v.charCodeAt(0) === 0xfeff) v = v.slice(1);
  return v.trim();
};

/**
 * Read an absolute http(s) base URL from an env var. Falls back to `fallback`
 * if the value is missing, empty, or not a valid absolute URL (e.g. a BOM
 * survived, or the protocol is missing).
 */
export const envBaseUrl = (name: string, fallback: string): string => {
  const v = env(name);
  return v && /^https?:\/\//i.test(v) ? v.replace(/\/+$/, '') : fallback;
};
