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
      a: 'Check-in ist ab 16:00 Uhr möglich, Check-out bis 10:00 Uhr. Du erhältst rechtzeitig vor Anreise alle Infos zum Self-Check-in inkl. PIN-Code und digitalem Gästeleitfaden.',
    },
    {
      q: 'Ist die Kurtaxe / der Gästebeitrag bereits enthalten?',
      a: 'Nein, der Kur- bzw. Gästebeitrag der Gemeinde Fischen wird separat fällig und kann bequem online beglichen werden. Mit der Allgäu-Walser-Card erhältst du dafür freien ÖPNV und viele Ermäßigungen.',
    },
    {
      q: 'Wie viele Personen passen ins Haus?',
      a: 'Bis zu 7 Gäste: 4 Erwachsene + 3 Kinder oder 6 Erwachsene. Es gibt 3 Schlafzimmer (Doppelbett, Doppelbett, Etagenbett + Einzelbett).',
    },
    {
      q: 'Gibt es Parkplätze und WLAN?',
      a: 'Ja – kostenfreie Privatparkplätze direkt am Haus und schnelles WLAN in allen Räumen.',
    },
    {
      q: 'Ist das Haus auch im Sommer attraktiv?',
      a: 'Absolut. Sauna und Kamin sorgen im Winter für Gemütlichkeit, im Sommer locken Balkon, Terrasse, Wandern, Baden und die ganze Bergwelt rund um Oberstdorf.',
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
      a: 'Check-in from 4:00 PM, check-out by 10:00 AM. Ahead of arrival you receive all self-check-in details including PIN code and a digital guest guide.',
    },
    {
      q: 'Is the local tourist tax already included?',
      a: 'No, the tourist contribution of the municipality of Fischen is paid separately and can be settled conveniently online. In return you receive the Allgäu-Walser-Card with free public transport and many discounts.',
    },
    {
      q: 'How many people fit in the house?',
      a: 'Up to 7 guests: 4 adults + 3 children, or 6 adults. There are 3 bedrooms (double, double, bunk + single).',
    },
    {
      q: 'Is there parking and Wi-Fi?',
      a: 'Yes – free private parking right at the house and fast Wi-Fi throughout.',
    },
    {
      q: 'Is the house attractive in summer too?',
      a: 'Absolutely. Sauna and fireplace make it cozy in winter, while balcony, terrace, hiking, swimming and the whole mountain world around Oberstdorf shine in summer.',
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