import { supabase } from '@/integrations/supabase/client';

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
    const { data, error } = await supabase.functions.invoke('calendar');
    if (error) throw error;
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