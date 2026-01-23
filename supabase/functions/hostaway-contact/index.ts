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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const HOSTAWAY_API_KEY = Deno.env.get("HOSTAWAY_API_KEY");
    if (!HOSTAWAY_API_KEY) {
      throw new Error("HOSTAWAY_API_KEY is not configured");
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

    // Build the message content for Hostaway
    let fullMessage = `Neue Anfrage von der Website:\n\n`;
    fullMessage += `Name: ${name}\n`;
    fullMessage += `E-Mail: ${email}\n`;
    if (phone) fullMessage += `Telefon: ${phone}\n`;
    if (arrivalDate) fullMessage += `Anreise: ${arrivalDate}\n`;
    if (departureDate) fullMessage += `Abreise: ${departureDate}\n`;
    if (guests) fullMessage += `Gäste: ${guests}\n`;
    fullMessage += `\nNachricht:\n${message}`;

    // Send to Hostaway Inbox API
    // Using the conversations/messages endpoint to create a new conversation
    const hostawayResponse = await fetch(
      "https://api.hostaway.com/v1/conversations",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HOSTAWAY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingMapId: 463607,
          guestName: name,
          guestEmail: email,
          guestPhone: phone || "",
          body: fullMessage,
          channelId: 2000, // Direct/Website channel
          isInquiry: true,
        }),
      }
    );

    if (!hostawayResponse.ok) {
      const errorText = await hostawayResponse.text();
      console.error("Hostaway API error:", hostawayResponse.status, errorText);
      
      // Try alternative endpoint for creating inbox messages
      const altResponse = await fetch(
        `https://api.hostaway.com/v1/listings/463607/inbox`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${HOSTAWAY_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            guestName: name,
            guestEmail: email,
            guestPhone: phone || "",
            message: fullMessage,
          }),
        }
      );

      if (!altResponse.ok) {
        const altErrorText = await altResponse.text();
        console.error("Hostaway alt API error:", altResponse.status, altErrorText);
        throw new Error(`Hostaway API error: ${altResponse.status}`);
      }
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
