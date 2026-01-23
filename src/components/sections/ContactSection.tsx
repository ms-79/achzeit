import { useLanguage } from '@/contexts/LanguageContext';
import { Mail } from 'lucide-react';

const ContactSection = () => {
  const { t } = useLanguage();

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

        {/* Hostaway Contact Form Embed */}
        <div className="max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="bg-card rounded-lg border border-border/50 shadow-soft overflow-hidden">
            <iframe
              src="https://achzeit.holidayfuture.com/contact-us"
              title="Kontaktformular"
              className="w-full min-h-[600px] border-0"
              style={{ background: 'transparent' }}
            />
          </div>

          {/* Direct Email */}
          <div className="mt-8 text-center">
            <a
              href="mailto:markus.siegmann@gmail.com"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="w-5 h-5" />
              markus.siegmann@gmail.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
