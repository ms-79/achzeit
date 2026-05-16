import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LISTING_ID = "463607";
let cachedToken = "";
let tokenExpiresAt = 0;
let cachedRaw: any[] | null = null;
let rawCachedAt = 0;
const cachedByLocale: Record<string, any[]> = {};
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

function detectLang(text: string): "de" | "en" | "other" {
  const s = (text || "").toLowerCase().slice(0, 1000);
  if (!s.trim()) return "other";
  const deHits = (s.match(/\b(und|der|die|das|mit|für|ist|nicht|auch|sich|ein|eine|sind|wir|sie|ihr|im|zum|zur|bei|sehr|haus|war|sehr|gerne|empfehlen|aufenthalt|gäste)\b/g) || []).length;
  const enHits = (s.match(/\b(the|and|with|for|you|your|our|are|this|that|from|have|will|was|were|stay|host|recommend|great|nice)\b/g) || []).length;
  const umlauts = (s.match(/[äöüß]/g) || []).length;
  const deScore = deHits + umlauts * 2;
  if (deScore > enHits && deScore >= 2) return "de";
  if (enHits > deScore && enHits >= 2) return "en";
  return "other";
}

async function translateReviews(
  reviews: { id: number; review: string }[],
  target: "de" | "en",
): Promise<Record<string, string>> {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey || reviews.length === 0) return {};
  const targetName = target === "de" ? "German (use 'Du'/'du' form)" : "English";
  const sys =
    `You translate vacation rental guest reviews to ${targetName}. ` +
    `Keep the tone natural, warm and authentic. Preserve emojis and punctuation. ` +
    `Return ONLY a JSON object mapping each review id (as string) to the translated text. ` +
    `No code fences, no commentary. If a review is already in ${targetName}, return it unchanged.`;
  const userPayload = JSON.stringify(
    reviews.map((r) => ({ id: String(r.id), text: r.review })),
  );
  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: sys },
          { role: "user", content: userPayload },
        ],
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) {
      console.error("translateReviews failed:", res.status, await res.text());
      return {};
    }
    const data = await res.json();
    const out = data?.choices?.[0]?.message?.content;
    if (typeof out !== "string") return {};
    const clean = out.trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/i, "").trim();
    const parsed = JSON.parse(clean);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (e) {
    console.error("translateReviews error:", e);
    return {};
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    let localeRaw = (url.searchParams.get("locale") || "").toLowerCase();
    if (!localeRaw && req.method === "POST") {
      try {
        const txt = await req.text();
        const body = txt ? JSON.parse(txt) : {};
        localeRaw = String(body?.locale || "").toLowerCase();
      } catch (_) { /* ignore */ }
    }
    const locale: "de" | "en" = localeRaw === "en" ? "en" : "de";

    // Serve from locale cache if fresh
    if (
      cachedByLocale[locale] &&
      Date.now() - rawCachedAt < REVIEWS_CACHE_TTL
    ) {
      return new Response(JSON.stringify({ reviews: cachedByLocale[locale] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Refetch raw reviews if stale
    if (!cachedRaw || Date.now() - rawCachedAt >= REVIEWS_CACHE_TTL) {
      const token = await getHostawayToken();
      const res = await fetch(
        `https://api.hostaway.com/v1/reviews?listingMapId=${LISTING_ID}&limit=100`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) throw new Error(`Reviews fetch failed: ${res.status}`);
      const data = await res.json();
      cachedRaw = (data.result || [])
        .filter((r: any) =>
          r.status === "published" &&
          r.publicReview &&
          r.rating &&
          String(r.listingMapId) === LISTING_ID
        )
        .map((r: any) => ({
          id: r.id,
          reviewerName: r.reviewerName || r.guestName,
          rating: r.rating,
          review: r.publicReview,
          submittedAt: r.submittedAt,
          arrivalDate: r.arrivalDate,
          departureDate: r.departureDate,
        }));
      rawCachedAt = Date.now();
      // Invalidate locale caches
      for (const k of Object.keys(cachedByLocale)) delete cachedByLocale[k];
    }

    const raw = cachedRaw || [];
    // Identify reviews that need translation
    const needTranslate = raw.filter((r) => {
      const lang = detectLang(r.review);
      return lang !== "other" && lang !== locale;
    });
    const translations = needTranslate.length > 0
      ? await translateReviews(needTranslate.map((r) => ({ id: r.id, review: r.review })), locale)
      : {};

    const localized = raw.map((r) => ({
      ...r,
      review: translations[String(r.id)] || r.review,
      originalReview: translations[String(r.id)] ? r.review : undefined,
    }));
    cachedByLocale[locale] = localized;

    return new Response(JSON.stringify({ reviews: localized }), {
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
