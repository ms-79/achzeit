import { useLanguage } from '@/contexts/LanguageContext';
import { Users, Bed, Bath, Flame, Home, UtensilsCrossed, TreePine, Heart, MapPin } from 'lucide-react';
import houseExterior from '@/assets/house-exterior.jpg';
import ScrollReveal from '@/components/ScrollReveal';

const HouseSection = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Users, label: t('house.guests'), detail: t('house.guests.detail') },
    { icon: Bed, label: t('house.bedrooms') },
    { icon: Bath, label: t('house.bathrooms') },
    { icon: Home, label: t('house.sauna') },
    { icon: Flame, label: t('house.fireplace') },
    { icon: UtensilsCrossed, label: t('house.kitchen') },
    { icon: TreePine, label: t('house.garden') },
    { icon: Heart, label: t('house.family') },
    { icon: MapPin, label: t('house.location') },
  ];

  return (
    <section id="house" className="section-padding bg-gradient-section">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            {t('house.title')}
          </h2>
          <p className="text-lg text-muted-foreground tracking-wide">
            {t('house.subtitle')}
          </p>
          <div className="alpine-divider mt-6" />
        </ScrollReveal>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <ScrollReveal direction="left" delay={0.1}>
            <div className="relative">
              <div className="aspect-[4/3] rounded overflow-hidden shadow-elevated">
                <img
                  src={houseExterior}
                  alt="ACHZEIT Haus - Außenansicht"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 border-2 border-alpine-stone/30 rounded -z-10" />
            </div>
          </ScrollReveal>

          {/* Text & Features */}
          <ScrollReveal direction="right" delay={0.2}>
            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed mb-10 font-light">
              {t('house.description')}
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-4 bg-card rounded border border-border/50 hover:border-alpine-stone/50 hover:shadow-soft transition-all duration-300"
                >
                  <feature.icon className="w-6 h-6 text-alpine-wood mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-foreground">{feature.label}</p>
                  {feature.detail && (
                    <p className="text-xs text-muted-foreground mt-1">{feature.detail}</p>
                  )}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default HouseSection;
