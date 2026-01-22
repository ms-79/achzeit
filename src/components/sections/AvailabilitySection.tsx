import { useLanguage } from '@/contexts/LanguageContext';

const AvailabilitySection = () => {
  const { t } = useLanguage();

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

        {/* Hostaway Calendar Embed */}
        <div className="max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="bg-card rounded-lg shadow-medium overflow-hidden border border-border/50">
            <iframe
              src="https://achzeit.holidayfuture.com/listings/463607"
              className="w-full h-[600px] md:h-[700px]"
              title="ACHZEIT Availability Calendar"
              frameBorder="0"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AvailabilitySection;
