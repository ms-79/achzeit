import { useEffect, useState, useRef } from 'react';

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

const fetchWithRetry = async (url: string, opts: RequestInit, retries = 2): Promise<Response> => {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fetch(url, opts);
    } catch (err) {
      if (i === retries) throw err;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw new Error('Netzwerkfehler');
};

const GuestGuide = () => {
  const [state, setState] = useState<GuideState>('loading');
  const [guestData, setGuestData] = useState<GuestData>(FALLBACK_DATA);
  const [errorMsg, setErrorMsg] = useState('');

  // Store the preloaded warmup promise so the PIN submit can await it
  const warmupPromiseRef = useRef<Promise<void> | null>(null);

  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const baseUrl = `https://${projectId}.supabase.co/functions/v1/reservation`;
  const headers = { apikey: anonKey, 'Content-Type': 'application/json' };

  const applyGuestData = (body: any) => {
    setGuestData({
      guestName: body.guestName || 'Gast',
      checkin: body.checkin || '',
      checkout: body.checkout || '',
      boxCode: body.doorCode || '– – – –',
      wifiPassword: body.wifiPassword || '',
    });

    if (body.reservationId && body.token) {
      window.history.replaceState(null, '', `${window.location.pathname}?t=${body.reservationId}.${body.token}`);
    }

    setState('loaded');
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tParam = params.get('t');
    let reservationId: string | null = null;
    let token: string | null = null;
    if (tParam && tParam.includes('.')) {
      const [id, tok] = tParam.split('.', 2);
      reservationId = id || null;
      token = tok || null;
    }

    const load = async () => {
      // Mode 1: Direct access via reservationId + token
      if (reservationId && token) {
        try {
          const res = await fetchWithRetry(
            `${baseUrl}?reservationId=${reservationId}&token=${token}`,
            { headers },
          );
          const body = await res.json();

          if (res.ok && body.status === 'ok') {
            applyGuestData(body);
            return;
          }
        } catch {
          // Token invalid/expired → fall through to PIN flow
        }
      }

      // No token or token failed → show PIN immediately
      setState('pin');

      // Fire a warmup request in the background (no PIN) to pre-heat
      // the edge function cold start + Hostaway token fetch.
      // The response will be `pin_required` but that's fine – the server
      // will have cached the Hostaway access token for the next call.
      warmupPromiseRef.current = fetchWithRetry(baseUrl, { headers })
        .then(() => {})
        .catch(() => {});
    };

    load();
  }, []);

  const handlePinSubmit = async (pin: string) => {
    setState('loading');

    // Wait for warmup to finish (if still running) so the PIN request
    // hits a warm edge function with a cached Hostaway token
    if (warmupPromiseRef.current) {
      await warmupPromiseRef.current;
      warmupPromiseRef.current = null;
    }

    try {
      const res = await fetchWithRetry(`${baseUrl}?pin=${pin}`, { headers });
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
    } catch {
      setErrorMsg('Verbindungsfehler. Bitte erneut versuchen.');
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
