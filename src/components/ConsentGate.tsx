import { useState, useEffect, ReactNode } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Shield, ExternalLink } from 'lucide-react';
import { hasConsent, getStoredConsent } from '@/components/CookieConsentBanner';
import { CONSENT_STORAGE_KEY } from '@/constants/legal';
import type { CookieConsent } from '@/constants/legal';

interface ConsentGateProps {
  category: 'functional' | 'statistics' | 'marketing';
  children: ReactNode;
  fallback?: ReactNode;
  providerName?: string;
  providerPrivacyUrl?: string;
}

/**
 * ConsentGate - 2-Klick-Lösung für externe Inhalte
 * 
 * Blockiert externe Inhalte (Maps, Videos, Widgets) bis der Nutzer
 * die entsprechende Cookie-Kategorie akzeptiert hat.
 * 
 * Verwendung:
 * <ConsentGate category="marketing" providerName="Google Maps">
 *   <GoogleMapsEmbed />
 * </ConsentGate>
 */
const ConsentGate = ({
  category,
  children,
  fallback,
  providerName = 'Externer Anbieter',
  providerPrivacyUrl,
}: ConsentGateProps) => {
  const { language } = useLanguage();
  const [hasUserConsent, setHasUserConsent] = useState<boolean>(false);
  const [manuallyEnabled, setManuallyEnabled] = useState(false);

  useEffect(() => {
    // Initial check
    setHasUserConsent(hasConsent(category));

    // Listen for consent updates
    const handleConsentUpdate = (event: CustomEvent<CookieConsent>) => {
      setHasUserConsent(event.detail[category] ?? false);
    };

    window.addEventListener('cookieConsentUpdated', handleConsentUpdate as EventListener);
    
    // Also check on storage changes (for multi-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CONSENT_STORAGE_KEY) {
        setHasUserConsent(hasConsent(category));
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('cookieConsentUpdated', handleConsentUpdate as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [category]);

  // Wenn Consent erteilt oder manuell aktiviert
  if (hasUserConsent || manuallyEnabled) {
    return <>{children}</>;
  }

  // Fallback wenn angegeben
  if (fallback) {
    return <>{fallback}</>;
  }

  // Standard-Platzhalter
  const t = {
    de: {
      title: 'Externer Inhalt',
      description: `Dieser Inhalt wird von ${providerName} bereitgestellt. Beim Laden werden Daten an den Anbieter übertragen.`,
      loadContent: 'Inhalt laden',
      acceptCategory: 'Dauerhaft erlauben',
      privacy: 'Datenschutz',
      categoryLabel: {
        functional: 'Funktionale Cookies',
        statistics: 'Statistik-Cookies',
        marketing: 'Marketing-Cookies',
      },
    },
    en: {
      title: 'External Content',
      description: `This content is provided by ${providerName}. When loaded, data will be transferred to the provider.`,
      loadContent: 'Load Content',
      acceptCategory: 'Always Allow',
      privacy: 'Privacy Policy',
      categoryLabel: {
        functional: 'Functional Cookies',
        statistics: 'Statistics Cookies',
        marketing: 'Marketing Cookies',
      },
    },
  };

  const texts = t[language] || t.de;

  const handleLoadOnce = () => {
    setManuallyEnabled(true);
  };

  const handleAcceptCategory = () => {
    // Update consent in localStorage
    const currentConsent = getStoredConsent() || {
      necessary: true,
      functional: false,
      statistics: false,
      marketing: false,
      timestamp: '',
    };
    
    const newConsent = {
      ...currentConsent,
      [category]: true,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(newConsent));
    setHasUserConsent(true);
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: newConsent }));
  };

  return (
    <div className="relative w-full min-h-[200px] bg-muted/50 border border-border rounded-lg flex items-center justify-center p-6">
      <div className="text-center max-w-md space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        
        <div>
          <h3 className="font-semibold text-foreground mb-2">{texts.title}</h3>
          <p className="text-sm text-muted-foreground">
            {texts.description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadOnce}
          >
            {texts.loadContent}
          </Button>
          <Button
            size="sm"
            onClick={handleAcceptCategory}
          >
            {texts.acceptCategory}
          </Button>
        </div>

        {providerPrivacyUrl && (
          <a
            href={providerPrivacyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            {texts.privacy}
            <ExternalLink className="w-3 h-3" />
          </a>
        )}

        <p className="text-xs text-muted-foreground">
          {language === 'de' ? 'Erfordert:' : 'Requires:'} {texts.categoryLabel[category]}
        </p>
      </div>
    </div>
  );
};

export default ConsentGate;
