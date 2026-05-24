export const config = { runtime: 'edge' };

const LISTING_ID = '463607';
let cachedToken = '';
let tokenExpiresAt = 0;
let cachedRaw: any[] | null = null;
let rawCachedAt = 0;
const cachedByLocale: Record<string, any[]> = {};
const REVIEWS_CACHE_TTL = 3600000;

async function getHostawayToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;
  const accountId = process.env.HOSTAWAY_CLIENT_ID;
  const apiKey = process.env.HOSTAWAY_API_TOKEN;
  const baseUrl = process.env.HOSTAWAY_BASE_URL || 'https://api.hostaway.com/v1';
  if (!accountId || !apiKey) throw new Error('Missing Hostaway credentials');
  const res = await fetch(`${baseUrl}/accessTokens`, {
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
  const s = (text || '').toLowerCase().slice(0, 1000);
  if (!s.trim()) return 'other';
  const deHits = (s.match(/\b(und|der|die|das|mit|für|ist|nicht|auch|sich|ein|eine|sind|wir|sie|ihr|im|zum|zur|bei|sehr|haus|war|gerne|empfehlen|aufenthalt|gäste)\b/g) || []).length;
  const enHits = (s.match(/\b(the|and|with|for|you|your|our|are|this|that|from|have|will|was|were|stay|host|recommend|great|nice)\b/g) || []).length;
  const umlauts = (s.match(/[äöüß]/g) || []).length;
  const deScore = deHits + umlauts * 2;
  if (deScore > enHits && deScore >= 2) return 'de';
  if (enHits > deScore && enHits >= 2) return 'en';
  return 'other';
}

async function translateReviews(reviews: { id: number; review: string }[], target: 'de' | 'en'): Promise<Record<string, string>> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || reviews.length === 0) return {};
  const targetName = target === 'de' ? "German (use 'Du'/'du' form)" : 'English';
  const sys = `You translate vacation rental guest reviews to ${targetName}. Keep the tone natural, warm and authentic. Preserve emojis and punctuation. Return ONLY a JSON object mapping each review id (as string) to the translated text. No code fences, no commentary.`;
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4096,
        system: sys,
        messages: [{ role: 'user', content: JSON.stringify(reviews.map((r) => ({ id: String(r.id), text: r.review }))) }],
      }),
    });
    if (!res.ok) return {};
    const data = await res.json();
    const out = data?.content?.[0]?.text;
    if (typeof out !== 'string') return {};
    const clean = out.trim().replace(/^```(?:json)?\s*/i, '').replace(/```$/i, '').trim();
    const parsed = JSON.parse(clean);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch { return {}; }
}

export default async function handler(req: Request): Promise<Response> {
  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

  try {
    const url = new URL(req.url);
    let locale: 'de' | 'en' = 'de';
    if (req.method === 'POST') {
      try { const body = await req.json(); locale = body?.locale === 'en' ? 'en' : 'de'; } catch { /* ignore */ }
    } else {
      locale = url.searchParams.get('locale') === 'en' ? 'en' : 'de';
    }

    if (cachedByLocale[locale] && Date.now() - rawCachedAt < REVIEWS_CACHE_TTL) {
      return json({ reviews: cachedByLocale[locale] });
    }

    if (!cachedRaw || Date.now() - rawCachedAt >= REVIEWS_CACHE_TTL) {
      const token = await getHostawayToken();
      const res = await fetch(`https://api.hostaway.com/v1/reviews?listingMapId=${LISTING_ID}&limit=100`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(`Reviews fetch failed: ${res.status}`);
      const data = await res.json();
      cachedRaw = (data.result || [])
        .filter((r: any) => r.status === 'published' && r.publicReview && r.rating && String(r.listingMapId) === LISTING_ID)
        .map((r: any) => ({ id: r.id, reviewerName: r.reviewerName || r.guestName, rating: r.rating, review: r.publicReview, submittedAt: r.submittedAt, arrivalDate: r.arrivalDate, departureDate: r.departureDate }));
      rawCachedAt = Date.now();
      for (const k of Object.keys(cachedByLocale)) delete cachedByLocale[k];
    }

    const raw = cachedRaw || [];
    const needTranslate = raw.filter((r) => { const lang = detectLang(r.review); return lang !== 'other' && lang !== locale; });
    const translations = needTranslate.length > 0 ? await translateReviews(needTranslate.map((r) => ({ id: r.id, review: r.review })), locale) : {};
    const localized = raw.map((r) => ({ ...r, review: translations[String(r.id)] || r.review, originalReview: translations[String(r.id)] ? r.review : undefined }));
    cachedByLocale[locale] = localized;

    return json({ reviews: localized });
  } catch (error) {
    return json({ error: 'Failed to fetch reviews' }, 500);
  }
}
