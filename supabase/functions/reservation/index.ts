Deno.serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

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

    // Step 1: Get access token from Hostaway
    const accountId = Deno.env.get("HOSTAWAY_ACCOUNT_ID");
    const apiKey = Deno.env.get("HOSTAWAY_API_KEY");

    if (!accountId || !apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing Hostaway credentials" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const tokenBody = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: accountId,
      client_secret: apiKey,
      scope: "general",
    });

    const tokenRes = await fetch("https://api.hostaway.com/v1/accessTokens", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenBody,
    });

    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      return new Response(
        JSON.stringify({ error: "Token request failed", details: text }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Step 2: Get reservation
    const resRes = await fetch(
      `https://api.hostaway.com/v1/reservations/${reservationId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!resRes.ok) {
      const text = await resRes.text();
      return new Response(
        JSON.stringify({ error: `Hostaway error: ${resRes.status}`, details: text }),
        { status: resRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resData = await resRes.json();
    const r = resData.result;

    const guestName = r.guestName || 
      [r.guestFirstName, r.guestLastName].filter(Boolean).join(" ") || 
      "Gast";

    const guideData = {
      guestName,
      checkin: r.arrivalDate || "",
      checkout: r.departureDate || "",
      numberOfGuests: r.numberOfGuests || 0,
    };

    return new Response(JSON.stringify(guideData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }
});
