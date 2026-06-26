import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Seo from '@/components/Seo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Cookie, Shield, BarChart3, Megaphone, Cog } from 'lucide-react';
import {
  COOKIE_CATEGORIES,
  CONSENT_STORAGE_KEY,
  type CookieConsent,
} from '@/constants/legal';
import { getStoredConsent } from '@/components/CookieConsentBanner';

const CookieSettings = () => {
  const { language } = useLanguage();
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true,
    functional: false,
    statistics: false,
    marketing: false,
    timestamp: '',
  });

  useEffect(() => {
    // Load stored consent
    const stored = getStoredConsent();
    if (stored) {
      setConsent(stored);
    }
  }, []);

  const saveConsent = (newConsent: CookieConsent) => {
    const consentWithTimestamp = {
      ...newConsent,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentWithTimestamp));
    setConsent(consentWithTimestamp);
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: consentWithTimestamp }));
  };

  const handleSaveSettings = () => {
    saveConsent(consent);
    toast.success(language === 'de' ? 'Einstellungen gespeichert' : 'Settings saved');
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      statistics: true,
      marketing: true,
      timestamp: '',
    };
    saveConsent(allAccepted);
    toast.success(language === 'de' ? 'Alle Cookies akzeptiert' : 'All cookies accepted');
  };

  const handleNecessaryOnly = () => {
    const necessaryOnly = {
      necessary: true,
      functional: false,
      statistics: false,
      marketing: false,
      timestamp: '',
    };
    saveConsent(necessaryOnly);
    toast.success(language === 'de' ? 'Nur notwendige Cookies aktiv' : 'Only necessary cookies active');
  };

  const toggleCategory = (category: keyof Omit<CookieConsent, 'timestamp'>) => {
    if (category === 'necessary') return;
    setConsent(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const categoryIcons = {
    necessary: Shield,
    functional: Cog,
    statistics: BarChart3,
    marketing: Megaphone,
  };

  const t = {
    de: {
      title: 'Cookie-Einstellungen',
      intro: 'Diese Website verwendet Cookies, um Funktionen wie Buchungskalender, Karten und Analyse zu ermöglichen. Sie können Ihre Einwilligung jederzeit anpassen.',
      whatAreCookies: 'Was sind Cookies?',
      whatAreCookiesText: 'Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden. Sie helfen dabei, die Website zu verbessern und bestimmte Funktionen bereitzustellen.',
      categories: 'Cookie-Kategorien',
      required: 'Erforderlich',
      saveSettings: 'Einstellungen speichern',
      acceptAll: 'Alle akzeptieren',
      necessaryOnly: 'Nur notwendige',
      lastUpdated: 'Zuletzt aktualisiert',
      notYetSet: 'Noch nicht festgelegt',
    },
    en: {
      title: 'Cookie Settings',
      intro: 'This website uses cookies to enable features like booking calendar, maps, and analytics. You can adjust your consent at any time.',
      whatAreCookies: 'What are Cookies?',
      whatAreCookiesText: 'Cookies are small text files stored on your device. They help improve the website and provide certain features.',
      categories: 'Cookie Categories',
      required: 'Required',
      saveSettings: 'Save Settings',
      acceptAll: 'Accept All',
      necessaryOnly: 'Necessary Only',
      lastUpdated: 'Last updated',
      notYetSet: 'Not yet set',
    },
  };

  const texts = t[language] || t.de;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Seo title="Cookie-Einstellungen – ACHZEIT" path="/cookies" noindex />
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <Cookie className="w-8 h-8 text-primary" />
            <h1 className="font-display text-3xl md:text-4xl font-light text-foreground">
              {texts.title}
            </h1>
          </div>
          
          <p className="text-foreground/70 mb-8">
            {texts.intro}
          </p>

          {/* What are Cookies */}
          <section className="mb-8 p-6 bg-muted/30 rounded-lg border border-border">
            <h2 className="font-semibold text-foreground mb-2">{texts.whatAreCookies}</h2>
            <p className="text-sm text-foreground/70">{texts.whatAreCookiesText}</p>
          </section>

          {/* Categories */}
          <section className="mb-8">
            <h2 className="font-semibold text-foreground mb-4">{texts.categories}</h2>
            <div className="space-y-4">
              {Object.entries(COOKIE_CATEGORIES).map(([key, category]) => {
                const Icon = categoryIcons[key as keyof typeof categoryIcons];
                const isChecked = consent[key as keyof Omit<CookieConsent, 'timestamp'>];
                
                return (
                  <div 
                    key={category.id}
                    className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg border border-border"
                  >
                    <div className="mt-1">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground">
                          {category.name[language] || category.name.de}
                        </h3>
                        {category.required && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                            {texts.required}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-foreground/60">
                        {category.description[language] || category.description.de}
                      </p>
                    </div>
                    <Switch
                      checked={isChecked}
                      onCheckedChange={() => toggleCategory(key as keyof Omit<CookieConsent, 'timestamp'>)}
                      disabled={category.required}
                      className={category.required ? 'opacity-50' : ''}
                    />
                  </div>
                );
              })}
            </div>
          </section>

          {/* Last Updated */}
          {consent.timestamp && (
            <p className="text-xs text-muted-foreground mb-6">
              {texts.lastUpdated}: {new Date(consent.timestamp).toLocaleString(language === 'de' ? 'de-DE' : 'en-US')}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleSaveSettings} variant="default">
              {texts.saveSettings}
            </Button>
            <Button onClick={handleAcceptAll} variant="outline">
              {texts.acceptAll}
            </Button>
            <Button onClick={handleNecessaryOnly} variant="ghost">
              {texts.necessaryOnly}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookieSettings;
