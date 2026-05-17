import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { prefetchCalendar, type CalendarDay } from '@/lib/calendarData';

const DAY_LABELS_DE = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const DAY_LABELS_EN = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTH_DE = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];
const MONTH_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);

const formatPrice = (price: number, currency: string, locale: string) => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${Math.round(price)} ${currency}`;
  }
};

interface Props {
  onSelect?: (range: { from: string | null; to: string | null }) => void;
}

const PriceCalendar = ({ onSelect }: Props) => {
  const { language } = useLanguage();
  const locale = language === 'de' ? 'de-DE' : 'en-US';
  const dayLabels = language === 'de' ? DAY_LABELS_DE : DAY_LABELS_EN;
  const monthNames = language === 'de' ? MONTH_DE : MONTH_EN;

  const [days, setDays] = useState<Record<string, CalendarDay>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<Date>(startOfMonth(new Date()));
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    prefetchCalendar()
      .then((map) => {
        if (!cancelled) setDays(map);
      })
      .catch((e) => {
        if (!cancelled) setError(String((e as Error).message || e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const canPrev = cursor > startOfMonth(today);

  const handleDayClick = (date: string, available: boolean) => {
    if (!available) return;
    if (!from || (from && to)) {
      setFrom(date);
      setTo(null);
      onSelect?.({ from: date, to: null });
      return;
    }
    if (date <= from) {
      setFrom(date);
      onSelect?.({ from: date, to: null });
      return;
    }
    setTo(date);
    onSelect?.({ from, to: date });
  };

  const renderMonth = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    // Monday = 0
    const offset = (first.getDay() + 6) % 7;
    const totalCells = Math.ceil((offset + last.getDate()) / 7) * 7;

    return (
      <div key={`${year}-${month}`} className="flex-1 min-w-0">
        <div className="text-center font-display text-base md:text-lg text-foreground mb-3">
          {monthNames[month]} {year}
        </div>
        <div className="grid grid-cols-7 gap-y-1 text-[11px] text-muted-foreground mb-1">
          {dayLabels.map((l) => (
            <div key={l} className="text-center">{l}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1">
          {Array.from({ length: totalCells }).map((_, i) => {
            const dayNum = i - offset + 1;
            if (dayNum < 1 || dayNum > last.getDate()) {
              return <div key={i} />;
            }
            const d = new Date(year, month, dayNum);
            const dateStr = ymd(d);
            const info = days[dateStr];
            const isPast = d < today;
            const available = !isPast && !!info?.isAvailable;
            const isFrom = from === dateStr;
            const isTo = to === dateStr;
            const inRange = from && to && dateStr > from && dateStr < to;
            const isSelected = isFrom || isTo;

            return (
              <button
                key={i}
                type="button"
                onClick={() => handleDayClick(dateStr, available)}
                disabled={!available}
                aria-label={dateStr}
                className={cn(
                  'flex flex-col items-center justify-start pt-1.5 h-12 rounded-md text-sm leading-none transition-colors px-0.5',
                  available
                    ? 'text-foreground hover:bg-muted cursor-pointer'
                    : 'text-muted-foreground/40 line-through cursor-not-allowed',
                  inRange && 'bg-muted',
                  isSelected && 'bg-foreground text-background hover:bg-foreground',
                )}
              >
                <span className="font-medium tabular-nums">{dayNum}</span>
                <span
                  className={cn(
                    'mt-1 text-[9px] tabular-nums leading-none h-[10px]',
                    isSelected ? 'text-background/90' : 'text-muted-foreground',
                  )}
                >
                  {available && info?.price ? formatPrice(info.price, info.currency, locale) : ''}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[360px] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-sm text-muted-foreground px-4 text-center">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={() => canPrev && setCursor(addMonths(cursor, -1))}
          disabled={!canPrev}
          className="w-8 h-8 rounded-full flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setCursor(addMonths(cursor, 1))}
          className="w-8 h-8 rounded-full flex items-center justify-center text-foreground hover:bg-muted"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <div className="min-w-0">{renderMonth(cursor)}</div>
        <div className="min-w-0 hidden md:block">{renderMonth(addMonths(cursor, 1))}</div>
      </div>
    </div>
  );
};

export default PriceCalendar;
