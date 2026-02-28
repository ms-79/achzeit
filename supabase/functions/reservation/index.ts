const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/** Map listing slug → Hostaway listing ID */
const LISTING_MAP: Record<string, string> = {
  achzeit: "463607",
};

async function getHostawayToken(accountId: string, apiKey: string): Promise<string> {
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

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token request failed: ${text}`);
  }

  const data = await res.json();
  return data.access_token;
}

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");
    const pin = url.searchParams.get("pin");

    if (!slug) {
      return json({ error: "slug parameter required" }, 400);
    }

    const listingId = LISTING_MAP[slug];
    if (!listingId) {
      return json({ error: "Unbekanntes Listing" }, 404);
    }

    const accountId = Deno.env.get("HOSTAWAY_ACCOUNT_ID");
    const apiKey = Deno.env.get("HOSTAWAY_API_KEY");
    if (!accountId || !apiKey) {
      return json({ error: "Missing Hostaway credentials" }, 500);
    }

    const accessToken = await getHostawayToken(accountId, apiKey);
    const today = todayUTC();

    // Find active reservation for this listing where today is between arrival and departure
    const reservationsRes = await fetch(
      `https://api.hostaway.com/v1/reservations?listingId=${listingId}&arrivalEndDate=${today}&departureStartDate=${today}&limit=5&sortOrder=arrivalDate&sortDirection=asc`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!reservationsRes.ok) {
      const text = await reservationsRes.text();
      return json({ error: `Hostaway error: ${reservationsRes.status}`, details: text }, 502);
    }

    const reservationsData = await reservationsRes.json();
    const reservations = reservationsData.result || [];

    // Filter to confirmed/new reservations where today falls within stay
    const active = reservations.find((r: any) => {
      const status = r.status;
      if (status === "cancelled" || status === "declined") return false;
      const arrival = r.arrivalDate?.slice(0, 10);
      const departure = r.departureDate?.slice(0, 10);
      return arrival && departure && today >= arrival && today <= departure;
    });

    if (!active) {
      return json({ error: "no_active_reservation", message: "Aktuell kein aktiver Aufenthalt." }, 404);
    }

    // If no PIN provided yet, ask for it (don't reveal guest data)
    if (!pin) {
      return json({ status: "pin_required" });
    }

    // Verify PIN against last 4 digits of guest phone
    const guestPhone = active.guestPhone || active.phone || "";
    const digits = guestPhone.replace(/\D/g, "");
    const expectedPin = digits.slice(-4);

    if (!expectedPin || pin !== expectedPin) {
      return json({ error: "invalid_pin", message: "Ungültige PIN." }, 403);
    }

    // PIN valid – return guest data
    let doorCode = active.doorCode || active.doorSecurityCode || "";
    let wifiPassword = "";

    // Fetch listing for fallback door code + wifi
    try {
      const listingRes = await fetch(
        `https://api.hostaway.com/v1/listings/${listingId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (listingRes.ok) {
        const listingData = await listingRes.json();
        const l = listingData.result;
        if (!doorCode) {
          doorCode = l.doorCode || l.doorSecurityCode || "";
        }
        wifiPassword = l.wifiPassword || "";
      }
    } catch (e) {
      console.error("Failed to fetch listing:", e);
    }

    const guestName =
      active.guestName ||
      [active.guestFirstName, active.guestLastName].filter(Boolean).join(" ") ||
      "Gast";

    return json({
      status: "ok",
      guestName,
      checkin: active.arrivalDate || "",
      checkout: active.departureDate || "",
      numberOfGuests: active.numberOfGuests || 0,
      doorCode,
      wifiPassword,
    });
  } catch (error) {
    console.error("Error:", error);
    return json({ error: String(error) }, 500);
  }
});
