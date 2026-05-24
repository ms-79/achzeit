import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame, Wifi, Car, Sun, Trees, Tv, WashingMachine, Wind,
  UtensilsCrossed, Coffee, Microwave, Refrigerator, Heart, Baby, Thermometer,
  Droplets, Scissors, Shirt, Bed, Lock, Briefcase, Moon, Archive, KeyRound,
  ChevronDown, ChevronUp, Sparkles, Volume2, Home, DoorOpen,
} from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

type AmenityDef = {
  match: RegExp;
  icon: typeof Flame;
  label: string;       // de
  labelEn: string;     // en
  highlight?: boolean; // wichtig fürs Booking
  priority?: number;   // niedriger = wichtiger
};

// Mapping Hostaway → Icon + DE/EN-Label, sortiert nach Buchungs-Relevanz
const AMENITY_MAP: AmenityDef[] = [
  { match: /private sauna|^sauna$/i, icon: Flame, label: 'Private Sauna', labelEn: 'Private Sauna', highlight: true, priority: 1 },
  { match: /fireplace/i, icon: Flame, label: 'Kamin', labelEn: 'Fireplace', highlight: true, priority: 2 },
  { match: /balcony/i, icon: Sun, label: 'Balkon mit Bergblick', labelEn: 'Balcony with mountain view', highlight: true, priority: 3 },
  { match: /garden|backyard/i, icon: Trees, label: 'Garten & Terrasse', labelEn: 'Garden & terrace', highlight: true, priority: 4 },
  { match: /wifi speed|500\+? mbps/i, icon: Wifi, label: 'Highspeed WLAN (500+ Mbps)', labelEn: 'High-speed Wi-Fi (500+ Mbps)', highlight: true, priority: 5 },
  { match: /free wifi|^wireless$|^internet$/i, icon: Wifi, label: 'Kostenfreies WLAN', labelEn: 'Free Wi-Fi', priority: 6 },
  { match: /free parking|^parking/i, icon: Car, label: 'Kostenfreier Parkplatz', labelEn: 'Free parking', highlight: true, priority: 7 },
  { match: /smart tv/i, icon: Tv, label: 'Smart TV', labelEn: 'Smart TV', highlight: true, priority: 8 },
  { match: /sound system/i, icon: Volume2, label: 'Soundsystem', labelEn: 'Sound system', priority: 9 },
  { match: /family/i, icon: Heart, label: 'Familienfreundlich', labelEn: 'Family friendly', highlight: true, priority: 10 },
  { match: /suitable for children/i, icon: Baby, label: 'Geeignet für Kinder', labelEn: 'Suitable for children', priority: 11 },
  { match: /suitable for infants/i, icon: Baby, label: 'Geeignet für Kleinkinder', labelEn: 'Suitable for infants', priority: 12 },
  { match: /baby crib/i, icon: Baby, label: 'Babybett', labelEn: 'Baby crib', priority: 13 },
  { match: /washing machine/i, icon: WashingMachine, label: 'Waschmaschine', labelEn: 'Washing machine', priority: 14 },
  { match: /^dryer$/i, icon: Wind, label: 'Trockner', labelEn: 'Dryer', priority: 15 },
  { match: /dishwasher/i, icon: UtensilsCrossed, label: 'Geschirrspüler', labelEn: 'Dishwasher', priority: 16 },
  { match: /coffee.*tea/i, icon: Coffee, label: 'Kaffee- & Teemaschine', labelEn: 'Coffee & tea maker', priority: 17 },
  { match: /microwave/i, icon: Microwave, label: 'Mikrowelle', labelEn: 'Microwave', priority: 18 },
  { match: /^oven$/i, icon: Microwave, label: 'Backofen', labelEn: 'Oven', priority: 19 },
  { match: /toaster/i, icon: Microwave, label: 'Toaster', labelEn: 'Toaster', priority: 20 },
  { match: /refrigerator|fridge/i, icon: Refrigerator, label: 'Kühlschrank', labelEn: 'Refrigerator', priority: 21 },
  { match: /cooking basics/i, icon: UtensilsCrossed, label: 'Koch-Grundausstattung', labelEn: 'Cooking basics', priority: 22 },
  { match: /heating/i, icon: Thermometer, label: 'Heizung', labelEn: 'Heating', priority: 23 },
  { match: /hot water/i, icon: Droplets, label: 'Warmwasser', labelEn: 'Hot water', priority: 24 },
  { match: /laptop friendly/i, icon: Briefcase, label: 'Arbeitsplatz', labelEn: 'Workspace', priority: 25 },
  { match: /private entrance/i, icon: DoorOpen, label: 'Privater Eingang', labelEn: 'Private entrance', priority: 26 },
  { match: /24-hour checkin|self check/i, icon: KeyRound, label: '24h Check-in', labelEn: '24h check-in', priority: 27 },
  { match: /^safe$/i, icon: Lock, label: 'Safe', labelEn: 'Safe', priority: 28 },
  { match: /private living room/i, icon: Home, label: 'Privates Wohnzimmer', labelEn: 'Private living room', priority: 29 },
  { match: /hair dryer/i, icon: Scissors, label: 'Föhn', labelEn: 'Hair dryer', priority: 30 },
  { match: /iron/i, icon: Shirt, label: 'Bügeleisen', labelEn: 'Iron', priority: 31 },
  { match: /hangers/i, icon: Shirt, label: 'Kleiderbügel', labelEn: 'Hangers', priority: 32 },
  { match: /linens/i, icon: Bed, label: 'Bettwäsche', labelEn: 'Linens', priority: 33 },
  { match: /extra pillows/i, icon: Bed, label: 'Extra Kissen & Decken', labelEn: 'Extra pillows & blankets', priority: 34 },
  { match: /room darkening|blackout/i, icon: Moon, label: 'Verdunkelung', labelEn: 'Blackout curtains', priority: 35 },
  { match: /clothing storage/i, icon: Archive, label: 'Kleiderschrank', labelEn: 'Clothing storage', priority: 36 },
  { match: /drying rack/i, icon: Wind, label: 'Wäscheständer', labelEn: 'Drying rack', priority: 37 },
  { match: /essentials/i, icon: Sparkles, label: 'Essentials (Handtücher, Seife)', labelEn: 'Essentials (towels, soap)', priority: 38 },
  { match: /cable tv|^tv$/i, icon: Tv, label: 'TV', labelEn: 'TV', priority: 39 },
];

function mapAmenities(raw: string[], lang: 'de' | 'en') {
  const seen = new Set<string>();
  const mapped: { label: string; icon: typeof Flame; highlight: boolean; priority: number }[] = [];
  for (const name of raw) {
    const def = AMENITY_MAP.find((d) => d.match.test(name));
    if (!def) continue;
    const key = def.label;
    if (seen.has(key)) continue;
    seen.add(key);
    mapped.push({
      label: lang === 'en' ? def.labelEn : def.label,
      icon: def.icon,
      highlight: !!def.highlight,
      priority: def.priority ?? 999,
    });
  }
  mapped.sort((a, b) => a.priority - b.priority);
  return mapped;
}

const AmenitiesSection = () => {
  const { t, language } = useLanguage();
  const [items, setItems] = useState<ReturnType<typeof mapAmenities>>([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/amenities?locale=${language}`, { method: 'GET' });
        const data = await res.json();
        const list: string[] = data?.amenities || [];
        setItems(mapAmenities(list, language));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [language]);

  if (loading) {
    return (
      <section id="amenities" className="section-padding bg-background">
        <div className="container mx-auto px-6">
          <div className="h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  const VISIBLE_COUNT = 10;
  const visibleItems = expanded ? items : items.slice(0, VISIBLE_COUNT);
  const hiddenCount = Math.max(0, items.length - VISIBLE_COUNT);

  return (
    <section id="amenities" className="section-padding bg-background">
      <div className="container mx-auto px-6">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            {t('amenities.title')}
          </h2>
          <p className="text-lg text-muted-foreground tracking-wide">
            {t('amenities.subtitle')}
          </p>
          <div className="alpine-divider mt-6" />
        </ScrollReveal>

        <ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <AnimatePresence initial={false}>
              {visibleItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25, delay: i < VISIBLE_COUNT ? i * 0.03 : 0 }}
                    className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                      item.highlight
                        ? 'border-primary/30 bg-card shadow-soft'
                        : 'border-border/60 bg-card/60'
                    }`}
                  >
                    <span
                      className={`shrink-0 w-10 h-10 rounded-md flex items-center justify-center ${
                        item.highlight
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-foreground/70'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="text-sm md:text-[15px] text-foreground leading-snug">
                      {item.label}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {hiddenCount > 0 && (
            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setExpanded((v) => !v)}
                className="gap-2"
              >
                {expanded ? (
                  <>
                    {t('amenities.showLess')}
                    <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    {t('amenities.showAll').replace('{count}', String(items.length))}
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
};

export default AmenitiesSection;
