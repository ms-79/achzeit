import { ExternalLink } from 'lucide-react';

const CALENDAR_URL = 'https://www.hoernerdoerfer.de/region/veranstaltungskalender';

const GuestGuideEvents = () => {
  return (
    <div className="space-y-4">
      <p className="text-sm">
        Veranstaltungen, Führungen und Kurse in Fischen und den Hörnerdörfern.
      </p>
      <a
        href={CALENDAR_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between bg-muted rounded-lg p-4 hover:bg-accent transition-colors w-full"
      >
        <div>
          <h4 className="font-display text-base text-foreground">
            Veranstaltungskalender
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Hörnerdörfer · Fischen, Ofterschwang, Bolsterlang & mehr
          </p>
        </div>
        <ExternalLink size={16} className="text-alpine-wood shrink-0" />
      </a>
      <p className="text-xs text-muted-foreground italic pt-1">
        Quelle: Hörnerdörfer Tourismus
      </p>
    </div>
  );
};

export default GuestGuideEvents;
