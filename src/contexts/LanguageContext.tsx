import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';

type Language = 'de' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  de: {
    // Navigation
    'nav.home': 'Start',
    'nav.house': 'Das Haus',
    'nav.gallery': 'Galerie',
    'nav.availability': 'Verfügbarkeit',
    'nav.book': 'Jetzt buchen',
    'nav.location': 'Lage',
    'nav.contact': 'Kontakt',
    
    // Hero
    'hero.title': 'ACHZEIT',
    'hero.subtitle': 'Family Retreat',
    'hero.tagline': 'Ihr modernes Ferienhaus im Allgäu',
    'hero.description': 'Wir haben ACHZEIT so gestaltet, wie wir selbst Urlaub machen möchten – ruhig, hochwertig und familienfreundlich.',
    'hero.cta.availability': 'Verfügbarkeit prüfen',
    'hero.cta.book': 'Jetzt buchen',
    
    // House
    'house.title': 'Das Haus',
    'house.subtitle': 'Ihr Zuhause in den Bergen',
    'house.description': 'ACHZEIT ist mehr als ein Ferienhaus – es ist ein Ort zum Entschleunigen, zum Wiederfinden und zum gemeinsamen Genießen im Herzen des Allgäus.',
    'house.guests': 'Bis zu 7 Gäste',
    'house.guests.detail': '4 Erwachsene & 3 Kinder oder 6 Erwachsene',
    'house.bedrooms': '3 Schlafzimmer',
    'house.bathrooms': 'Bäder in beiden OGs & Dusche an der Sauna',
    'house.sauna': 'Private Sauna',
    'house.fireplace': 'Gemütlicher Kamin',
    'house.kitchen': 'Moderne Küche',
    'house.garden': 'Garten & Terrasse',
    'house.family': 'Familienfreundlich',
    'house.location': 'Ruhige Lage in Fischen',
    'house.nopets': 'Keine Haustiere',
    
    // Gallery
    'gallery.title': 'Galerie',
    'gallery.subtitle': 'Einblicke in Ihr Ferienhaus',
    'gallery.living': 'Kamin im Wohnzimmer',
    'gallery.livingsofa': 'Gemütliche Sitzecke im Wohnzimmer',
    'gallery.kitchen': 'Küche & Essbereich',
    'gallery.kitchendetails': 'Hochwertige Küchenausstattung (SMEG)',
    'gallery.bedroom1': 'Schlafzimmer 1',
    'gallery.bedroom2': 'Schlafzimmer 2 – Doppelbett',
    'gallery.bedroom3': 'Schlafzimmer 3 (Kinderzimmer) – Etagenbett',
    'gallery.workspace': 'Arbeitsplatz direkt an Schlafzimmer 1',
    'gallery.bathrooms': 'Badezimmer en Suite (Schlafzimmer 1)',
    'gallery.sauna': 'Private Sauna',
    'gallery.saunainterior': 'Sauna Innenansicht',
    'gallery.garden': 'Natur & Umgebung',
    'gallery.diningfireplace': 'Esstisch direkt am Kamin',
    'gallery.kitchenview': 'Blick in die Küche',
    'gallery.nespresso': 'Nespresso Kaffeemaschine',
    'gallery.saunashower': 'Dusche im Saunabereich',
    'gallery.boracooktop': 'BORA Kochfeld',
    'gallery.bathroomupstairs': 'Bad im OG',
    'gallery.bedroomsingle': 'Einzelbett (180x80) in Schlafzimmer 3 (Kinderzimmer)',
    'gallery.terrace': 'Terrasse mit Lounge & Esstisch',
    'gallery.balcony': 'Balkon im Dachgeschoss mit Bergblick',
    'gallery.games': 'Spielesammlung für Familienabende',
    
    // Availability
    'availability.title': 'Verfügbarkeit',
    'availability.subtitle': 'Prüfen Sie freie Termine',
    'availability.clearDates': 'Daten löschen',
    'availability.apply': 'Anwenden',
    
    // Booking
    'booking.title': 'Jetzt buchen',
    'booking.subtitle': 'Reservieren Sie Ihren Aufenthalt',
    
    // Location
    'location.title': 'Lage',
    'location.subtitle': 'Fischen im Allgäu',
    'location.description': 'Eingebettet in die atemberaubende Landschaft des Allgäus bietet Fischen den perfekten Ausgangspunkt für Wanderungen, Skifahren und Familienaktivitäten. Genießen Sie die frische Bergluft und die Ruhe der Natur.',
    
    // Contact
    'contact.title': 'Kontakt',
    'contact.subtitle': 'Wir freuen uns auf Ihre Nachricht',
    'contact.name': 'Name',
    'contact.email': 'E-Mail',
    'contact.message': 'Nachricht',
    'contact.send': 'Nachricht senden',
    'contact.success': 'Vielen Dank für Ihre Nachricht!',
    
    // Footer
    'footer.rights': 'Alle Rechte vorbehalten',
    'footer.tagline': 'Zeit für Familie. Zeit für die Berge. Zeit für ACHZEIT.',

    // Kurtaxe Danke
    'kurtaxe.thanksTitle': 'Vielen Dank!',
    'kurtaxe.thanksMessage': 'Ihre Kurtaxe wurde erfolgreich gezahlt. Wir wünschen Ihnen einen wunderbaren Aufenthalt in Fischen und erholsame Tage im Allgäu.',
    'kurtaxe.confirmationEmail': 'Eine Bestätigung wurde an Ihre E-Mail-Adresse gesendet.',
    'kurtaxe.backHome': 'Zurück zur Startseite',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.house': 'The House',
    'nav.gallery': 'Gallery',
    'nav.availability': 'Availability',
    'nav.book': 'Book Now',
    'nav.location': 'Location',
    'nav.contact': 'Contact',
    
    // Hero
    'hero.title': 'ACHZEIT',
    'hero.subtitle': 'Family Retreat',
    'hero.tagline': 'Your Modern Holiday Home in the Allgäu',
    'hero.description': 'We designed ACHZEIT the way we ourselves want to vacation – peaceful, high-quality and family-friendly.',
    'hero.cta.availability': 'Check Availability',
    'hero.cta.book': 'Book Now',
    
    // House
    'house.title': 'The House',
    'house.subtitle': 'Your Home in the Mountains',
    'house.description': 'ACHZEIT is more than a holiday home – it\'s a place to slow down, reconnect, and enjoy time together in the heart of the Allgäu.',
    'house.guests': 'Up to 7 Guests',
    'house.guests.detail': '4 adults & 3 kids or 6 adults',
    'house.bedrooms': '3 Bedrooms',
    'house.bathrooms': 'Bathrooms on Both Upper Floors & Shower at Sauna',
    'house.sauna': 'Private Sauna',
    'house.fireplace': 'Cozy Fireplace',
    'house.kitchen': 'Modern Kitchen',
    'house.garden': 'Garden & Terrace',
    'house.family': 'Family Friendly',
    'house.location': 'Quiet Location in Fischen',
    'house.nopets': 'No Pets Allowed',
    
    // Gallery
    'gallery.title': 'Gallery',
    'gallery.subtitle': 'Discover Your Holiday Home',
    'gallery.living': 'Fireplace in the Living Room',
    'gallery.livingsofa': 'Cozy Lounge Area in the Living Room',
    'gallery.kitchen': 'Kitchen & Dining',
    'gallery.kitchendetails': 'Premium Kitchen Appliances (SMEG)',
    'gallery.bedroom1': 'Bedroom 1',
    'gallery.bedroom2': 'Bedroom 2 – Double Bed',
    'gallery.bedroom3': 'Bedroom 3 (Kids Room) – Bunk Beds',
    'gallery.workspace': 'Workspace Adjacent to Bedroom 1',
    'gallery.bathrooms': 'En Suite Bathroom (Bedroom 1)',
    'gallery.sauna': 'Private Sauna',
    'gallery.saunainterior': 'Sauna Interior',
    'gallery.garden': 'Nature & Surroundings',
    'gallery.diningfireplace': 'Dining Table by the Fireplace',
    'gallery.kitchenview': 'Kitchen View',
    'gallery.nespresso': 'Nespresso Coffee Machine',
    'gallery.saunashower': 'Shower in Sauna Area',
    'gallery.boracooktop': 'BORA Cooktop',
    'gallery.bathroomupstairs': 'Upstairs Bathroom',
    'gallery.bedroomsingle': 'Single Bed (180x80) in Bedroom 3 (Kids Room)',
    'gallery.terrace': 'Terrace with Lounge & Dining Table',
    'gallery.balcony': 'Top-Floor Balcony with Mountain View',
    'gallery.games': 'Board Games for Family Evenings',
    
    // Availability
    'availability.title': 'Availability',
    'availability.subtitle': 'Check Available Dates',
    'availability.clearDates': 'Clear dates',
    'availability.apply': 'Apply',
    
    // Booking
    'booking.title': 'Book Now',
    'booking.subtitle': 'Reserve Your Stay',
    
    // Location
    'location.title': 'Location',
    'location.subtitle': 'Fischen im Allgäu',
    'location.description': 'Nestled in the breathtaking landscape of the Allgäu, Fischen offers the perfect starting point for hiking, skiing, and family activities. Enjoy the fresh mountain air and the peace of nature.',
    
    // Contact
    'contact.title': 'Contact',
    'contact.subtitle': 'We Look Forward to Hearing From You',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    'contact.success': 'Thank you for your message!',
    
    // Footer
    'footer.rights': 'All rights reserved',
    'footer.tagline': 'Time for family. Time for the mountains. Time for ACHZEIT.',

    // Kurtaxe Danke
    'kurtaxe.thanksTitle': 'Thank You!',
    'kurtaxe.thanksMessage': 'Your tourist tax has been successfully paid. We wish you a wonderful stay in Fischen and relaxing days in the Allgäu.',
    'kurtaxe.confirmationEmail': 'A confirmation has been sent to your email address.',
    'kurtaxe.backHome': 'Back to Home',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('de');

  const t = useCallback((key: string): string => {
    return translations[language][key] || key;
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
