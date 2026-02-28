const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

/**
 * Extract the week date range from raw PDF text.
 * PDFs store text in fragments, so dates may appear as separate elements.
 * We look for two date patterns (dd.mm. and dd.mm.yyyy) near each other.
 */
function extractDateRange(text: string): string | null {
  // Strategy 1: dates connected with separator (dd.mm. – dd.mm.yyyy)
  const connected =
    /(\d{1,2}\.\d{1,2}\.(?:\d{4})?)\s*[–\-—]\s*(\d{1,2}\.\d{1,2}\.\d{4})/;
  const m1 = text.match(connected);
  if (m1) return m1[0].trim();

  // Strategy 2: Find first short date (dd.mm.) and first full date (dd.mm.yyyy)
  // These are typically the start and end of the program week
  const shortDatePattern = /(\d{1,2})\.(\d{1,2})\.\s/g;
  const fullDatePattern = /(\d{1,2})\.(\d{1,2})\.(\d{4})/g;

  const shortMatch = shortDatePattern.exec(text);
  const fullMatch = fullDatePattern.exec(text);

  if (shortMatch && fullMatch) {
    const startDay = shortMatch[1].padStart(2, '0');
    const startMonth = shortMatch[2].padStart(2, '0');
    const endDay = fullMatch[1].padStart(2, '0');
    const endMonth = fullMatch[2].padStart(2, '0');
    const year = fullMatch[3];

    return `${startDay}.${startMonth}. – ${endDay}.${endMonth}.${year}`;
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

    const headRes = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    if (!headRes.ok) {
      return new Response(
        JSON.stringify({ available: false, status: headRes.status, dateRange: null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    let dateRange: string | null = null;
    try {
      const pdfRes = await fetch(url, { redirect: 'follow' });
      if (pdfRes.ok) {
        const buf = await pdfRes.arrayBuffer();
        const raw = new TextDecoder('latin1').decode(buf);
        dateRange = extractDateRange(raw);
      }
    } catch {
      // non-critical
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
