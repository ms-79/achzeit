import { useEffect, useState } from 'react';
import { ExternalLink, X } from 'lucide-react';
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
  const parts = dateRange.split(/\s*[–\-—]\s*/);
  if (parts.length !== 2) return dateRange;

  const endPart = parts[1].trim();
  const endMatch = endPart.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (!endMatch) return dateRange;
  const year = parseInt(endMatch[3], 10);

  const startPart = parts[0].trim();
  const startMatch = startPart.match(/(\d{1,2})\.(\d{1,2})\./);
  if (!startMatch) return dateRange;

  const startDate = new Date(Date.UTC(year, parseInt(startMatch[2], 10) - 1, parseInt(startMatch[1], 10)));
  const endDate = new Date(Date.UTC(year, parseInt(endMatch[2], 10) - 1, parseInt(endMatch[1], 10)));

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

/** Fullscreen PDF viewer overlay */
const PdfViewerModal = ({
  url,
  title,
  onClose,
}: {
  url: string;
  title: string;
  onClose: () => void;
}) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted">
        <h3 className="font-display text-sm text-foreground truncate pr-4">{title}</h3>
        <button
          onClick={onClose}
          className="shrink-0 p-2 rounded-full hover:bg-accent transition-colors"
          aria-label="Schließen"
        >
          <X size={20} className="text-foreground" />
        </button>
      </div>
      <iframe
        src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(
          `https://ubtfmbzlpywvtljkxooy.supabase.co/functions/v1/check-pdf?url=${encodeURIComponent(url)}`
        )}`}
        className="flex-1 w-full border-0"
        title={title}
        allow="fullscreen"
      />
    </div>
  );
};

const GuestGuideEvents = () => {
  const now = new Date();
  const currentWeek = getISOWeek(now);
  const nextWeek = currentWeek + 1;

  const currentKwStr = String(currentWeek).padStart(2, '0');
  const currentUrl = `${BASE_URL}${currentKwStr}.pdf`;
  const currentResult = useCheckPdf(currentUrl);

  const nextKwStr = String(nextWeek).padStart(2, '0');
  const nextUrl = `${BASE_URL}${nextKwStr}.pdf`;
  const nextResult = useCheckPdf(nextUrl);

  const currentDisplayDate = currentResult.dateRange;
  let nextDisplayDate = nextResult.dateRange;
  if (!nextDisplayDate && currentDisplayDate) {
    nextDisplayDate = shiftDateRange(currentDisplayDate, 7);
  }

  const [viewerState, setViewerState] = useState<{ url: string; title: string } | null>(null);

  return (
    <div className="space-y-4">
      <p className="text-sm">
        Das aktuelle Wochenprogramm mit Veranstaltungen, Führungen und Kursen in Fischen.
      </p>
      <div className="space-y-3">
        <WeekRowDirect
          kwStr={currentKwStr}
          label="Aktuelle Woche"
          status={currentResult.status}
          dateRange={currentDisplayDate}
          onOpen={() => setViewerState({ url: currentUrl, title: `Wochenprogramm KW ${currentKwStr}` })}
        />
        <WeekRowDirect
          kwStr={nextKwStr}
          label="Nächste Woche"
          status={nextResult.status}
          dateRange={nextDisplayDate}
          onOpen={() => setViewerState({ url: nextUrl, title: `Wochenprogramm KW ${nextKwStr}` })}
        />
      </div>
      <p className="text-xs text-muted-foreground italic pt-1">
        Quelle: Hörnerdörfer Tourismus · PDF wird wöchentlich aktualisiert.
      </p>

      {viewerState && (
        <PdfViewerModal
          url={viewerState.url}
          title={viewerState.title}
          onClose={() => setViewerState(null)}
        />
      )}
    </div>
  );
};

/** Presentational row – click opens inline PDF viewer */
const WeekRowDirect = ({
  kwStr,
  label,
  status,
  dateRange,
  onOpen,
}: {
  kwStr: string;
  label: string;
  status: 'loading' | 'available' | 'unavailable';
  dateRange: string | null;
  onOpen: () => void;
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
    <button
      onClick={onOpen}
      className="flex items-center justify-between bg-muted rounded-lg p-4 hover:bg-accent transition-colors w-full text-left"
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
    </button>
  );
};

export default GuestGuideEvents;
