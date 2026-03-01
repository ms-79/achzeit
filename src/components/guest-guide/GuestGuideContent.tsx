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
  ShoppingCart,
  HelpCircle,
} from 'lucide-react';
import type { GuestData } from '@/pages/GuestGuide';
import GuestGuideEvents from './GuestGuideEvents';

const WalkingIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7" />
  </svg>
);

const CarIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
  </svg>
);

interface Props {
  guestData: GuestData;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const GuestGuideContent = ({ guestData, activeSection, onSectionChange }: Props) => {
  const { boxCode, wifiPassword } = guestData;

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 md:py-16">
      <Accordion type="single" collapsible value={activeSection} onValueChange={(val) => onSectionChange(val || '')} className="space-y-4">
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
                <li>• Der Router befindet sich im Keller unter der Treppe.</li>
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
              <li>• Babybett und Hochstuhl stehen im Keller unter der Treppe</li>
              <li>• Wickelunterlage im Schrank im Kinderzimmer – bitte Handtuch unterlegen</li>
              <li>• Rausfallschutz im Kinderzimmer in der Schublade unter dem Etagenbett</li>
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
                <li>• Starterset mit Anzünder, Anfeuerholz und Holz als Erstausstattung vorhanden.</li>
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
                <div className="flex justify-end mt-2 gap-3"><span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold"><WalkingIcon size={14} /> 10 Min.</span><span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold"><CarIcon size={14} /> 3 Min.</span></div>
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
                <div className="flex justify-end mt-2"><span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold"><CarIcon size={14} /> 12 Min.</span></div>
              </a>

              {/* Alte Sennküche */}
              <a href="https://altesennkueche.de/" target="_blank" rel="noopener noreferrer" className="block bg-muted rounded-lg p-4 hover:bg-accent transition-colors">
                <div>
                  <h4 className="font-display text-base text-foreground">Alte Sennküche</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Oberstdorf · Traditionell bayerisch</p>
                </div>
                <p className="text-sm mt-2">Gemütliche Stuben, deftige Schmankerl und gut gezapftes Bier – bodenständig und authentisch Oberstdorf.</p>
                <div className="flex justify-end mt-2"><span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold"><CarIcon size={14} /> 13 Min.</span></div>
              </a>

              {/* Zum wilde Männle */}
              <a href="https://wilde-maennle.de/" target="_blank" rel="noopener noreferrer" className="block bg-muted rounded-lg p-4 hover:bg-accent transition-colors">
                <div>
                  <h4 className="font-display text-base text-foreground">Zum wilde Männle</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Oberstdorf · Traditionsgaststätte</p>
                </div>
                <p className="text-sm mt-2">Institution in der Fußgängerzone seit 1937. Hier trifft sich Jung und Alt – urgemütlich mit Brauereiausschank.</p>
                <div className="flex justify-end mt-2"><span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold"><CarIcon size={14} /> 13 Min.</span></div>
              </a>

              {/* Bei Alberto */}
              <a href="https://pizzeria-beialberto.de/" target="_blank" rel="noopener noreferrer" className="block bg-muted rounded-lg p-4 hover:bg-accent transition-colors">
                <div>
                  <h4 className="font-display text-base text-foreground">Bei Alberto</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Oberstdorf · Italienisch</p>
                </div>
                <p className="text-sm mt-2">Familienbetrieb in zweiter Generation – Pizza, Pasta und italienisches Lebensgefühl mit großer Sonnenterrasse.</p>
                <div className="flex justify-end mt-2"><span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold"><CarIcon size={14} /> 13 Min.</span></div>
              </a>
            </div>

            <p className="text-xs text-muted-foreground italic pt-1 flex items-center gap-1.5">
              <MapPin size={12} /> Alle Restaurants sind in 3–13 Minuten mit dem Auto erreichbar.
            </p>
          </AccordionContent>
        </AccordionItem>

        {/* Einkaufen & Versorgung */}
        <AccordionItem value="einkaufen" id="einkaufen" className="border border-border rounded-lg px-6 overflow-hidden">
          <AccordionTrigger className="text-lg md:text-xl font-display hover:no-underline">
            <span className="flex items-center gap-3">
              <ShoppingCart size={20} className="text-alpine-wood" />
              Einkaufen & Versorgung
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed space-y-5">
            <p className="text-sm">Alles Wichtige für den täglichen Bedarf – direkt in Fischen oder wenige Minuten entfernt.</p>

            <div className="space-y-4">
              <a href="https://maps.google.com/?q=EDEKA+Fischen+im+Allgäu" target="_blank" rel="noopener noreferrer" className="block bg-muted rounded-lg p-4 hover:bg-accent transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-display text-base text-foreground">EDEKA</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Fischen · Supermarkt</p>
                  </div>
                  <ExternalLink size={14} className="text-alpine-wood shrink-0 mt-1" />
                </div>
                <p className="text-sm mt-2">Vollsortiment direkt im Ort. Gut sortiert mit regionalen Produkten.</p>
                <div className="flex justify-end mt-2 gap-3"><span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold"><WalkingIcon size={14} /> 11 Min.</span><span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold"><CarIcon size={14} /> 2 Min.</span></div>
              </a>

              <a href="https://maps.google.com/?q=Bäckerei+Härle+Fischen+im+Allgäu" target="_blank" rel="noopener noreferrer" className="block bg-muted rounded-lg p-4 hover:bg-accent transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-display text-base text-foreground">Bäckerei Härle <span className="text-xs font-medium text-alpine-wood">★ Unser Tipp</span></h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Fischen · Traditionelle Handwerksbäckerei</p>
                  </div>
                  <ExternalLink size={14} className="text-alpine-wood shrink-0 mt-1" />
                </div>
                <p className="text-sm mt-2">Hier wird noch alles von Hand gemacht – frische Semmeln, Brot und Gebäck. Auch sonntags geöffnet.</p>
                <div className="flex justify-end mt-2 gap-3"><span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold"><WalkingIcon size={14} /> 11 Min.</span><span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold"><CarIcon size={14} /> 3 Min.</span></div>
              </a>

              <a href="https://maps.google.com/?q=Metzgerei+Hubert+Schmid+Fischen+im+Allgäu" target="_blank" rel="noopener noreferrer" className="block bg-muted rounded-lg p-4 hover:bg-accent transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-display text-base text-foreground">Metzgerei Hubert Schmid</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Fischen · Fleisch & Wurst</p>
                  </div>
                  <ExternalLink size={14} className="text-alpine-wood shrink-0 mt-1" />
                </div>
                <p className="text-sm mt-2">Regionale Fleisch- und Wurstwaren vom Allgäuer Metzger.</p>
                <div className="flex justify-end mt-2 gap-3"><span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold"><WalkingIcon size={14} /> 12 Min.</span><span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold"><CarIcon size={14} /> 2 Min.</span></div>
              </a>

              <a href="https://maps.google.com/?q=Feneberg+Oberstdorf" target="_blank" rel="noopener noreferrer" className="block bg-muted rounded-lg p-4 hover:bg-accent transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-display text-base text-foreground">Feneberg</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Oberstdorf · Supermarkt</p>
                  </div>
                  <ExternalLink size={14} className="text-alpine-wood shrink-0 mt-1" />
                </div>
                <p className="text-sm mt-2">Großer Allgäuer Supermarkt mit breiter Auswahl.</p>
                <div className="flex justify-end mt-2"><span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold"><CarIcon size={14} /> 9 Min.</span></div>
              </a>

              <a href="https://maps.google.com/?q=V-Markt+Fischen+Oberstdorf" target="_blank" rel="noopener noreferrer" className="block bg-muted rounded-lg p-4 hover:bg-accent transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-display text-base text-foreground">V-Markt</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Zwischen Fischen & Oberstdorf · Verbrauchermarkt</p>
                  </div>
                  <ExternalLink size={14} className="text-alpine-wood shrink-0 mt-1" />
                </div>
                <p className="text-sm mt-2">Großer Verbrauchermarkt mit riesiger Auswahl – von Lebensmitteln bis Haushalt.</p>
                <div className="flex justify-end mt-2"><span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold"><CarIcon size={14} /> 5 Min.</span></div>
              </a>

              <a href="https://maps.google.com/?q=Kur-Apotheke+Färberhaus+Fischen+im+Allgäu" target="_blank" rel="noopener noreferrer" className="block bg-muted rounded-lg p-4 hover:bg-accent transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-display text-base text-foreground">Kur-Apotheke Färberhaus</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Fischen · Apotheke</p>
                  </div>
                  <ExternalLink size={14} className="text-alpine-wood shrink-0 mt-1" />
                </div>
                <p className="text-sm mt-2">Apotheke im Ortszentrum von Fischen.</p>
                <div className="flex justify-end mt-2 gap-3"><span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold"><WalkingIcon size={14} /> 11 Min.</span><span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold"><CarIcon size={14} /> 3 Min.</span></div>
              </a>
            </div>

            <p className="text-xs text-muted-foreground italic pt-1 flex items-center gap-1.5">
              <MapPin size={12} /> Alle Geschäfte sind fußläufig oder in wenigen Minuten mit dem Auto erreichbar.
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
                  <p className="text-sm mt-2">Kleines Skigebiet am Ortsrand – ideal für Anfänger und Familien. Mit Abendrodelbahn und gemütlichem Liftstadl.</p>
                  <div className="flex justify-end mt-2 gap-3"><span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold"><WalkingIcon size={14} /> 9 Min.</span><span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold"><CarIcon size={14} /> 2 Min.</span></div>
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
                <p className="text-sm mt-2">Die tiefste und eine der beeindruckendsten Felsschluchten Mitteleuropas. Im Sommer tosende Wasserfälle, im Winter magische Eisformationen.</p>
                <div className="flex justify-end mt-2"><span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold"><CarIcon size={14} /> 12 Min.</span></div>
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
                <p className="text-sm mt-2">Mit der Gondel auf 2.224 m – 400 Gipfel im Blick. Nordwandsteig und Panorama-Rundweg. Im Winter herrliches Skigebiet.</p>
                <div className="flex justify-end mt-2"><span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold"><CarIcon size={14} /> 13 Min.</span></div>
              </a>

              <a href="https://www.ok-bergbahnen.com/fellhorn-kanzelwand" target="_blank" rel="noopener noreferrer" className="block bg-muted rounded-lg p-4 hover:bg-accent transition-colors">
                <div>
                  <h4 className="font-display text-base text-foreground">Fellhorn / Kanzelwand</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Oberstdorf · Wandern & Skifahren</p>
                </div>
                <p className="text-sm mt-2">Blumenreiche Bergwiesen im Sommer, erstklassiges Skigebiet im Winter. Die Zwei-Länder-Wanderung (DE/AT) ist ein Highlight.</p>
                <div className="flex justify-end mt-2"><span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold"><CarIcon size={14} /> 18 Min.</span></div>
              </a>

              <a href="https://www.sturmannshoehle.de/" target="_blank" rel="noopener noreferrer" className="block bg-muted rounded-lg p-4 hover:bg-accent transition-colors">
                <div>
                  <h4 className="font-display text-base text-foreground">Sturmannshöhle</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Obermaiselstein · Tropfsteinhöhle</p>
                </div>
                <p className="text-sm mt-2">Die einzige begehbare Höhle im Allgäu – beeindruckende Tropfsteinformationen tief im Berg. Tolles Erlebnis auch für Kinder.</p>
                <div className="flex justify-end mt-2"><span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold"><CarIcon size={14} /> 7 Min.</span></div>
              </a>

              <a href="https://www.ok-bergbahnen.com/soellereck" target="_blank" rel="noopener noreferrer" className="block bg-muted rounded-lg p-4 hover:bg-accent transition-colors">
                <div>
                  <h4 className="font-display text-base text-foreground">Söllereck</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Oberstdorf · Familienberg</p>
                </div>
                <p className="text-sm mt-2">Der Familienberg: Sommerrodelbahn, kurze Wanderwege und ein tolles Panorama. Ideal mit Kindern.</p>
                <div className="flex justify-end mt-2"><span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold"><CarIcon size={14} /> 9 Min.</span></div>
              </a>

              <a href="https://maps.google.com/?q=Christlessee+Trettachtal" target="_blank" rel="noopener noreferrer" className="block bg-muted rounded-lg p-4 hover:bg-accent transition-colors">
                <div>
                  <h4 className="font-display text-base text-foreground">Christlessee</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Trettachtal · Bergsee</p>
                </div>
                <p className="text-sm mt-2">Kristallklarer Bergsee mit türkisem Wasser – ein Geheimtipp zum Staunen. Leichte Wanderung ab Parkplatz Trettachtal.</p>
                <div className="flex justify-end mt-2"><span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold"><CarIcon size={14} /> 19 Min.</span></div>
              </a>
            </div>

            <p className="text-xs text-muted-foreground italic pt-1 flex items-center gap-1.5">
              <MapPin size={12} /> Alle Ausflugsziele sind in 2–19 Minuten mit dem Auto erreichbar.
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
              <div className="space-y-3">
                <h4 className="font-display text-base text-foreground">⚡ Schnellste Ladestationen</h4>
                <a href="https://maps.google.com/?q=Trigema+Langenwang+Fischen" target="_blank" rel="noopener noreferrer" className="block bg-muted rounded-lg p-4 hover:bg-accent transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm"><strong className="text-foreground">150 kW Schnelllader</strong> – Trigema, Dorfstr. 25 (EnBW)</p>
                    <ExternalLink size={14} className="text-alpine-wood shrink-0 mt-0.5" />
                  </div>
                  <div className="flex justify-end mt-2"><span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold"><CarIcon size={14} /> 4 Min.</span></div>
                </a>
                <a href="https://maps.google.com/?q=McDonald's+Langenwang+Fischen" target="_blank" rel="noopener noreferrer" className="block bg-muted rounded-lg p-4 hover:bg-accent transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm"><strong className="text-foreground">50 kW</strong> – McDonald's, An der Breitach 1 (AllgäuStrom)</p>
                    <ExternalLink size={14} className="text-alpine-wood shrink-0 mt-0.5" />
                  </div>
                  <div className="flex justify-end mt-2"><span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold"><CarIcon size={14} /> 6 Min.</span></div>
                </a>
                <a href="https://maps.google.com/?q=Parkplatz+P2+Sonthofener+Str+Oberstdorf" target="_blank" rel="noopener noreferrer" className="block bg-muted rounded-lg p-4 hover:bg-accent transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm"><strong className="text-foreground">22 kW</strong> – Parkplatz P2 Oberstdorf, Sonthofener Str. 20 (AllgäuStrom)</p>
                    <ExternalLink size={14} className="text-alpine-wood shrink-0 mt-0.5" />
                  </div>
                  <div className="flex justify-end mt-2"><span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold"><CarIcon size={14} /> 8 Min.</span></div>
                </a>
              </div>

              <div className="space-y-3">
                <h4 className="font-display text-base text-foreground">📍 Nächste Ladestationen</h4>
                <a href="https://maps.google.com/?q=Kurhaus+Fiskina+Fischen" target="_blank" rel="noopener noreferrer" className="block bg-muted rounded-lg p-4 hover:bg-accent transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm">Kurhaus Fiskina, Bahnhofstr. 3 – 22 kW (New Motion)</p>
                    <ExternalLink size={14} className="text-alpine-wood shrink-0 mt-0.5" />
                  </div>
                  <div className="flex justify-end mt-2 gap-3"><span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold"><WalkingIcon size={14} /> 11 Min.</span><span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold"><CarIcon size={14} /> 3 Min.</span></div>
                </a>
                <a href="https://maps.google.com/?q=Parkplatz+Fischen-Au+Illerstr+Fischen" target="_blank" rel="noopener noreferrer" className="block bg-muted rounded-lg p-4 hover:bg-accent transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm">Parkplatz Fischen-Au, Illerstr. 11 – 11–22 kW (New Motion)</p>
                    <ExternalLink size={14} className="text-alpine-wood shrink-0 mt-0.5" />
                  </div>
                  <div className="flex justify-end mt-2"><span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold"><CarIcon size={14} /> 4 Min.</span></div>
                </a>
                <a href="https://maps.google.com/?q=Haus+des+Gastes+Langenwang+Fischen" target="_blank" rel="noopener noreferrer" className="block bg-muted rounded-lg p-4 hover:bg-accent transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm">Haus des Gastes, Dorfstr. 19 – 11–22 kW (New Motion)</p>
                    <ExternalLink size={14} className="text-alpine-wood shrink-0 mt-0.5" />
                  </div>
                  <div className="flex justify-end mt-2"><span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold"><CarIcon size={14} /> 4 Min.</span></div>
                </a>
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

        {/* Troubleshooting / Anleitungen */}
        <AccordionItem value="anleitungen" id="anleitungen" className="border border-border rounded-lg px-6 overflow-hidden">
          <AccordionTrigger className="text-lg md:text-xl font-display hover:no-underline">
            <span className="flex items-center gap-3">
              <HelpCircle size={20} className="text-alpine-wood" />
              Hilfe & Anleitungen
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed space-y-6">
            <p className="text-sm">Schritt-für-Schritt-Anleitungen für die wichtigsten Geräte und Funktionen im Haus.</p>

            {/* BORA Kochfeld */}
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <h4 className="font-display text-base text-foreground">🍳 BORA-Kochfeld bedienen</h4>
              <ol className="list-decimal list-inside text-sm space-y-1">
                <li>Kochfeld am Hauptschalter (rechte Seite) einschalten.</li>
                <li>Kochzone durch Berühren des +-Symbols aktivieren.</li>
                <li>Temperatur mit Schieberegler oder +/- einstellen.</li>
                <li>Absaugung startet automatisch – Stufe kann manuell angepasst werden.</li>
                <li>Nach dem Kochen: Kochzone auf 0 stellen, Absaugung läuft automatisch nach.</li>
              </ol>
              <p className="text-xs text-muted-foreground italic">📌 Bitte keine Alufolie oder Töpfe direkt auf die Absaugöffnung stellen.</p>
            </div>

            {/* Sauna */}
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <h4 className="font-display text-base text-foreground">🧖 Sauna einschalten</h4>
              <ol className="list-decimal list-inside text-sm space-y-1">
                <li>Saunaofen am Drehregler (außen an der Kabine) einschalten.</li>
                <li>Gewünschte Temperatur einstellen (empfohlen: 70–85 °C).</li>
                <li>Aufheizzeit ca. 30–45 Minuten abwarten.</li>
                <li>Immer auf einem Handtuch sitzen.</li>
                <li>Nach der Nutzung: Regler auf 0 drehen und kurz lüften.</li>
              </ol>
              <p className="text-xs text-muted-foreground italic">📌 Bitte kein Wasser direkt auf die Steuereinheit gießen.</p>
            </div>

            {/* Kamin */}
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <h4 className="font-display text-base text-foreground">🔥 Kamin anzünden</h4>
              <ol className="list-decimal list-inside text-sm space-y-1">
                <li>Kaminzufuhr (Hebel unten) vollständig öffnen.</li>
                <li>Anzünder und kleines Holz als Basis schichten.</li>
                <li>Von oben nach unten anzünden.</li>
                <li>Erst nach ca. 15 Min. größere Scheite nachlegen.</li>
                <li>Zufuhr nach dem Anbrennen halb schließen für gleichmäßige Wärme.</li>
              </ol>
              <p className="text-xs text-muted-foreground italic">📌 Nur trockenes Holz verwenden. Asche erst kalt entsorgen.</p>
            </div>

            {/* Kaffeemaschine */}
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <h4 className="font-display text-base text-foreground">☕ Kaffeemaschine (Nespresso)</h4>
              <ol className="list-decimal list-inside text-sm space-y-1">
                <li>Maschine am Knopf oben einschalten – Aufheizen abwarten.</li>
                <li>Kapsel einlegen und Hebel schließen.</li>
                <li>Tasse unterstellen und gewünschte Größe drücken (klein/groß).</li>
                <li>Nach dem Brühen: Hebel öffnen, Kapsel fällt automatisch in den Behälter.</li>
              </ol>
              <p className="text-xs text-muted-foreground italic">📌 Kapseln findet ihr in der Küchenschublade. Auffangbehälter bitte bei Bedarf leeren.</p>
            </div>

            {/* Geschirrspüler */}
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <h4 className="font-display text-base text-foreground">🍽️ Geschirrspüler starten</h4>
              <ol className="list-decimal list-inside text-sm space-y-1">
                <li>Tab in das Fach in der Innentür einlegen.</li>
                <li>Tür schließen.</li>
                <li>Einschaltknopf drücken und Programm wählen (Eco oder Auto empfohlen).</li>
                <li>Start drücken.</li>
              </ol>
              <p className="text-xs text-muted-foreground italic">📌 Tabs befinden sich unter der Spüle.</p>
            </div>

            {/* Heizung / Thermostat */}
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <h4 className="font-display text-base text-foreground">🌡️ Heizung & Thermostat</h4>
              <ol className="list-decimal list-inside text-sm space-y-1">
                <li>Die Fußbodenheizung wird zentral gesteuert.</li>
                <li>Thermostat im Wohnbereich auf gewünschte Temperatur einstellen.</li>
                <li>Änderungen wirken sich erst nach ca. 1–2 Stunden aus.</li>
              </ol>
              <p className="text-xs text-muted-foreground italic">📌 Bitte nicht über 23 °C einstellen – die Fußbodenheizung reagiert langsam.</p>
            </div>

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
