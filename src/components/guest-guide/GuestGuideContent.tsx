import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Key,
  Wifi,
  Baby,
  Flame,
  Trash2,
  AlertTriangle,
  Car,
  Zap,
  UtensilsCrossed,
  Phone,
  MapPin,
  Star,
  Mountain,
  ExternalLink,
} from 'lucide-react';
import type { GuestData } from '@/pages/GuestGuide';
import GuestGuideEvents from './GuestGuideEvents';

interface Props {
  guestData: GuestData;
}

const GuestGuideContent = ({ guestData }: Props) => {
  const { boxCode, wifiPassword } = guestData;

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 md:py-16">
      <Accordion type="multiple" defaultValue={['zugang']} className="space-y-4">
        {/* Zugang & Anreise */}
        <AccordionItem value="zugang" id="zugang" className="border border-border rounded-lg px-6 overflow-hidden">
          <AccordionTrigger className="text-lg md:text-xl font-display hover:no-underline">
            <span className="flex items-center gap-3">
              <Key size={20} className="text-alpine-wood" />
              Anreise & Zugang
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed space-y-4">
            <p>Check-in ist ab <strong className="text-foreground">16:00 Uhr</strong> möglich.</p>

            <div className="bg-muted rounded-lg p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Schlüsselbox-Code</p>
              <p className="text-2xl font-mono font-bold text-foreground tracking-[0.3em]">{boxCode}</p>
            </div>

            <div className="space-y-2 text-sm">
              <p>📌 Bitte nach Entnahme den Schlüssel wieder sicher verschließen.</p>
              <p>📌 Beim Check-out den Schlüssel wieder in die Box hängen und den Code verdrehen.</p>
            </div>

            <div className="pt-2">
              <h4 className="font-display text-base text-foreground mb-2 flex items-center gap-2">
                <Car size={16} className="text-alpine-wood" /> Parken
              </h4>
              <ul className="space-y-1 text-sm">
                <li>• Carport direkt am Haus.</li>
              </ul>
            </div>

          </AccordionContent>
        </AccordionItem>

        {/* WLAN */}
        <AccordionItem value="wlan" id="wlan" className="border border-border rounded-lg px-6 overflow-hidden">
          <AccordionTrigger className="text-lg md:text-xl font-display hover:no-underline">
            <span className="flex items-center gap-3">
              <Wifi size={20} className="text-alpine-wood" />
              WLAN
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-muted rounded-lg p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Netzwerkname</p>
                <p className="text-lg font-mono font-bold text-foreground">ACHZEIT</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Passwort</p>
                <p className="text-lg font-mono font-bold text-foreground">{wifiPassword || '– – – –'}</p>
              </div>
            </div>
            <div className="pt-2">
              <h4 className="font-display text-base text-foreground mb-2">Bei Verbindungsproblemen</h4>
              <ul className="space-y-1 text-sm">
                <li>• Router befindet sich im Technikschrank.</li>
                <li>• Kurz vom Strom trennen (30 Sekunden) und neu verbinden.</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Familie */}
        <AccordionItem value="familie" id="familie" className="border border-border rounded-lg px-6 overflow-hidden">
          <AccordionTrigger className="text-lg md:text-xl font-display hover:no-underline">
            <span className="flex items-center gap-3">
              <Baby size={20} className="text-alpine-wood" />
              Familienfreundlich ausgestattet
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed space-y-4">
            <ul className="space-y-2 text-sm">
              <li>• Babybett (im Abstellraum)</li>
              <li>• Wickelunterlage im Badezimmerschrank</li>
              <li>• Rausfallschutz verfügbar</li>
              <li>• Hochstuhl in der Küche</li>
              <li>• Kindergeschirr in der unteren Küchenschublade</li>
              <li>• Spiele & Bücher im Wohnbereich</li>
            </ul>
            <p className="text-sm italic text-muted-foreground">
              ACHZEIT ist bewusst familienfreundlich konzipiert – damit sich auch die Kleinsten wohlfühlen.
            </p>
          </AccordionContent>
        </AccordionItem>

        {/* Küche & Technik */}
        <AccordionItem value="kueche" id="kueche" className="border border-border rounded-lg px-6 overflow-hidden">
          <AccordionTrigger className="text-lg md:text-xl font-display hover:no-underline">
            <span className="flex items-center gap-3">
              <UtensilsCrossed size={20} className="text-alpine-wood" />
              Küche & Geräte
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed space-y-4">
            <ul className="space-y-2 text-sm">
              <li>• BORA-Kochfeld mit integriertem Abzug</li>
              <li>• Backofen & Geschirrspüler unter der Arbeitsplatte</li>
              <li>• Kaffeemaschine im Küchenbereich</li>
              <li>• Mülltrennung unter der Spüle (Restmüll, Bio, Gelber Sack)</li>
            </ul>
            <p className="text-sm font-medium text-foreground">
              📌 Bitte den Geschirrspüler vor Abreise starten.
            </p>
          </AccordionContent>
        </AccordionItem>

        {/* Sauna & Kamin */}
        <AccordionItem value="sauna" id="sauna" className="border border-border rounded-lg px-6 overflow-hidden">
          <AccordionTrigger className="text-lg md:text-xl font-display hover:no-underline">
            <span className="flex items-center gap-3">
              <Flame size={20} className="text-alpine-wood" />
              Sauna & Kamin
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed space-y-4">
            <div>
              <h4 className="font-display text-base text-foreground mb-2">Sauna</h4>
              <ul className="space-y-1 text-sm">
                <li>• Bitte ausschließlich im Sitzen auf einem Handtuch nutzen.</li>
                <li>• Nach Nutzung kurz lüften.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-display text-base text-foreground mb-2">Kamin</h4>
              <ul className="space-y-1 text-sm">
                <li>• Nur trockenes Holz verwenden.</li>
                <li>• Asche erst vollständig abgekühlt entsorgen.</li>
              </ul>
            </div>
            <p className="text-sm italic text-muted-foreground pt-2">
              Genießt eure ganz persönliche ACHZEIT – mit Wärme, Ruhe und Bergblick.
            </p>
          </AccordionContent>
        </AccordionItem>

        {/* Restaurant-Empfehlungen */}
        <AccordionItem value="restaurants" id="restaurants" className="border border-border rounded-lg px-6 overflow-hidden">
          <AccordionTrigger className="text-lg md:text-xl font-display hover:no-underline">
            <span className="flex items-center gap-3">
              <UtensilsCrossed size={20} className="text-alpine-wood" />
              Restaurant-Empfehlungen
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed space-y-5">
            <p className="text-sm">Unsere persönlichen Tipps für euren Aufenthalt – von regional bis gehoben.</p>

            <div className="space-y-4">
              {/* Gaisbock */}
              <a href="https://www.dorfalpe.de/gaisbock/" target="_blank" rel="noopener noreferrer" className="block bg-muted rounded-lg p-4 hover:bg-accent transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-display text-base text-foreground">Gaisbock</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Fischen im Allgäu · Regionale Küche</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-alpine-wood whitespace-nowrap">
                    <Star size={12} className="fill-alpine-wood" /> Top-Empfehlung
                  </span>
                </div>
                <p className="text-sm mt-2">Traditionelle Allgäuer Gastlichkeit mit modernen Akzenten. Regionale Küche mit besten Zutaten aus der Heimat – gemütlich und herzlich.</p>
              </a>

              {/* Ondersch */}
              <a href="https://ondersch.de/" target="_blank" rel="noopener noreferrer" className="block bg-muted rounded-lg p-4 hover:bg-accent transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-display text-base text-foreground">Ondersch</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Oberstdorf · Fine Dining & Genusswirtschaft</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-alpine-wood whitespace-nowrap">
                    <Star size={12} className="fill-alpine-wood" /> Sterne-Niveau
                  </span>
                </div>
                <p className="text-sm mt-2">Zwei Konzepte unter einem Dach – gehobene Küche und entspannte Genusswirtschaft. Perfekt für einen besonderen Abend.</p>
              </a>

              {/* Alte Sennküche */}
              <a href="https://altesennkueche.de/" target="_blank" rel="noopener noreferrer" className="block bg-muted rounded-lg p-4 hover:bg-accent transition-colors">
                <div>
                  <h4 className="font-display text-base text-foreground">Alte Sennküche</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Oberstdorf · Traditionell bayerisch</p>
                </div>
                <p className="text-sm mt-2">Gemütliche Stuben, deftige Schmankerl und gut gezapftes Bier – bodenständig und authentisch Oberstdorf.</p>
              </a>

              {/* Zum wilde Männle */}
              <a href="https://wilde-maennle.de/" target="_blank" rel="noopener noreferrer" className="block bg-muted rounded-lg p-4 hover:bg-accent transition-colors">
                <div>
                  <h4 className="font-display text-base text-foreground">Zum wilde Männle</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Oberstdorf · Traditionsgaststätte</p>
                </div>
                <p className="text-sm mt-2">Institution in der Fußgängerzone seit 1937. Hier trifft sich Jung und Alt – urgemütlich mit Brauereiausschank.</p>
              </a>

              {/* Bei Alberto */}
              <a href="https://pizzeria-beialberto.de/" target="_blank" rel="noopener noreferrer" className="block bg-muted rounded-lg p-4 hover:bg-accent transition-colors">
                <div>
                  <h4 className="font-display text-base text-foreground">Bei Alberto</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Oberstdorf · Italienisch</p>
                </div>
                <p className="text-sm mt-2">Familienbetrieb in zweiter Generation – Pizza, Pasta und italienisches Lebensgefühl mit großer Sonnenterrasse.</p>
              </a>
            </div>

            <p className="text-xs text-muted-foreground italic pt-1 flex items-center gap-1.5">
              <MapPin size={12} /> Alle Restaurants sind in 5–15 Minuten mit dem Auto erreichbar.
            </p>
          </AccordionContent>
        </AccordionItem>

        {/* Ausflüge & Veranstaltungen */}
        <AccordionItem value="ausfluege" id="ausfluege" className="border border-border rounded-lg px-6 overflow-hidden">
          <AccordionTrigger className="text-lg md:text-xl font-display hover:no-underline">
            <span className="flex items-center gap-3">
              <Mountain size={20} className="text-alpine-wood" />
              Ausflüge & Veranstaltungen
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed space-y-5">
            <p className="text-sm">Rund um ACHZEIT gibt es viel zu entdecken – hier unsere Favoriten.</p>

            <div className="space-y-4">
              {/* Veranstaltungskalender – immer als erster Eintrag */}
              <GuestGuideEvents />

              {/* Stinesser Lift – nur während der Saison anzeigen */}
              {new Date() <= new Date('2026-03-08T23:59:59') && (
                <a href="https://www.stinesser-lifte.de/" target="_blank" rel="noopener noreferrer" className="block bg-muted rounded-lg p-4 hover:bg-accent transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-display text-base text-foreground">Stinesser Lifte</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Fischen im Allgäu · Familienskigebiet</p>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-alpine-wood whitespace-nowrap">
                      <Star size={12} className="fill-alpine-wood" /> Direkt im Ort
                    </span>
                  </div>
                  <p className="text-sm mt-2">Kleines Skigebiet am Ortsrand – ideal für Anfänger und Familien. Mit Abendrodelbahn und gemütlichem Liftstadl. Zu Fuß oder in 2 Min. mit dem Auto erreichbar.</p>
                </a>
              )}

              <a href="https://www.breitachklamm.com/" target="_blank" rel="noopener noreferrer" className="block bg-muted rounded-lg p-4 hover:bg-accent transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-display text-base text-foreground">Breitachklamm</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Tiefenbach · Naturwunder</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-alpine-wood whitespace-nowrap">
                    <Star size={12} className="fill-alpine-wood" /> Top-Ausflug
                  </span>
                </div>
                <p className="text-sm mt-2">Die tiefste und eine der beeindruckendsten Felsschluchten Mitteleuropas. Im Sommer tosende Wasserfälle, im Winter magische Eisformationen. Ca. 10 Min. mit dem Auto.</p>
              </a>

              <a href="https://www.ok-bergbahnen.com/nebelhorn" target="_blank" rel="noopener noreferrer" className="block bg-muted rounded-lg p-4 hover:bg-accent transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-display text-base text-foreground">Nebelhorn (2.224 m)</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Oberstdorf · Bergbahn & Panorama</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-alpine-wood whitespace-nowrap">
                    <Star size={12} className="fill-alpine-wood" /> 400er Gipfelblick
                  </span>
                </div>
                <p className="text-sm mt-2">Mit der Gondel auf 2.224 m – 400 Gipfel im Blick. Nordwandsteig und Panorama-Rundweg. Im Winter herrliches Skigebiet. Ca. 15 Min. zur Talstation.</p>
              </a>

              <a href="https://www.ok-bergbahnen.com/fellhorn-kanzelwand" target="_blank" rel="noopener noreferrer" className="block bg-muted rounded-lg p-4 hover:bg-accent transition-colors">
                <div>
                  <h4 className="font-display text-base text-foreground">Fellhorn / Kanzelwand</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Oberstdorf · Wandern & Skifahren</p>
                </div>
                <p className="text-sm mt-2">Blumenreiche Bergwiesen im Sommer, erstklassiges Skigebiet im Winter. Die Zwei-Länder-Wanderung (DE/AT) ist ein Highlight. Ca. 20 Min. Fahrzeit.</p>
              </a>

              <a href="https://www.sturmannshoehle.de/" target="_blank" rel="noopener noreferrer" className="block bg-muted rounded-lg p-4 hover:bg-accent transition-colors">
                <div>
                  <h4 className="font-display text-base text-foreground">Sturmannshöhle</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Obermaiselstein · Tropfsteinhöhle</p>
                </div>
                <p className="text-sm mt-2">Die einzige begehbare Höhle im Allgäu – beeindruckende Tropfsteinformationen tief im Berg. Tolles Erlebnis auch für Kinder. Ca. 5 Min. Fahrzeit.</p>
              </a>

              <a href="https://www.ok-bergbahnen.com/soellereck" target="_blank" rel="noopener noreferrer" className="block bg-muted rounded-lg p-4 hover:bg-accent transition-colors">
                <div>
                  <h4 className="font-display text-base text-foreground">Söllereck</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Oberstdorf · Familienberg</p>
                </div>
                <p className="text-sm mt-2">Der Familienberg: Sommerrodelbahn, kurze Wanderwege und ein tolles Panorama. Ideal mit Kindern. Ca. 15 Min. Fahrzeit.</p>
              </a>

              <a href="https://maps.google.com/?q=Christlessee+Trettachtal" target="_blank" rel="noopener noreferrer" className="block bg-muted rounded-lg p-4 hover:bg-accent transition-colors">
                <div>
                  <h4 className="font-display text-base text-foreground">Christlessee</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Trettachtal · Bergsee</p>
                </div>
                <p className="text-sm mt-2">Kristallklarer Bergsee mit türkisem Wasser – ein Geheimtipp zum Staunen. Leichte Wanderung ab Parkplatz Trettachtal. Ca. 20 Min. Fahrzeit.</p>
              </a>
            </div>

            <p className="text-xs text-muted-foreground italic pt-1 flex items-center gap-1.5">
              <MapPin size={12} /> Alle Ausflugsziele sind in 5–20 Minuten mit dem Auto erreichbar.
            </p>
          </AccordionContent>
        </AccordionItem>

        {/* E-Auto Ladestationen */}
        <AccordionItem value="e-auto" id="e-auto" className="border border-border rounded-lg px-6 overflow-hidden">
          <AccordionTrigger className="text-lg md:text-xl font-display hover:no-underline">
            <span className="flex items-center gap-3">
              <Zap size={20} className="text-alpine-wood" />
              E-Auto Ladestationen
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed space-y-5">
            <p className="text-sm">Öffentliche Ladestationen in der Nähe – am Haus selbst ist keine Ladestation vorhanden.</p>

            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-display text-base text-foreground mb-2">Fischen</h4>
                <ul className="space-y-1.5 text-sm">
                  <li>• Kurhaus Fiskina, Bahnhofstr. 3 – 22 kW (New Motion)</li>
                  <li>• Parkplatz Fischen-Au, Illerstr. 11 – 11–22 kW (New Motion)</li>
                  <li>• NaturGut Allgäu, Maderhalm 2 – 22 kW (Heel-Energie)</li>
                </ul>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-display text-base text-foreground mb-2">Fischen-Langenwang</h4>
                <ul className="space-y-1.5 text-sm">
                  <li>• Trigema, Dorfstr. 25 – <strong className="text-foreground">150 kW Schnelllader</strong> (EnBW)</li>
                  <li>• McDonald's, An der Breitach 1 – 50 kW (AllgäuStrom)</li>
                  <li>• Haus des Gastes, Dorfstr. 19 – 11–22 kW (New Motion)</li>
                </ul>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-display text-base text-foreground mb-2">Oberstdorf</h4>
                <ul className="space-y-1.5 text-sm">
                  <li>• Parkplatz P2, Sonthofener Str. 20 – 22 kW (AllgäuStrom)</li>
                  <li>• Nebelhornbahn, Nebelhornstr. 67 – 22 kW (AllgäuStrom)</li>
                </ul>
              </div>
            </div>

            <p className="text-xs text-muted-foreground italic pt-1 flex items-center gap-1.5">
              <MapPin size={12} /> Alle Stationen 5–15 Min. Fahrzeit · Quelle: Hörnerdörfer Tourismus
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="checkout" id="checkout" className="border border-border rounded-lg px-6 overflow-hidden">
          <AccordionTrigger className="text-lg md:text-xl font-display hover:no-underline">
            <span className="flex items-center gap-3">
              <Trash2 size={20} className="text-alpine-wood" />
              Abreise
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed space-y-4">
            <p>Check-out bis <strong className="text-foreground">11:00 Uhr</strong>.</p>
            <ul className="space-y-2 text-sm">
              <li>• Müll nach draußen bringen</li>
              <li>• Geschirrspüler starten</li>
              <li>• Gästekarten auf dem Tisch liegen lassen</li>
              <li>• Schlüssel zurück in die Schlüsselbox hängen</li>
            </ul>
            <p className="text-sm italic text-muted-foreground pt-2">
              Vielen Dank für euren Aufenthalt im ACHZEIT.
            </p>
          </AccordionContent>
        </AccordionItem>

        {/* Notfall */}
        <AccordionItem value="notfall" id="notfall" className="border border-border rounded-lg px-6 overflow-hidden">
          <AccordionTrigger className="text-lg md:text-xl font-display hover:no-underline">
            <span className="flex items-center gap-3">
              <AlertTriangle size={20} className="text-alpine-wood" />
              Notfall & Hilfe
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="tel:112"
                className="flex items-center gap-3 bg-destructive/10 rounded-lg p-4 hover:bg-destructive/15 transition-colors"
              >
                <Phone size={18} className="text-destructive" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Notruf</p>
                  <p className="text-lg font-bold text-foreground">112</p>
                </div>
              </a>
              <a
                href="tel:116117"
                className="flex items-center gap-3 bg-muted rounded-lg p-4 hover:bg-accent transition-colors"
              >
                <Phone size={18} className="text-alpine-wood" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Ärztl. Bereitschaftsdienst</p>
                  <p className="text-lg font-bold text-foreground">116 117</p>
                </div>
              </a>
            </div>
            <ul className="space-y-1 text-sm">
              <li>• Erste-Hilfe-Set im Badezimmerschrank.</li>
              <li>• Feuerlöscher im Hauswirtschaftsraum.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

    </main>
  );
};

export default GuestGuideContent;
