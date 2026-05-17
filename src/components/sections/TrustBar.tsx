import { Star, ShieldCheck, Heart, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

/**
 * Compact, premium trust bar shown directly under the hero.
 * Surfaces the strongest social proof + direct-booking reassurance
 * without competing with the hero visual.
 */
const TrustBar = () => {
  const { t } = useLanguage();
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    supabase.functions
      .invoke('reviews')
      .then(({ data }) => {
        const n = data?.reviews?.length;
        if (typeof n === 'number') setCount(n);
      })
      .catch(() => {});
  }, []);

  const reviewsLabel = t('trust.reviews').replace('{count}', String(count ?? 6));

  const items = [
    { icon: Heart, label: t('trust.favorite') },
    { icon: Star, label: t('trust.rating') },
    { icon: MessageCircle, label: reviewsLabel },
    { icon: ShieldCheck, label: t('trust.direct') },
  ];

  return (
    <section
      aria-label="Trust"
      className="border-y border-border/60 bg-card/60"
    >
      <div className="container mx-auto px-6 py-4 md:py-5">
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:gap-x-10">
          {items.map(({ icon: Icon, label }, i) => (
            <li
              key={i}
              className="inline-flex items-center gap-2 text-xs md:text-sm text-foreground/85"
            >
              <Icon className="w-4 h-4 text-primary" aria-hidden="true" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-center text-[11px] md:text-xs text-muted-foreground">
          {t('trust.service')}
        </p>
      </div>
    </section>
  );
};

export default TrustBar;