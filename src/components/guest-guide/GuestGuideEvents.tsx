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

/** Parse a date range string like "24.02. – 02.03.2025" and add days */
function shiftDateRange(dateRange: string, days: number): string {
  // Extract the two date parts
  const parts = dateRange.split(/\s*[–\-—]\s*/);
  if (parts.length !== 2) return dateRange;

  const endPart = parts[1].trim();
  // Extract year from end date (always has full year)
  const endMatch = endPart.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (!endMatch) return dateRange;
  const year = parseInt(endMatch[3], 10);

  const startPart = parts[0].trim();
  const startMatch = startPart.match(/(\d{1,2})\.(\d{1,2})\./);
  if (!startMatch) return dateRange;

  const startDate = new Date(Date.UTC(year, parseInt(startMatch[2], 10) - 1, parseInt(startMatch[1], 10)));
  const endDate = new Date(Date.UTC(year, parseInt(endMatch[2], 10) - 1, parseInt(endMatch[1], 10)));

  // Handle year boundary (start in Dec, end in Jan)
  if (startDate > endDate) {
    startDate.setUTCFullYear(year - 1);
  }

  startDate.setUTCDate(startDate.getUTCDate() + days);
  endDate.setUTCDate(endDate.getUTCDate() + days);

  const fmt = (d: Date) =>
    d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' });

  return `${fmt(startDate)} – ${fmt(endDate)}`;
}

type PdfResult = {
  status: 'loading' | 'available' | 'unavailable';
  dateRange: string | null;
};

function useCheckPdf(url: string): PdfResult {
  const [result, setResult] = useState<PdfResult>({ status: 'loading', dateRange: null });

  useEffect(() => {
    let cancelled = false;

    supabase.functions
      .invoke('check-pdf', { body: { url } })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data?.available) {
          setResult({ status: 'unavailable', dateRange: null });
        } else {
          setResult({ status: 'available', dateRange: data.dateRange ?? null });
        }
      })
      .catch(() => {
        if (!cancelled) setResult({ status: 'unavailable', dateRange: null });
      });

    return () => { cancelled = true; };
  }, [url]);

  return result;
}

interface WeekRowProps {
  kwNumber: number;
  label: string;
  /** Date range from the previous (current) week, used as fallback (+7 days) */
  fallbackFromDateRange?: string | null;
}

const WeekRow = ({ kwNumber, label, fallbackFromDateRange }: WeekRowProps) => {
  const kwStr = String(kwNumber).padStart(2, '0');
  const url = `${BASE_URL}${kwStr}.pdf`;
  const { status, dateRange } = useCheckPdf(url);

  // Determine displayed date range
  let displayDate: string | null = dateRange;
  if (!displayDate && fallbackFromDateRange) {
    displayDate = shiftDateRange(fallbackFromDateRange, 7);
  }

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
        {displayDate && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {displayDate} · {label}
          </p>
        )}
        <p className="text-sm text-muted-foreground mt-2 italic">
          Information noch nicht verfügbar.
        </p>
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between bg-muted rounded-lg p-4 hover:bg-accent transition-colors"
    >
      <div>
        <h4 className="font-display text-base text-foreground">
          Wochenprogramm KW {kwStr}
        </h4>
        {displayDate && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {displayDate} · {label}
          </p>
        )}
      </div>
      <ExternalLink size={16} className="text-alpine-wood shrink-0" />
    </a>
  );
};

const GuestGuideEvents = () => {
  const now = new Date();
  const currentWeek = getISOWeek(now);
  const nextWeek = currentWeek + 1;

  // We need the current week's dateRange to compute fallback for next week.
  // Use a shared hook at this level.
  const currentKwStr = String(currentWeek).padStart(2, '0');
  const currentUrl = `${BASE_URL}${currentKwStr}.pdf`;
  const currentResult = useCheckPdf(currentUrl);

  const nextKwStr = String(nextWeek).padStart(2, '0');
  const nextUrl = `${BASE_URL}${nextKwStr}.pdf`;
  
  const nextResult = useCheckPdf(nextUrl);

  // Determine displayed dates
  const currentDisplayDate = currentResult.dateRange;
  let nextDisplayDate = nextResult.dateRange;
  if (!nextDisplayDate && currentDisplayDate) {
    nextDisplayDate = shiftDateRange(currentDisplayDate, 7);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm">
        Das aktuelle Wochenprogramm mit Veranstaltungen, Führungen und Kursen in Fischen.
      </p>
      <div className="space-y-3">
        {/* Current week */}
        <WeekRowDirect
          kwStr={currentKwStr}
          label="Aktuelle Woche"
          status={currentResult.status}
          dateRange={currentDisplayDate}
          url={currentUrl}
        />
        {/* Next week */}
        <WeekRowDirect
          kwStr={nextKwStr}
          label="Nächste Woche"
          status={nextResult.status}
          dateRange={nextDisplayDate}
          url={nextUrl}
        />
      </div>
      <p className="text-xs text-muted-foreground italic pt-1">
        Quelle: Hörnerdörfer Tourismus · PDF wird wöchentlich aktualisiert.
      </p>
    </div>
  );
};

/** Presentational row that receives all data – no internal fetch */
const WeekRowDirect = ({
  kwStr,
  label,
  status,
  dateRange,
  url,
}: {
  kwStr: string;
  label: string;
  status: 'loading' | 'available' | 'unavailable';
  dateRange: string | null;
  url: string;
}) => {
  

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
        {dateRange && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {dateRange} · {label}
          </p>
        )}
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
        {dateRange && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {dateRange} · {label}
          </p>
        )}
      </div>
      <ExternalLink size={16} className="text-alpine-wood shrink-0" />
    </a>
  );
};

export default GuestGuideEvents;
