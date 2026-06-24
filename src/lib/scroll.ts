/**
 * Scroll the visitor to the single primary booking surface (the hero booking box).
 *
 * The box is rendered twice: in-flow below the collage on mobile/tablet
 * (id="booking", visible < xl) and as a sticky sidebar column on desktop
 * (always on screen within the hero). When the in-flow box is hidden
 * (display:none at xl), `offsetParent` is null, so we fall back to the top of
 * the hero where the sticky box lives.
 */
export const scrollToBooking = (): void => {
  if (typeof document === 'undefined') return;
  const box = document.getElementById('booking');
  if (box && box.offsetParent !== null) {
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    document.getElementById('home')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};
