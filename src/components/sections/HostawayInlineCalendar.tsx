import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const HOSTAWAY_SCRIPT_URL = 'https://d2q3n06xhbi0am.cloudfront.net/calendar.js';

interface Props {
  instanceId: string;
}

/**
 * Mounts the Hostaway calendar widget into an isolated container.
 * Shows real availability + per-day prices from Hostaway.
 */
const HostawayInlineCalendar = ({ instanceId }: Props) => {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const init = () => {
      const widget = (window as any).hostawayCalendarWidget;
      if (!widget || cancelled || !ref.current) return;
      ref.current.innerHTML = '';
      // The widget renders into the element with this id
      ref.current.id = instanceId;
      try {
        widget({
          baseUrl: 'https://achzeit.holidayfuture.com/',
          listingId: 463607,
          numberOfMonths: 2,
          openInNewTab: true,
          font: 'Inter',
          rounded: true,
          containerId: instanceId,
          button: {
            action: 'checkout',
            text: t('availability.apply'),
          },
          clearButtonText: t('availability.clearDates'),
          color: {
            mainColor: '#363330',
            frameColor: '#363330',
            textColor: '#363330',
          },
        });
      } catch (e) {
        console.error('Hostaway widget init failed:', e);
      }
    };

    const load = () => {
      if ((window as any).hostawayCalendarWidget) {
        init();
        return;
      }
      const existing = document.querySelector(`script[src="${HOSTAWAY_SCRIPT_URL}"]`);
      if (existing) {
        const t = setInterval(() => {
          if ((window as any).hostawayCalendarWidget) {
            clearInterval(t);
            if (!cancelled) init();
          }
        }, 100);
        setTimeout(() => clearInterval(t), 10000);
        return;
      }
      const s = document.createElement('script');
      s.src = HOSTAWAY_SCRIPT_URL;
      s.async = true;
      s.onload = () => setTimeout(() => { if (!cancelled) init(); }, 200);
      document.body.appendChild(s);
    };

    load();
    return () => { cancelled = true; };
  }, [instanceId, t]);

  return (
    <div
      ref={ref}
      id={instanceId}
      className="min-h-[360px] flex items-center justify-center"
    >
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default HostawayInlineCalendar;
