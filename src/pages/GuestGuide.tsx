import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import logoAchzeit from '@/assets/logo-achzeit-transparent.webp';
import GuestGuideHero from '@/components/guest-guide/GuestGuideHero';
import GuestGuideContent from '@/components/guest-guide/GuestGuideContent';

export interface GuestData {
  guestName: string;
  checkin: string;
  checkout: string;
  boxCode: string;
}

const FALLBACK_DATA: GuestData = {
  guestName: 'Gast',
  checkin: '',
  checkout: '',
  boxCode: '– – – –',
};

const GuestGuide = () => {
  const { reservationId } = useParams<{ reservationId?: string }>();
  const [guestData, setGuestData] = useState<GuestData>(FALLBACK_DATA);
  const [loading, setLoading] = useState(!!reservationId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reservationId) return;

    const fetchReservation = async () => {
      try {
        setLoading(true);
        const { data, error: fnError } = await supabase.functions.invoke('get-reservation', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          body: null,
        });

        // supabase.functions.invoke doesn't support query params natively,
        // so we use a direct fetch instead
        const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
        const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

        const res = await fetch(
          `https://${projectId}.supabase.co/functions/v1/get-reservation?reservationId=${reservationId}`,
          {
            headers: {
              'apikey': anonKey,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Fehler beim Laden der Reservierung (${res.status})`);
        }

        const result = await res.json();
        setGuestData({
          guestName: result.guestName || 'Gast',
          checkin: result.checkin || '',
          checkout: result.checkout || '',
          boxCode: '– – – –', // Not available from API, will be set manually
        });
      } catch (err: any) {
        console.error('Failed to fetch reservation:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [reservationId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <img src={logoAchzeit} alt="ACHZEIT" className="w-24 mx-auto mb-6 opacity-40" />
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GuestGuideHero guestData={guestData} />
      <GuestGuideContent guestData={guestData} />

      {/* Footer */}
      <div className="max-w-3xl mx-auto px-6 text-center mt-16 pb-12 pt-8 border-t border-border">
        <img src={logoAchzeit} alt="ACHZEIT" className="w-20 mx-auto mb-3 opacity-30" />
        <p className="text-xs text-muted-foreground">Eure Gästemappe · ACHZEIT im Allgäu</p>
      </div>
    </div>
  );
};

export default GuestGuide;
