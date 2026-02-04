import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useRef } from 'react';
import ScrollReveal from '@/components/ScrollReveal';

const HOSTAWAY_SCRIPT_URL = 'https://d2q3n06xhbi0am.cloudfront.net/calendar.js';

const AvailabilitySection = () => {
  const { t } = useLanguage();
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const initializingRef = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (initializingRef.current) return;
    initializingRef.current = true;

    const initializeWidget = () => {
      const hostawayWidget = (window as any).hostawayCalendarWidget;
      if (!hostawayWidget) {
        console.error('Hostaway widget function not available');
        return;
      }
      
      if (!widgetContainerRef.current) {
        console.error('Widget container not found');
        return;
      }
      
      // Clear container
      widgetContainerRef.current.innerHTML = '';
      
      try {
        hostawayWidget({
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
      } catch (error) {
        console.error('Failed to initialize Hostaway widget:', error);
      }
    };

    const loadScript = () => {
      // Check if already loaded
      if ((window as any).hostawayCalendarWidget) {
        initializeWidget();
        return;
      }

      // Check if script is already in document
      const existingScript = document.querySelector(`script[src="${HOSTAWAY_SCRIPT_URL}"]`);
      if (existingScript) {
        // Wait for it to load
        const checkReady = setInterval(() => {
          if ((window as any).hostawayCalendarWidget) {
            clearInterval(checkReady);
            initializeWidget();
          }
        }, 100);
        setTimeout(() => clearInterval(checkReady), 10000);
        return;
      }

      // Add script
      const script = document.createElement('script');
      script.src = HOSTAWAY_SCRIPT_URL;
      script.async = true;
      script.onload = () => {
        // Wait a bit for the function to be available
        setTimeout(initializeWidget, 200);
      };
      script.onerror = (e) => {
        console.error('Failed to load Hostaway script:', e);
      };
      document.body.appendChild(script);
    };

    // Run after component has mounted
    loadScript();
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
              <div 
                id="hostaway-calendar-widget" 
                ref={widgetContainerRef}
                className="min-h-[350px] flex items-center justify-center"
              >
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default AvailabilitySection;
