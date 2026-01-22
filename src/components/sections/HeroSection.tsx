import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import heroWinter from '@/assets/hero-winter.webp';
import heroSummer from '@/assets/hero-summer.jpg';
import AchzeitLogo from '@/components/AchzeitLogo';

const HeroSection = () => {
  const { t } = useLanguage();

  // Determine which hero image to show based on current month
  // Winter: October (10) - March (3)
  // Summer: April (4) - September (9)
  const getSeasonalHeroImage = () => {
    const month = new Date().getMonth() + 1; // getMonth() returns 0-11
    const isWinter = month >= 10 || month <= 3;
    return isWinter ? heroWinter : heroSummer;
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={getSeasonalHeroImage()}
          alt="ACHZEIT Family Retreat - Alpine House"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-alpine-charcoal/60 via-alpine-charcoal/40 to-alpine-charcoal/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto animate-fade-up">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <AchzeitLogo 
              className="w-48 sm:w-56 md:w-64 lg:w-72 h-auto" 
              color="hsl(var(--alpine-snow))"
            />
          </div>

          {/* Subtitle */}
          <p className="text-lg md:text-xl tracking-[0.4em] uppercase text-alpine-snow/80 mb-6">
            {t('hero.subtitle')}
          </p>

          {/* Divider */}
          <div className="w-24 h-px bg-alpine-snow/40 mx-auto mb-8" />

          {/* Tagline */}
          <p className="font-display text-2xl md:text-3xl lg:text-4xl text-alpine-snow/95 mb-4">
            {t('hero.tagline')}
          </p>
          <p className="text-lg md:text-xl text-alpine-snow/80 max-w-2xl mx-auto mb-12 font-light">
            {t('hero.description')}
          </p>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Button
              variant="hero"
              size="lg"
              onClick={() => scrollToSection('#availability')}
              className="text-base tracking-wide"
            >
              {t('hero.cta.book')}
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={() => scrollToSection('#house')}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-alpine-snow/60 hover:text-alpine-snow transition-colors animate-bounce"
      >
        <ChevronDown size={32} />
      </button>
    </section>
  );
};

export default HeroSection;
