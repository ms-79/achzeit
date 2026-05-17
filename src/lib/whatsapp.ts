// WhatsApp config — Stufe 1 (wa.me Deep-Link, kein Backend, keine Tracker)
export const WHATSAPP_NUMBER = '4915679656368'; // ohne + und ohne Leerzeichen
export const WHATSAPP_DISPLAY = '+49 15679 656368';

export const buildWhatsAppUrl = (prefill?: string): string => {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!prefill) return base;
  return `${base}?text=${encodeURIComponent(prefill)}`;
};