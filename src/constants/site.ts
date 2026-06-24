// Editable site-wide constants (single source of truth).
// Adjust these values without touching component code.

/** Lowest nightly rate shown in the hero booking box ("Ab X € pro Nacht"). */
export const PRICE_FROM_EUR = 249;

/** Airbnb rating shown as social proof. Use a comma for the German decimal. */
export const AIRBNB_RATING = '5,0';

/**
 * Base URL of the direct-booking checkout (branded white-label domain pointing
 * to the HolidayFuture checkout for listing 463607). The booking box appends
 * `?start=&end=&numberOfGuests=` to this. Change here if the checkout moves.
 */
export const CHECKOUT_BASE_URL = 'https://book.achzeit.de/checkout/463607';

/**
 * Full-width emotional landscape image below the welcome story.
 * Real Allgäu photo (Weiher mit Bergpanorama bei Fischen), optimized to ~1600px.
 * Swap by replacing the file in /public or pointing this at a new asset path.
 */
export const WELCOME_BAND_IMAGE = '/welcome-allgaeu-weiher.jpg';
