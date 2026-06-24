import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Always-visible booking CTA on mobile/tablet.
 * Appears after the user scrolls past the hero to keep the
 * primary conversion action one tap away.
 */
const StickyMobileCTA = () => {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 xl:hidden border-t border-border/60 bg-background/95 backdrop-blur-md transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground leading-tight">{t('sticky.eyebrow')}</p>
          <p className="text-sm font-medium text-foreground leading-tight truncate">
            {t('sticky.cta')}
          </p>
        </div>
        <Button
          variant="alpine"
          size="default"
          onClick={() => scrollTo('#availability')}
          className="shrink-0"
        >
          {t('nav.book')}
        </Button>
      </div>
    </div>
  );
};

export default StickyMobileCTA;