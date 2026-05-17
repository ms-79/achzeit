import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import PriceCalendar from './PriceCalendar';
import { prefetchCalendar, type CalendarDay } from '@/lib/calendarData';

const MAX_GUESTS = 7;

const HeroBookingBox = () => {
  const { t } = useLanguage();
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [open, setOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [range, setRange] = useState<{ from: string | null; to: string | null }>({ from: null, to: null });
  const [days, setDays] = useState<Record<string, CalendarDay>>({});
  const panelRef = useRef<HTMLDivElement | null>(null);

  const total = adults + kids;

  useEffect(() => {
    prefetchCalendar().then(setDays).catch(() => {});
  }, []);

  const fmtDate = (s: string) => {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(
      t('hero.book.checkin') === 'CHECK-IN' ? 'en-US' : 'de-DE',
      { day: '2-digit', month: 'short', year: 'numeric' },
    );
  };

  const minStay = range.from ? days[range.from]?.minimumStay ?? null : null;
  const nights = range.from && range.to
    ? Math.round((new Date(range.to).getTime() - new Date(range.from).getTime()) / 86400000)
    : 0;
  const minStayWarning = minStay && nights > 0 && nights < minStay;

  const openCheckout = () => {
    const base = 'https://achzeit.holidayfuture.com/checkout/463607';
    const params = new URLSearchParams();
    if (range.from) params.set('start', range.from);
    if (range.to) params.set('end', range.to);
    params.set('numberOfGuests', String(total));
    const url = range.from && range.to ? `${base}?${params.toString()}` : base;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const Stepper = ({
    value,
    onDec,
    onInc,
    canDec,
    canInc,
    label,
    sub,
  }: {
    value: number;
    onDec: () => void;
    onInc: () => void;
    canDec: boolean;
    canInc: boolean;
    label: string;
    sub: string;
  }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="text-sm font-medium text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDec}
          disabled={!canDec}
          aria-label={`− ${label}`}
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:border-foreground transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-5 text-center text-sm font-medium text-foreground tabular-nums">{value}</span>
        <button
          type="button"
          onClick={onInc}
          disabled={!canInc}
          aria-label={`+ ${label}`}
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:border-foreground transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  return (
    <aside
      className="w-full rounded-2xl border border-border bg-card shadow-medium p-5 md:p-6 lg:sticky lg:top-24"
      aria-label={t('hero.book.title')}
    >
      <p className="font-display text-xl md:text-[1.4rem] leading-snug text-foreground mb-4">
        {t('hero.book.title')}
      </p>

      {/* Date pills */}
      <Popover open={dateOpen} onOpenChange={setDateOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="w-full grid grid-cols-2 rounded-xl border border-border overflow-hidden mb-3 hover:bg-muted/40 transition-colors text-left"
            aria-label={`${t('hero.book.checkin')} / ${t('hero.book.checkout')}`}
          >
            <span className="px-3.5 py-2.5 border-r border-border">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-foreground/80">
                {t('hero.book.checkin')}
              </span>
              <span className={`block text-sm mt-0.5 ${range.from ? 'text-foreground' : 'text-muted-foreground'}`}>
                {range.from ? fmtDate(range.from) : t('hero.book.addDate')}
              </span>
            </span>
            <span className="px-3.5 py-2.5">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-foreground/80">
                {t('hero.book.checkout')}
              </span>
              <span className={`block text-sm mt-0.5 ${range.to ? 'text-foreground' : 'text-muted-foreground'}`}>
                {range.to ? fmtDate(range.to) : t('hero.book.addDate')}
              </span>
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={8}
          className="p-4 w-[min(94vw,760px)] max-h-[80vh] overflow-auto z-50 bg-card"
        >
          <PriceCalendar
            onSelect={(r) => {
              setRange(r);
              if (r.from && r.to) setDateOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>

      {/* Nights summary (only when both dates picked) */}
      {range.from && range.to && nights > 0 && (
        <p className="text-[11px] -mt-1 mb-3 text-muted-foreground">
          {`${nights} ${nights === 1 ? (t('hero.book.checkin') === 'CHECK-IN' ? 'night' : 'Nacht') : (t('hero.book.checkin') === 'CHECK-IN' ? 'nights' : 'Nächte')}`}
        </p>
      )}

      {/* Guests pill with expandable steppers */}
      <div ref={panelRef} className="relative mb-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="w-full text-left rounded-xl border border-border px-3.5 py-2.5 hover:bg-muted/40 transition-colors flex items-center justify-between gap-2"
        >
          <span className="min-w-0">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-foreground/80">
              {t('hero.book.guests')}
            </span>
            <span className="block text-sm text-foreground mt-0.5 truncate">
              {adults} {t('hero.book.adults.short')} · {kids} {t('hero.book.kids.short')}
            </span>
          </span>
          {open ? (
            <ChevronUp className="w-4 h-4 text-foreground/70 shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 text-foreground/70 shrink-0" />
          )}
        </button>

        {open && (
          <div className="mt-2 rounded-xl border border-border bg-card shadow-soft px-4 py-1 divide-y divide-border">
            <Stepper
              value={adults}
              onDec={() => setAdults((a) => Math.max(1, a - 1))}
              onInc={() => setAdults((a) => Math.min(MAX_GUESTS - kids, a + 1))}
              canDec={adults > 1}
              canInc={adults + kids < MAX_GUESTS}
              label={t('hero.book.adults')}
              sub={t('hero.book.adults.age')}
            />
            <Stepper
              value={kids}
              onDec={() => setKids((k) => Math.max(0, k - 1))}
              onInc={() => setKids((k) => Math.min(MAX_GUESTS - adults, k + 1))}
              canDec={kids > 0}
              canInc={adults + kids < MAX_GUESTS}
              label={t('hero.book.kids')}
              sub={t('hero.book.kids.age')}
            />
          </div>
        )}
      </div>

      <Button
        variant="alpine"
        size="lg"
        className="w-full"
        onClick={openCheckout}
      >
        {t('hero.book.cta')}
      </Button>

      <p className="text-[11px] leading-snug text-muted-foreground text-center mt-3">
        {t('hero.book.trust')}
      </p>


      <span className="sr-only">
        {total} {total === 1 ? t('hero.book.guest.one') : t('hero.book.guest.many')}
      </span>
    </aside>
  );
};

export default HeroBookingBox;
