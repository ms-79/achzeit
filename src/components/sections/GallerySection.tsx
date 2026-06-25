import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import ScrollReveal from '@/components/ScrollReveal';
import Lightbox from '@/components/Lightbox';
import { motion } from 'framer-motion';

// Living & Fireplace
import galleryLiving from '@/assets/gallery-living.webp';
import galleryLivingSofa from '@/assets/gallery-living-sofa.webp';
import galleryDiningFireplace from '@/assets/gallery-dining-fireplace.jpg';

// Kitchen
import galleryKitchen from '@/assets/gallery-kitchen.jpg';
import galleryKitchenSmeg from '@/assets/gallery-kitchen-smeg.jpg';
import galleryKitchenView from '@/assets/gallery-kitchen-view.jpg';
import galleryNespresso from '@/assets/gallery-nespresso.jpg';
import galleryBoraCooktop from '@/assets/gallery-bora-cooktop.jpg';

// Bedrooms
import galleryWorkspace from '@/assets/gallery-workspace.jpg';
import galleryBedroom2 from '@/assets/gallery-bedroom2.webp';
import galleryBedroom3 from '@/assets/gallery-bedroom3.webp';
import galleryBedroomMain from '@/assets/gallery-bedroom-main.webp';
import galleryBedroomSingle from '@/assets/gallery-bedroom-single.webp';

// Bathroom
import galleryBathroom from '@/assets/gallery-bathroom.webp';
import galleryBathroomShower from '@/assets/gallery-bathroom-shower.jpg';
import galleryBathroomUpstairs from '@/assets/gallery-bathroom-upstairs.webp';

// Sauna
import gallerySauna from '@/assets/gallery-sauna.webp';
import gallerySaunaInterior from '@/assets/gallery-sauna-interior.jpg';
import gallerySaunaShower from '@/assets/gallery-sauna-shower.jpg';

// Exterior
import galleryHouseExterior from '@/assets/house-exterior.webp';

// Garden & Nature
import galleryGarden from '@/assets/gallery-garden.jpg';

// Outdoor & Extras
import galleryTerrace from '@/assets/gallery-terrasse.jpg';
import galleryBalcony from '@/assets/gallery-balkon-dachgeschoss.jpg';
import galleryBalconyView from '@/assets/gallery-balcony-view.jpg';
import galleryLaundry from '@/assets/gallery-laundry.jpg';
import galleryGamesNight from '@/assets/gallery-games-night.jpg';

interface GalleryItem {
  src: string;
  labelKey: string;
  visibleInGrid: boolean; // Show in 3x3 grid on page
}

const GallerySection = () => {
  const { t } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  // All gallery items - first 9 are visible in grid, all accessible in lightbox
  const galleryItems: GalleryItem[] = [
    // Visible in 3x3 grid (positions 1-9)
    { src: galleryLivingSofa, labelKey: 'gallery.livingsofa', visibleInGrid: true }, // 1. Gemütliche Sitzecke im Wohnzimmer
    { src: galleryLiving, labelKey: 'gallery.living', visibleInGrid: true }, // 2. Kamin im Wohnzimmer
    { src: gallerySauna, labelKey: 'gallery.sauna', visibleInGrid: true }, // 3. Private Sauna
    { src: galleryTerrace, labelKey: 'gallery.terrace', visibleInGrid: true }, // 4. Terrasse & Garten
    { src: galleryHouseExterior, labelKey: 'gallery.exterior', visibleInGrid: true }, // 5. Außenansicht des Hauses
    { src: galleryBedroomMain, labelKey: 'gallery.bedroom1', visibleInGrid: true }, // 6. Schlafzimmer 1
    { src: galleryWorkspace, labelKey: 'gallery.workspace', visibleInGrid: true }, // Arbeitsbereich direkt an Schlafzimmer 1
    { src: galleryBathroom, labelKey: 'gallery.bathrooms', visibleInGrid: true }, // 6. Badezimmer en Suite (Schlafzimmer 1)
    { src: galleryBathroomShower, labelKey: 'gallery.showerbed1', visibleInGrid: true }, // 6b. Dusche im Bad an Schlafzimmer 1
    { src: galleryBedroom2, labelKey: 'gallery.bedroom2', visibleInGrid: true }, // 7. Schlafzimmer 2 – Doppelbett
    { src: galleryBedroom3, labelKey: 'gallery.bedroom3', visibleInGrid: true }, // 8. Schlafzimmer 3 – Etagenbett & Einzelbett
    { src: galleryBedroomSingle, labelKey: 'gallery.bedroomsingle', visibleInGrid: true }, // 9. Einzelbett in Schlafzimmer 3
    
    // Only in lightbox (positions 10-19)
    { src: galleryDiningFireplace, labelKey: 'gallery.diningfireplace', visibleInGrid: true }, // 10. Esstisch direkt am Kamin
    { src: gallerySaunaInterior, labelKey: 'gallery.saunainterior', visibleInGrid: false }, // 11. Sauna Innenansicht
    { src: gallerySaunaShower, labelKey: 'gallery.saunashower', visibleInGrid: false }, // 12. Dusche im Saunabereich
    { src: galleryBathroomUpstairs, labelKey: 'gallery.bathroomupstairs', visibleInGrid: false }, // 13. Bad im OG
    { src: galleryKitchen, labelKey: 'gallery.kitchenview', visibleInGrid: false }, // 14. Blick in die Küche
    { src: galleryKitchenView, labelKey: 'gallery.kitchen', visibleInGrid: false }, // 15. Küche & Essbereich
    { src: galleryNespresso, labelKey: 'gallery.nespresso', visibleInGrid: false }, // 16. Nespresso Kaffeemaschine
    { src: galleryBoraCooktop, labelKey: 'gallery.boracooktop', visibleInGrid: false }, // 17. BORA Kochfeld
    { src: galleryKitchenSmeg, labelKey: 'gallery.kitchendetails', visibleInGrid: false }, // 18. SMEG Ausstattung
    { src: galleryGarden, labelKey: 'gallery.garden', visibleInGrid: false }, // 19. Natur & Umgebung
    { src: galleryBalcony, labelKey: 'gallery.balcony', visibleInGrid: true }, // 20. Balkon Dachgeschoss
    { src: galleryBalconyView, labelKey: 'gallery.balconyview', visibleInGrid: true }, // 21. Blick vom Balkon
    { src: galleryLaundry, labelKey: 'gallery.laundry', visibleInGrid: true }, // 22. Waschbereich
    { src: galleryGamesNight, labelKey: 'gallery.games', visibleInGrid: true }, // 23. Spielesammlung
  ];

  const gridItems = galleryItems.filter(item => item.visibleInGrid);

  // Preload lightbox-only images when user opens the lightbox
  useEffect(() => {
    if (selectedIndex === null || imagesPreloaded) return;

    // Only preload non-grid images (they're not lazy loaded on page)
    const lightboxOnlyImages = galleryItems.filter(item => !item.visibleInGrid);
    lightboxOnlyImages.forEach((item) => {
      const img = new Image();
      img.src = item.src;
    });
    setImagesPreloaded(true);
  }, [selectedIndex, imagesPreloaded]);

  return (
    <section id="gallery" className="section-padding bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            {t('gallery.title')}
          </h2>
          <p className="text-lg text-muted-foreground tracking-wide">
            {t('gallery.subtitle')}
          </p>
          <div className="alpine-divider mt-6" />
        </ScrollReveal>

        {/* Gallery Grid - 4x3 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {gridItems.map((item, gridIndex) => {
            // Find the actual index in galleryItems for lightbox navigation
            const actualIndex = galleryItems.findIndex(g => g.src === item.src);
            return (
              <motion.div
                key={gridIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ 
                  duration: 0.5, 
                  delay: gridIndex * 0.05,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
                className="relative group cursor-pointer overflow-hidden rounded aspect-square"
                onClick={() => setSelectedIndex(actualIndex)}
              >
                <img
                  src={item.src}
                  alt={t(item.labelKey)}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-alpine-charcoal/0 group-hover:bg-alpine-charcoal/40 transition-all duration-300 flex items-end">
                  <span className="text-alpine-snow text-sm font-medium p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                    {t(item.labelKey)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Lightbox
        images={galleryItems.map((g) => ({ src: g.src, caption: t(g.labelKey) }))}
        index={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        onNavigate={setSelectedIndex}
      />
    </section>
  );
};

export default GallerySection;
