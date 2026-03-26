import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LISTING_ID = "463607";
let cachedToken = "";
let tokenExpiresAt = 0;
let cachedReviews: any[] | null = null;
let reviewsCachedAt = 0;
const REVIEWS_CACHE_TTL = 3600000; // 1 hour

async function getHostawayToken(): Promise<string> {
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Return cached reviews if fresh
    if (cachedReviews && Date.now() - reviewsCachedAt < REVIEWS_CACHE_TTL) {
      return new Response(JSON.stringify({ reviews: cachedReviews }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = await getHostawayToken();
    const res = await fetch(
      `https://api.hostaway.com/v1/reviews?listingMapId=${LISTING_ID}&limit=100`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) throw new Error(`Reviews fetch failed: ${res.status}`);
    const data = await res.json();

    const allResults = data.result || [];
    
    // Log first review's keys for debugging
    if (allResults.length > 0) {
      console.log("Sample review keys:", Object.keys(allResults[0]));
      console.log("Sample listingMapId:", allResults[0].listingMapId, typeof allResults[0].listingMapId);
      console.log("Sample listingId:", allResults[0].listingId, typeof allResults[0].listingId);
      console.log("Total reviews from API:", allResults.length);
    }

    // Filter to published reviews with actual content, strictly for this listing
    const reviews = allResults
      .filter((r: any) => {
        const matchesListing = String(r.listingMapId) === LISTING_ID || String(r.listingId) === LISTING_ID;
        const isValid = r.status === "published" && r.publicReview && r.rating;
        if (!matchesListing && isValid) {
          console.log(`Excluding review ${r.id} - listingMapId: ${r.listingMapId}, listingId: ${r.listingId}`);
        }
        return isValid && matchesListing;
      })
      .map((r: any) => ({
        id: r.id,
        reviewerName: r.reviewerName,
        rating: r.rating,
        review: r.publicReview,
        submittedAt: r.submittedAt,
        arrivalDate: r.arrivalDate,
        departureDate: r.departureDate,
      }));

    cachedReviews = reviews;
    reviewsCachedAt = Date.now();

    return new Response(JSON.stringify({ reviews }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch reviews" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
