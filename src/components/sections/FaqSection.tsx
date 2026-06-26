import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ScrollReveal from '@/components/ScrollReveal';
import { FAQS } from '@/data/faq';

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