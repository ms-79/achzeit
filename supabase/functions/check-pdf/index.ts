const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

/**
 * Attempt to extract a date range like "24.02. – 02.03.2025" or
 * "24.02. - 02.03.2025" from raw PDF text content.
 * Returns the matched string or null.
 */
function extractDateRange(text: string): string | null {
  // Pattern: dd.mm. – dd.mm.yyyy  or  dd.mm.yyyy – dd.mm.yyyy
  // Separators: – - —
  const pattern =
    /(\d{1,2}\.\d{1,2}\.(?:\d{4})?)\s*[–\-—]\s*(\d{1,2}\.\d{1,2}\.\d{4})/;
  const match = text.match(pattern);
  if (match) {
    return match[0].trim();
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return new Response(
        JSON.stringify({ available: false, error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // First do a HEAD check
    const headRes = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    if (!headRes.ok) {
      return new Response(
        JSON.stringify({ available: false, status: headRes.status, dateRange: null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // PDF is available – fetch content and try to extract date range
    let dateRange: string | null = null;
    try {
      const pdfRes = await fetch(url, { redirect: 'follow' });
      if (pdfRes.ok) {
        const buf = await pdfRes.arrayBuffer();
        // Convert raw bytes to latin1 string to find readable text in PDF
        const raw = new TextDecoder('latin1').decode(buf);
        dateRange = extractDateRange(raw);
      }
    } catch {
      // Extraction failure is non-critical; we still know the PDF exists
    }

    return new Response(
      JSON.stringify({ available: true, status: 200, dateRange }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ available: false, error: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
