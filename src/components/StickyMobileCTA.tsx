import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { scrollToBooking } from '@/lib/scroll';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

/**
 * Always-visible booking CTA on mobile/tablet (< xl). The booking box is the
 * single primary action, with WhatsApp as a small secondary icon in the same
 * bar (so there are not two competing fixed CTAs at the bottom).
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
        {/* Secondary: WhatsApp */}
        <a
          href={buildWhatsAppUrl(t('whatsapp.prefill'))}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('whatsapp.aria')}
          className="shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-[#25D366] text-white hover:bg-[#1ebe5d] transition-colors"
        >
          <svg viewBox="0 0 32 32" className="w-6 h-6 fill-white" aria-hidden="true">
            <path d="M16.001 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.26.59 4.46 1.71 6.4L3.2 28.8l6.55-1.71a12.74 12.74 0 0 0 6.25 1.6h.01c7.06 0 12.8-5.73 12.8-12.8 0-3.42-1.33-6.63-3.75-9.05A12.71 12.71 0 0 0 16.001 3.2Zm0 23.36h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-3.89 1.02 1.04-3.79-.25-.4a10.6 10.6 0 0 1-1.63-5.68c0-5.86 4.77-10.63 10.64-10.63 2.84 0 5.51 1.11 7.52 3.12a10.58 10.58 0 0 1 3.12 7.52c0 5.86-4.77 10.63-10.75 10.55Zm5.83-7.96c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1.01 1.25-.18.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.55-.08-.16-.71-1.71-.98-2.34-.26-.62-.52-.53-.71-.54l-.6-.01c-.21 0-.55.08-.84.4-.29.32-1.11 1.08-1.11 2.63 0 1.55 1.13 3.05 1.29 3.26.16.21 2.23 3.4 5.4 4.77.75.32 1.34.52 1.8.66.76.24 1.45.21 1.99.13.61-.09 1.89-.77 2.16-1.52.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37Z" />
          </svg>
        </a>
        <Button
          variant="alpine"
          size="default"
          onClick={scrollToBooking}
          className="shrink-0"
        >
          {t('nav.book')}
        </Button>
      </div>
    </div>
  );
};

export default StickyMobileCTA;
