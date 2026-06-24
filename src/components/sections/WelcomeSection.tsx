import { useLanguage } from '@/contexts/LanguageContext';
import ScrollReveal from '@/components/ScrollReveal';

/**
 * Emotional welcome / storytelling section placed directly below the hero.
 * Single centered column — sensory copy that sells the feeling of an ACHZEIT
 * stay, complementing the fact-driven hero without competing with the booking
 * CTA. No personal/family photos (owner requirement).
 */
const WelcomeSection = () => {
  const { t } = useLanguage();

  return (
    <section id="welcome" className="py-20 md:py-28 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-6">
        <ScrollReveal className="max-w-2xl mx-auto text-center">
          <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-alpine-wood font-medium mb-4">
            {t('welcome.kicker')}
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 text-balance">
            {t('welcome.title')}
          </h2>
          <div className="alpine-divider mb-8" />

          <div className="space-y-5 text-base md:text-lg text-muted-foreground font-light leading-relaxed text-balance">
            <p>{t('welcome.p1')}</p>
            <p>{t('welcome.p2')}</p>
            <p>{t('welcome.p3')}</p>
          </div>

          <p className="font-display text-2xl md:text-3xl text-alpine-wood mt-8">
            {t('welcome.closer')}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default WelcomeSection;
