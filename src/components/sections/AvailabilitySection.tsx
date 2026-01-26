import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';
import ScrollReveal from '@/components/ScrollReveal';

const AvailabilitySection = () => {
  const { t } = useLanguage();

  useEffect(() => {
    // Load the Hostaway calendar script
    const script = document.createElement('script');
    script.src = 'https://d2q3n06xhbi0am.cloudfront.net/calendar.js';
    script.async = true;
    script.onload = () => {
      // Initialize the widget after script loads
      if ((window as any).hostawayCalendarWidget) {
        (window as any).hostawayCalendarWidget({
          baseUrl: 'https://achzeit.holidayfuture.com/',
          listingId: 463607,
          numberOfMonths: 2,
          openInNewTab: true,
          font: 'Inter',
          rounded: true,
          button: {
            action: 'checkout',
            text: t('availability.apply'),
          },
          clearButtonText: t('availability.clearDates'),
          color: {
            mainColor: '#363330',
            frameColor: '#363330',
            textColor: '#363330',
          },
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector(`script[src="${script.src}"]`);
      if (existingScript) {
        existingScript.remove();
      }
      // Clear the widget container
      const container = document.getElementById('hostaway-calendar-widget');
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [t]);

  return (
    <section id="availability" className="section-padding bg-gradient-section">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            {t('availability.title')}
          </h2>
          <p className="text-lg text-muted-foreground tracking-wide">
            {t('availability.subtitle')}
          </p>
          <div className="alpine-divider mt-6" />
        </ScrollReveal>

        {/* Hostaway Calendar Widget */}
        <ScrollReveal delay={0.2}>
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-lg shadow-medium overflow-hidden border border-border/50 p-6">
              <div id="hostaway-calendar-widget" />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default AvailabilitySection;
