const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

/**
 * Extract date-like patterns from raw PDF text.
 */
function extractDateRange(text: string): string | null {
  // Pattern: dd.mm. – dd.mm.yyyy  or  dd.mm.yyyy – dd.mm.yyyy
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
    const { url, debug } = await req.json();

    if (!url || typeof url !== 'string') {
      return new Response(
        JSON.stringify({ available: false, error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const headRes = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    if (!headRes.ok) {
      return new Response(
        JSON.stringify({ available: false, status: headRes.status, dateRange: null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // PDF is available – fetch and extract dates
    let dateRange: string | null = null;
    let debugSnippets: string[] | undefined;
    try {
      const pdfRes = await fetch(url, { redirect: 'follow' });
      if (pdfRes.ok) {
        const buf = await pdfRes.arrayBuffer();
        const raw = new TextDecoder('latin1').decode(buf);

        // If debug mode, collect all date-like patterns
        if (debug) {
          const datePatterns = raw.match(/\d{1,2}\.\d{1,2}\.\s*[-–—]?\s*\d{0,2}\.?\d{0,2}\.?\d{0,4}/g);
          // Also grab text around "KW" or "Woche" or month names
          const kwPatterns = raw.match(/.{0,40}(KW|Woche|Februar|März|Januar|April|Mai).{0,40}/gi);
          debugSnippets = [
            ...(datePatterns || []).slice(0, 10),
            ...(kwPatterns || []).slice(0, 10),
          ];
        }

        dateRange = extractDateRange(raw);
      }
    } catch {
      // non-critical
    }

    const result: Record<string, unknown> = { available: true, status: 200, dateRange };
    if (debug && debugSnippets) {
      result.debugSnippets = debugSnippets;
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ available: false, error: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
