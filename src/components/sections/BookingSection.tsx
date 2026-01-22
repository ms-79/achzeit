import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';

const BookingSection = () => {
  const { t } = useLanguage();

  useEffect(() => {
    // Load the Hostaway search bar script
    const script = document.createElement('script');
    script.src = 'https://d2q3n06xhbi0am.cloudfront.net/widget.js?1640277196';
    script.async = true;
    script.onload = () => {
      // Initialize the search bar widget after script loads
      if ((window as any).searchBar) {
        (window as any).searchBar({
          baseUrl: 'https://achzeit.holidayfuture.com/',
          showLocation: true,
          color: '#2d5a27',
          rounded: true,
          openInNewTab: true,
          font: 'Inter',
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
      const container = document.getElementById('hostaway-booking-widget');
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <section id="booking" className="section-padding bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            {t('booking.title')}
          </h2>
          <p className="text-lg text-muted-foreground tracking-wide">
            {t('booking.subtitle')}
          </p>
          <div className="alpine-divider mt-6" />
        </div>

        {/* Hostaway Search Bar Widget */}
        <div className="max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="bg-card rounded-lg shadow-medium overflow-hidden border border-border/50 p-6">
            <div id="hostaway-booking-widget" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
