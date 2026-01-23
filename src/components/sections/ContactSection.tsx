import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Send, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
      const { data, error } = await supabase.functions.invoke('hostaway-contact', {
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
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            {t('contact.title')}
          </h2>
          <p className="text-lg text-muted-foreground tracking-wide">
            {t('contact.subtitle')}
          </p>
          <div className="alpine-divider mt-6" />
        </div>

        {/* Contact Form */}
        <div className="max-w-xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
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

          {/* Direct Email */}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
