import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { X, Settings, Cookie } from 'lucide-react';
import {
  COOKIE_CATEGORIES,
  DEFAULT_CONSENT,
  CONSENT_STORAGE_KEY,
  type CookieConsent,
} from '@/constants/legal';

// Hilfsfunktion zum Prüfen ob Consent erteilt wurde
export const getStoredConsent = (): CookieConsent | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

// Hilfsfunktion zum Prüfen einer bestimmten Kategorie
export const hasConsent = (category: keyof Omit<CookieConsent, 'timestamp'>): boolean => {
  const consent = getStoredConsent();
  if (!consent) return category === 'necessary';
  return consent[category] ?? false;
};

const CookieConsentBanner = () => {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>(DEFAULT_CONSENT);

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      // Kurze Verzögerung für bessere UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
    setConsent(stored);
  }, []);

  const saveConsent = (newConsent: CookieConsent) => {
    const consentWithTimestamp = {
      ...newConsent,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentWithTimestamp));
    setConsent(consentWithTimestamp);
    setIsVisible(false);
    
    // Dispatch custom event für andere Komponenten
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: consentWithTimestamp }));
  };

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      functional: true,
      statistics: true,
      marketing: true,
      timestamp: '',
    });
  };

  const acceptNecessary = () => {
    saveConsent(DEFAULT_CONSENT);
  };

  const saveCustom = () => {
    saveConsent(consent);
  };

  const toggleCategory = (category: keyof Omit<CookieConsent, 'timestamp'>) => {
    if (category === 'necessary') return; // Notwendige können nicht deaktiviert werden
    setConsent(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  if (!isVisible) return null;

  const t = {
    de: {
      title: 'Cookie-Einstellungen',
      description: 'Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten. Sie können wählen, welche Cookies Sie zulassen möchten.',
      acceptAll: 'Alle akzeptieren',
      acceptNecessary: 'Nur notwendige',
      settings: 'Einstellungen',
      save: 'Auswahl speichern',
      moreInfo: 'Mehr erfahren',
    },
    en: {
      title: 'Cookie Settings',
      description: 'We use cookies to provide you with the best possible experience on our website. You can choose which cookies you want to allow.',
      acceptAll: 'Accept All',
      acceptNecessary: 'Necessary Only',
      settings: 'Settings',
      save: 'Save Selection',
      moreInfo: 'Learn More',
    },
  };

  const texts = t[language] || t.de;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center p-4 pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 pointer-events-auto"
        onClick={() => {}} // Verhindert Schließen durch Klick außerhalb
      />
      
      {/* Banner */}
      <div className="relative w-full max-w-2xl bg-background border border-border rounded-xl shadow-2xl pointer-events-auto mb-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Cookie className="w-6 h-6 text-primary" />
          <h2 className="text-lg font-semibold text-foreground flex-1">
            {texts.title}
          </h2>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          <p className="text-sm text-muted-foreground">
            {texts.description}
          </p>

          {/* Details Toggle */}
          {showDetails && (
            <div className="space-y-3 pt-2">
              {Object.values(COOKIE_CATEGORIES).map((category) => (
                <div
                  key={category.id}
                  className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                >
                  <Switch
                    checked={consent[category.id as keyof Omit<CookieConsent, 'timestamp'>]}
                    onCheckedChange={() => toggleCategory(category.id as keyof Omit<CookieConsent, 'timestamp'>)}
                    disabled={category.required}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-foreground">
                        {category.name[language] || category.name.de}
                      </span>
                      {category.required && (
                        <span className="text-xs text-muted-foreground">
                          ({language === 'de' ? 'Erforderlich' : 'Required'})
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {category.description[language] || category.description.de}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Link to Cookie Page */}
          <a
            href="/cookies"
            className="text-xs text-primary hover:underline inline-block"
          >
            {texts.moreInfo} →
          </a>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex flex-wrap gap-2 justify-end">
            {!showDetails ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetails(true)}
                  className="gap-2"
                >
                  <Settings className="w-4 h-4" />
                  {texts.settings}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={acceptNecessary}
                >
                  {texts.acceptNecessary}
                </Button>
                <Button
                  size="sm"
                  onClick={acceptAll}
                >
                  {texts.acceptAll}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                >
                  ← {language === 'de' ? 'Zurück' : 'Back'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={acceptNecessary}
                >
                  {texts.acceptNecessary}
                </Button>
                <Button
                  size="sm"
                  onClick={saveCustom}
                >
                  {texts.save}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
