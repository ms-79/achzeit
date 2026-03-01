import { useEffect, useState, useRef } from 'react';

import logoAchzeit from '@/assets/logo-achzeit-transparent.webp';
import GuestGuideHero from '@/components/guest-guide/GuestGuideHero';
import GuestGuideStickyNav from '@/components/guest-guide/GuestGuideStickyNav';
import GuestGuideContent from '@/components/guest-guide/GuestGuideContent';
import GuestGuidePinEntry from '@/components/guest-guide/GuestGuidePinEntry';
import GuestGuideChatbot from '@/components/guest-guide/GuestGuideChatbot';
import { GuestGuideLanguageProvider } from '@/components/guest-guide/GuestGuideLanguageContext';
import { useGuestGuideLocale } from '@/components/guest-guide/GuestGuideLanguageContext';
import { mapHostawayLanguage, type GuestGuideLocale } from '@/components/guest-guide/translations';
import { translations } from '@/components/guest-guide/translations';


export interface GuestData {
  guestName: string;
  checkin: string;
  checkout: string;
  boxCode: string;
  wifiPassword: string;
  guestLanguage: GuestGuideLocale;
}

const FALLBACK_DATA: GuestData = {
  guestName: 'Gast',
  checkin: '',
  checkout: '',
  boxCode: '– – – –',
  wifiPassword: '',
  guestLanguage: 'de',
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

const GuestGuideInner = () => {
  const [state, setState] = useState<GuideState>('loading');
  const [guestData, setGuestData] = useState<GuestData>(FALLBACK_DATA);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeSection, setActiveSection] = useState('zugang');
  const { locale, setLocale } = useGuestGuideLocale();

  const warmupPromiseRef = useRef<Promise<void> | null>(null);

  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const baseUrl = `https://${projectId}.supabase.co/functions/v1/reservation`;
  const headers = { apikey: anonKey, 'Content-Type': 'application/json' };

  const applyGuestData = (body: any) => {
    const lang = mapHostawayLanguage(body.guestLanguage);
    setGuestData({
      guestName: body.guestName || 'Gast',
      checkin: body.checkin || '',
      checkout: body.checkout || '',
      boxCode: body.doorCode || '– – – –',
      wifiPassword: body.wifiPassword || '',
      guestLanguage: lang,
    });

    setLocale(lang);

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

      setState('pin');

      warmupPromiseRef.current = fetchWithRetry(baseUrl, { headers })
        .then(() => {})
        .catch(() => {});
    };

    load();
  }, []);

  const handlePinSubmit = async (pin: string) => {
    try {
      const res = await fetchWithRetry(`${baseUrl}?pin=${pin}`, { headers });
      const body = await res.json();

      if (res.ok && body.status === 'ok') {
        setState('loading');
        applyGuestData(body);
      } else if (body.error === 'invalid_pin') {
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
          <h1 className="font-display text-2xl text-foreground mb-3">{translations.noReservationTitle[locale]}</h1>
          <p className="text-muted-foreground text-sm">{translations.noReservationText[locale]}</p>
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <img src={logoAchzeit} alt="ACHZEIT" className="w-24 mx-auto mb-6 opacity-40" />
          <h1 className="font-display text-2xl text-foreground mb-3">{translations.errorTitle[locale]}</h1>
          <p className="text-muted-foreground text-sm">{errorMsg}</p>
        </div>
      </div>
    );
  }

  if (state === 'pin') {
    return <GuestGuidePinEntry onSubmit={handlePinSubmit} />;
  }

  const handleNavClick = (section: string) => {
    setActiveSection(section);
    setTimeout(() => {
      const el = document.getElementById(section);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 56 - 12;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <GuestGuideHero guestData={guestData} onNavClick={handleNavClick} />
      <GuestGuideStickyNav activeSection={activeSection} onNavClick={handleNavClick} />
      <GuestGuideContent guestData={guestData} activeSection={activeSection} onSectionChange={setActiveSection} />

      <GuestGuideChatbot guestData={guestData} />

      <div className="max-w-3xl mx-auto px-6 text-center mt-16 pb-12 pt-8 border-t border-border">
        <img src={logoAchzeit} alt="ACHZEIT" className="w-20 mx-auto mb-3 opacity-30" />
        <p className="text-xs text-muted-foreground">{translations.footerText[locale]}</p>
      </div>
    </div>
  );
};

const GuestGuide = () => {
  return (
    <GuestGuideLanguageProvider>
      <GuestGuideInner />
    </GuestGuideLanguageProvider>
  );
};

export default GuestGuide;
