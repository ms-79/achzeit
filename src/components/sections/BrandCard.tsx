import { Heart, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

/**
 * Neutral brand card shown beneath the booking box.
 * Deliberately uses no host/family photo – brand & tone only.
 */
const BrandCard = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full rounded-2xl border border-border bg-card px-5 py-4 shadow-soft">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-alpine-forest">
          <Heart className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="font-display text-lg leading-snug text-foreground">
            {t('hero.brand.title')}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {t('hero.brand.text')}
          </p>
          <a
            href={buildWhatsAppUrl(t('whatsapp.prefill'))}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-alpine-forest hover:opacity-80 transition-opacity"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            {t('hero.brand.whatsapp')}
          </a>
        </div>
      </div>
    </div>
  );
};

export default BrandCard;
