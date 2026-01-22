import React, { createContext, useContext, useState, ReactNode } from 'react';

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
    'nav.book': 'Jetzt Buchen',
    'nav.location': 'Lage',
    'nav.contact': 'Kontakt',
    
    // Hero
    'hero.title': 'ACHZEIT',
    'hero.subtitle': 'Family Retreat',
    'hero.tagline': 'Ihr modernes Ferienhaus im Allgäu',
    'hero.description': 'Ein modernes Ferienhaus mit Sauna, Kamin und Platz für gemeinsame Zeit.',
    'hero.cta.availability': 'Verfügbarkeit prüfen',
    'hero.cta.book': 'Jetzt buchen',
    
    // House
    'house.title': 'Das Haus',
    'house.subtitle': 'Ihr Zuhause in den Bergen',
    'house.description': 'ACHZEIT ist mehr als ein Ferienhaus – es ist ein Ort zum Entschleunigen, zum Wiederfinden und zum gemeinsamen Genießen im Herzen des Allgäus.',
    'house.guests': 'Bis zu 7 Gäste',
    'house.guests.detail': '4 Erwachsene & 3 Kinder oder 6 Erwachsene',
    'house.bedrooms': '3 Schlafzimmer',
    'house.bathrooms': 'Mehrere Badezimmer',
    'house.sauna': 'Private Sauna',
    'house.fireplace': 'Gemütlicher Kamin',
    'house.kitchen': 'Moderne Küche',
    'house.garden': 'Garten & Terrasse',
    'house.family': 'Familienfreundlich',
    'house.location': 'Ruhige Lage in Fischen',
    
    // Gallery
    'gallery.title': 'Galerie',
    'gallery.subtitle': 'Einblicke in Ihr Ferienhaus',
    'gallery.living': 'Wohnen & Kamin',
    'gallery.kitchen': 'Küche & Essen',
    'gallery.bedrooms': 'Schlafzimmer',
    'gallery.bathrooms': 'Badezimmer',
    'gallery.sauna': 'Badezimmer en Suite / Schlafzimmer 1',
    'gallery.garden': 'Garten & Außenbereich',
    
    // Availability
    'availability.title': 'Verfügbarkeit',
    'availability.subtitle': 'Prüfen Sie freie Termine',
    
    // Booking
    'booking.title': 'Jetzt Buchen',
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
    'hero.description': 'A modern holiday home with sauna, fireplace and space for time together.',
    'hero.cta.availability': 'Check Availability',
    'hero.cta.book': 'Book Now',
    
    // House
    'house.title': 'The House',
    'house.subtitle': 'Your Home in the Mountains',
    'house.description': 'ACHZEIT is more than a holiday home – it\'s a place to slow down, reconnect, and enjoy time together in the heart of the Allgäu.',
    'house.guests': 'Up to 7 Guests',
    'house.guests.detail': '4 adults & 3 kids or 6 adults',
    'house.bedrooms': '3 Bedrooms',
    'house.bathrooms': 'Multiple Bathrooms',
    'house.sauna': 'Private Sauna',
    'house.fireplace': 'Cozy Fireplace',
    'house.kitchen': 'Modern Kitchen',
    'house.garden': 'Garden & Terrace',
    'house.family': 'Family Friendly',
    'house.location': 'Quiet Location in Fischen',
    
    // Gallery
    'gallery.title': 'Gallery',
    'gallery.subtitle': 'Discover Your Holiday Home',
    'gallery.living': 'Living & Fireplace',
    'gallery.kitchen': 'Kitchen & Dining',
    'gallery.bedrooms': 'Bedrooms',
    'gallery.bathrooms': 'Bathrooms',
    'gallery.sauna': 'En Suite Bathroom / Bedroom 1',
    'gallery.garden': 'Garden & Exterior',
    
    // Availability
    'availability.title': 'Availability',
    'availability.subtitle': 'Check Available Dates',
    
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
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('de');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
