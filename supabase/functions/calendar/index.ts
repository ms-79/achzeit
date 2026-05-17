const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LISTING_ID = "463607";

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

interface CachedCalendar {
  data: any[];
  fetchedAt: number;
}
let cached: CachedCalendar | null = null;
const CACHE_TTL = 5 * 60_000; // 5min

async function getHostawayToken(accountId: string, apiKey: string): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: accountId,
    client_secret: apiKey,
    scope: "general",
  });
  const res = await fetch("https://api.hostaway.com/v1/accessTokens", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`Token request failed: ${await res.text()}`);
  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + 3500_000;
  return data.access_token;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const accountId = Deno.env.get("HOSTAWAY_ACCOUNT_ID");
    const apiKey = Deno.env.get("HOSTAWAY_API_KEY");
    if (!accountId || !apiKey) throw new Error("Hostaway credentials missing");

    const now = Date.now();
    if (cached && (now - cached.fetchedAt) < CACHE_TTL) {
      return new Response(JSON.stringify({ days: cached.data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = await getHostawayToken(accountId, apiKey);
    const start = new Date().toISOString().slice(0, 10);
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 14);
    const end = endDate.toISOString().slice(0, 10);

    const res = await fetch(
      `https://api.hostaway.com/v1/listings/${LISTING_ID}/calendar?startDate=${start}&endDate=${end}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!res.ok) throw new Error(`Hostaway calendar error: ${res.status} ${await res.text()}`);

    const json = await res.json();
    const result = (json.result || []).map((d: any) => ({
      date: d.date,
      isAvailable: d.isAvailable === 1 || d.isAvailable === true,
      status: d.status,
      price: typeof d.price === "number" ? d.price : Number(d.price) || null,
      currency: d.currency || "EUR",
      minimumStay: d.minimumStay ?? null,
    }));

    cached = { data: result, fetchedAt: now };

    return new Response(JSON.stringify({ days: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("calendar error", e);
    return new Response(JSON.stringify({ error: String((e as Error).message || e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
