import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import galleryBalcony from '@/assets/gallery-balkon-dachgeschoss.jpg';
import galleryLivingSofa from '@/assets/gallery-living-sofa.webp';
import gallerySaunaInterior from '@/assets/gallery-sauna-interior.jpg';
import galleryTerrace from '@/assets/gallery-terrasse.jpg';
import galleryDiningFireplace from '@/assets/gallery-dining-fireplace.jpg';

// Simple stylised laurel branch (Airbnb-Style "Gäste-Favorit")
const Laurel = ({ flip = false }: { flip?: boolean }) => (
  <svg
    viewBox="0 0 40 80"
    className={`h-16 w-auto text-alpine-charcoal ${flip ? 'scale-x-[-1]' : ''}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <path d="M30 78 Q22 60 22 40 Q22 20 30 4" />
    {Array.from({ length: 7 }).map((_, i) => {
      const y = 12 + i * 9;
      return (
        <path
          key={i}
          d={`M22 ${y} Q10 ${y - 2} 4 ${y + 4} Q14 ${y + 2} 22 ${y + 6} Z`}
          fill="currentColor"
        />
      );
    })}
  </svg>
);

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
          {/* Gäste-Favorit badge */}
          <div className="md:col-span-2 border border-border rounded-2xl bg-card p-5 md:p-6 shadow-soft">
            <div className="flex items-center gap-3 md:gap-5">
              <Laurel />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground text-base md:text-lg">
                  Gäste-Favorit
                </div>
                <div className="text-xs md:text-sm text-muted-foreground leading-snug mt-0.5">
                  Unterkunft auf Airbnb mit herausragenden<br className="hidden sm:inline" /> Gäste-Bewertungen in allen Kategorien
                </div>
              </div>
              <Laurel flip />

              {reviewData && (
                <>
                  <div className="hidden sm:block self-stretch w-px bg-border" />
                  <button
                    onClick={() => scrollToSection('#reviews')}
                    className="text-center px-2 md:px-3 hover:opacity-80 transition-opacity"
                  >
                    <div className="font-display text-2xl md:text-3xl text-foreground leading-none">
                      {reviewData.avg.toFixed(1)}
                    </div>
                    <div className="flex justify-center gap-0.5 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-2.5 h-2.5 ${
                            i < Math.round(reviewData.avg)
                              ? 'fill-alpine-charcoal text-alpine-charcoal'
                              : 'text-muted-foreground/30'
                          }`}
                        />
                      ))}
                    </div>
                  </button>
                  <div className="hidden sm:block self-stretch w-px bg-border" />
                  <button
                    onClick={() => scrollToSection('#reviews')}
                    className="text-center px-2 md:px-3 hover:opacity-80 transition-opacity"
                  >
                    <div className="font-display text-2xl md:text-3xl text-foreground leading-none underline underline-offset-4">
                      {reviewData.count}
                    </div>
                    <div className="text-[10px] md:text-xs text-muted-foreground mt-1.5">
                      Bewertungen
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>

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
