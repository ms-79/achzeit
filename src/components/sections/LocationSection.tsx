import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Mountain, TreePine, Snowflake } from 'lucide-react';
import locationVillage from '@/assets/location-village.webp';
import locationRiver from '@/assets/location-river.webp';
import locationCountryside from '@/assets/location-countryside.jpg';
import ScrollReveal from '@/components/ScrollReveal';
import { motion } from 'framer-motion';

const LocationSection = () => {
  const { t } = useLanguage();
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLAnchorElement>(null);

  // Lazy load Google Maps when section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setMapLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Load 200px before visible
    );

    if (mapContainerRef.current) {
      observer.observe(mapContainerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const highlights = [
    { icon: Mountain, label: t('location.hiking') },
    { icon: Snowflake, label: t('location.skiing') },
    { icon: TreePine, label: t('location.nature') },
  ];

  const locationImages = [
    { src: locationVillage, alt: 'St. Verena Kirche, Fischen im Allgäu' },
    { src: locationRiver, alt: 'Iller River, Fischen im Allgäu' },
    { src: locationCountryside, alt: 'Alpine Meadows, Fischen im Allgäu' },
  ];

  return (
    <section id="location" className="section-padding bg-gradient-section">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            {t('location.title')}
          </h2>
          <p className="text-lg text-muted-foreground tracking-wide flex items-center justify-center gap-2">
            <MapPin className="w-5 h-5" />
            {t('location.subtitle')}
          </p>
          <div className="alpine-divider mt-6" />
        </ScrollReveal>

        {/* Location Images Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {locationImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              className="aspect-[4/3] rounded-lg overflow-hidden shadow-medium"
            >
              <img 
                src={image.src} 
                alt={image.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Map - Lazy loaded */}
          <ScrollReveal direction="left" delay={0.1}>
            <a 
              ref={mapContainerRef}
              href="https://maps.app.goo.gl/N46eWmKxw8XKva8G9" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block aspect-[4/3] rounded-lg overflow-hidden shadow-medium border border-border/50 hover:shadow-elevated transition-shadow duration-300 bg-muted"
            >
              {mapLoaded ? (
                <iframe
                  src="https://www.google.com/maps?q=ACHZEIT%20Family%20Retreat.%2C%20Achweg%205a%2C%2087538%20Fischen%20im%20Allg%C3%A4u&ftid=0x479c9b8c7fe4e8bb:0x17310beaa05b6bb&z=15&hl=de&output=embed"
                  className="w-full h-full pointer-events-none"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="ACHZEIT Family Retreat – Fischen im Allgäu (Google Maps)"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <span className="text-sm">{t('common.mapLoading')}</span>
                  </div>
                </div>
              )}
            </a>
          </ScrollReveal>

          {/* Description */}
          <ScrollReveal direction="right" delay={0.2}>
            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed mb-5 font-light">
              {t('location.description')}
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 font-light">
              {t('location.description2')}
            </p>

            {/* Activity Highlights */}
            <div className="flex gap-6">
              {highlights.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.4, 
                    delay: 0.3 + index * 0.1,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-card border border-border/50 flex items-center justify-center shadow-soft">
                    <item.icon className="w-7 h-7 text-alpine-wood" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
