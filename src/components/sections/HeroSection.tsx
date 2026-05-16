import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Mountain, Flame, Sparkles } from 'lucide-react';
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
          <div className="flex items-center gap-3 mb-3">
            <span className="h-px w-10 bg-primary/60" aria-hidden="true" />
            <span className="font-body uppercase tracking-[0.25em] text-xs md:text-sm text-primary/80">
              Family Retreat · Fischen im Allgäu
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.02] tracking-tight">
            Endlich ankommen.
            <br />
            <span className="italic font-light text-primary/90">
              Tief durchatmen.
            </span>
          </h1>
          <p className="mt-4 text-base md:text-xl text-foreground/80 max-w-2xl leading-relaxed">
            Dein modernes <strong className="font-semibold text-foreground">Family Retreat</strong> mitten in den Allgäuer Alpen –
            mit privater Sauna, Kamin und Bergblick vom Balkon.
          </p>

          {/* Benefits / Trust Row */}
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm md:text-[15px] text-foreground/80">
            <span className="inline-flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-primary" aria-hidden="true" />
              Private Sauna &amp; Kamin
            </span>
            <span className="hidden md:inline text-border">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Mountain className="w-4 h-4 text-primary" aria-hidden="true" />
              360° Bergpanorama
            </span>
            <span className="hidden md:inline text-border">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
              Bis zu 8 Gäste · 3 Schlafzimmer
            </span>
          </div>
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
          {/* Gäste-Favorit Badge – Airbnb-Layout */}
          <button
            onClick={() => scrollToSection('#reviews')}
            className="md:col-span-2 border border-border rounded-2xl bg-card px-5 py-4 md:px-8 md:py-5 shadow-soft hover:shadow-medium transition-shadow text-left"
          >
            <div className="flex items-center gap-4 md:gap-8">
              {/* Lorbeer + Gäste-Favorit – Text-Höhe an Lorbeer gebunden */}
              <div className="flex items-center gap-1 md:gap-1.5 shrink-0 h-10 md:h-12">
                <img
                  src={laurelLeft}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-auto shrink-0"
                  loading="lazy"
                />
                <span
                  className="font-body font-semibold text-foreground text-center whitespace-nowrap flex flex-col justify-center h-full leading-[1.05] text-[11px] md:text-[13px]"
                >
                  <span>Gäste-</span>
                  <span>Favorit</span>
                </span>
                <img
                  src={laurelRight}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-auto shrink-0"
                  loading="lazy"
                />
              </div>

              {/* Beschreibung */}
              <p className="flex-1 text-xs md:text-sm text-foreground leading-snug">
                Unterkunft auf Airbnb mit herausragenden Gäste-Bewertungen in allen Kategorien
              </p>

              {/* Bewertung */}
              <div className="flex items-stretch gap-4 md:gap-6 shrink-0">
                <div className="flex flex-col items-center justify-center text-center border-l border-border pl-4 md:pl-6 min-w-[3.5rem]">
                  <div className="font-body font-semibold text-xl md:text-2xl text-foreground leading-none h-6 md:h-7 flex items-center">
                    {reviewData ? reviewData.avg.toFixed(1).replace('.', ',') : '5,0'}
                  </div>
                  <div className="flex justify-center gap-0.5 mt-1.5 h-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-2.5 h-2.5 fill-foreground text-foreground"
                      />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center text-center border-l border-border pl-4 md:pl-6 min-w-[3.5rem]">
                  <div className="font-body font-semibold text-xl md:text-2xl text-foreground leading-none h-6 md:h-7 flex items-center">
                    {reviewData ? reviewData.count : '–'}
                  </div>
                  <div className="text-[10px] md:text-xs text-muted-foreground mt-1.5 h-3 leading-none">
                    Bewertungen
                  </div>
                </div>
              </div>
            </div>
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
