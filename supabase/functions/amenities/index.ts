const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LISTING_ID = "463607";
let cachedToken = "";
let tokenExpiresAt = 0;
let cachedAmenities: string[] | null = null;
let amenitiesCachedAt = 0;
const cachedDescriptions: Record<string, string> = {};
const cachedSummaries: Record<string, string> = {};
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

async function translateToGerman(text: string): Promise<string> {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey || !text.trim()) return text;
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
          {
            role: "system",
            content:
              "Du bist ein professioneller Übersetzer für hochwertige Ferienhaus-Beschreibungen. " +
              "Übersetze den Text vom Englischen ins Deutsche. " +
              "Behalte Absätze, Zeilenumbrüche und HTML-Tags wie <b>...</b> exakt bei. " +
              "Verwende einen einladenden, hochwertigen Ton (Du-Form). " +
              "Gib nur die Übersetzung zurück, keinen zusätzlichen Text.",
          },
          { role: "user", content: text },
        ],
      }),
    });
    if (!res.ok) {
      console.error("Translation failed:", res.status, await res.text());
      return text;
    }
    const data = await res.json();
    const out = data?.choices?.[0]?.message?.content;
    return typeof out === "string" && out.trim() ? out.trim() : text;
  } catch (e) {
    console.error("Translation error:", e);
    return text;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const url = new URL(req.url);
    const bypass = url.searchParams.get("refresh") === "1";
    let localeRaw = (url.searchParams.get("locale") || "").toLowerCase();
    if (!localeRaw && req.method === "POST") {
      try {
        const txt = await req.text();
        const body = txt ? JSON.parse(txt) : {};
        localeRaw = String(body?.locale || "").toLowerCase();
        console.log("parsed body locale:", localeRaw, "raw:", txt);
      } catch (e) {
        console.error("body parse failed:", e);
      }
    }
    if (!localeRaw) localeRaw = "en";
    const locale = localeRaw === "de" ? "de" : "en";
    console.log("resolved locale:", locale, "method:", req.method);
    if (
      !bypass &&
      cachedAmenities &&
      Date.now() - amenitiesCachedAt < CACHE_TTL &&
      cachedDescriptions[locale]
    ) {
      return new Response(JSON.stringify({
        amenities: cachedAmenities,
        description: cachedDescriptions[locale] || cachedDescriptions.en || "",
        summary: cachedSummaries[locale] || cachedSummaries.en || "",
        locale,
      }), {
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
    if (listing.listingTranslations) {
      console.log(
        "translations languages:",
        (listing.listingTranslations || []).map((t: any) => t.language).join(","),
      );
    }

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

    // Default fields are typically EN on this account.
    cachedDescriptions.en = String(
      listing.description || listing.descriptionLong || listing.summary || "",
    );
    cachedSummaries.en = String(listing.summary || "");

    // Hostaway returns localized variants in `listingTranslations`.
    const translations: any[] = Array.isArray(listing.listingTranslations)
      ? listing.listingTranslations
      : [];
    for (const tr of translations) {
      const lang = String(tr.language || tr.languageCode || "").toLowerCase().slice(0, 2);
      if (!lang) continue;
      const desc = String(tr.description || tr.descriptionLong || tr.summary || "");
      const sum = String(tr.summary || "");
      if (desc) cachedDescriptions[lang] = desc;
      if (sum) cachedSummaries[lang] = sum;
    }

    // Fallback: if no German translation in Hostaway and the user wants DE,
    // translate the English description once via Lovable AI Gateway and cache it.
    if (locale === "de" && !cachedDescriptions.de && cachedDescriptions.en) {
      console.log("Translating description EN → DE via Lovable AI");
      cachedDescriptions.de = await translateToGerman(cachedDescriptions.en);
      if (cachedSummaries.en) {
        cachedSummaries.de = await translateToGerman(cachedSummaries.en);
      }
    }

    return new Response(JSON.stringify({
      amenities,
      description: cachedDescriptions[locale] || cachedDescriptions.en || "",
      summary: cachedSummaries[locale] || cachedSummaries.en || "",
      locale,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("amenities error:", error);
    return new Response(JSON.stringify({ error: String(error), amenities: [], description: "", summary: "" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
