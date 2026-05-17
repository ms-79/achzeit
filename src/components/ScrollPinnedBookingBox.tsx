import HeroBookingBox from '@/components/sections/HeroBookingBox';

/**
 * Renders the booking box as a fixed sidebar on desktop (lg+),
 * always visible in the viewport from the first paint.
 */
const ScrollPinnedBookingBox = () => {
  return (
    <aside
      className="hidden lg:block fixed top-24 right-6 w-[340px] z-30"
      aria-label="Buchungsbox"
    >
      <HeroBookingBox />
    </aside>
  );
};

export default ScrollPinnedBookingBox;
