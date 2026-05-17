import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import galleryBalcony from '@/assets/gallery-balkon-dachgeschoss.jpg';
import galleryLivingSofa from '@/assets/gallery-living-sofa.webp';
import gallerySaunaInterior from '@/assets/gallery-sauna-interior.jpg';
import galleryTerrace from '@/assets/gallery-terrasse.jpg';
import galleryDiningFireplace from '@/assets/gallery-dining-fireplace.jpg';
import GuestFavoriteBadge from '@/components/GuestFavoriteBadge';
import HeroBookingBox from './HeroBookingBox';
const HeroSection = () => {
  const { t } = useLanguage();

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
    <section id="home" className="pt-20 md:pt-24 pb-6 md:pb-8 bg-background relative lg:pr-[380px]">
      <div className="container mx-auto px-6 relative">
        {/* Title above image */}
        <motion.div
          className="mb-5 md:mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="h-px w-10 bg-primary/60" aria-hidden="true" />
            <span className="font-body uppercase tracking-[0.25em] text-xs md:text-sm text-primary/80">
              {t('hero.chip')}
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground leading-[1.05] tracking-tight">
            {t('hero.headline.1')}{' '}
            <span className="italic font-light text-primary/90 whitespace-nowrap">
              {t('hero.headline.2')}
            </span>
          </h1>
          <p
            className="mt-4 text-base md:text-lg text-foreground/80 leading-relaxed [&_strong]:font-semibold [&_strong]:text-foreground"
            dangerouslySetInnerHTML={{ __html: t('hero.sub') }}
          />

          {/* Facts row */}
          <p className="mt-5 text-sm md:text-[15px] text-foreground/75 leading-relaxed">
            {t('hero.facts')}
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

        {/* Mobile/Tablet: Buchungsbox direkt nach der Bildcollage + Gäste-Favorit Badge */}
        <div className="lg:hidden mt-6 space-y-4">
          <HeroBookingBox />
          <GuestFavoriteBadge />
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
