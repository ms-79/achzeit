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
  UtensilsCrossed,
  Phone,
  MapPin,
  Star,
} from 'lucide-react';
import type { GuestData } from '@/pages/GuestGuide';

interface Props {
  guestData: GuestData;
}

const GuestGuideContent = ({ guestData }: Props) => {
  const { boxCode } = guestData;

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
                <li>• E-Ladestation vorhanden (bitte Kabel nach Nutzung ordentlich verstauen).</li>
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
            <div className="bg-muted rounded-lg p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Netzwerkname</p>
              <p className="text-lg font-mono font-bold text-foreground">ACHZEIT_WLAN</p>
            </div>
            <p className="text-sm">Das Passwort findet ihr auf dem Aufsteller im Wohnbereich.</p>
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

        {/* Check-out */}
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
