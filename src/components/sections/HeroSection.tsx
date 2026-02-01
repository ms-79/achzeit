import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import heroWinter from '@/assets/hero-winter.webp';
import heroSummer from '@/assets/hero-summer.jpg';
import logoAchzeit from '@/assets/logo-achzeit-transparent.png';

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
        <motion.img
          src={getSeasonalHeroImage()}
          alt="ACHZEIT Family Retreat - Alpine House"
          className="w-full h-full object-cover"
          fetchPriority="high"
          decoding="async"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-alpine-charcoal/60 via-alpine-charcoal/40 to-alpine-charcoal/70" />
      </div>

      {/* Content - positioned higher with padding-bottom for scroll indicator */}
      <div className="relative z-10 container mx-auto px-6 text-center pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Logo */}
          <motion.div 
            className="mb-4 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img 
              src={logoAchzeit} 
              alt="ACHZEIT" 
              className="w-48 sm:w-56 md:w-64 lg:w-72 h-auto brightness-0 invert"
            />
          </motion.div>

          {/* Subtitle */}
          <motion.p 
            className="text-lg md:text-xl tracking-[0.4em] uppercase text-alpine-snow/80 mb-6"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* Divider */}
          <motion.div 
            className="w-24 h-px bg-alpine-snow/40 mx-auto mb-8"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />

          {/* Tagline */}
          <motion.p 
            className="font-display text-2xl md:text-3xl lg:text-4xl text-alpine-snow/95 mb-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {t('hero.tagline')}
          </motion.p>
          <motion.p 
            className="text-lg md:text-xl text-alpine-snow/80 max-w-2xl mx-auto mb-8 font-light"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {t('hero.description')}
          </motion.p>

          {/* CTA Button */}
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <Button
              variant="hero"
              size="lg"
              onClick={() => scrollToSection('#availability')}
              className="text-base tracking-wide"
            >
              {t('hero.cta.book')}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - positioned at bottom */}
      <motion.button
        onClick={() => scrollToSection('#house')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-alpine-snow/60 hover:text-alpine-snow transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ 
          opacity: { duration: 0.5, delay: 1.2 },
          y: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
        }}
      >
        <ChevronDown size={32} />
      </motion.button>
    </section>
  );
};

export default HeroSection;
