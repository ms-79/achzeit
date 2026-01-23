import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, CheckCircle } from 'lucide-react';

const ContactSection = () => {
  const { t, language } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build email body
    let body = `Name: ${formData.name}\n`;
    body += `E-Mail: ${formData.email}\n`;
    if (formData.phone) body += `Telefon: ${formData.phone}\n`;
    body += `\nNachricht:\n${formData.message}`;
    
    // Create mailto link
    const subject = encodeURIComponent(
      language === 'de' 
        ? `Anfrage von ${formData.name} - Achzeit Website`
        : `Inquiry from ${formData.name} - Achzeit Website`
    );
    const encodedBody = encodeURIComponent(body);
    
    // Open email client
    window.location.href = `mailto:info@achzeit.de?subject=${subject}&body=${encodedBody}`;
    
    setIsSubmitted(true);
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
                {language === 'de' ? 'Ihr E-Mail-Programm wurde geöffnet!' : 'Your email client has been opened!'}
              </p>
              <p className="text-muted-foreground mt-2">
                {language === 'de' 
                  ? 'Bitte senden Sie die E-Mail ab, um Ihre Anfrage zu übermitteln.' 
                  : 'Please send the email to submit your inquiry.'}
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
              >
                <Send className="w-4 h-4 mr-2" />
                {language === 'de' ? 'Anfrage senden' : 'Send Inquiry'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
