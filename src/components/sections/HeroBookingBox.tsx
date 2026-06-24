import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Minus, Plus, CircleCheck, CalendarCheck } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import PriceCalendar from './PriceCalendar';
import { prefetchCalendar, nextAvailableRanges, type CalendarDay } from '@/lib/calendarData';
import { CHECKOUT_BASE_URL } from '@/constants/site';

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

  // Next bookable windows (≥ 5 nights) derived from the Hostaway calendar data.
  const availRanges = useMemo(() => nextAvailableRanges(days, { minNights: 5, max: 3 }), [days]);

  const fmtRange = (from: string, to: string) => {
    const [fy, fm, fd] = from.split('-').map(Number);
    const [ty, tm, td] = to.split('-').map(Number);
    if (t('hero.book.checkin') === 'CHECK-IN') {
      const opt: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
      const left = new Date(fy, fm - 1, fd).toLocaleDateString('en-US', opt);
      const right = new Date(ty, tm - 1, td).toLocaleDateString('en-US', { ...opt, year: 'numeric' });
      return `${left} – ${right}`;
    }
    const p = (n: number) => String(n).padStart(2, '0');
    const left = fy === ty ? `${p(fd)}.${p(fm)}.` : `${p(fd)}.${p(fm)}.${fy}`;
    return `${left}–${p(td)}.${p(tm)}.${ty}`;
  };

  const minStay = range.from ? days[range.from]?.minimumStay ?? null : null;
  const nights = range.from && range.to
    ? Math.round((new Date(range.to).getTime() - new Date(range.from).getTime()) / 86400000)
    : 0;
  const minStayWarning = minStay && nights > 0 && nights < minStay;

  const openCheckout = () => {
    const base = CHECKOUT_BASE_URL;
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

  const trustItems = [
    t('hero.book.list.bestprice'),
    t('hero.book.list.flexible'),
    t('hero.book.list.direct'),
    t('hero.book.list.nofees'),
  ];

  return (
    <div className="w-full flex flex-col gap-3">
      <aside
        data-booking-box
        className="w-full rounded-3xl bg-alpine-pine text-alpine-snow ring-1 ring-white/10 shadow-[0_24px_70px_-20px_hsla(156,40%,8%,0.5)] p-6 md:p-7"
        aria-label={t('hero.book.title')}
      >
        <p className="font-display text-2xl md:text-[1.75rem] leading-snug text-alpine-snow">
          {t('hero.book.title')}
        </p>
        <p className="text-sm text-alpine-snow/70 mb-5">{t('hero.book.subtitle')}</p>

        {/* Date pills */}
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="w-full grid grid-cols-2 rounded-xl border border-alpine-snow/20 overflow-hidden mb-3 hover:bg-alpine-snow/5 transition-colors text-left"
              aria-label={`${t('hero.book.checkin')} / ${t('hero.book.checkout')}`}
            >
              <span className="px-3.5 py-2.5 border-r border-alpine-snow/20">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-alpine-snow/60">
                  {t('hero.book.checkin')}
                </span>
                <span className={`block text-sm mt-0.5 ${range.from ? 'text-alpine-snow' : 'text-alpine-snow/50'}`}>
                  {range.from ? fmtDate(range.from) : t('hero.book.addDate')}
                </span>
              </span>
              <span className="px-3.5 py-2.5">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-alpine-snow/60">
                  {t('hero.book.checkout')}
                </span>
                <span className={`block text-sm mt-0.5 ${range.to ? 'text-alpine-snow' : 'text-alpine-snow/50'}`}>
                  {range.to ? fmtDate(range.to) : t('hero.book.addDate')}
                </span>
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            sideOffset={8}
            className="p-4 w-[min(94vw,760px)] max-h-[80vh] overflow-auto z-50 bg-card text-foreground"
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
          <p className="text-[11px] -mt-1 mb-3 text-alpine-snow/60">
            {`${nights} ${nights === 1 ? (t('hero.book.checkin') === 'CHECK-IN' ? 'night' : 'Nacht') : (t('hero.book.checkin') === 'CHECK-IN' ? 'nights' : 'Nächte')}`}
            {minStayWarning ? ` · min. ${minStay}` : ''}
          </p>
        )}

        {/* Guests pill with expandable steppers */}
        <div ref={panelRef} className="relative mb-4">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="w-full text-left rounded-xl border border-alpine-snow/20 px-3.5 py-2.5 hover:bg-alpine-snow/5 transition-colors flex items-center justify-between gap-2"
          >
            <span className="min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-alpine-snow/60">
                {t('hero.book.guests')}
              </span>
              <span className="block text-sm text-alpine-snow mt-0.5 truncate">
                {adults} {t('hero.book.adults.short')} · {kids} {t('hero.book.kids.short')}
              </span>
            </span>
            {open ? (
              <ChevronUp className="w-4 h-4 text-alpine-snow/70 shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-alpine-snow/70 shrink-0" />
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
          variant="gold"
          size="xl"
          className="w-full text-base font-semibold tracking-wide"
          onClick={openCheckout}
        >
          {t('hero.book.cta')}
        </Button>

        {/* Next available dates – derived from the Hostaway calendar; hidden when none */}
        {availRanges.length > 0 && (
          <div className="mt-4 rounded-xl bg-alpine-snow/10 border border-alpine-snow/15 px-4 py-3">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-alpine-snow/60 mb-2">
              <CalendarCheck className="w-3.5 h-3.5 text-alpine-gold" aria-hidden="true" />
              {t('hero.book.avail.title')}
            </p>
            <ul className="space-y-1.5">
              {availRanges.map((r) => (
                <li key={r.from} className="flex items-center gap-2 text-sm text-alpine-snow">
                  <span className="w-1.5 h-1.5 rounded-full bg-alpine-gold shrink-0" aria-hidden="true" />
                  <span className="tabular-nums">{fmtRange(r.from, r.to)}</span>
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-alpine-snow/55 mt-2">{t('hero.book.avail.more')}</p>
          </div>
        )}

        <span className="sr-only">
          {total} {total === 1 ? t('hero.book.guest.one') : t('hero.book.guest.many')}
        </span>
      </aside>

      {/* Trust list (on the page background, outside the green box) */}
      <ul className="rounded-2xl border border-border bg-card shadow-soft px-5 py-4 space-y-2.5">
        {trustItems.map((item) => (
          <li key={item} className="flex items-center gap-2.5 text-sm text-foreground/90">
            <CircleCheck className="w-4 h-4 text-alpine-forest shrink-0" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HeroBookingBox;
