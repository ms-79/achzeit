import { env } from './_env';

export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const { name, email, phone, message } = await req.json();
    if (!name || !email || !message) return json({ error: 'Name, email, and message are required' }, 400);

    const apiKey = env('RESEND_API_KEY');
    if (!apiKey) return json({ error: 'Email service not configured' }, 500);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Achzeit Website <noreply@allgau-stays.com>',
        to: 'info@achzeit.de',
        subject: `Neue Anfrage von ${name}`,
        html: `<p><strong>Name:</strong> ${name}</p><p><strong>E-Mail:</strong> ${email}</p><p><strong>Telefon:</strong> ${phone || 'Nicht angegeben'}</p><p><strong>Nachricht:</strong><br>${message.replace(/\n/g, '<br>')}</p>`,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return json({ error: (err as any).message || 'Failed to send email' }, 500);
    }
    return json({ success: true });
  } catch (error: any) {
    return json({ error: error.message }, 500);
  }
}
