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

// Heuristic language detection between de and en.
function detectLang(text: string): "de" | "en" | "other" {
  const sample = text.toLowerCase().slice(0, 2000);
  if (!sample.trim()) return "other";
  const deHits = (sample.match(/\b(und|der|die|das|mit|für|ist|nicht|auch|sich|ein|eine|sind|wir|sie|ihr|im|zum|zur|bei|sehr|haus|wohnung|küche|schlafzimmer|gäste|aussicht|berge|gemütlich|ferienhaus)\b/g) || []).length;
  const enHits = (sample.match(/\b(the|and|with|for|you|your|our|are|this|that|from|have|will|kitchen|bedroom|guests|mountain|view|cozy|house|apartment|vacation)\b/g) || []).length;
  const umlauts = (sample.match(/[äöüß]/g) || []).length;
  const deScore = deHits + umlauts * 2;
  if (deScore > enHits && deScore >= 3) return "de";
  if (enHits > deScore && enHits >= 3) return "en";
  return "other";
}

// Translate + structure: returns HTML with <h3> headings and <p> paragraphs.
async function aiFormat(
  text: string,
  targetLang: "de" | "en",
  needsTranslation: boolean,
): Promise<string> {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey || !text.trim()) return text;
  const langName = targetLang === "de" ? "Deutsch (Du-Form)" : "English";
  const sys =
    `Du formatierst Ferienhaus-Beschreibungen für eine hochwertige Website.\n\n` +
    `AUFGABE:\n` +
    `1. ${needsTranslation ? `Übersetze den Text vollständig nach ${langName}.` : `Der Text ist bereits ${langName} — behalte die Sprache exakt bei.`}\n` +
    `2. Erkenne logische Abschnitte (z.B. "Das Haus", "Schlafzimmer", "Ausstattung", "Lage", "Aktivitäten") und gib ihnen kurze, klare Überschriften.\n` +
    `3. Strukturiere den Output als sauberes HTML mit <h3> für Überschriften und <p> für Absätze.\n` +
    `4. Erlaubte Tags NUR: <h3>, <p>, <strong>, <em>, <br>, <ul>, <li>. Keine anderen Tags, keine Attribute, keine Markdown-Zeichen wie ** oder ##.\n` +
    `5. Keine Inhalte hinzuerfinden oder weglassen. Doppelte Infos entfernen.\n` +
    `6. Antworte ausschließlich mit dem HTML, ohne Code-Fences, ohne Vor-/Nachtext.`;
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
          { role: "user", content: text },
        ],
      }),
    });
    if (!res.ok) {
      console.error("aiFormat failed:", res.status, await res.text());
      return text;
    }
    const data = await res.json();
    let out = data?.choices?.[0]?.message?.content;
    if (typeof out !== "string" || !out.trim()) return text;
    out = out.trim().replace(/^```(?:html)?\s*/i, "").replace(/```$/i, "").trim();
    return out;
  } catch (e) {
    console.error("aiFormat error:", e);
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
    const defaultDesc = String(
      listing.description || listing.descriptionLong || listing.summary || "",
    );
    const defaultSum = String(listing.summary || "");
    const defaultLang = detectLang(defaultDesc);
    console.log("default description detected lang:", defaultLang);
    // Store raw under detected language (default to en if undetermined).
    const storeAs = defaultLang === "de" ? "de" : "en";
    cachedDescriptions[storeAs] = defaultDesc;
    cachedSummaries[storeAs] = defaultSum;

    // Hostaway returns localized variants in `listingTranslations`.
    const translations: any[] = Array.isArray(listing.listingTranslations)
      ? listing.listingTranslations
      : [];
    for (const tr of translations) {
      const lang = String(tr.language || tr.languageCode || "").toLowerCase().slice(0, 2);
      if (!lang) continue;
      const desc = String(tr.description || tr.descriptionLong || tr.summary || "");
      const sum = String(tr.summary || "");
      if (desc) {
        // Verify it actually matches the claimed language; otherwise discard.
        const actual = detectLang(desc);
        if (actual === "other" || actual === lang) {
          cachedDescriptions[lang] = desc;
        } else {
          console.log(`discarding translation '${lang}' — actual lang is '${actual}'`);
        }
      }
      if (sum) cachedSummaries[lang] = sum;
    }

    // Ensure we have the requested locale: detect actual language and format.
    const have = cachedDescriptions[locale];
    const haveLang = have ? detectLang(have) : "other";
    if (!have || (haveLang !== "other" && haveLang !== locale)) {
      const source =
        cachedDescriptions[locale === "de" ? "en" : "de"] ||
        cachedDescriptions.en ||
        cachedDescriptions.de ||
        defaultDesc;
      console.log(`Formatting/translating description → ${locale} (source lang: ${detectLang(source)})`);
      cachedDescriptions[locale] = await aiFormat(source, locale, detectLang(source) !== locale);
    } else if (have && !/<h3|<p/i.test(have)) {
      // Already correct language but unformatted → just structure it.
      console.log(`Formatting existing ${locale} description`);
      cachedDescriptions[locale] = await aiFormat(have, locale, false);
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
