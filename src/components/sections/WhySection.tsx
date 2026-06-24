import { useLanguage } from '@/contexts/LanguageContext';
import { Flame, Home, Users, Mountain, Trees, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScrollReveal from '@/components/ScrollReveal';
import { scrollToBooking } from '@/lib/scroll';

const WhySection = () => {
  const { t } = useLanguage();

  const tiles = [
    { icon: Flame, title: t('why.1.title'), text: t('why.1.text') },
    { icon: Home, title: t('why.2.title'), text: t('why.2.text') },
    { icon: Users, title: t('why.3.title'), text: t('why.3.text') },
    { icon: Mountain, title: t('why.4.title'), text: t('why.4.text') },
    { icon: Trees, title: t('why.5.title'), text: t('why.5.text') },
    { icon: Car, title: t('why.6.title'), text: t('why.6.text') },
  ];


  return (
    <section id="why" className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-6">
        <ScrollReveal className="text-center mb-10 md:mb-12 max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-3">
            {t('why.title')}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed">
            {t('why.subtitle')}
          </p>
          <div className="alpine-divider mt-6" />
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-6xl mx-auto">
          {tiles.map((tile, i) => (
            <ScrollReveal key={i} delay={i * 0.05}>
              <div className="group h-full p-6 rounded-xl bg-card border border-border/60 shadow-soft hover:shadow-medium hover:border-alpine-stone/50 transition-all duration-300">
                <div className="w-11 h-11 rounded-lg bg-alpine-stone/10 flex items-center justify-center mb-4 group-hover:bg-alpine-stone/20 transition-colors">
                  <tile.icon className="w-5 h-5 text-alpine-wood" aria-hidden="true" />
                </div>
                <h3 className="font-display text-lg md:text-xl text-foreground mb-1.5 leading-snug">
                  {tile.title}
                </h3>
                <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed font-light">
                  {tile.text}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-10 md:mt-12 text-center">
          <Button variant="alpine" size="lg" onClick={scrollToBooking}>
            {t('why.cta')}
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default WhySection;
