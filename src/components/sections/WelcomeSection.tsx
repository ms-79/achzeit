import { useLanguage } from '@/contexts/LanguageContext';
import ScrollReveal from '@/components/ScrollReveal';
import { WELCOME_BAND_IMAGE } from '@/constants/site';

/**
 * Emotional welcome / storytelling section placed directly below the hero.
 * Single centered column of sensory copy, followed by a full-width landscape
 * band with the emotional closer overlaid. Sells the feeling of an ACHZEIT stay
 * without competing with the hero booking CTA. No personal/family photos
 * (owner requirement); the band image is a swappable placeholder.
 */
const WelcomeSection = () => {
  const { t } = useLanguage();

  return (
    <section id="welcome" className="bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-6 py-20 md:py-28">
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
        </ScrollReveal>
      </div>

      {/* Full-width emotional landscape band with the closer overlaid */}
      <div className="relative w-full overflow-hidden">
        <img
          src={WELCOME_BAND_IMAGE}
          alt={t('welcome.band.alt')}
          width={1600}
          height={1200}
          loading="lazy"
          decoding="async"
          className="w-full h-[clamp(16rem,38vw,32rem)] object-cover object-[center_22%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-alpine-pine/70 via-alpine-pine/25 to-transparent" />
        <ScrollReveal className="absolute inset-0 flex items-end justify-center pb-10 md:pb-14">
          <p className="font-display text-3xl md:text-4xl lg:text-5xl text-alpine-snow drop-shadow-[0_2px_12px_hsla(156,40%,8%,0.6)] text-center px-6">
            {t('welcome.closer')}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default WelcomeSection;
