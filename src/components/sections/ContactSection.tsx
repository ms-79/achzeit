import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ScrollReveal from '@/components/ScrollReveal';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

const ContactSection = () => {
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-contact', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          message: formData.message,
        },
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success(
        language === 'de' 
          ? 'Ihre Anfrage wurde erfolgreich gesendet!' 
          : 'Your inquiry has been sent successfully!'
      );
    } catch (error: any) {
      console.error('Contact form error:', error);
      toast.error(
        language === 'de'
          ? 'Fehler beim Senden. Bitte versuchen Sie es erneut.'
          : 'Error sending message. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            {t('contact.title')}
          </h2>
          <p className="text-lg text-muted-foreground tracking-wide">
            {t('contact.subtitle')}
          </p>
          <div className="alpine-divider mt-6" />
        </ScrollReveal>

        {/* Contact Form */}
        <ScrollReveal delay={0.2} className="max-w-xl mx-auto">
          {/* WhatsApp quick-contact card */}
          <a
            href={buildWhatsAppUrl(t('whatsapp.prefill'))}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('whatsapp.aria')}
            className="group block mb-8 rounded-2xl border border-border bg-card hover:border-[#25D366]/60 shadow-soft hover:shadow-medium transition-all p-5 md:p-6"
          >
            <div className="flex items-start gap-4">
              <span className="shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#25D366] flex items-center justify-center">
                <svg viewBox="0 0 32 32" className="w-7 h-7 md:w-8 md:h-8 fill-white" aria-hidden="true">
                  <path d="M16.001 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.26.59 4.46 1.71 6.4L3.2 28.8l6.55-1.71a12.74 12.74 0 0 0 6.25 1.6h.01c7.06 0 12.8-5.73 12.8-12.8 0-3.42-1.33-6.63-3.75-9.05A12.71 12.71 0 0 0 16.001 3.2Zm0 23.36h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-3.89 1.02 1.04-3.79-.25-.4a10.6 10.6 0 0 1-1.63-5.68c0-5.86 4.77-10.63 10.64-10.63 2.84 0 5.51 1.11 7.52 3.12a10.58 10.58 0 0 1 3.12 7.52c0 5.86-4.77 10.63-10.75 10.55Zm5.83-7.96c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1.01 1.25-.18.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.55-.08-.16-.71-1.71-.98-2.34-.26-.62-.52-.53-.71-.54l-.6-.01c-.21 0-.55.08-.84.4-.29.32-1.11 1.08-1.11 2.63 0 1.55 1.13 3.05 1.29 3.26.16.21 2.23 3.4 5.4 4.77.75.32 1.34.52 1.8.66.76.24 1.45.21 1.99.13.61-.09 1.89-.77 2.16-1.52.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37Z" />
                </svg>
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-display text-xl md:text-2xl text-foreground leading-tight">
                  {t('whatsapp.card.title')}
                </p>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                  {t('whatsapp.card.sub')}
                </p>
                <p className="text-xs text-muted-foreground/80 mt-2">{t('whatsapp.card.hours')}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#1ebe5d] group-hover:text-[#178f47] transition-colors">
                  {t('whatsapp.card.cta')} <span aria-hidden="true">→</span>
                </span>
              </div>
            </div>
          </a>

          <div className="flex items-center gap-3 mb-6">
            <span className="h-px flex-1 bg-border" aria-hidden="true" />
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {t('whatsapp.card.or')}
            </span>
            <span className="h-px flex-1 bg-border" aria-hidden="true" />
          </div>

          {isSubmitted ? (
            <div className="text-center py-12 bg-card rounded-lg border border-border/50 shadow-soft">
              <CheckCircle className="w-16 h-16 text-alpine-forest mx-auto mb-4" />
              <p className="text-xl text-foreground font-medium">
                {language === 'de' ? 'Vielen Dank für Ihre Anfrage!' : 'Thank you for your inquiry!'}
              </p>
              <p className="text-muted-foreground mt-2">
                {language === 'de' 
                  ? 'Wir melden uns schnellstmöglich bei Ihnen.' 
                  : 'We will get back to you as soon as possible.'}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsSubmitted(false)}
              >
                {language === 'de' ? 'Neue Anfrage' : 'New Inquiry'}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  {language === 'de' ? 'Name *' : 'Name *'}
                </label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-card border-border/50 focus:border-alpine-stone"
                  placeholder={language === 'de' ? 'Ihr vollständiger Name' : 'Your full name'}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  {language === 'de' ? 'E-Mail *' : 'Email *'}
                </label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-card border-border/50 focus:border-alpine-stone"
                  placeholder={language === 'de' ? 'ihre@email.de' : 'your@email.com'}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                  {language === 'de' ? 'Telefon (optional)' : 'Phone (optional)'}
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-card border-border/50 focus:border-alpine-stone"
                  placeholder={language === 'de' ? '+49 123 456789' : '+1 234 567890'}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  {language === 'de' ? 'Nachricht *' : 'Message *'}
                </label>
                <Textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-card border-border/50 focus:border-alpine-stone resize-none"
                  placeholder={language === 'de' 
                    ? 'Ihre Nachricht, gewünschte Reisedaten, Anzahl der Gäste...' 
                    : 'Your message, preferred travel dates, number of guests...'}
                />
              </div>

              <Button 
                type="submit" 
                variant="alpine" 
                size="lg" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {language === 'de' ? 'Wird gesendet...' : 'Sending...'}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {language === 'de' ? 'Anfrage senden' : 'Send Inquiry'}
                  </>
                )}
              </Button>
            </form>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ContactSection;
