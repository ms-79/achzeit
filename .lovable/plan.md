## Ziel
Die Gäste-Favorit-Badge rechts im Hero so anpassen, dass sie auf jeder Bildschirmgröße kompakt bleibt und der Erklärtext sauber umbricht – ohne horizontales Überlaufen und ohne dass der Text die Karte sprengt.

## Aktueller Stand (HeroSection.tsx, Zeile 92–129)
- Badge nutzt `min-w-[140px]` aber Erklärtext hat `max-w-[180px]` → Text kann breiter werden als der Inhaltsrahmen suggeriert.
- Padding `px-6 py-5 md:px-7 md:py-6` ist auf Mobile relativ groß.
- Auf sehr schmalen Displays (<360px) konkurriert die Badge mit der H1 um den Platz.

## Änderungen

1. **Feste, responsive Breite statt min/max-Mix**
   - Badge-Wrapper: `w-full max-w-[220px] sm:max-w-[200px] md:w-[200px]` (auf Mobile volle Spaltenbreite bis Cap, ab md fixe Spalte).
   - Inneren `min-w-[140px]` entfernen, stattdessen `w-full`.

2. **Padding reduzieren auf kleinen Displays**
   - `px-4 py-4 md:px-6 md:py-5` statt `px-6 py-5 md:px-7 md:py-6`.

3. **Erklärtext-Umbruch absichern**
   - `max-w-[180px]` entfernen → Text nutzt volle Badge-Breite minus Padding.
   - `text-pretty` + `break-words` ergänzen, `leading-snug` bleibt.
   - Schriftgröße `text-[11px] leading-[1.35]` konsistent (kein md-Sprung, damit Umbruch vorhersehbar bleibt).

4. **Lorbeerblätter/Headline-Höhe auf Mobile kleiner**
   - `h-11 md:h-14` statt `h-12 md:h-14`, damit Badge auf Mobile insgesamt schlanker wird.

5. **Hero-Header-Layout**
   - Flex-Container der Title-Row: `gap-4 md:gap-8` (statt `gap-6`) und auf Mobile `items-stretch`, damit die Badge oberhalb der H1 nicht zu viel Platz frisst.
   - Badge `self-start md:self-start` bleibt, aber auf Mobile `mx-auto md:mx-0` für saubere Zentrierung wenn sie alleinsteht.

## Technische Details
- Nur `src/components/sections/HeroSection.tsx` betroffen.
- Keine neuen Tokens nötig, alle Tailwind-Utilities sind im Standard-Setup verfügbar.
- Visuelle QA in 320px / 375px / 768px / 1280px Viewports.