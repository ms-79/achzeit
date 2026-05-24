export const config = { runtime: 'edge' };

const LISTING_ID = '463607';
let cachedToken: string | null = null;
let tokenExpiresAt = 0;
let cached: { data: any[]; fetchedAt: number } | null = null;
const CACHE_TTL = 5 * 60_000;

async function getHostawayToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;
  const accountId = process.env.HOSTAWAY_ACCOUNT_ID;
  const apiKey = process.env.HOSTAWAY_API_KEY;
  if (!accountId || !apiKey) throw new Error('Hostaway credentials missing');
  const res = await fetch('https://api.hostaway.com/v1/accessTokens', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: accountId, client_secret: apiKey, scope: 'general' }),
  });
  if (!res.ok) throw new Error(`Token request failed: ${await res.text()}`);
  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + 3500_000;
  return data.access_token;
}

export default async function handler(_req: Request): Promise<Response> {
  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

  try {
    const now = Date.now();
    if (cached && (now - cached.fetchedAt) < CACHE_TTL) {
      return json({ days: cached.data });
    }
    const token = await getHostawayToken();
    const start = new Date().toISOString().slice(0, 10);
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 14);
    const end = endDate.toISOString().slice(0, 10);

    const res = await fetch(`https://api.hostaway.com/v1/listings/${LISTING_ID}/calendar?startDate=${start}&endDate=${end}`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error(`Hostaway calendar error: ${res.status}`);

    const json2 = await res.json();
    const result = (json2.result || []).map((d: any) => ({
      date: d.date,
      isAvailable: d.isAvailable === 1 || d.isAvailable === true,
      status: d.status,
      price: typeof d.price === 'number' ? d.price : Number(d.price) || null,
      currency: d.currency || 'EUR',
      minimumStay: d.minimumStay ?? null,
    }));
    cached = { data: result, fetchedAt: now };
    return json({ days: result });
  } catch (e) {
    return json({ error: String((e as Error).message || e) }, 500);
  }
}
