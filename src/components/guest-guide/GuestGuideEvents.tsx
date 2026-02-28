import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const BASE_URL =
  'https://www.hoernerdoerfer.de/fileadmin/thd/x_partner_info/dateien/gaesteinfos/Fischen/dateien/Wochenprogramm_KW';

/** Returns ISO 8601 week number */
function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/** Returns the Monday of a given ISO week */
function getMondayOfWeek(year: number, week: number): Date {
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const dayOfWeek = jan4.getUTCDay() || 7;
  const monday = new Date(jan4);
  monday.setUTCDate(jan4.getUTCDate() - dayOfWeek + 1 + (week - 1) * 7);
  return monday;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function getWeekRange(year: number, week: number): string {
  const monday = getMondayOfWeek(year, week);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  return `${formatDate(monday)} – ${formatDate(sunday)}`;
}

type Status = 'loading' | 'available' | 'unavailable';

function useCheckPdf(url: string): Status {
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    let cancelled = false;

    supabase.functions
      .invoke('check-pdf', { body: { url } })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data?.available) {
          setStatus('unavailable');
        } else {
          setStatus('available');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('unavailable');
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return status;
}

interface WeekRowProps {
  kwNumber: number;
  year: number;
  label: string;
}

const WeekRow = ({ kwNumber, year, label }: WeekRowProps) => {
  const kwStr = String(kwNumber).padStart(2, '0');
  const url = `${BASE_URL}${kwStr}.pdf`;
  const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`;
  const status = useCheckPdf(url);
  const dateRange = getWeekRange(year, kwNumber);

  if (status === 'loading') {
    return (
      <div className="bg-muted rounded-lg p-4 animate-pulse">
        <div className="h-5 bg-border/50 rounded w-48 mb-1.5" />
        <div className="h-3 bg-border/50 rounded w-32" />
      </div>
    );
  }

  if (status === 'unavailable') {
    return (
      <div className="bg-muted rounded-lg p-4 opacity-60">
        <h4 className="font-display text-base text-foreground">
          Wochenprogramm KW {kwStr}
        </h4>
        <p className="text-xs text-muted-foreground mt-0.5">
          {dateRange} · {label}
        </p>
        <p className="text-sm text-muted-foreground mt-2 italic">
          Information noch nicht verfügbar.
        </p>
      </div>
    );
  }

  return (
    <a
      href={viewerUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between bg-muted rounded-lg p-4 hover:bg-accent transition-colors"
    >
      <div>
        <h4 className="font-display text-base text-foreground">
          Wochenprogramm KW {kwStr}
        </h4>
        <p className="text-xs text-muted-foreground mt-0.5">
          {dateRange} · {label}
        </p>
      </div>
      <ExternalLink size={16} className="text-alpine-wood shrink-0" />
    </a>
  );
};

const GuestGuideEvents = () => {
  const now = new Date();
  const year = now.getFullYear();
  const currentWeek = getISOWeek(now);
  const nextWeek = currentWeek + 1;

  return (
    <div className="space-y-4">
      <p className="text-sm">
        Das aktuelle Wochenprogramm mit Veranstaltungen, Führungen und Kursen in Fischen.
      </p>
      <div className="space-y-3">
        <WeekRow kwNumber={currentWeek} year={year} label="Aktuelle Woche" />
        <WeekRow kwNumber={nextWeek} year={year} label="Nächste Woche" />
      </div>
      <p className="text-xs text-muted-foreground italic pt-1">
        Quelle: Hörnerdörfer Tourismus · PDF wird wöchentlich aktualisiert.
      </p>
    </div>
  );
};

export default GuestGuideEvents;
