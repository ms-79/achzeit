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
    'nav.faq': 'FAQ',
    'nav.amenities': 'Ausstattung',

    // Hero
    'hero.title': 'ACHZEIT',
    'hero.subtitle': 'Family Retreat',
   'hero.tagline': 'Dein modernes Ferienhaus im Allgäu',
   'hero.description': 'Wir haben ACHZEIT so gestaltet, wie wir selbst Urlaub machen möchten – ruhig, hochwertig und familienfreundlich.',
    'hero.cta.availability': 'Verfügbarkeit prüfen',
    'hero.chip': 'ACHZEIT Family Retreat · Fischen im Allgäu · Nahe Oberstdorf',
    'hero.headline.1': 'Euer privates Family Retreat im Allgäu',
    'hero.headline.2': 'Mit Sauna, Kamin und Bergblick.',
    'hero.sub': 'Ankommen, abschalten und gemeinsame Zeit genießen – in eurem modernen Ferienhaus für bis zu <strong>7 Gäste</strong>.',
    'hero.benefit.sauna': 'Private Sauna & Kamin',
    'hero.benefit.terrace': 'Terrasse & Balkon',
    'hero.benefit.guests': 'Bis zu 7 Gäste (4 Erwachsene, 3 Kinder)',

    // Hero – social proof, USPs, image overlay, brand card, feature strip
    'hero.social.rating': 'bei Airbnb',
    'hero.social.over': 'Über',
    'hero.social.guests': 'begeisterte Gäste',
    'hero.usp.sauna.title': 'Private Sauna',
    'hero.usp.sauna.sub': 'Für entspannte Abende',
    'hero.usp.fireplace.title': 'Kamin',
    'hero.usp.fireplace.sub': 'Für gemütliche Familienzeit',
    'hero.usp.capacity.title': 'Platz für alle',
    'hero.usp.capacity.sub': 'Bis zu 7 Gäste (4 Erw., 3 Kinder)',
    'hero.usp.allgaeu.title': 'Allgäu erleben',
    'hero.usp.allgaeu.sub': 'Wandern, Skifahren & Natur vor der Tür',
    'hero.image.overlay': 'Ruhige Lage mit Bergblick',
    'hero.gallery.cta': 'Zur Galerie',
    'hero.brand.title': 'Von Familien für Familien',
    'hero.brand.text': 'Ein Ort zum Durchatmen, Auftanken und Erinnerungen schaffen.',
    'hero.brand.whatsapp': 'Persönlicher WhatsApp-Service',
    'hero.feature.wifi.title': 'Schnelles WLAN',
    'hero.feature.wifi.sub': 'Für Arbeit & Freizeit',
    'hero.feature.parking.title': 'Kostenloser Parkplatz',
    'hero.feature.parking.sub': 'Direkt am Haus',
    'hero.feature.lifts.title': 'Nähe zu Bergbahnen',
    'hero.feature.lifts.sub': 'Ski & Wandern leicht gemacht',
    'hero.feature.shopping.title': 'Einkaufen in der Nähe',
    'hero.feature.shopping.sub': 'Restaurants & Supermärkte',
    'hero.badge.title': 'Gäste-Favorit',
    'hero.badge.reviews': 'Bewertungen',
    'hero.badge.text': 'Unterkunft mit herausragenden Gäste-Bewertungen in allen Kategorien bei',
    'hero.secondary.gallery': 'Galerie ansehen',
    'hero.trust': 'Antwort meist innerhalb 1\u00a0Std. · Direktkontakt zum Gastgeber · Sichere Buchung direkt auf dieser Website',
    'hero.book.title': 'Verfügbarkeit prüfen',
    'hero.book.subtitle': 'Bestpreis direkt beim Gastgeber',
    'hero.book.dates.hint': 'Zeitraum wählen, um Preise anzuzeigen',
    'hero.book.price.from': 'Ab',
    'hero.book.price.unit': 'pro Nacht',
    'hero.book.price.note': 'inkl. Endreinigung & Nebenkosten',
    'hero.book.list.bestprice': 'Bestpreis-Garantie',
    'hero.book.list.flexible': 'Flexible An- & Abreise',
    'hero.book.list.direct': 'Direkter Kontakt zum Gastgeber',
    'hero.book.list.nofees': 'Keine Servicegebühren (Airbnb, Booking etc.)',
    'hero.book.checkin': 'Check-in',
    'hero.book.checkout': 'Check-out',
    'hero.book.addDate': 'Datum hinzufügen',
    'hero.book.guests': 'Gäste',
    'hero.book.guest.one': 'Gast',
    'hero.book.guest.many': 'Gäste',
   'hero.book.adults': 'Erwachsene',
   'hero.book.adults.age': 'Ab 13 Jahre',
   'hero.book.kids': 'Kinder',
   'hero.book.kids.age': '0–12 Jahre',
   'hero.book.adults.short': 'Erw.',
   'hero.book.kids.short': 'Kinder',
    'hero.book.cta': 'Verfügbarkeit prüfen',
    'hero.book.trust': 'Sichere Buchung direkt beim Gastgeber zu den besten Konditionen. Keine Provision.',

    // Welcome / emotional intro
    'welcome.kicker': 'Willkommen bei ACHZEIT',
    'welcome.title': 'Hier kehrt Ruhe ein.',
    'welcome.p1': 'Nach einem Tag voller Abenteuer verblassen die Berge im Abendlicht. Die Skihosen hängen zum Trocknen, im Kamin lodert das Feuer, und der Duft aus der Küche zieht durchs Haus. Am Esstisch wird gelacht, erzählt, genossen – kein Zeitdruck, keine Ablenkung. Nur echte Momente, zusammen.',
    'welcome.p2': 'Im Sommer beginnt der Tag mit frischer Bergluft auf der Terrasse. Die Wanderwege starten direkt vor der Haustür, und abends wird gegrillt, während die Kinder barfuß durch den Garten toben.',
    'welcome.p3': 'ACHZEIT ist mehr als ein Ferienhaus – es ist euer Rückzugsort. Modern, alpin, durchdacht, mit privater Sauna und Kamin. Mit Raum für das, was im Alltag oft fehlt:',
    'welcome.closer': 'Zeit füreinander.',

    // Why ACHZEIT
    'why.title': 'Warum ACHZEIT?',
    'why.subtitle': 'Ein Ferienhaus für gemeinsame Zeit, ruhige Abende und echte Allgäu-Momente.',
    'why.cta': 'Verfügbarkeit prüfen',
    'why.1.title': 'Private Sauna',
    'why.1.text': 'Nach Wandertag, Skitag oder Familienausflug einfach abschalten.',
    'why.2.title': 'Kamin & Wohnbereich',
    'why.2.text': 'Gemütliche Abende mit viel Raum für gemeinsame Zeit.',
    'why.3.title': 'Ideal für Familien',
    'why.3.text': 'Bis zu 7 Gäste, 3 Schlafzimmer, Garten und praktische Ausstattung.',
    'why.4.title': 'Fischen im Allgäu',
    'why.4.text': 'Ruhig gelegen nahe Oberstdorf, Bergen, Natur und Ausflugszielen.',
    'why.5.title': 'Terrasse, Balkon & Garten',
    'why.5.text': 'Draußen frühstücken, spielen und die Allgäuer Luft genießen.',
    'why.6.title': 'Komfortabel anreisen',
    'why.6.text': 'Carport, moderne Küche, Waschmaschine und Trockner.',

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

    // Amenities
    'amenities.title': 'Ausstattung',
    'amenities.subtitle': 'Alles, was du für deinen Aufenthalt brauchst',
    'amenities.showAll': 'Alle {count} Ausstattungsmerkmale anzeigen',
    'amenities.showLess': 'Weniger anzeigen',

    // Common
    'common.readMore': 'Weiterlesen',
    'common.readLess': 'Weniger anzeigen',
    'common.language': 'Sprache',
    'common.mapLoading': 'Karte wird geladen…',

    // Location highlights
    'location.hiking': 'Wandern',
    'location.skiing': 'Skifahren',
    'location.nature': 'Natur',

    // Sticky CTA
    'sticky.eyebrow': 'ACHZEIT · Allgäu',
    'sticky.cta': 'Verfügbarkeit prüfen',
    
    // Availability
    'availability.title': 'Belegungskalender',
    'availability.subtitle': 'Aktuelle freie Termine auf einen Blick',
    'availability.clearDates': 'Daten löschen',
    'availability.apply': 'Anwenden',
    
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

    // WhatsApp
    'whatsapp.cta.short': 'WhatsApp',
    'whatsapp.aria': 'Per WhatsApp Kontakt aufnehmen',
    'whatsapp.close': 'Schließen',
    'whatsapp.card.title': 'Schreib uns auf WhatsApp',
    'whatsapp.card.sub': 'Direkter Draht zu den Gastgebern – ideal für schnelle Fragen zu Verfügbarkeit, Anreise oder Ausstattung.',
    'whatsapp.card.cta': 'Chat auf WhatsApp starten',
    'whatsapp.card.hours': 'Mo–So 9–20 Uhr · Antwort meist innerhalb 1 Std.',
    'whatsapp.card.privacy': 'Mit dem Klick wirst du zu WhatsApp (Meta) weitergeleitet. Es gelten unsere Datenschutzhinweise.',
    'whatsapp.card.or': 'oder klassisch per Formular',
    'whatsapp.prefill': 'Hallo, ich interessiere mich für das Achzeit Ferienhaus in Fischen im Allgäu und hätte eine Frage.',
    
    // Footer
    'footer.rights': 'Alle Rechte vorbehalten',
    'footer.tagline': 'Zeit für Familie. Zeit für die Berge. Zeit für ACHZEIT.',
    'footer.location': 'Fischen im Allgäu · nahe Oberstdorf',
    'footer.nav': 'Navigation',
    'footer.contact': 'Kontakt',
    'footer.book': 'Direkt buchen',
    'footer.whatsapp': 'WhatsApp',
    'footer.legal.agb': 'AGB & Stornierungsbedingungen',

    // Kurtaxe Danke
    'kurbeitrag.thanksTitle': 'Vielen Dank!',
    'kurbeitrag.thanksMessage': 'Dein Kurbeitrag wurde erfolgreich gezahlt. Wir wünschen dir einen wunderbaren Aufenthalt in Fischen und erholsame Tage im Allgäu.',
    'kurbeitrag.backHome': 'Zurück zur Startseite',
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
    'nav.faq': 'FAQ',
    'nav.amenities': 'Amenities',

    // Hero
    'hero.title': 'ACHZEIT',
    'hero.subtitle': 'Family Retreat',
    'hero.tagline': 'Your Modern Holiday Home in the Allgäu',
    'hero.description': 'We designed ACHZEIT the way we ourselves want to vacation – peaceful, high-quality and family-friendly.',
    'hero.cta.availability': 'Check Availability',
    'hero.chip': 'ACHZEIT Family Retreat · Fischen im Allgäu · Near Oberstdorf',
    'hero.headline.1': 'Your private family retreat in the Allgäu',
    'hero.headline.2': 'With sauna, fireplace and mountain views.',
    'hero.sub': 'Arrive, unwind and enjoy time together – in your modern holiday home for up to <strong>7 guests</strong>.',
    'hero.benefit.sauna': 'Private sauna & fireplace',
    'hero.benefit.terrace': 'Terrace & balcony',
    'hero.benefit.guests': 'Up to 7 guests (4 adults, 3 children)',

    // Hero – social proof, USPs, image overlay, brand card, feature strip
    'hero.social.rating': 'on Airbnb',
    'hero.social.over': 'Over',
    'hero.social.guests': 'happy guests',
    'hero.usp.sauna.title': 'Private Sauna',
    'hero.usp.sauna.sub': 'For relaxing evenings',
    'hero.usp.fireplace.title': 'Fireplace',
    'hero.usp.fireplace.sub': 'For cozy family time',
    'hero.usp.capacity.title': 'Room for everyone',
    'hero.usp.capacity.sub': 'Up to 7 guests (4 adults, 3 kids)',
    'hero.usp.allgaeu.title': 'Experience the Allgäu',
    'hero.usp.allgaeu.sub': 'Hiking, skiing & nature at your door',
    'hero.image.overlay': 'Quiet location with mountain views',
    'hero.gallery.cta': 'To the gallery',
    'hero.brand.title': 'By families, for families',
    'hero.brand.text': 'A place to breathe, recharge and create memories.',
    'hero.brand.whatsapp': 'Personal WhatsApp service',
    'hero.feature.wifi.title': 'Fast Wi-Fi',
    'hero.feature.wifi.sub': 'For work & leisure',
    'hero.feature.parking.title': 'Free parking',
    'hero.feature.parking.sub': 'Right at the house',
    'hero.feature.lifts.title': 'Close to mountain lifts',
    'hero.feature.lifts.sub': 'Skiing & hiking made easy',
    'hero.feature.shopping.title': 'Shopping nearby',
    'hero.feature.shopping.sub': 'Restaurants & supermarkets',
    'hero.badge.title': 'Guest Favorite',
    'hero.badge.reviews': 'reviews',
    'hero.badge.text': 'A home with outstanding guest ratings across all categories on',
    'hero.secondary.gallery': 'View gallery',
    'hero.trust': 'Usually replies within 1\u00a0hr · Direct contact with host · Secure booking directly on this website',
    'hero.book.title': 'Check availability',
    'hero.book.subtitle': 'Best price directly with the host',
    'hero.book.dates.hint': 'Select dates to view prices',
    'hero.book.price.from': 'From',
    'hero.book.price.unit': 'per night',
    'hero.book.price.note': 'incl. final cleaning & extra costs',
    'hero.book.list.bestprice': 'Best-price guarantee',
    'hero.book.list.flexible': 'Flexible arrival & departure',
    'hero.book.list.direct': 'Direct contact with the host',
    'hero.book.list.nofees': 'No service fees (Airbnb, Booking etc.)',
    'hero.book.checkin': 'Check-in',
    'hero.book.checkout': 'Check-out',
    'hero.book.addDate': 'Add date',
    'hero.book.guests': 'Guests',
    'hero.book.guest.one': 'guest',
    'hero.book.guest.many': 'guests',
   'hero.book.adults': 'Adults',
   'hero.book.adults.age': 'Ages 13+',
   'hero.book.kids': 'Children',
   'hero.book.kids.age': 'Ages 0–12',
   'hero.book.adults.short': 'adults',
   'hero.book.kids.short': 'children',
    'hero.book.cta': 'Check availability',
    'hero.book.trust': 'Secure booking directly with the host at the best rates. No commission.',

    // Welcome / emotional intro
    'welcome.kicker': 'Welcome to ACHZEIT',
    'welcome.title': 'Where calm settles in.',
    'welcome.p1': 'After a day full of adventure, the mountains fade into the evening light. Ski trousers hang out to dry, the fire crackles in the hearth, and the smell of cooking drifts through the house. Around the table there is laughter, stories and time to savour – no rush, no distractions. Just real moments, together.',
    'welcome.p2': 'In summer the day begins with fresh mountain air on the terrace. The hiking trails start right at your doorstep, and in the evening you fire up the grill while the children run barefoot through the garden.',
    'welcome.p3': 'ACHZEIT is more than a holiday home – it is your retreat. Modern, alpine and thoughtfully designed, with a private sauna and fireplace. With room for what everyday life so often lacks:',
    'welcome.closer': 'Time for each other.',

    // Why ACHZEIT
    'why.title': 'Why ACHZEIT?',
    'why.subtitle': 'A holiday home for shared time, quiet evenings and genuine Allgäu moments.',
    'why.cta': 'Check availability',
    'why.1.title': 'Private Sauna',
    'why.1.text': 'Unwind after a day of hiking, skiing or family adventures.',
    'why.2.title': 'Fireplace & Living Area',
    'why.2.text': 'Cozy evenings with plenty of space to spend time together.',
    'why.3.title': 'Ideal for Families',
    'why.3.text': 'Up to 7 guests, 3 bedrooms, garden and practical amenities.',
    'why.4.title': 'Fischen im Allgäu',
    'why.4.text': 'Quietly located near Oberstdorf, mountains, nature and excursions.',
    'why.5.title': 'Terrace, Balcony & Garden',
    'why.5.text': 'Breakfast outside, let the kids play and enjoy the Allgäu air.',
    'why.6.title': 'Comfortable Stay',
    'why.6.text': 'Carport, modern kitchen, washing machine and dryer.',

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

    // Amenities
    'amenities.title': 'Amenities',
    'amenities.subtitle': 'Everything you need for your stay',
    'amenities.showAll': 'Show all {count} amenities',
    'amenities.showLess': 'Show less',

    // Common
    'common.readMore': 'Read more',
    'common.readLess': 'Show less',
    'common.language': 'Language',
    'common.mapLoading': 'Loading map…',

    // Location highlights
    'location.hiking': 'Hiking',
    'location.skiing': 'Skiing',
    'location.nature': 'Nature',

    // Sticky CTA
    'sticky.eyebrow': 'ACHZEIT · Allgäu',
    'sticky.cta': 'Check availability',
    
    // Availability
    'availability.title': 'Availability Calendar',
    'availability.subtitle': 'Free dates at a glance',
    'availability.clearDates': 'Clear dates',
    'availability.apply': 'Apply',
    
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

    // WhatsApp
    'whatsapp.cta.short': 'WhatsApp',
    'whatsapp.aria': 'Contact us on WhatsApp',
    'whatsapp.close': 'Close',
    'whatsapp.card.title': 'Message us on WhatsApp',
    'whatsapp.card.sub': 'Direct line to your hosts – perfect for quick questions about availability, arrival or amenities.',
    'whatsapp.card.cta': 'Start WhatsApp chat',
    'whatsapp.card.hours': 'Mon–Sun 9 am–8 pm · usually replies within 1 hour',
    'whatsapp.card.privacy': 'You will be redirected to WhatsApp (Meta). Our privacy policy applies.',
    'whatsapp.card.or': 'or use the contact form below',
    'whatsapp.prefill': 'Hi, I am interested in the Achzeit holiday home in Fischen im Allgäu and have a question.',
    
    // Footer
    'footer.rights': 'All rights reserved',
    'footer.tagline': 'Time for family. Time for the mountains. Time for ACHZEIT.',
    'footer.location': 'Fischen im Allgäu · near Oberstdorf',
    'footer.nav': 'Navigation',
    'footer.contact': 'Contact',
    'footer.book': 'Book directly',
    'footer.whatsapp': 'WhatsApp',
    'footer.legal.agb': 'Terms & cancellation policy',

    // Kurtaxe Danke
    'kurbeitrag.thanksTitle': 'Thank You!',
    'kurbeitrag.thanksMessage': 'Your tourist contribution has been successfully paid. We wish you a wonderful stay in Fischen and relaxing days in the Allgäu.',
    'kurbeitrag.backHome': 'Back to Home',
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
