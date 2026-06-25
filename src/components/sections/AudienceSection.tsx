import { useLanguage } from '@/contexts/LanguageContext';
import { Users, Wine, Mountain } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

/**
 * "Für wen ist ACHZEIT ideal?" – positions the house for families, friends/couples
 * and active guests alike, without making it feel like a kids-only family home.
 */
const AudienceSection = () => {
  const { t } = useLanguage();

  const cards = [
    { icon: Users, title: t('audience.families.title'), text: t('audience.families.text') },
    { icon: Wine, title: t('audience.friends.title'), text: t('audience.friends.text') },
    { icon: Mountain, title: t('audience.active.title'), text: t('audience.active.text') },
  ];

  return (
    <section id="audience" className="py-16 md:py-20 bg-gradient-section">
      <div className="container mx-auto px-6">
        <ScrollReveal className="text-center mb-10 md:mb-12 max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-3">
            {t('audience.title')}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed">
            {t('audience.subtitle')}
          </p>
          <div className="alpine-divider mt-6" />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto">
          {cards.map((card, i) => (
            <ScrollReveal key={card.title} delay={i * 0.05}>
              <div className="h-full p-6 md:p-7 rounded-xl bg-card border border-border/60 shadow-soft">
                <div className="w-11 h-11 rounded-lg bg-alpine-stone/10 flex items-center justify-center mb-4">
                  <card.icon className="w-5 h-5 text-alpine-forest" aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl md:text-2xl text-foreground mb-2 leading-snug">
                  {card.title}
                </h3>
                <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed font-light">
                  {card.text}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-8 max-w-3xl mx-auto">
          <p className="text-center text-sm text-muted-foreground leading-relaxed">
            {t('audience.note')}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default AudienceSection;
