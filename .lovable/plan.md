## Ziel
Den „Gäste-Favorit"-Badge in `HeroSection.tsx` so anpassen, dass Typografie und Proportionen 1:1 dem Airbnb-Original entsprechen.

## Änderungen (nur Badge-Block)

**Zahl „5,0"**
- Schrift von `font-display` (Cormorant Serif) → `font-body` (Inter)
- Gewicht: `font-bold` (statt aktuell standard)
- Größe deutlich erhöht: `text-7xl md:text-8xl` (statt `text-5xl md:text-6xl`)
- Farbe bleibt `text-foreground` (Anthrazit)
- `tracking-tight` für engeren Look wie bei Airbnb

**Lorbeerblätter**
- Höhe reduzieren auf `h-12 md:h-14` (statt `h-16 md:h-20`), damit sie wie bei Airbnb deutlich kleiner als die Zahl sind
- Abstand zwischen Lorbeer und Zahl enger: `gap-2 md:gap-3` (statt `gap-4 md:gap-6`)

**„Gäste-Favorit auf Airbnb"**
- Bleibt `font-medium`, Größe `text-base md:text-lg`
- Abstand nach oben reduzieren: `mt-2` (statt `mt-4`), damit der Block kompakter wirkt

**Beschreibungstext**
- Bleibt wie ist, ggf. `max-w-xs md:max-w-sm` für engeren Textblock wie im Airbnb-Original

**Container**
- Padding ggf. leicht reduzieren auf `p-5 md:p-6` für kompakteres Verhältnis

## Nicht geändert
- Logik, Bewertungs-Fetch, Klickziel `#reviews`, Bilder bleiben unverändert.
