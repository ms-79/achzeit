import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import logoAchzeit from '@/assets/logo-achzeit-transparent.webp';

interface GuideData {
  guest_name: string;
  checkin: string;
  checkout: string;
  box_code: string;
}

const GuestGuide = () => {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<GuideData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = searchParams.get('t');
    if (!token) {
      setError(true);
      setLoading(false);
      return;
    }

    const fetchGuide = async () => {
      try {
        const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
        const res = await fetch(
          `https://${projectId}.supabase.co/functions/v1/guide?t=${encodeURIComponent(token)}`,
          {
            headers: {
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
          }
        );

        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }

        const json = await res.json();
        setData(json);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchGuide();
  }, [searchParams]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('de-DE', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <img src={logoAchzeit} alt="ACHZEIT" className="w-32 mx-auto mb-6 opacity-40" />
          <div className="w-8 h-8 border-2 border-alpine-stone border-t-alpine-charcoal rounded-full animate-spin mx-auto" />
        </motion.div>
      </div>
    );
  }

  // Error
  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <img src={logoAchzeit} alt="ACHZEIT" className="w-32 mx-auto mb-8 opacity-40" />
          <h1 className="font-display text-2xl text-foreground mb-3">
            Dieser Link ist ungültig oder abgelaufen.
          </h1>
          <p className="text-muted-foreground mb-8">
            Bitte kontaktiere deinen Gastgeber für einen neuen Zugangslink.
          </p>
          <Button
            variant="alpine"
            size="lg"
            onClick={() => window.location.href = '/#contact'}
          >
            Gastgeber kontaktieren
          </Button>
        </motion.div>
      </div>
    );
  }

  const quickActions = [
    { icon: Key, label: 'Zugang', target: 'zugang' },
    { icon: Wifi, label: 'WLAN', target: 'wlan' },
    { icon: Baby, label: 'Familie', target: 'familie' },
    { icon: Flame, label: 'Sauna & Kamin', target: 'sauna' },
    { icon: Trash2, label: 'Check-out', target: 'checkout' },
    { icon: AlertTriangle, label: 'Notfall', target: 'notfall' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-alpine-charcoal text-alpine-snow py-16 md:py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.img
            src={logoAchzeit}
            alt="ACHZEIT"
            className="w-28 md:w-36 mx-auto mb-8 brightness-0 invert opacity-80"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ duration: 0.6 }}
          />

          <motion.h1
            className="font-display text-4xl md:text-5xl lg:text-6xl mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Willkommen {data.guest_name}
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-alpine-snow/70 mb-6 tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Deine ACHZEIT im Allgäu beginnt jetzt.
          </motion.p>

          <motion.div
            className="inline-block bg-alpine-snow/10 backdrop-blur-sm rounded-lg px-6 py-3 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-sm text-alpine-snow/60 uppercase tracking-widest mb-1">Aufenthalt</p>
            <p className="text-alpine-snow/90 font-medium">
              {formatDate(data.checkin)} – {formatDate(data.checkout)}
            </p>
          </motion.div>

          <motion.p
            className="text-alpine-snow/60 max-w-xl mx-auto text-sm md:text-base leading-relaxed mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Schön, dass ihr da seid. Hier findet ihr alle wichtigen Informationen für einen
            entspannten Aufenthalt im ACHZEIT.
          </motion.p>

          {/* Quick Actions */}
          <motion.div
            className="flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {quickActions.map((action) => (
              <button
                key={action.target}
                onClick={() => scrollToSection(action.target)}
                className="flex items-center gap-2 bg-alpine-snow/10 hover:bg-alpine-snow/20 text-alpine-snow/80 hover:text-alpine-snow px-4 py-2.5 rounded-lg text-sm transition-all duration-200"
              >
                <action.icon size={16} />
                <span>{action.label}</span>
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Content */}
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
                <p className="text-2xl font-mono font-bold text-foreground tracking-[0.3em]">{data.box_code}</p>
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

              <p className="text-sm">
                Das Passwort findet ihr auf dem Aufsteller im Wohnbereich.
              </p>

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
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Ärztlicher Bereitschaftsdienst</p>
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

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-border">
          <img src={logoAchzeit} alt="ACHZEIT" className="w-20 mx-auto mb-3 opacity-30" />
          <p className="text-xs text-muted-foreground">Eure Gästemappe · ACHZEIT im Allgäu</p>
        </div>
      </main>
    </div>
  );
};

export default GuestGuide;
