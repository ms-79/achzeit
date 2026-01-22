import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { X } from 'lucide-react';
import galleryLiving from '@/assets/gallery-living.jpg';
import galleryKitchen from '@/assets/gallery-kitchen.jpg';
import galleryBedroom from '@/assets/gallery-bedroom.jpg';
import galleryBathroom from '@/assets/gallery-bathroom.jpg';
import gallerySauna from '@/assets/gallery-sauna.jpg';
import galleryGarden from '@/assets/gallery-garden.jpg';

const GallerySection = () => {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryItems = [
    { src: galleryLiving, label: t('gallery.living'), span: 'col-span-2 row-span-2' },
    { src: galleryKitchen, label: t('gallery.kitchen'), span: 'col-span-1' },
    { src: gallerySauna, label: t('gallery.sauna'), span: 'col-span-1' },
    { src: galleryBedroom, label: t('gallery.bedrooms'), span: 'col-span-1' },
    { src: galleryBathroom, label: t('gallery.bathrooms'), span: 'col-span-1' },
    { src: galleryGarden, label: t('gallery.garden'), span: 'col-span-2' },
  ];

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
              onClick={() => setSelectedImage(item.src)}
            >
              <div className="aspect-square md:aspect-auto md:h-full">
                <img
                  src={item.src}
                  alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-alpine-charcoal/0 group-hover:bg-alpine-charcoal/40 transition-all duration-300 flex items-end">
                <span className="text-alpine-snow text-sm font-medium p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-alpine-charcoal/95 flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-alpine-snow hover:text-alpine-stone transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          <img
            src={selectedImage}
            alt="Gallery Image"
            className="max-w-full max-h-[90vh] object-contain rounded"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

export default GallerySection;
