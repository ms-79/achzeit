import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function getAccessToken(): Promise<string> {
  const accountId = Deno.env.get("HOSTAWAY_ACCOUNT_ID");
  const apiKey = Deno.env.get("HOSTAWAY_API_KEY");

  if (!accountId || !apiKey) {
    throw new Error("Missing Hostaway credentials");
  }

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
    throw new Error(`Token request failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data.access_token;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const reservationId = url.searchParams.get("reservationId");

    if (!reservationId) {
      return new Response(
        JSON.stringify({ error: "reservationId parameter required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = await getAccessToken();

    const res = await fetch(
      `https://api.hostaway.com/v1/reservations/${reservationId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return new Response(
        JSON.stringify({ error: `Hostaway API error: ${res.status}`, details: text }),
        { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await res.json();
    const r = data.result;

    // Extract relevant guest guide data
    const guideData = {
      guestName: r.guestName || r.guestFirstName
        ? `${r.guestFirstName || ""} ${r.guestLastName || ""}`.trim()
        : "Gast",
      checkin: r.arrivalDate,
      checkout: r.departureDate,
      listingId: r.listingMapId,
      numberOfGuests: r.numberOfGuests,
      phone: r.phone || r.guestPhone || null,
      email: r.guestEmail || null,
    };

    return new Response(JSON.stringify(guideData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
