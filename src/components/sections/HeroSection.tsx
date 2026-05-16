import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import galleryBalcony from '@/assets/gallery-balkon-dachgeschoss.jpg';
import galleryLivingSofa from '@/assets/gallery-living-sofa.webp';
import gallerySaunaInterior from '@/assets/gallery-sauna-interior.jpg';
import galleryTerrace from '@/assets/gallery-terrasse.jpg';
import galleryDiningFireplace from '@/assets/gallery-dining-fireplace.jpg';
import laurelLeft from '@/assets/laurel-left.png';
import laurelRight from '@/assets/laurel-right.png';

const HeroSection = () => {
  const { t } = useLanguage();
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

  const scrollToSection = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const thumbs = [
    { src: galleryLivingSofa, alt: t('gallery.livingsofa') },
    { src: gallerySaunaInterior, alt: t('gallery.saunainterior') },
    { src: galleryTerrace, alt: t('gallery.terrace') },
    { src: galleryDiningFireplace, alt: t('gallery.diningfireplace') },
  ];

  return (
    <section id="home" className="pt-24 md:pt-28 pb-12 md:pb-16 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Title above image (mobile) */}
        <motion.div
          className="mb-6 md:mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight">
            ACHZEIT — {t('hero.tagline')}
          </h1>
          <p className="mt-3 text-base md:text-lg text-muted-foreground">
            {t('house.guests')} · {t('house.bedrooms')} · 4 {t('house.bedrooms').includes('Bedroom') ? 'Beds' : 'Betten'} · 3 {t('house.bedrooms').includes('Bedroom') ? 'Bathrooms' : 'Badezimmer'}
          </p>
        </motion.div>

        {/* Airbnb-style photo grid */}
        <motion.div
          className="grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden h-[60vh] min-h-[420px] max-h-[560px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <button
            onClick={() => scrollToSection('#gallery')}
            className="col-span-4 md:col-span-2 row-span-2 relative group overflow-hidden"
          >
            <img
              src={galleryBalcony}
              alt={t('gallery.balcony')}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              fetchPriority="high"
              loading="eager"
            />
          </button>
          {thumbs.map((thumb, i) => (
            <button
              key={i}
              onClick={() => scrollToSection('#gallery')}
              className="hidden md:block relative group overflow-hidden"
            >
              <img
                src={thumb.src}
                alt={thumb.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {i === 3 && (
                <span className="absolute bottom-3 right-3 bg-alpine-snow text-alpine-charcoal text-xs md:text-sm font-medium px-3 py-1.5 rounded-md shadow-soft">
                  {t('nav.gallery')} ›
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Info row: Gäste-Favorit + CTA */}
        <motion.div
          className="mt-8 md:mt-10 grid md:grid-cols-3 gap-6 md:gap-8 items-start"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
        >
          {/* Gäste-Favorit Badge */}
          <button
            onClick={() => scrollToSection('#reviews')}
            className="md:col-span-2 border border-border rounded-2xl bg-card p-5 md:p-6 shadow-soft hover:shadow-medium transition-shadow text-center"
          >
            <div className="flex items-center justify-center gap-2 md:gap-3">
              <img
                src={laurelLeft}
                alt=""
                aria-hidden="true"
                className="h-12 md:h-14 w-auto"
                loading="lazy"
              />
              <span className="font-body font-bold tracking-tight text-7xl md:text-8xl text-foreground leading-none">
                {reviewData ? reviewData.avg.toFixed(1).replace('.', ',') : '5,0'}
              </span>
              <img
                src={laurelRight}
                alt=""
                aria-hidden="true"
                className="h-12 md:h-14 w-auto"
                loading="lazy"
              />
            </div>
            <div className="mt-2 font-medium text-foreground text-base md:text-lg">
              Gäste-Favorit auf Airbnb
            </div>
            <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-xs md:max-w-sm mx-auto leading-relaxed">
              Diese Unterkunft gehört zu den{' '}
              <span className="font-medium text-foreground">obersten 10 %</span>{' '}
              der gefragtesten Inserate auf Airbnb – basierend auf Bewertungen und Zuverlässigkeit
              {reviewData ? ` (${reviewData.count} Bewertungen).` : '.'}
            </p>
          </button>

          {/* CTA */}
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('hero.description')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="alpine"
                size="lg"
                onClick={() => scrollToSection('#availability')}
              >
                {t('hero.cta.book')}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => scrollToSection('#house')}
              >
                {t('nav.house')}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
