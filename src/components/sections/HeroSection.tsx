import { useLanguage } from '@/contexts/LanguageContext';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  FlameKindling,
  ThermometerSun,
  Mountain,
  Star,
  MapPin,
  ArrowRight,
  Wifi,
  Car,
  CableCar,
  ShoppingBag,
} from 'lucide-react';
import galleryBalcony from '@/assets/gallery-balkon-dachgeschoss.webp';
import galleryLivingSofa from '@/assets/gallery-living-sofa.webp';
import gallerySaunaInterior from '@/assets/gallery-sauna-interior.webp';
import galleryTerrace from '@/assets/gallery-terrasse.webp';
import galleryDiningFireplace from '@/assets/gallery-dining-fireplace.webp';
// Additional images for the full mobile swipe gallery (incl. location)
import galleryLiving from '@/assets/gallery-living.webp';
import gallerySauna from '@/assets/gallery-sauna.webp';
import galleryHouseExterior from '@/assets/house-exterior.webp';
import galleryBedroomMain from '@/assets/gallery-bedroom-main.webp';
import galleryWorkspace from '@/assets/gallery-workspace.jpg';
import galleryBathroom from '@/assets/gallery-bathroom.webp';
import galleryBathroomShower from '@/assets/gallery-bathroom-shower.jpg';
import galleryBedroom2 from '@/assets/gallery-bedroom2.webp';
import galleryBedroom3 from '@/assets/gallery-bedroom3.webp';
import galleryBedroomSingle from '@/assets/gallery-bedroom-single.webp';
import galleryBalconyView from '@/assets/gallery-balcony-view.jpg';
import galleryLaundry from '@/assets/gallery-laundry.jpg';
import galleryGamesNight from '@/assets/gallery-games-night.jpg';
import locationSwans from '@/assets/location-swans.jpg';
import locationVillage from '@/assets/location-village.webp';
import locationRiver from '@/assets/location-river.webp';
import locationCountryside from '@/assets/location-countryside.jpg';
import HeroBookingBox from '@/components/sections/HeroBookingBox';
import BrandCard from '@/components/sections/BrandCard';
import { AIRBNB_RATING } from '@/constants/site';

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

  // Mobile hero is a native swipe carousel through all images (incl. location).
  const heroImages = [
    { src: galleryBalcony, alt: t('gallery.balcony') },
    { src: galleryLivingSofa, alt: t('gallery.livingsofa') },
    { src: galleryLiving, alt: t('gallery.living') },
    { src: gallerySauna, alt: t('gallery.sauna') },
    { src: gallerySaunaInterior, alt: t('gallery.saunainterior') },
    { src: galleryDiningFireplace, alt: t('gallery.diningfireplace') },
    { src: galleryTerrace, alt: t('gallery.terrace') },
    { src: galleryHouseExterior, alt: t('gallery.exterior') },
    { src: galleryBedroomMain, alt: t('gallery.bedroom1') },
    { src: galleryWorkspace, alt: t('gallery.workspace') },
    { src: galleryBathroom, alt: t('gallery.bathrooms') },
    { src: galleryBathroomShower, alt: t('gallery.showerbed1') },
    { src: galleryBedroom2, alt: t('gallery.bedroom2') },
    { src: galleryBedroom3, alt: t('gallery.bedroom3') },
    { src: galleryBedroomSingle, alt: t('gallery.bedroomsingle') },
    { src: galleryBalconyView, alt: t('gallery.balconyview') },
    { src: galleryLaundry, alt: t('gallery.laundry') },
    { src: galleryGamesNight, alt: t('gallery.games') },
    { src: locationSwans, alt: 'Schwanenfamilie am Grundbach in Fischen im Allgäu mit Bergpanorama' },
    { src: locationVillage, alt: 'St. Verena Kirche, Fischen im Allgäu' },
    { src: locationRiver, alt: 'Iller bei Fischen im Allgäu' },
    { src: locationCountryside, alt: 'Allgäuer Bergwiesen bei Fischen' },
  ];
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const onCarouselScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    setActiveSlide(Math.round(el.scrollLeft / el.clientWidth));
  };

  const usps = [
    { icon: ThermometerSun, title: t('hero.usp.sauna.title'), sub: t('hero.usp.sauna.sub') },
    { icon: Flame, title: t('hero.usp.fireplace.title'), sub: t('hero.usp.fireplace.sub') },
    { icon: FlameKindling, title: t('hero.usp.grill.title'), sub: t('hero.usp.grill.sub') },
    { icon: Mountain, title: t('hero.usp.allgaeu.title'), sub: t('hero.usp.allgaeu.sub') },
  ];

  const features = [
    { icon: Wifi, title: t('hero.feature.wifi.title'), sub: t('hero.feature.wifi.sub') },
    { icon: Car, title: t('hero.feature.parking.title'), sub: t('hero.feature.parking.sub') },
    { icon: CableCar, title: t('hero.feature.lifts.title'), sub: t('hero.feature.lifts.sub') },
    { icon: ShoppingBag, title: t('hero.feature.shopping.title'), sub: t('hero.feature.shopping.sub') },
  ];

  return (
    <section id="home" className="pt-28 md:pt-36 pb-10 md:pb-14 bg-background">
      <div className="mx-auto w-full max-w-[1600px] px-6">
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-8 2xl:gap-12 items-start">
          {/* ───────── Left column: content + collage + features ───────── */}
          <div className="min-w-0">
            {/* Title */}
            <motion.div
              className="mb-8 md:mb-10"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-5 md:mb-6">
                <span className="h-px w-10 bg-primary/60" aria-hidden="true" />
                <span className="font-body uppercase tracking-[0.22em] text-xs md:text-sm text-primary/80">
                  {t('hero.chip')}
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] 2xl:text-[3.8rem] text-foreground leading-[1.05] tracking-tight">
                {t('hero.headline.1')}
              </h1>
              <p
                className="mt-5 md:mt-6 max-w-2xl text-base md:text-lg text-foreground/80 leading-relaxed [&_strong]:font-semibold [&_strong]:text-foreground"
                dangerouslySetInnerHTML={{ __html: t('hero.sub') }}
              />
              <p className="mt-3 text-sm text-muted-foreground">
                {t('hero.capacityNote')}
              </p>
            </motion.div>

            {/* Social proof + USP strip */}
            <motion.div
              className="mb-8 md:mb-10"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              {/* USPs – gap-px draws clean dividers in any layout. */}
              <div className="overflow-hidden rounded-2xl border border-border bg-border shadow-soft grid grid-cols-2 lg:grid-cols-4 gap-px">
                {usps.map(({ icon: Icon, title, sub }) => (
                  <div key={title} className="flex items-start gap-2.5 bg-card px-4 py-3.5">
                    <Icon className="w-5 h-5 text-alpine-forest shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground leading-tight">{title}</p>
                      <p className="text-xs text-muted-foreground leading-snug mt-0.5">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Photo collage */}
            <motion.div
              className="relative rounded-3xl overflow-hidden h-[58vh] min-h-[460px] max-h-[620px] 2xl:max-h-[700px]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              {/* Mobile: native swipe carousel through all hero images */}
              <div className="md:hidden h-full">
                <div
                  ref={carouselRef}
                  onScroll={onCarouselScroll}
                  className="flex h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                >
                  {heroImages.map((img, i) => (
                    <div key={i} className="snap-center shrink-0 w-full h-full">
                      <img
                        src={img.src}
                        alt={img.alt}
                        loading={i === 0 ? 'eager' : 'lazy'}
                        fetchPriority={i === 0 ? 'high' : undefined}
                        draggable={false}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                {/* Airbnb badge → reviews */}
                <button
                  type="button"
                  onClick={() => scrollToSection('#reviews')}
                  aria-label={`${AIRBNB_RATING} ${t('hero.social.rating')}`}
                  className="absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 bg-alpine-snow/95 text-alpine-charcoal text-xs font-medium px-3 py-1.5 rounded-lg shadow-soft backdrop-blur-sm"
                >
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-alpine-gold text-alpine-gold" />
                    ))}
                  </span>
                  <span className="font-semibold tabular-nums">{AIRBNB_RATING}</span>
                  <span className="text-alpine-charcoal/70">{t('hero.social.rating')}</span>
                </button>
                {/* Gallery CTA */}
                <button
                  type="button"
                  onClick={() => scrollToSection('#gallery')}
                  className="absolute bottom-4 right-4 z-20 inline-flex items-center gap-1.5 bg-alpine-snow text-alpine-charcoal text-xs font-medium px-3.5 py-2 rounded-lg shadow-soft"
                >
                  {t('hero.gallery.cta')}
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                {/* Slide counter */}
                <div className="absolute bottom-4 left-4 z-20 rounded-full bg-alpine-charcoal/55 text-alpine-snow text-xs font-medium px-2.5 py-1 tabular-nums backdrop-blur-sm">
                  {activeSlide + 1} / {heroImages.length}
                </div>
              </div>

              {/* Desktop: collage grid */}
              <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2.5 h-full">
                <div className="col-span-2 row-span-2 relative group overflow-hidden">
                <img
                  src={galleryBalcony}
                  alt={t('gallery.balcony')}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  fetchPriority="high"
                  loading="eager"
                />
                {/* Whole-image click target → gallery */}
                <button
                  type="button"
                  onClick={() => scrollToSection('#gallery')}
                  aria-label={t('hero.gallery.cta')}
                  className="absolute inset-0 z-0"
                />
                {/* Airbnb rating badge → reviews (clickable, sits above the gallery target) */}
                <button
                  type="button"
                  onClick={() => scrollToSection('#reviews')}
                  aria-label={`${AIRBNB_RATING} ${t('hero.social.rating')}`}
                  className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 bg-alpine-snow/95 text-alpine-charcoal text-xs md:text-sm font-medium px-3 py-1.5 rounded-lg shadow-soft backdrop-blur-sm hover:bg-alpine-snow transition-colors"
                >
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-alpine-gold text-alpine-gold" />
                    ))}
                  </span>
                  <span className="font-semibold tabular-nums">{AIRBNB_RATING}</span>
                  <span className="text-alpine-charcoal/70">{t('hero.social.rating')}</span>
                </button>
                {/* Decorative overlays – non-interactive so clicks fall through to the gallery target */}
                <span className="pointer-events-none absolute bottom-4 left-4 inline-flex items-center gap-1.5 bg-alpine-pine/85 text-alpine-snow text-xs md:text-sm font-medium px-3.5 py-2 rounded-lg backdrop-blur-sm">
                  <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                  {t('hero.image.overlay')}
                </span>
                <span className="pointer-events-none md:hidden absolute bottom-4 right-4 inline-flex items-center gap-1.5 bg-alpine-snow text-alpine-charcoal text-xs font-medium px-3.5 py-2 rounded-lg shadow-soft">
                  {t('hero.gallery.cta')}
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              </div>
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
                    <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 bg-alpine-snow text-alpine-charcoal text-xs md:text-sm font-medium px-3.5 py-2 rounded-lg shadow-soft">
                      {t('hero.gallery.cta')}
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                  )}
                </button>
              ))}
              </div>
            </motion.div>

            {/* Booking box + brand card – in flow below the collage on < xl */}
            <div id="booking" className="xl:hidden mt-6 flex flex-col gap-4 scroll-mt-24">
              <HeroBookingBox />
              <BrandCard />
            </div>

            {/* Feature / trust strip */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-5 border-t border-border pt-6">
              {features.map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-alpine-forest">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-tight">{title}</p>
                    <p className="text-xs text-muted-foreground leading-snug">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ───────── Right column: booking box (sticky), xl+ only ───────── */}
          <motion.aside
            className="hidden xl:block"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="sticky top-24 flex flex-col gap-4">
              <HeroBookingBox />
              <BrandCard />
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
