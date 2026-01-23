import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const CookieSettingsContent = () => {
  const { language } = useLanguage();
  const [necessary, setNecessary] = useState(true);
  const [functional, setFunctional] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  const handleSaveSettings = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true,
      functional,
      analytics,
      timestamp: new Date().toISOString()
    }));
    toast.success(language === 'de' ? 'Einstellungen gespeichert' : 'Settings saved');
  };

  const handleAcceptAll = () => {
    setFunctional(true);
    setAnalytics(true);
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true,
      functional: true,
      analytics: true,
      timestamp: new Date().toISOString()
    }));
    toast.success(language === 'de' ? 'Alle Cookies akzeptiert' : 'All cookies accepted');
  };

  const handleNecessaryOnly = () => {
    setFunctional(false);
    setAnalytics(false);
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true,
      functional: false,
      analytics: false,
      timestamp: new Date().toISOString()
    }));
    toast.success(language === 'de' ? 'Nur notwendige Cookies aktiv' : 'Only necessary cookies active');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="font-display text-3xl md:text-4xl font-light text-foreground mb-4">
            {language === 'de' ? 'Cookie-Einstellungen' : 'Cookie Settings'}
          </h1>
          <p className="text-foreground/70 mb-8">
            {language === 'de'
              ? 'Diese Website verwendet Cookies, um Funktionen wie Buchungskalender, Karten und Analyse zu ermöglichen. Sie können Ihre Einwilligung jederzeit anpassen.'
              : 'This website uses cookies to enable features like booking calendar, maps, and analytics. You can adjust your consent at any time.'}
          </p>

          <div className="space-y-6 mb-8">
            {/* Necessary Cookies */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
              <div>
                <h3 className="font-medium text-foreground">
                  {language === 'de' ? 'Notwendige Cookies' : 'Necessary Cookies'}
                </h3>
                <p className="text-sm text-foreground/60">
                  {language === 'de'
                    ? 'Diese Cookies sind für den Betrieb der Website erforderlich.'
                    : 'These cookies are required for the website to function.'}
                </p>
              </div>
              <Switch checked={necessary} disabled className="opacity-50" />
            </div>

            {/* Functional Cookies */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
              <div>
                <h3 className="font-medium text-foreground">
                  {language === 'de' ? 'Funktionale Cookies' : 'Functional Cookies'}
                </h3>
                <p className="text-sm text-foreground/60">
                  {language === 'de'
                    ? 'Für Buchungskalender, Karten und externe Dienste.'
                    : 'For booking calendar, maps, and external services.'}
                </p>
              </div>
              <Switch checked={functional} onCheckedChange={setFunctional} />
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
              <div>
                <h3 className="font-medium text-foreground">
                  {language === 'de' ? 'Analyse-Cookies' : 'Analytics Cookies'}
                </h3>
                <p className="text-sm text-foreground/60">
                  {language === 'de'
                    ? 'Helfen uns, die Website zu verbessern.'
                    : 'Help us improve the website.'}
                </p>
              </div>
              <Switch checked={analytics} onCheckedChange={setAnalytics} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleSaveSettings} variant="default">
              {language === 'de' ? 'Einstellungen speichern' : 'Save Settings'}
            </Button>
            <Button onClick={handleAcceptAll} variant="outline">
              {language === 'de' ? 'Alle akzeptieren' : 'Accept All'}
            </Button>
            <Button onClick={handleNecessaryOnly} variant="ghost">
              {language === 'de' ? 'Nur notwendige' : 'Necessary Only'}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const CookieSettings = () => {
  return (
    <LanguageProvider>
      <CookieSettingsContent />
    </LanguageProvider>
  );
};

export default CookieSettings;
