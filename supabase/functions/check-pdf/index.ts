const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

/**
 * Extract the week date range from raw PDF text.
 */
function extractDateRange(text: string): string | null {
  const connected =
    /(\d{1,2}\.\d{1,2}\.(?:\d{4})?)\s*[–\-—]\s*(\d{1,2}\.\d{1,2}\.\d{4})/;
  const m1 = text.match(connected);
  if (m1) return m1[0].trim();

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

/** Allowed URL prefix for proxying */
const ALLOWED_PREFIX =
  'https://www.hoernerdoerfer.de/fileadmin/thd/x_partner_info/dateien/gaesteinfos/Fischen/dateien/';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const urlObj = new URL(req.url);

  // GET = proxy mode: serve PDF inline with correct headers
  if (req.method === 'GET') {
    const fileUrl = urlObj.searchParams.get('url');
    if (!fileUrl || !fileUrl.startsWith(ALLOWED_PREFIX)) {
      return new Response('Bad request', { status: 400, headers: corsHeaders });
    }

    const pdfRes = await fetch(fileUrl, { redirect: 'follow' });
    if (!pdfRes.ok) {
      return new Response('Not found', { status: 404, headers: corsHeaders });
    }

    const pdfBody = await pdfRes.arrayBuffer();
    return new Response(pdfBody, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  // POST = check mode (existing behavior)
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string' || !url.startsWith(ALLOWED_PREFIX)) {
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
