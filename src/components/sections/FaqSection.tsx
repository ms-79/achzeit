import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ScrollReveal from '@/components/ScrollReveal';

type Faq = { q: string; a: string };

const FAQS: Record<'de' | 'en', Faq[]> = {
  de: [
    {
      q: 'Wie funktioniert die Buchung?',
      a: 'Die Buchung erfolgt sicher und direkt hier auf unserer Website über eine verschlüsselte Verbindung – ohne Plattform-Gebühren und ohne Umweg über Airbnb. Du wählst deine Wunschtermine im Verfügbarkeitskalender oben aus oder stellst uns vorab per Kontaktformular eine Frage – wir antworten meist innerhalb einer Stunde.',
    },
    {
      q: 'Welche Stornierungsbedingungen gelten?',
      a: 'Es gelten unsere hauseigenen Stornobedingungen. Die genauen Konditionen werden dir vor Abschluss der Buchung transparent angezeigt.',
    },
    {
      q: 'Sind Haustiere erlaubt?',
      a: 'Nein. ACHZEIT ist ein strikt haustierfreies Haus – auch aus Rücksicht auf Allergiker:innen unter unseren Gästen.',
    },
    {
      q: 'Wann sind Check-in und Check-out?',
      a: 'Check-in ist ab 16:00 Uhr möglich, Check-out bis 11:00 Uhr. Du erhältst rechtzeitig vor Anreise alle Infos zum Self-Check-in inkl. PIN-Code und digitalem Gästeleitfaden.',
    },
    {
      q: 'Ist die Kurtaxe / der Gästebeitrag bereits enthalten?',
      a: 'Nein, der Kur- bzw. Gästebeitrag der Gemeinde Fischen wird separat fällig und kann bequem online beglichen werden. Mit der Allgäu-Walser-Card erhältst du dafür freien ÖPNV und viele Ermäßigungen.',
    },
    {
      q: 'Wie viele Personen passen ins Haus?',
      a: 'ACHZEIT bietet Platz für bis zu 7 Gäste und ist komfortabel für bis zu 6 Erwachsene. Ideal für Familien sowie für befreundete Paare und kleine Gruppen.',
    },
    {
      q: 'Wie sind die Schlafzimmer aufgeteilt?',
      a: 'Es gibt 3 Schlafzimmer: Schlafzimmer 1 mit Doppelbett (200 × 200 cm), Schlafzimmer 2 mit Doppelbett (200 × 200 cm) und Schlafzimmer 3 mit Etagenbett (200 × 90 cm) sowie einem kleinen zusätzlichen Einzelbett (180 × 80 cm). Das dritte Schlafzimmer ist besonders gut für Kinder und Jugendliche geeignet – für Erwachsenengruppen empfehlen wir ACHZEIT komfortabel für bis zu 6 Erwachsene.',
    },
    {
      q: 'Gibt es Parkplätze und WLAN?',
      a: 'Ja – kostenfreie Privatparkplätze direkt am Haus und schnelles WLAN in allen Räumen.',
    },
    {
      q: 'Ist das Haus im Sommer wie im Winter attraktiv?',
      a: 'Absolut – ACHZEIT ist ganzjährig ein Erlebnis. Im Winter sorgen Sauna und Kamin für Gemütlichkeit, die Skigebiete und Loipen rund um Oberstdorf sind schnell erreicht. Im Sommer locken Balkon, Terrasse, Garten mit Grill, Wandern, Baden und die ganze Bergwelt.',
    },
  ],
  en: [
    {
      q: 'How does the booking work?',
      a: 'Booking is handled securely and directly here on our website via an encrypted connection – no platform fees and no detour through Airbnb. Pick your dates in the availability calendar above or contact us first – we usually reply within an hour.',
    },
    {
      q: 'What is the cancellation policy?',
      a: 'Our own house cancellation terms apply. Exact conditions are shown transparently before you confirm your booking.',
    },
    {
      q: 'Are pets allowed?',
      a: 'No. ACHZEIT is strictly pet-free, also out of consideration for guests with allergies.',
    },
    {
      q: 'What are the check-in and check-out times?',
      a: 'Check-in from 4:00 PM, check-out by 11:00 AM. Ahead of arrival you receive all self-check-in details including PIN code and a digital guest guide.',
    },
    {
      q: 'Is the local tourist tax already included?',
      a: 'No, the tourist contribution of the municipality of Fischen is paid separately and can be settled conveniently online. In return you receive the Allgäu-Walser-Card with free public transport and many discounts.',
    },
    {
      q: 'How many people fit in the house?',
      a: 'ACHZEIT sleeps up to 7 guests and is comfortable for up to 6 adults. Ideal for families as well as friends, couples and small groups.',
    },
    {
      q: 'How are the bedrooms arranged?',
      a: 'There are 3 bedrooms: bedroom 1 with a double bed (200 × 200 cm), bedroom 2 with a double bed (200 × 200 cm), and bedroom 3 with a bunk bed (200 × 90 cm) plus a small additional single bed (180 × 80 cm). The third bedroom is especially well suited to children and teenagers – for groups of adults we recommend ACHZEIT comfortably for up to 6 adults.',
    },
    {
      q: 'Is there parking and Wi-Fi?',
      a: 'Yes – free private parking right at the house and fast Wi-Fi throughout.',
    },
    {
      q: 'Is the house attractive in both summer and winter?',
      a: 'Absolutely – ACHZEIT is a year-round experience. In winter, sauna and fireplace make it cozy, and the ski areas and cross-country trails around Oberstdorf are quickly reached. In summer, the balcony, terrace, garden with grill, hiking, swimming and the whole mountain world await.',
    },
  ],
};

const FaqSection = () => {
  const { language } = useLanguage();
  const [open, setOpen] = useState<number | null>(0);
  const items = FAQS[language] || FAQS.de;
  const title = language === 'de' ? 'Häufige Fragen' : 'Frequently Asked Questions';
  const subtitle =
    language === 'de'
      ? 'Die wichtigsten Antworten vor deiner Buchung'
      : 'The most important answers before you book';

  return (
    <section id="faq" className="section-padding bg-background">
      <div className="container mx-auto px-6">
        <ScrollReveal className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground tracking-wide">{subtitle}</p>
          <div className="alpine-divider mt-6" />
        </ScrollReveal>

        <ScrollReveal>
          <div className="max-w-3xl mx-auto divide-y divide-border/60 border-y border-border/60">
            {items.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={i}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 py-5 text-left group"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-lg md:text-xl text-foreground group-hover:text-primary transition-colors">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100 pb-5' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-foreground/80 leading-relaxed font-light pr-8">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <p className="text-sm text-muted-foreground">
              {language === 'de' ? 'Noch eine andere Frage?' : 'Another question?'}{' '}
              <a
                href="#contact"
                className="text-primary underline underline-offset-4 hover:opacity-80"
              >
                {language === 'de' ? 'Schreib uns direkt' : 'Contact us directly'}
              </a>
              .
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FaqSection;