import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// Living & Fireplace
import galleryLiving from '@/assets/gallery-living.jpg';
import galleryLivingSofa from '@/assets/gallery-living-sofa.jpg';

// Kitchen
import galleryKitchen from '@/assets/gallery-kitchen.jpg';
import galleryKitchenBora from '@/assets/gallery-kitchen-bora.jpg';
import galleryKitchenSmeg from '@/assets/gallery-kitchen-smeg.jpg';

// Bedrooms
import galleryBedroom from '@/assets/gallery-bedroom.jpg';
import galleryBedroom1 from '@/assets/gallery-bedroom1.jpg';
import galleryBedroom2 from '@/assets/gallery-bedroom2.jpg';
import galleryBedroom3 from '@/assets/gallery-bedroom3.png';

// Bathroom
import galleryBathroom from '@/assets/gallery-bathroom.jpg';

// Sauna
import gallerySauna from '@/assets/gallery-sauna.jpg';
import gallerySaunaInterior from '@/assets/gallery-sauna-interior.jpg';

// Garden & Nature
import galleryGarden from '@/assets/gallery-garden.jpg';

interface GalleryItem {
  src: string;
  labelKey: string;
  span: string;
}

const GallerySection = () => {
  const { t } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const galleryItems: GalleryItem[] = [
    // Row 1 - Living room large + Kitchen
    { src: galleryLiving, labelKey: 'gallery.living', span: 'col-span-2 row-span-2' },
    { src: galleryKitchen, labelKey: 'gallery.kitchen', span: 'col-span-1' },
    { src: gallerySauna, labelKey: 'gallery.sauna', span: 'col-span-1' },
    
    // Row 2 - Bedrooms
    { src: galleryBedroom2, labelKey: 'gallery.bedroom2', span: 'col-span-1' },
    { src: galleryBathroom, labelKey: 'gallery.bathrooms', span: 'col-span-1' },
    
    // Row 3 - More rooms
    { src: galleryLivingSofa, labelKey: 'gallery.livingsofa', span: 'col-span-1' },
    { src: gallerySaunaInterior, labelKey: 'gallery.saunainterior', span: 'col-span-1' },
    { src: galleryBedroom3, labelKey: 'gallery.bedroom3', span: 'col-span-1' },
    { src: galleryBedroom1, labelKey: 'gallery.bedroom1', span: 'col-span-1' },
    
    // Row 4 - Details & Garden
    { src: galleryKitchenSmeg, labelKey: 'gallery.kitchendetails', span: 'col-span-1' },
    { src: galleryBedroom, labelKey: 'gallery.workspace', span: 'col-span-1' },
    { src: galleryGarden, labelKey: 'gallery.garden', span: 'col-span-2' },
  ];

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
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            {t('gallery.title')}
          </h2>
          <p className="text-lg text-muted-foreground tracking-wide">
            {t('gallery.subtitle')}
          </p>
          <div className="alpine-divider mt-6" />
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          {galleryItems.map((item, index) => (
            <div
              key={index}
              className={`${item.span} relative group cursor-pointer overflow-hidden rounded`}
              onClick={() => setSelectedIndex(index)}
            >
              <div className="aspect-square md:aspect-auto md:h-full min-h-[200px]">
                <img
                  src={item.src}
                  alt={t(item.labelKey)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-alpine-charcoal/0 group-hover:bg-alpine-charcoal/40 transition-all duration-300 flex items-end">
                <span className="text-alpine-snow text-sm font-medium p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                  {t(item.labelKey)}
                </span>
              </div>
            </div>
          ))}
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
            className="max-w-full max-h-[85vh] object-contain rounded"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next button */}
          <button
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-alpine-snow hover:text-alpine-stone transition-colors p-2 bg-alpine-charcoal/50 rounded-full"
            onClick={handleNext}
          >
            <ChevronRight size={32} />
          </button>

          {/* Image counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-alpine-snow/80 text-sm">
            {selectedIndex + 1} / {galleryItems.length}
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
