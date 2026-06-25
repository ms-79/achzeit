export interface CalendarDay {
  date: string;
  isAvailable: boolean;
  status?: string;
  price: number | null;
  currency: string;
  minimumStay: number | null;
}

export interface AvailableRange {
  /** First free night (check-in), YYYY-MM-DD. */
  from: string;
  /** Check-out day = day after the last free night, YYYY-MM-DD. */
  to: string;
  /** Number of consecutive free nights in this window. */
  nights: number;
}

const dayAfter = (s: string): string => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);
};

/** Today's date in the visitor's local timezone as YYYY-MM-DD (never UTC, so it
 *  never drifts to the previous day in the evening/CET). */
export const localTodayISO = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/**
 * Derive the next bookable windows from already-fetched Hostaway calendar data.
 * A window is a run of consecutive available nights long enough for a stay of at
 * least `minNights` (and at least the run's own minimumStay, if higher).
 * Pure + side-effect free so it can be unit-tested and memoized in the UI.
 */
export const nextAvailableRanges = (
  days: Record<string, CalendarDay>,
  { minNights = 5, max = 3, today = localTodayISO() }: {
    minNights?: number;
    max?: number;
    today?: string;
  } = {},
): AvailableRange[] => {
  const avail = Object.values(days)
    .filter((d) => d.isAvailable && d.date >= today)
    .map((d) => d.date)
    .sort();

  const ranges: AvailableRange[] = [];
  let start: string | null = null;
  let prev: string | null = null;

  const flush = () => {
    if (!start || !prev) return;
    const nights = Math.round((Date.parse(prev) - Date.parse(start)) / 86_400_000) + 1;
    const required = Math.max(minNights, days[start]?.minimumStay ?? 0);
    if (nights >= required) ranges.push({ from: start, to: dayAfter(prev), nights });
  };

  for (const date of avail) {
    if (start === null) {
      start = date;
      prev = date;
    } else if (prev && dayAfter(prev) === date) {
      prev = date;
    } else {
      flush();
      start = date;
      prev = date;
    }
    if (ranges.length >= max) break;
  }
  if (ranges.length < max) flush();

  return ranges.slice(0, max);
};

let cache: Promise<Record<string, CalendarDay>> | null = null;

export const prefetchCalendar = () => {
  if (cache) return cache;
  cache = (async () => {
    const res = await fetch('/api/calendar');
    if (!res.ok) throw new Error('Calendar fetch failed');
    const data = await res.json();
    const map: Record<string, CalendarDay> = {};
    (data?.days || []).forEach((d: CalendarDay) => {
      map[d.date] = d;
    });
    return map;
  })().catch((e) => {
    cache = null;
    throw e;
  });
  return cache;
};