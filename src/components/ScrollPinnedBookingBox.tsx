import { useEffect, useState } from 'react';
import HeroBookingBox from '@/components/sections/HeroBookingBox';

/**
 * Renders a fixed clone of the booking box on desktop once the user has
 * scrolled past the inline anchor (#hero-booking-anchor). Also adds
 * right padding to <main> to prevent overlap with page content.
 */
const ScrollPinnedBookingBox = () => {
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const anchor = document.getElementById('hero-booking-anchor');
    if (!anchor) return;

    // Only activate on lg+ screens
    const mq = window.matchMedia('(min-width: 1024px)');
    if (!mq.matches) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        // Pin when the inline box is no longer in view (above viewport)
        const above = entry.boundingClientRect.bottom < 0;
        setPinned(!entry.isIntersecting && above);
      },
      { threshold: 0, rootMargin: '0px 0px 0px 0px' },
    );
    obs.observe(anchor);

    return () => {
      obs.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!pinned) return null;
  return (
    <aside
      className="hidden lg:block fixed top-24 right-6 w-[340px] z-30 animate-fade-in"
      aria-label="Buchungsbox"
    >
      <HeroBookingBox />
    </aside>
  );
};

export default ScrollPinnedBookingBox;
