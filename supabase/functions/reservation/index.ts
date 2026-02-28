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

/** Fixed token for now – will be replaced with dynamic HMAC later */
const FIXED_TOKEN = "ABC321";

function isValidToken(reservationId: string, token: string): boolean {
  return token === FIXED_TOKEN;
}

function buildGuestResponse(reservation: any, doorCode: string, wifiPassword: string) {
  const guestName =
    reservation.guestName ||
    [reservation.guestFirstName, reservation.guestLastName].filter(Boolean).join(" ") ||
    "Gast";

  return {
    status: "ok",
    guestName,
    checkin: reservation.arrivalDate || "",
    checkout: reservation.departureDate || "",
    numberOfGuests: reservation.numberOfGuests || 0,
    doorCode,
    wifiPassword,
  };
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
    const reservationId = url.searchParams.get("reservationId");
    const token = url.searchParams.get("token");

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
    

    // ── MODE 1: Direct access via reservationId + token ──
    if (reservationId && token) {
      if (!isValidToken(reservationId, token)) {
        return json({ error: "invalid_token", message: "Ungültiger Zugangslink." }, 403);
      }

      // Fetch the specific reservation
      const resRes = await fetch(
        `https://api.hostaway.com/v1/reservations/${reservationId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      if (!resRes.ok) {
        return json({ error: "reservation_not_found" }, 404);
      }

      const resData = await resRes.json();
      const reservation = resData.result;

      // Verify it belongs to this listing
      if (String(reservation.listingMapId) !== listingId && String(reservation.listingId) !== listingId) {
        return json({ error: "reservation_not_found" }, 404);
      }

      let doorCode = reservation.doorCode || reservation.doorSecurityCode || "";
      let wifiPassword = "";

      try {
        const listingRes = await fetch(
          `https://api.hostaway.com/v1/listings/${listingId}`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
        if (listingRes.ok) {
          const listingData = await listingRes.json();
          const l = listingData.result;
          if (!doorCode) doorCode = l.doorCode || l.doorSecurityCode || "";
          wifiPassword = l.wifiPassword || "";
        }
      } catch (e) {
        console.error("Failed to fetch listing:", e);
      }

      const resp = buildGuestResponse(reservation, doorCode, wifiPassword);
      // Include token info so frontend knows it's a direct-access link
      return json({ ...resp, reservationId, token });
    }

    // ── MODE 2: Date-based lookup with PIN ──
    const today = todayUTC();

    const reservationsRes = await fetch(
      `https://api.hostaway.com/v1/reservations?listingId=${listingId}&arrivalEndDate=${today}&departureStartDate=${today}&limit=10&sortOrder=arrivalDate&sortDirection=asc`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (!reservationsRes.ok) {
      const text = await reservationsRes.text();
      return json({ error: `Hostaway error: ${reservationsRes.status}`, details: text }, 502);
    }

    const reservationsData = await reservationsRes.json();
    const reservations = reservationsData.result || [];

    // Filter to active reservations where today falls within stay
    const activeReservations = reservations.filter((r: any) => {
      const status = r.status;
      if (status === "cancelled" || status === "declined") return false;
      const arrival = r.arrivalDate?.slice(0, 10);
      const departure = r.departureDate?.slice(0, 10);
      return arrival && departure && today >= arrival && today <= departure;
    });

    if (activeReservations.length === 0) {
      return json({ error: "no_active_reservation", message: "Aktuell kein aktiver Aufenthalt." }, 404);
    }

    // No PIN yet → ask for it
    if (!pin) {
      return json({ status: "pin_required" });
    }

    // Try to match PIN against each active reservation
    const matched = activeReservations.find((r: any) => {
      const guestPhone = r.guestPhone || r.phone || "";
      const digits = guestPhone.replace(/\D/g, "");
      const expectedPin = digits.slice(-4);
      return expectedPin && pin === expectedPin;
    });

    if (!matched) {
      return json({ error: "invalid_pin", message: "Ungültige PIN." }, 403);
    }

    // PIN valid – return guest data
    let doorCode = matched.doorCode || matched.doorSecurityCode || "";
    let wifiPassword = "";

    try {
      const listingRes = await fetch(
        `https://api.hostaway.com/v1/listings/${listingId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      if (listingRes.ok) {
        const listingData = await listingRes.json();
        const l = listingData.result;
        if (!doorCode) doorCode = l.doorCode || l.doorSecurityCode || "";
        wifiPassword = l.wifiPassword || "";
      }
    } catch (e) {
      console.error("Failed to fetch listing:", e);
    }

    const resp = buildGuestResponse(matched, doorCode, wifiPassword);
    // Return with fixed token for bookmarking
    const matchedId = String(matched.id);
    return json({ ...resp, reservationId: matchedId, token: FIXED_TOKEN });
  } catch (error) {
    console.error("Error:", error);
    return json({ error: String(error) }, 500);
  }
});
