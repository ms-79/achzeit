import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ChevronDown, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import heroWinter from '@/assets/hero-winter.webp';
import heroSummer from '@/assets/hero-summer.jpg';
import logoAchzeit from '@/assets/logo-achzeit-transparent.webp';

const HeroSection = () => {
  const { t, language } = useLanguage();
  const [reviewData, setReviewData] = useState<{ avg: number; count: number } | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await supabase.functions.invoke('reviews');
        const reviews = data?.reviews || [];
        if (reviews.length > 0) {
          const avg = reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length;
          setReviewData({ avg: avg / 2, count: reviews.length });
        }
      } catch {}
    };
    fetchReviews();
  }, []);

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
      {/* Background Image - Native img for better LCP */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={getSeasonalHeroImage()}
          alt="ACHZEIT Family Retreat - Alpine House"
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
          loading="eager"
          decoding="sync"
          style={{ minHeight: '100%', minWidth: '100%' }}
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
              fetchPriority="high"
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

          {/* Review Badge */}
          {reviewData && (
            <motion.div
              className="flex justify-center mt-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <button
                onClick={() => scrollToSection('#reviews')}
                className="flex items-center gap-3 bg-alpine-charcoal/60 backdrop-blur-md border-2 border-amber-400/60 rounded-full px-7 py-3 hover:border-amber-400/80 hover:bg-alpine-charcoal/70 transition-all cursor-pointer shadow-[0_0_20px_rgba(251,191,36,0.15)]"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.round(reviewData.avg) ? 'fill-amber-400 text-amber-400' : 'text-alpine-snow/30'}`}
                    />
                  ))}
                </div>
                <span className="text-amber-300 text-lg font-semibold">
                  {reviewData.avg.toFixed(1)}
                </span>
                <span className="text-alpine-snow/60 text-sm">
                  ({reviewData.count} {language === 'de' ? 'Bewertungen' : 'reviews'})
                </span>
              </button>
            </motion.div>
          )}
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
