import { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface LightboxImage {
  src: string;
  caption: string;
}

interface LightboxProps {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/**
 * Reusable fullscreen image lightbox with arrow buttons, keyboard navigation
 * and touch-swipe (left/right) on mobile. Used by the gallery and the location
 * images so both behave identically.
 */
const Lightbox = ({ images, index, onClose, onNavigate }: LightboxProps) => {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const go = (dir: number) => {
    if (index === null) return;
    onNavigate((index + dir + images.length) % images.length);
  };

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    // Lock background scroll while the lightbox is open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, images.length]);

  if (index === null || !images[index]) return null;
  const current = images[index];

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - (touchStartY.current ?? 0);
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-alpine-charcoal/95 flex items-center justify-center p-6 animate-fade-in touch-none overscroll-contain"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button
        className="absolute top-6 right-6 text-alpine-snow hover:text-alpine-stone transition-colors z-10"
        onClick={onClose}
        aria-label="Schließen"
      >
        <X size={32} />
      </button>

      <button
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-alpine-snow hover:text-alpine-stone transition-colors p-2 bg-alpine-charcoal/50 rounded-full"
        onClick={(e) => { e.stopPropagation(); go(-1); }}
        aria-label="Vorheriges Bild"
      >
        <ChevronLeft size={32} />
      </button>

      <img
        src={current.src}
        alt={current.caption}
        className="max-w-full max-h-[75vh] object-contain rounded select-none touch-none"
        onClick={(e) => e.stopPropagation()}
        draggable={false}
      />

      <button
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-alpine-snow hover:text-alpine-stone transition-colors p-2 bg-alpine-charcoal/50 rounded-full"
        onClick={(e) => { e.stopPropagation(); go(1); }}
        aria-label="Nächstes Bild"
      >
        <ChevronRight size={32} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center px-6">
        <p className="text-alpine-snow font-medium text-lg mb-1">{current.caption}</p>
        <span className="text-alpine-snow/60 text-sm">
          {index + 1} / {images.length}
        </span>
      </div>
    </div>
  );
};

export default Lightbox;
