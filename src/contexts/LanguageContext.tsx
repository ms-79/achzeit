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
    'hero.subtitle': 'Family & Friends Retreat',
   'hero.tagline': 'Dein modernes Ferienhaus im Allgäu',
   'hero.description': 'Wir haben ACHZEIT so gestaltet, wie wir selbst Urlaub machen möchten – ruhig, hochwertig und einladend für Familien wie Freunde.',
    'hero.cta.availability': 'Verfügbarkeit prüfen',
    'hero.chip': 'ACHZEIT Family & Friends Retreat · Fischen im Allgäu · Nahe Oberstdorf',
    'hero.headline.1': 'ACHZEIT – Auszeit im Allgäu für bis zu 7 Gäste',
    'hero.sub': 'Modernes Ferienhaus in Fischen mit Sauna, Kamin, Outdoor-Grill und viel Platz – ideal für Familien, befreundete Paare und gemeinsame Auszeiten im Allgäu.',
    'hero.capacityNote': 'Komfortabel für bis zu 6 Erwachsene oder Familien mit bis zu 7 Gästen.',
    'hero.benefit.sauna': 'Private Sauna & Kamin',
    'hero.benefit.terrace': 'Terrasse & Balkon',
    'hero.benefit.guests': 'Bis zu 7 Gäste · komfortabel für bis zu 6 Erwachsene',

    // Hero – social proof, USPs, image overlay, brand card, feature strip
    'hero.social.rating': 'bei Airbnb',
    'hero.usp.sauna.title': 'Private Sauna',
    'hero.usp.sauna.sub': 'Für entspannte Abende',
    'hero.usp.fireplace.title': 'Kamin',
    'hero.usp.fireplace.sub': 'Für gemütliche Abende',
    'hero.usp.grill.title': 'Outdoor-Grill',
    'hero.usp.grill.sub': 'Für Sommerabende auf der Terrasse',
    'hero.usp.allgaeu.title': 'Allgäu erleben',
    'hero.usp.allgaeu.sub': 'Wandern, Skifahren & Natur vor der Tür',
    'hero.image.overlay': 'Ruhige Lage mit Bergblick',
    'hero.gallery.cta': 'Zur Galerie',
    'hero.brand.title': 'Für Familien & Freunde',
    'hero.brand.text': 'Ein Ort zum Durchatmen, Auftanken und Erinnerungen schaffen.',
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
    'hero.book.avail.title': 'Nächste freie Termine',
    'hero.book.avail.more': 'Weitere Termine nach Auswahl des Reisezeitraums.',
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
    'welcome.p2': 'Im Sommer beginnt der Tag mit frischer Bergluft auf der Terrasse. Die Wanderwege starten direkt vor der Haustür, und abends wird gegrillt, während die letzten Sonnenstrahlen über den Garten ziehen.',
    'welcome.p3': 'ACHZEIT ist mehr als ein Ferienhaus – es ist euer Rückzugsort. Modern, alpin, durchdacht, mit privater Sauna und Kamin. Mit Raum für das, was im Alltag oft fehlt:',
    'welcome.closer': 'Einfach mal Ruhe.',
    'welcome.band.alt': 'Bergpanorama mit Weiher bei Fischen im Allgäu',

    // Why ACHZEIT
    'why.title': 'Warum ACHZEIT?',
    'why.subtitle': 'Ein Ferienhaus für gemeinsame Zeit, ruhige Abende und echte Allgäu-Momente.',
    'why.cta': 'Verfügbarkeit prüfen',
    'why.1.title': 'Private Sauna',
    'why.1.text': 'Nach Wandertag, Skitag oder Ausflug einfach abschalten.',
    'why.2.title': 'Kamin & Wohnbereich',
    'why.2.text': 'Gemütliche Abende mit viel Raum für gemeinsame Zeit.',
    'why.3.title': 'Für Familien & Freunde',
    'why.3.text': 'Bis zu 7 Gäste, 3 Schlafzimmer, Garten – komfortabel für bis zu 6 Erwachsene.',
    'why.4.title': 'Fischen im Allgäu',
    'why.4.text': 'Ruhig gelegen nahe Oberstdorf, Bergen, Natur und Ausflugszielen.',
    'why.5.title': 'Terrasse, Balkon & Garten',
    'why.5.text': 'Draußen frühstücken, entspannen und die Allgäuer Luft genießen.',
    'why.6.title': 'Outdoor-Grill & Terrasse',
    'why.6.text': 'Gemauerter Outdoor-Grill und viel Platz für entspannte Sommerabende draußen.',

    // Audience – "Für wen ist ACHZEIT ideal?"
    'audience.title': 'Für wen ist ACHZEIT ideal?',
    'audience.subtitle': 'Eine Auszeit im Allgäu – für ganz unterschiedliche Runden.',
    'audience.families.title': 'Familien',
    'audience.families.text': 'Viel Platz, drei Schlafzimmer, Garten, moderne Küche und kurze Wege zu Ausflügen im Allgäu – ideal für entspannte Familienzeit.',
    'audience.friends.title': 'Freunde & befreundete Paare',
    'audience.friends.text': 'Zwei großzügige Schlafzimmer mit 200 × 200 cm Doppelbetten und ein drittes Zimmer mit Etagenbett (200 × 90 cm) und kleinem Einzelbett (180 × 80 cm). Dazu private Sauna, Kamin, moderne Küche und Garten mit Grill – plus großzügige Gemeinschaftsbereiche für lange Abende. Perfekt für gemeinsame Tage im Allgäu.',
    'audience.active.title': 'Aktive Genießer',
    'audience.active.text': 'Wandern, Radfahren, Skifahren, Wellness und Abende am Kamin – ACHZEIT ist der passende Rückzugsort für aktive Auszeiten in Fischen.',
    'audience.note': 'Bis zu 7 Gäste insgesamt – komfortabel für bis zu 6 Erwachsene. Das dritte Schlafzimmer (Etagenbett 200 × 90 cm + Einzelbett 180 × 80 cm) ist besonders für Kinder und Jugendliche geeignet.',

    // House
    'house.title': 'Das Haus',
    'house.subtitle': 'Ihr Zuhause in den Bergen',
    'house.description': 'ACHZEIT ist mehr als ein Ferienhaus – es ist ein Ort zum Entschleunigen, zum Wiederfinden und zum gemeinsamen Genießen im Herzen des Allgäus.',
    'house.guests': 'Bis zu 7 Gäste',
    'house.guests.detail': 'Komfortabel für bis zu 6 Erwachsene',
    'house.bedrooms': '3 Schlafzimmer',
    'house.bathrooms': 'Bäder in beiden OGs & Dusche an der Sauna',
    'house.sauna': 'Private Sauna',
    'house.fireplace': 'Gemütlicher Kamin',
    'house.kitchen': 'Moderne Küche',
    'house.garden': 'Garten & Terrasse',
    'house.family': 'Familien & Freunde',
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
    'gallery.bedroom3': 'Schlafzimmer 3 – Etagenbett (200 × 90) & Einzelbett (180 × 80)',
    'gallery.workspace': 'Arbeitsplatz direkt an Schlafzimmer 1',
    'gallery.bathrooms': 'Badezimmer en Suite (Schlafzimmer 1)',
    'gallery.sauna': 'Private Sauna',
    'gallery.saunainterior': 'Sauna Innenansicht',
    'gallery.garden': 'Natur & Umgebung',
    'gallery.exterior': 'Außenansicht des Hauses',
    'gallery.diningfireplace': 'Esstisch direkt am Kamin',
    'gallery.kitchenview': 'Blick in die Küche',
    'gallery.nespresso': 'Nespresso Kaffeemaschine',
    'gallery.saunashower': 'Dusche im Saunabereich',
    'gallery.boracooktop': 'BORA Kochfeld',
    'gallery.bathroomupstairs': 'Bad im OG',
    'gallery.bedroomsingle': 'Einzelbett (180 × 80 cm) in Schlafzimmer 3',
    'gallery.terrace': 'Terrasse mit Lounge & Esstisch',
    'gallery.balcony': 'Balkon im Dachgeschoss mit Bergblick',
    'gallery.games': 'Spielesammlung für gemütliche Abende',

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
    'location.description': 'Eingebettet in die Hörnerdörfer im Oberallgäu liegt ACHZEIT in Fischen – nur wenige Minuten von Oberstdorf und dem Kleinwalsertal entfernt. Direkt vom Haus starten Wander- und Radwege ins Illertal, im Winter sind Loipen und die Skigebiete am Nebelhorn, Söllereck und in Balderschwang schnell erreicht.',
    'location.description2': 'Die Bergbahnen rund um Oberstdorf, das Familienbad und zahlreiche Ausflugsziele liegen in unmittelbarer Nähe. Ob Sommerwanderung, Skitag oder ein ruhiger Nachmittag mit Bergblick – Fischen im Allgäu ist der ideale Ausgangspunkt für Familien, Freunde und gemeinsame Auszeiten.',
    
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
    'whatsapp.prefill': 'Hallo, ich interessiere mich für das ACHZEIT Ferienhaus in Fischen im Allgäu und hätte eine Frage.',
    
    // Footer
    'footer.rights': 'Alle Rechte vorbehalten',
    'footer.tagline': 'Zeit zum Auftanken. Zeit für die Berge. Zeit für ACHZEIT.',
    'footer.location': 'Fischen im Allgäu · nahe Oberstdorf',
    'footer.nav': 'Navigation',
    'footer.contact': 'Kontakt',
    'footer.whatsapp': 'WhatsApp',
    'footer.legal.agb': 'AGB & Stornierungsbedingungen',

    // Kurbeitrag Danke
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
    'hero.subtitle': 'Family & Friends Retreat',
    'hero.tagline': 'Your Modern Holiday Home in the Allgäu',
    'hero.description': 'We designed ACHZEIT the way we ourselves want to vacation – peaceful, high-quality and welcoming for families and friends alike.',
    'hero.cta.availability': 'Check Availability',
    'hero.chip': 'ACHZEIT Family & Friends Retreat · Fischen im Allgäu · Near Oberstdorf',
    'hero.headline.1': 'ACHZEIT – Your Allgäu getaway for up to 7 guests',
    'hero.sub': 'Modern holiday home in Fischen with sauna, fireplace, outdoor grill and plenty of space – ideal for families, couples and shared getaways in the Allgäu.',
    'hero.capacityNote': 'Comfortable for up to 6 adults, or families with up to 7 guests.',
    'hero.benefit.sauna': 'Private sauna & fireplace',
    'hero.benefit.terrace': 'Terrace & balcony',
    'hero.benefit.guests': 'Up to 7 guests · comfortable for up to 6 adults',

    // Hero – social proof, USPs, image overlay, brand card, feature strip
    'hero.social.rating': 'on Airbnb',
    'hero.usp.sauna.title': 'Private Sauna',
    'hero.usp.sauna.sub': 'For relaxing evenings',
    'hero.usp.fireplace.title': 'Fireplace',
    'hero.usp.fireplace.sub': 'For cozy evenings',
    'hero.usp.grill.title': 'Outdoor grill',
    'hero.usp.grill.sub': 'For summer evenings on the terrace',
    'hero.usp.allgaeu.title': 'Experience the Allgäu',
    'hero.usp.allgaeu.sub': 'Hiking, skiing & nature at your door',
    'hero.image.overlay': 'Quiet location with mountain views',
    'hero.gallery.cta': 'To the gallery',
    'hero.brand.title': 'For families & friends',
    'hero.brand.text': 'A place to breathe, recharge and create memories.',
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
    'hero.book.avail.title': 'Next available dates',
    'hero.book.avail.more': 'More dates after choosing your travel period.',
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
    'welcome.p2': 'In summer the day begins with fresh mountain air on the terrace. The hiking trails start right at your doorstep, and in the evening you fire up the grill while the last rays of sun drift across the garden.',
    'welcome.p3': 'ACHZEIT is more than a holiday home – it is your retreat. Modern, alpine and thoughtfully designed, with a private sauna and fireplace. With room for what everyday life so often lacks:',
    'welcome.closer': 'Simply some quiet.',
    'welcome.band.alt': 'Mountain panorama with pond near Fischen im Allgäu',

    // Why ACHZEIT
    'why.title': 'Why ACHZEIT?',
    'why.subtitle': 'A holiday home for shared time, quiet evenings and genuine Allgäu moments.',
    'why.cta': 'Check availability',
    'why.1.title': 'Private Sauna',
    'why.1.text': 'Unwind after a day of hiking, skiing or exploring.',
    'why.2.title': 'Fireplace & Living Area',
    'why.2.text': 'Cozy evenings with plenty of space to spend time together.',
    'why.3.title': 'For Families & Friends',
    'why.3.text': 'Up to 7 guests, 3 bedrooms, garden – comfortable for up to 6 adults.',
    'why.4.title': 'Fischen im Allgäu',
    'why.4.text': 'Quietly located near Oberstdorf, mountains, nature and excursions.',
    'why.5.title': 'Terrace, Balcony & Garden',
    'why.5.text': 'Breakfast outside, relax and enjoy the Allgäu air.',
    'why.6.title': 'Outdoor Grill & Terrace',
    'why.6.text': 'A built-in outdoor grill and plenty of space for relaxed summer evenings outdoors.',

    // Audience – "Who is ACHZEIT ideal for?"
    'audience.title': 'Who is ACHZEIT ideal for?',
    'audience.subtitle': 'A getaway in the Allgäu – for all kinds of groups.',
    'audience.families.title': 'Families',
    'audience.families.text': 'Plenty of space, three bedrooms, garden, modern kitchen and short trips to Allgäu adventures – ideal for relaxed family time.',
    'audience.friends.title': 'Friends & couples',
    'audience.friends.text': 'Two spacious bedrooms with 200 × 200 cm double beds and a third room with a bunk bed (200 × 90 cm) and a small single bed (180 × 80 cm). Plus a private sauna, fireplace, modern kitchen and garden with grill – and generous shared spaces for long evenings. Perfect for days together in the Allgäu.',
    'audience.active.title': 'Active souls',
    'audience.active.text': 'Hiking, cycling, skiing, wellness and evenings by the fire – ACHZEIT is the right retreat for active getaways in Fischen.',
    'audience.note': 'Up to 7 guests in total – comfortable for up to 6 adults. The third bedroom (bunk bed 200 × 90 cm + single bed 180 × 80 cm) is especially suited to children and teenagers.',

    // House
    'house.title': 'The House',
    'house.subtitle': 'Your Home in the Mountains',
    'house.description': 'ACHZEIT is more than a holiday home – it\'s a place to slow down, reconnect, and enjoy time together in the heart of the Allgäu.',
    'house.guests': 'Up to 7 Guests',
    'house.guests.detail': 'Comfortable for up to 6 adults',
    'house.bedrooms': '3 Bedrooms',
    'house.bathrooms': 'Bathrooms on Both Upper Floors & Shower at Sauna',
    'house.sauna': 'Private Sauna',
    'house.fireplace': 'Cozy Fireplace',
    'house.kitchen': 'Modern Kitchen',
    'house.garden': 'Garden & Terrace',
    'house.family': 'Families & Friends',
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
    'gallery.bedroom3': 'Bedroom 3 – Bunk Bed (200 × 90) & Single Bed (180 × 80)',
    'gallery.workspace': 'Workspace Adjacent to Bedroom 1',
    'gallery.bathrooms': 'En Suite Bathroom (Bedroom 1)',
    'gallery.sauna': 'Private Sauna',
    'gallery.saunainterior': 'Sauna Interior',
    'gallery.garden': 'Nature & Surroundings',
    'gallery.exterior': 'Exterior View of the House',
    'gallery.diningfireplace': 'Dining Table by the Fireplace',
    'gallery.kitchenview': 'Kitchen View',
    'gallery.nespresso': 'Nespresso Coffee Machine',
    'gallery.saunashower': 'Shower in Sauna Area',
    'gallery.boracooktop': 'BORA Cooktop',
    'gallery.bathroomupstairs': 'Upstairs Bathroom',
    'gallery.bedroomsingle': 'Single Bed (180 × 80 cm) in Bedroom 3',
    'gallery.terrace': 'Terrace with Lounge & Dining Table',
    'gallery.balcony': 'Top-Floor Balcony with Mountain View',
    'gallery.games': 'Board Games for Cozy Evenings',

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
    'location.description': 'Set among the Hörnerdörfer in the Oberallgäu, ACHZEIT sits in Fischen – just minutes from Oberstdorf and the Kleinwalsertal valley. Hiking and cycling trails start right at the house into the Iller valley, while in winter the cross-country tracks and the ski areas at Nebelhorn, Söllereck and Balderschwang are quickly reached.',
    'location.description2': 'The mountain lifts around Oberstdorf, the family swimming pool and countless excursions are all close by. Whether a summer hike, a day on the slopes or a quiet afternoon with mountain views – Fischen im Allgäu is the perfect base for families, friends and shared getaways.',
    
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
    'whatsapp.prefill': 'Hi, I am interested in the ACHZEIT holiday home in Fischen im Allgäu and have a question.',
    
    // Footer
    'footer.rights': 'All rights reserved',
    'footer.tagline': 'Time to recharge. Time for the mountains. Time for ACHZEIT.',
    'footer.location': 'Fischen im Allgäu · near Oberstdorf',
    'footer.nav': 'Navigation',
    'footer.contact': 'Contact',
    'footer.whatsapp': 'WhatsApp',
    'footer.legal.agb': 'Terms & cancellation policy',

    // Kurbeitrag Danke
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
