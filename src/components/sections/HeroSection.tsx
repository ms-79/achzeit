import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Star, Flame, Sun, Users } from 'lucide-react';
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
      <div className="container mx-auto px-6">
        {/* Title above image */}
        <motion.div
          className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-px w-10 bg-primary/60" aria-hidden="true" />
            <span className="font-body uppercase tracking-[0.25em] text-xs md:text-sm text-primary/80">
              ACHZEIT Family Retreat · Fischen im Allgäu · Nahe Oberstdorf
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground leading-[1.05] tracking-tight">
            Endlich ankommen.{' '}
            <span className="italic font-light text-primary/90 whitespace-nowrap">
              Tief durchatmen.
            </span>
          </h1>
          <p className="mt-4 text-base md:text-xl text-foreground/80 max-w-2xl leading-relaxed">
            Dein modernes <strong className="font-semibold text-foreground">Family Retreat</strong> mitten in den Allgäuer Alpen, nahe Oberstdorf –
            mit privater Sauna, Kamin, Terrasse und Balkon.
          </p>

          {/* Benefits / Trust Row */}
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm md:text-[15px] text-foreground/80">
            <span className="inline-flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-primary" aria-hidden="true" />
              Private Sauna &amp; Kamin
            </span>
            <span className="hidden md:inline text-border">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-primary" aria-hidden="true" />
              Terrasse &amp; Balkon
            </span>
            <span className="hidden md:inline text-border">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary" aria-hidden="true" />
              Bis zu 7 Gäste (4 Erwachsene, 3 Kinder)
            </span>
          </div>
          </div>

          {/* Gäste-Favorit Badge – kompakt, rechts im Hero-Header */}
          <button
            onClick={() => scrollToSection('#reviews')}
            className="shrink-0 self-start mx-auto md:mx-0 w-full max-w-[220px] md:w-[200px] md:max-w-none border border-border rounded-2xl bg-card px-4 py-4 md:px-6 md:py-5 shadow-soft hover:shadow-medium transition-shadow"
            aria-label="Gäste-Favorit auf Airbnb"
          >
            <div className="flex flex-col items-center text-center gap-3 w-full">
              {/* Lorbeer + Gäste-Favorit */}
              <div className="flex items-center gap-1.5 h-11 md:h-14">
                <img src={laurelLeft} alt="" aria-hidden="true" className="h-full w-auto shrink-0" loading="lazy" />
                <span className="font-body font-semibold text-foreground whitespace-nowrap flex flex-col justify-center h-full leading-[1.05] text-[13px] md:text-sm">
                  <span>Gäste-</span>
                  <span>Favorit</span>
                </span>
                <img src={laurelRight} alt="" aria-hidden="true" className="h-full w-auto shrink-0" loading="lazy" />
              </div>

              {/* Bewertung */}
              <div className="flex flex-col items-center pt-2 border-t border-border w-full">
                <div className="font-body font-semibold text-2xl md:text-3xl text-foreground leading-none">
                  {reviewData ? reviewData.avg.toFixed(1).replace('.', ',') : '5,0'}
                </div>
                <div className="flex justify-center gap-0.5 mt-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 fill-foreground text-foreground" />
                  ))}
                </div>
                <div className="text-[11px] md:text-xs text-muted-foreground mt-2 underline">
                  {reviewData ? `${reviewData.count} Bewertungen` : 'Bewertungen'}
                </div>
              </div>

              {/* Erklärtext */}
              <p className="text-[11px] leading-[1.35] text-muted-foreground w-full break-words text-pretty mt-1">
                Unterkunft auf Airbnb mit herausragenden Gäste-Bewertungen in allen Kategorien
              </p>
            </div>
          </button>
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

        {/* CTA Row */}
        <motion.div
          className="mt-8 md:mt-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
        >
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
