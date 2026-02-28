import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import logoAchzeit from '@/assets/logo-achzeit-transparent.webp';
import GuestGuideHero from '@/components/guest-guide/GuestGuideHero';
import GuestGuideContent from '@/components/guest-guide/GuestGuideContent';
import GuestGuidePinEntry from '@/components/guest-guide/GuestGuidePinEntry';

export interface GuestData {
  guestName: string;
  checkin: string;
  checkout: string;
  boxCode: string;
  wifiPassword: string;
}

const FALLBACK_DATA: GuestData = {
  guestName: 'Gast',
  checkin: '',
  checkout: '',
  boxCode: '– – – –',
  wifiPassword: '',
};

type GuideState = 'loading' | 'pin' | 'loaded' | 'no_reservation' | 'error';

const GuestGuide = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState<GuideState>('loading');
  const [guestData, setGuestData] = useState<GuestData>(FALLBACK_DATA);
  const [errorMsg, setErrorMsg] = useState('');

  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const baseUrl = `https://${projectId}.supabase.co/functions/v1/reservation`;

  const applyGuestData = (body: any) => {
    setGuestData({
      guestName: body.guestName || 'Gast',
      checkin: body.checkin || '',
      checkout: body.checkout || '',
      boxCode: body.doorCode || '– – – –',
      wifiPassword: body.wifiPassword || '',
    });

    // Persist token in URL so the guest can bookmark/share the direct link
    if (body.reservationId && body.token) {
      setSearchParams({ reservationId: body.reservationId, token: body.token }, { replace: true });
    }

    setState('loaded');
  };

  useEffect(() => {
    if (!slug) return;

    // Support format: ?RESID.TOKEN (single query key with dot separator)
    const rawQuery = window.location.search.replace('?', '');
    let reservationId: string | null = null;
    let token: string | null = null;
    if (rawQuery.includes('.')) {
      const [id, tok] = rawQuery.split('.', 2);
      reservationId = id || null;
      token = tok || null;
    }

    const load = async () => {
      try {
        // Mode 1: Direct access via reservationId + token
        if (reservationId && token) {
          const res = await fetch(
            `${baseUrl}?slug=${slug}&reservationId=${reservationId}&token=${token}`,
            { headers: { apikey: anonKey, 'Content-Type': 'application/json' } },
          );
          const body = await res.json();

          if (res.ok && body.status === 'ok') {
            applyGuestData(body);
            return;
          }
          // Token invalid/expired → fall through to PIN flow
        }

        // Mode 2: Check for active reservation → PIN
        const res = await fetch(
          `${baseUrl}?slug=${slug}`,
          { headers: { apikey: anonKey, 'Content-Type': 'application/json' } },
        );
        const body = await res.json();

        if (res.ok && body.status === 'pin_required') {
          setState('pin');
        } else if (body.error === 'no_active_reservation') {
          setState('no_reservation');
        } else {
          setErrorMsg(body.message || body.error || 'Unbekannter Fehler');
          setState('error');
        }
      } catch (err: any) {
        setErrorMsg(err.message);
        setState('error');
      }
    };

    load();
  }, [slug]);

  const handlePinSubmit = async (pin: string) => {
    setState('loading');
    try {
      const res = await fetch(
        `${baseUrl}?slug=${slug}&pin=${pin}`,
        { headers: { apikey: anonKey, 'Content-Type': 'application/json' } },
      );
      const body = await res.json();

      if (res.ok && body.status === 'ok') {
        applyGuestData(body);
      } else if (body.error === 'invalid_pin') {
        setState('pin');
        return 'invalid';
      } else {
        setErrorMsg(body.message || body.error || 'Fehler');
        setState('error');
      }
    } catch (err: any) {
      setErrorMsg(err.message);
      setState('error');
    }
    return 'ok';
  };

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <img src={logoAchzeit} alt="ACHZEIT" className="w-24 mx-auto mb-6 opacity-40" />
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (state === 'no_reservation') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <img src={logoAchzeit} alt="ACHZEIT" className="w-24 mx-auto mb-6 opacity-40" />
          <h1 className="font-display text-2xl text-foreground mb-3">Aktuell kein aktiver Aufenthalt</h1>
          <p className="text-muted-foreground text-sm">
            Die digitale Gästemappe ist nur während eures Aufenthalts verfügbar.
          </p>
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <img src={logoAchzeit} alt="ACHZEIT" className="w-24 mx-auto mb-6 opacity-40" />
          <h1 className="font-display text-2xl text-foreground mb-3">Fehler</h1>
          <p className="text-muted-foreground text-sm">{errorMsg}</p>
        </div>
      </div>
    );
  }

  if (state === 'pin') {
    return <GuestGuidePinEntry onSubmit={handlePinSubmit} />;
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
