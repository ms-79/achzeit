import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';

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
            text: t('availability.bookNow') || 'Jetzt buchen',
          },
          clearButtonText: t('availability.clearDates') || 'Daten löschen',
          color: {
            mainColor: '#2d5a27',
            frameColor: '#1a1a1a',
            textColor: '#1a1a1a',
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
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            {t('availability.title')}
          </h2>
          <p className="text-lg text-muted-foreground tracking-wide">
            {t('availability.subtitle')}
          </p>
          <div className="alpine-divider mt-6" />
        </div>

        {/* Hostaway Calendar Widget */}
        <div className="max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="bg-card rounded-lg shadow-medium overflow-hidden border border-border/50 p-6">
            <div id="hostaway-calendar-widget" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AvailabilitySection;
