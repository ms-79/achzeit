export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const { name, email, phone, message } = await req.json();
    if (!name || !email || !message) return json({ error: 'Name, email, and message are required' }, 400);

    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (!accessKey) return json({ error: 'Email service not configured' }, 500);

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `Neue Anfrage von ${name} - Achzeit Website`,
        from_name: 'Achzeit Website',
        to: 'info@achzeit.de',
        name,
        email,
        phone: phone || 'Nicht angegeben',
        message,
      }),
    });

    const result = await response.json();
    if (!result.success) return json({ error: 'Failed to send email' }, 500);
    return json({ success: true });
  } catch (error: any) {
    return json({ error: error.message }, 500);
  }
}
