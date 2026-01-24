import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { motion } from 'framer-motion';

// Living & Fireplace
import galleryLiving from '@/assets/gallery-living.jpg';
import galleryLivingSofa from '@/assets/gallery-living-sofa.jpg';
import galleryDiningFireplace from '@/assets/gallery-dining-fireplace.jpg';

// Kitchen
import galleryKitchen from '@/assets/gallery-kitchen.jpg';
import galleryKitchenSmeg from '@/assets/gallery-kitchen-smeg.jpg';
import galleryKitchenView from '@/assets/gallery-kitchen-view.jpg';
import galleryNespresso from '@/assets/gallery-nespresso.jpg';
import galleryBoraCooktop from '@/assets/gallery-bora-cooktop.jpg';

// Bedrooms
import galleryBedroom1 from '@/assets/gallery-bedroom1.jpg';
import galleryBedroom2 from '@/assets/gallery-bedroom2.jpg';
import galleryBedroom3 from '@/assets/gallery-bedroom3.png';
import galleryBedroomMain from '@/assets/gallery-bedroom-main.jpg';
import galleryBedroomSingle from '@/assets/gallery-bedroom-single.png';

// Bathroom
import galleryBathroom from '@/assets/gallery-bathroom.jpg';
import galleryBathroomUpstairs from '@/assets/gallery-bathroom-upstairs.jpg';

// Sauna
import gallerySauna from '@/assets/gallery-sauna.jpg';
import gallerySaunaInterior from '@/assets/gallery-sauna-interior.jpg';
import gallerySaunaShower from '@/assets/gallery-sauna-shower.jpg';

// Garden & Nature
import galleryGarden from '@/assets/gallery-garden.jpg';

interface GalleryItem {
  src: string;
  labelKey: string;
  visibleInGrid: boolean; // Show in 3x3 grid on page
}

const GallerySection = () => {
  const { t } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // All gallery items - first 9 are visible in grid, all accessible in lightbox
  const galleryItems: GalleryItem[] = [
    // Visible in 3x3 grid (positions 1-9)
    { src: galleryLivingSofa, labelKey: 'gallery.livingsofa', visibleInGrid: true }, // 1. Gemütliche Sitzecke im Wohnzimmer
    { src: galleryLiving, labelKey: 'gallery.living', visibleInGrid: true }, // 2. Kamin im Wohnzimmer
    { src: gallerySauna, labelKey: 'gallery.sauna', visibleInGrid: true }, // 3. Private Sauna
    { src: galleryBedroomMain, labelKey: 'gallery.bedroom1', visibleInGrid: true }, // 4. Schlafzimmer 1
    { src: galleryBedroom1, labelKey: 'gallery.workspace', visibleInGrid: true }, // 5. Arbeitsplatz direkt an Schlafzimmer 1
    { src: galleryBathroom, labelKey: 'gallery.bathrooms', visibleInGrid: true }, // 6. Badezimmer en Suite (Schlafzimmer 1)
    { src: galleryBedroom2, labelKey: 'gallery.bedroom2', visibleInGrid: true }, // 7. Schlafzimmer 2 – Doppelbett
    { src: galleryBedroom3, labelKey: 'gallery.bedroom3', visibleInGrid: true }, // 8. Schlafzimmer 3 (Kinderzimmer) – Etagenbett
    { src: galleryBedroomSingle, labelKey: 'gallery.bedroomsingle', visibleInGrid: true }, // 9. Einzelbett in Schlafzimmer 3
    
    // Only in lightbox (positions 10-19)
    { src: galleryDiningFireplace, labelKey: 'gallery.diningfireplace', visibleInGrid: false }, // 10. Esstisch direkt am Kamin
    { src: gallerySaunaInterior, labelKey: 'gallery.saunainterior', visibleInGrid: false }, // 11. Sauna Innenansicht
    { src: gallerySaunaShower, labelKey: 'gallery.saunashower', visibleInGrid: false }, // 12. Dusche im Saunabereich
    { src: galleryBathroomUpstairs, labelKey: 'gallery.bathroomupstairs', visibleInGrid: false }, // 13. Bad im OG
    { src: galleryKitchen, labelKey: 'gallery.kitchenview', visibleInGrid: false }, // 14. Blick in die Küche
    { src: galleryKitchenView, labelKey: 'gallery.kitchen', visibleInGrid: false }, // 15. Küche & Essbereich
    { src: galleryNespresso, labelKey: 'gallery.nespresso', visibleInGrid: false }, // 16. Nespresso Kaffeemaschine
    { src: galleryBoraCooktop, labelKey: 'gallery.boracooktop', visibleInGrid: false }, // 17. BORA Kochfeld
    { src: galleryKitchenSmeg, labelKey: 'gallery.kitchendetails', visibleInGrid: false }, // 18. SMEG Ausstattung
    { src: galleryGarden, labelKey: 'gallery.garden', visibleInGrid: false }, // 19. Natur & Umgebung
  ];

  const gridItems = galleryItems.filter(item => item.visibleInGrid);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? galleryItems.length - 1 : selectedIndex - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === galleryItems.length - 1 ? 0 : selectedIndex + 1);
    }
  };

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

        {/* Gallery Grid - 3x3 */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
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

      {/* Lightbox with Navigation */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-alpine-charcoal/95 flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 text-alpine-snow hover:text-alpine-stone transition-colors z-10"
            onClick={() => setSelectedIndex(null)}
          >
            <X size={32} />
          </button>

          {/* Previous button */}
          <button
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-alpine-snow hover:text-alpine-stone transition-colors p-2 bg-alpine-charcoal/50 rounded-full"
            onClick={handlePrev}
          >
            <ChevronLeft size={32} />
          </button>

          {/* Image */}
          <img
            src={galleryItems[selectedIndex].src}
            alt={t(galleryItems[selectedIndex].labelKey)}
            className="max-w-full max-h-[75vh] object-contain rounded"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next button */}
          <button
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-alpine-snow hover:text-alpine-stone transition-colors p-2 bg-alpine-charcoal/50 rounded-full"
            onClick={handleNext}
          >
            <ChevronRight size={32} />
          </button>

          {/* Image description and counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
            <p className="text-alpine-snow font-medium text-lg mb-1">
              {t(galleryItems[selectedIndex].labelKey)}
            </p>
            <span className="text-alpine-snow/60 text-sm">
              {selectedIndex + 1} / {galleryItems.length}
            </span>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
