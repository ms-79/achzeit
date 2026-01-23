import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
  arrivalDate?: string;
  departureDate?: string;
  guests?: number;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

async function getAccessToken(accountId: string, apiKey: string): Promise<string> {
  const response = await fetch("https://api.hostaway.com/v1/accessTokens", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: accountId,
      client_secret: apiKey,
      scope: "general",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to get access token:", response.status, errorText);
    throw new Error(`Failed to authenticate with Hostaway: ${response.status}`);
  }

  const data: TokenResponse = await response.json();
  return data.access_token;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const HOSTAWAY_API_KEY = Deno.env.get("HOSTAWAY_API_KEY");
    const HOSTAWAY_ACCOUNT_ID = Deno.env.get("HOSTAWAY_ACCOUNT_ID");
    
    if (!HOSTAWAY_API_KEY) {
      throw new Error("HOSTAWAY_API_KEY is not configured");
    }
    if (!HOSTAWAY_ACCOUNT_ID) {
      throw new Error("HOSTAWAY_ACCOUNT_ID is not configured");
    }

    const body: ContactRequest = await req.json();
    const { name, email, phone, message, arrivalDate, departureDate, guests } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Name, email and message are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get OAuth access token
    console.log("Getting access token...");
    const accessToken = await getAccessToken(HOSTAWAY_ACCOUNT_ID, HOSTAWAY_API_KEY);
    console.log("Access token obtained successfully");

    // Build the message content for Hostaway
    let fullMessage = `Neue Anfrage von der Website:\n\n`;
    fullMessage += `Name: ${name}\n`;
    fullMessage += `E-Mail: ${email}\n`;
    if (phone) fullMessage += `Telefon: ${phone}\n`;
    if (arrivalDate) fullMessage += `Anreise: ${arrivalDate}\n`;
    if (departureDate) fullMessage += `Abreise: ${departureDate}\n`;
    if (guests) fullMessage += `Gäste: ${guests}\n`;
    fullMessage += `\nNachricht:\n${message}`;

    // Generate placeholder dates if not provided (required by Hostaway)
    // Use tomorrow and day after as placeholder for inquiries without dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 30); // 30 days from now
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 7); // 7 days stay

    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    
    const effectiveArrivalDate = arrivalDate || formatDate(tomorrow);
    const effectiveDepartureDate = departureDate || formatDate(dayAfter);

    // Create a reservation inquiry in Hostaway
    console.log("Creating reservation inquiry...");
    const reservationBody = {
      listingMapId: 463607,
      channelId: 2000, // Direct/Website channel
      source: "manual",
      guestName: name,
      guestFirstName: name.split(' ')[0],
      guestLastName: name.split(' ').slice(1).join(' ') || name,
      guestEmail: email,
      guestPhone: phone || "",
      status: "inquiry",
      arrivalDate: effectiveArrivalDate,
      departureDate: effectiveDepartureDate,
      numberOfGuests: guests || 1,
      adults: guests || 1,
      children: 0,
      infants: 0,
      pets: 0,
      guestNote: fullMessage,
      hostNote: arrivalDate ? "" : "HINWEIS: Kunde hat keine Daten angegeben - Platzhalterdaten verwendet.",
    };

    console.log("Reservation body:", JSON.stringify(reservationBody));

    const inquiryResponse = await fetch(
      "https://api.hostaway.com/v1/reservations",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationBody),
      }
    );

    const inquiryText = await inquiryResponse.text();
    console.log("Inquiry response:", inquiryResponse.status, inquiryText);

    if (!inquiryResponse.ok) {
      throw new Error(`Hostaway API error: ${inquiryResponse.status} - ${inquiryText}`);
    }

    console.log("Message sent to Hostaway successfully");

    return new Response(
      JSON.stringify({ success: true, message: "Anfrage erfolgreich gesendet" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in hostaway-contact function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Ein Fehler ist aufgetreten" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
