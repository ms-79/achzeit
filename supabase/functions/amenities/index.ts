const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LISTING_ID = "463607";
let cachedToken = "";
let tokenExpiresAt = 0;
let cachedAmenities: string[] | null = null;
let amenitiesCachedAt = 0;
const CACHE_TTL = 6 * 60 * 60 * 1000;

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;
  const accountId = Deno.env.get("HOSTAWAY_ACCOUNT_ID");
  const apiKey = Deno.env.get("HOSTAWAY_API_KEY");
  if (!accountId || !apiKey) throw new Error("Missing Hostaway credentials");

  const res = await fetch("https://api.hostaway.com/v1/accessTokens", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: accountId,
      client_secret: apiKey,
      scope: "general",
    }),
  });
  if (!res.ok) throw new Error(`Token request failed: ${await res.text()}`);
  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in - 120) * 1000;
  return cachedToken;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    if (cachedAmenities && Date.now() - amenitiesCachedAt < CACHE_TTL) {
      return new Response(JSON.stringify({ amenities: cachedAmenities }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = await getToken();
    const res = await fetch(
      `https://api.hostaway.com/v1/listings/${LISTING_ID}?includeResources=1`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!res.ok) throw new Error(`Listing fetch failed: ${res.status}`);
    const data = await res.json();
    const listing = data.result || {};
    console.log("listing keys:", Object.keys(listing).join(","));

    // Hostaway returns "listingAmenities": [{ amenityId, amenityName }]
    // but on some accounts only "listingAmenities": [{ id, amenityId }] (numeric IDs).
    // Fetch amenity catalog to resolve IDs → names if needed.
    const raw = listing.listingAmenities || [];
    console.log("listingAmenities sample:", JSON.stringify(raw.slice(0, 3)));

    let names: string[] = raw
      .map((a: any) => a.amenityName || a.name || "")
      .filter((s: string) => !!s);

    if (names.length === 0 && raw.length > 0) {
      // Resolve via amenities catalog
      try {
        const catRes = await fetch("https://api.hostaway.com/v1/amenities", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (catRes.ok) {
          const catData = await catRes.json();
          const catalog: Record<string, string> = {};
          for (const c of (catData.result || [])) {
            catalog[String(c.id)] = c.name;
          }
          names = raw
            .map((a: any) => catalog[String(a.amenityId ?? a.id)] || "")
            .filter((s: string) => !!s);
        }
      } catch (e) {
        console.error("Catalog fetch failed:", e);
      }
    }

    const amenities = Array.from(new Set(names));
    cachedAmenities = amenities;
    amenitiesCachedAt = Date.now();

    return new Response(JSON.stringify({ amenities }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("amenities error:", error);
    return new Response(JSON.stringify({ error: String(error), amenities: [] }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
