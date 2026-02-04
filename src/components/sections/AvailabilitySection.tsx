import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useRef, useState, useCallback } from 'react';
import ScrollReveal from '@/components/ScrollReveal';

const HOSTAWAY_SCRIPT_URL = 'https://d2q3n06xhbi0am.cloudfront.net/calendar.js';

const AvailabilitySection = () => {
  const { t, language } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [widgetInitialized, setWidgetInitialized] = useState(false);
  const initAttemptedRef = useRef(false);

  // Initialize the Hostaway widget
  const initializeWidget = useCallback(() => {
    if (initAttemptedRef.current || widgetInitialized) return;
    
    const hostawayWidget = (window as any).hostawayCalendarWidget;
    if (!hostawayWidget || !widgetContainerRef.current) return;
    
    initAttemptedRef.current = true;
    
    // Clear any existing content
    widgetContainerRef.current.innerHTML = '';
    
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
    
    setWidgetInitialized(true);
  }, [t, widgetInitialized]);

  // Observe when section becomes visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px', threshold: 0 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Load script and initialize widget when visible
  useEffect(() => {
    if (!isVisible) return;

    // Check if script already exists
    const existingScript = document.querySelector(`script[src="${HOSTAWAY_SCRIPT_URL}"]`);
    
    if (existingScript) {
      // Script already loaded, just initialize
      if ((window as any).hostawayCalendarWidget) {
        initializeWidget();
      }
      return;
    }

    const script = document.createElement('script');
    script.src = HOSTAWAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => {
      // Small delay to ensure the widget function is available
      setTimeout(() => {
        initializeWidget();
      }, 100);
    };
    script.onerror = () => {
      console.error('Failed to load Hostaway calendar script');
    };
    document.body.appendChild(script);

    // No cleanup - we want the script and widget to persist
  }, [isVisible, initializeWidget]);

  // Re-initialize widget when language changes (if already initialized)
  useEffect(() => {
    if (widgetInitialized && (window as any).hostawayCalendarWidget) {
      initAttemptedRef.current = false;
      setWidgetInitialized(false);
      
      // Clear and reinitialize with new language
      if (widgetContainerRef.current) {
        widgetContainerRef.current.innerHTML = '';
      }
      
      setTimeout(() => {
        initializeWidget();
      }, 100);
    }
  }, [language]); // Only re-run when language changes

  return (
    <section ref={sectionRef} id="availability" className="section-padding bg-gradient-section">
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
                className="min-h-[200px]"
              />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default AvailabilitySection;
