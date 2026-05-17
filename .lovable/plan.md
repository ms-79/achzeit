## Ziel
Die Buchungsbox soll auf Desktop (lg+) ab dem ersten Laden **dauerhaft rechts im sichtbaren Bereich** fixiert sein – nicht erst nach dem Scrollen über den Hero hinaus.

## Änderungen

### 1. `src/components/ScrollPinnedBookingBox.tsx`
- IntersectionObserver-Logik entfernen.
- Komponente rendert die fixe Box **immer** auf `lg+` (kein Pin-State mehr).
- Position: `fixed top-24 right-6 w-[340px] z-30` bleibt.

### 2. `src/components/sections/HeroSection.tsx`
- Inline-`HeroBookingBox` aus dem Hero-Grid entfernen, da sie nun von Anfang an fixed rechts angezeigt wird (sonst doppelt).
- Badge-Row wieder auf volle Breite (`mt-6 md:mt-8`, ohne 2-Spalten-Grid).
- Anker `#hero-booking-anchor` entfernen (nicht mehr benötigt).

### 3. `src/pages/Index.tsx`
- `lg:pr-[380px]` bleibt am `<main>`-Wrapper bestehen, damit Inhalt nicht unter der fixen Box liegt.
- Hero-Section ebenfalls in diesen rechts-gepaddeten Bereich aufnehmen, damit der Hero-Inhalt (Titel, Galerie, Badge) nicht mit der fixen Box kollidiert.

### 4. Mobile
- Unverändert: `hidden lg:block` an der fixen Box; mobil greift weiterhin `StickyMobileCTA`.

## Ergebnis
Die Buchungsbox ist sofort beim Seitenaufruf rechts oben sichtbar und bleibt beim Scrollen dort fixiert – über die gesamte Seite.
