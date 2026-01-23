import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Mountain, TreePine, Snowflake } from 'lucide-react';
import locationVillage from '@/assets/location-village.jpg';
import locationRiver from '@/assets/location-river.jpg';
import locationCountryside from '@/assets/location-countryside.jpg';

const LocationSection = () => {
  const { t } = useLanguage();

  const highlights = [
    { icon: Mountain, label: 'Hiking' },
    { icon: Snowflake, label: 'Skiing' },
    { icon: TreePine, label: 'Nature' },
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
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            {t('location.title')}
          </h2>
          <p className="text-lg text-muted-foreground tracking-wide flex items-center justify-center gap-2">
            <MapPin className="w-5 h-5" />
            {t('location.subtitle')}
          </p>
          <div className="alpine-divider mt-6" />
        </div>

        {/* Location Images Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          {locationImages.map((image, index) => (
            <div key={index} className="aspect-[4/3] rounded-lg overflow-hidden shadow-medium">
              <img 
                src={image.src} 
                alt={image.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Map */}
          <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-medium border border-border/50">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d681.8726!2d10.2692!3d47.4597!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479c7f9d1b5c8c6d%3A0x8c9a1e4f3b2d0e7a!2sAchweg%205a%2C%2087538%20Fischen%20im%20Allg%C3%A4u!5e0!3m2!1sde!2sde!4v1705000000000!5m2!1sde!2sde"
                className="w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="ACHZEIT - Achweg 5a, Fischen im Allgäu"
              />
            </div>
          </div>

          {/* Description */}
          <div className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed mb-8 font-light">
              {t('location.description')}
            </p>

            {/* Activity Highlights */}
            <div className="flex gap-6">
              {highlights.map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-2 text-center">
                  <div className="w-16 h-16 rounded-full bg-card border border-border/50 flex items-center justify-center shadow-soft">
                    <item.icon className="w-7 h-7 text-alpine-wood" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
