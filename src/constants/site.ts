// Editable site-wide constants (single source of truth).
// Adjust these values without touching component code.

/** Lowest nightly rate shown in the hero booking box ("Ab X € pro Nacht"). */
export const PRICE_FROM_EUR = 249;

/** Airbnb rating shown as social proof. Use a comma for the German decimal. */
export const AIRBNB_RATING = '5,0';

/** Approximate number of happy guests shown as social proof. */
export const GUEST_COUNT = 120;

/**
 * Base URL of the direct-booking checkout (branded white-label domain pointing
 * to the HolidayFuture checkout for listing 463607). The booking box appends
 * `?start=&end=&numberOfGuests=` to this. Change here if the checkout moves.
 */
export const CHECKOUT_BASE_URL = 'https://book.achzeit.de/checkout/463607';

/**
 * Full-width emotional landscape image below the welcome story.
 * PLACEHOLDER — swap with a real/AI Allgäu photo later by replacing the file in
 * /public or pointing this at the new asset path (recommended: optimized .webp,
 * ~1600×600, landscape, no people).
 */
export const WELCOME_BAND_IMAGE = '/allgaeu-band-placeholder.svg';
