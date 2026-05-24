export interface CalendarDay {
  date: string;
  isAvailable: boolean;
  status?: string;
  price: number | null;
  currency: string;
  minimumStay: number | null;
}

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