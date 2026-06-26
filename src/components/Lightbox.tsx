import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface LightboxImage {
  src: string;
  caption: string;
}

interface LightboxProps {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  /** Optional – the carousel manages its own position internally. */
  onNavigate?: (index: number) => void;
}

/**
 * Fullscreen image lightbox built as a native horizontal scroll-snap carousel –
 * the image follows the finger with a smooth transition (same feel as the hero
 * gallery), instead of jumping. Background scroll is locked while open and
 * touch-action is limited to horizontal panning so the page never moves.
 */
const Lightbox = ({ images, index, onClose }: LightboxProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const isOpen = index !== null;

  // Move to prev/next based on the live scroll position (no stale state).
  const slideBy = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const cur = Math.round(el.scrollLeft / el.clientWidth);
    const target = Math.min(images.length - 1, Math.max(0, cur + dir));
    el.scrollTo({ left: target * el.clientWidth, behavior: 'smooth' });
  };

  const onScroll = () => {
    const el = trackRef.current;
    if (el) setCurrent(Math.round(el.scrollLeft / el.clientWidth));
  };

  // Position on the opened slide before paint (no flash of slide 0).
  useLayoutEffect(() => {
    if (index === null) return;
    const el = trackRef.current;
    if (el) el.scrollLeft = index * el.clientWidth;
    setCurrent(index);
  }, [index]);

  // Body scroll lock + keyboard navigation while open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') slideBy(-1);
      else if (e.key === 'ArrowRight') slideBy(1);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-alpine-charcoal/95 animate-fade-in">
      {/* Swipeable, snapping track */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        onClick={onClose}
        className="absolute inset-0 flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide overscroll-contain touch-pan-x"
      >
        {images.map((img, i) => (
          <div key={i} className="snap-center shrink-0 w-full h-full flex items-center justify-center p-6">
            <img
              src={img.src}
              alt={img.caption}
              className="max-w-full max-h-[80vh] object-contain rounded select-none"
              onClick={(e) => e.stopPropagation()}
              draggable={false}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <button
        className="absolute top-6 right-6 z-20 text-alpine-snow hover:text-alpine-stone transition-colors"
        onClick={onClose}
        aria-label="Schließen"
      >
        <X size={32} />
      </button>

      <button
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 text-alpine-snow hover:text-alpine-stone transition-colors p-2 bg-alpine-charcoal/50 rounded-full"
        onClick={() => slideBy(-1)}
        aria-label="Vorheriges Bild"
      >
        <ChevronLeft size={32} />
      </button>

      <button
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 text-alpine-snow hover:text-alpine-stone transition-colors p-2 bg-alpine-charcoal/50 rounded-full"
        onClick={() => slideBy(1)}
        aria-label="Nächstes Bild"
      >
        <ChevronRight size={32} />
      </button>

      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-center px-6">
        <p className="text-alpine-snow font-medium text-lg mb-1">{images[current]?.caption}</p>
        <span className="text-alpine-snow/60 text-sm">
          {current + 1} / {images.length}
        </span>
      </div>
    </div>
  );
};

export default Lightbox;
