import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import laurelLeft from '@/assets/laurel-left.png';
import laurelRight from '@/assets/laurel-right.png';
import airbnbLogo from '@/assets/airbnb-logo.png';

const GuestFavoriteBadge = () => {
  const { t } = useLanguage();
  const [reviewData, setReviewData] = useState<{ avg: number; count: number } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.functions.invoke('reviews');
        const reviews = data?.reviews || [];
        if (reviews.length > 0) {
          const avg = reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length;
          setReviewData({ avg: avg / 2, count: reviews.length });
        }
      } catch {}
    })();
  }, []);

  const scrollToReviews = () => {
    document.querySelector('#reviews')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToReviews}
      className="w-full text-left border border-border rounded-2xl bg-card px-4 py-3 shadow-soft hover:shadow-medium transition-shadow"
      aria-label={t('hero.badge.title')}
    >
      <div className="flex items-center gap-3">
        {/* Lorbeer + Gäste-Favorit */}
        <div className="flex items-center gap-1 shrink-0 h-10">
          <img src={laurelLeft} alt="" aria-hidden="true" className="h-full w-auto shrink-0" loading="lazy" />
          <span className="font-body font-semibold text-foreground flex flex-col justify-center h-full leading-[1.05] text-[11px] text-center">
            {t('hero.badge.title').split(/[-\s]/).map((w, i) => (
              <span key={i}>{w}</span>
            ))}
          </span>
          <img src={laurelRight} alt="" aria-hidden="true" className="h-full w-auto shrink-0" loading="lazy" />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-3 shrink-0 border-l border-border pl-3 ml-auto">
          <div className="flex flex-col items-center">
            <div className="font-body font-semibold text-base text-foreground leading-none">
              {reviewData ? reviewData.avg.toFixed(1).replace('.', ',') : '5,0'}
            </div>
            <div className="flex gap-0.5 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-2 h-2 fill-foreground text-foreground" />
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center border-l border-border pl-3">
            <div className="font-body font-semibold text-base text-foreground leading-none">
              {reviewData?.count ?? 5}
            </div>
            <div className="text-[10px] text-muted-foreground mt-1 underline">
              {t('hero.badge.reviews')}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-2 text-[11px] leading-snug text-muted-foreground text-pretty">
        {t('hero.badge.text')}
        <img
          src={airbnbLogo}
          alt="Airbnb"
          loading="lazy"
          className="inline-block h-3 w-auto align-middle ml-1"
        />
      </p>
    </button>
  );
};

export default GuestFavoriteBadge;