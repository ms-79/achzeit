import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/contexts/LanguageContext';

const DatenschutzContent = () => {
  const { language } = useLanguage();

  useEffect(() => {
    // Set noindex meta tag
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow';
    document.head.appendChild(metaRobots);
    
    return () => {
      document.head.removeChild(metaRobots);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="font-display text-3xl md:text-4xl font-light text-foreground mb-4">
            {language === 'de' ? 'Datenschutzerklärung' : 'Privacy Policy'}
          </h1>
          <p className="text-foreground/70 mb-8">
            {language === 'de' 
              ? 'Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst.'
              : 'We take the protection of your personal data very seriously.'}
          </p>

          <div className="prose prose-lg max-w-none text-foreground/80 space-y-8">
            <section>
              <h2 className="font-display text-xl font-medium text-foreground mb-4">
                {language === 'de' ? '1. Verantwortlicher' : '1. Controller'}
              </h2>
              <p className="text-foreground/70">
                M. und M. Siegmann GbR<br />
                Hofheimer Str. 17<br />
                65824 Schwalbach<br />
                E-Mail: markus.siegmann@gmail.com
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-medium text-foreground mb-4">
                {language === 'de' ? '2. Erhebung und Speicherung personenbezogener Daten' : '2. Collection and Storage of Personal Data'}
              </h2>
              <p className="text-foreground/70 mb-4">
                {language === 'de'
                  ? 'Wenn Sie uns kontaktieren oder eine Buchung vornehmen, werden folgende Daten verarbeitet:'
                  : 'When you contact us or make a booking, the following data is processed:'}
              </p>
              <ul className="list-disc list-inside text-foreground/70 space-y-1">
                <li>{language === 'de' ? 'Name' : 'Name'}</li>
                <li>{language === 'de' ? 'E-Mail-Adresse' : 'Email address'}</li>
                <li>{language === 'de' ? 'Telefonnummer' : 'Phone number'}</li>
                <li>{language === 'de' ? 'Reisedaten' : 'Travel dates'}</li>
                <li>{language === 'de' ? 'Zahlungsdaten (über Drittanbieter)' : 'Payment data (via third-party providers)'}</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-medium text-foreground mb-4">
                {language === 'de' ? '3. Weitergabe an Dritte' : '3. Disclosure to Third Parties'}
              </h2>
              <p className="text-foreground/70 mb-4">
                {language === 'de'
                  ? 'Zur Abwicklung der Buchung nutzen wir:'
                  : 'To process bookings, we use:'}
              </p>
              <ul className="list-disc list-inside text-foreground/70 space-y-1">
                <li>{language === 'de' ? 'Hostaway (Buchung & Kalender)' : 'Hostaway (Booking & Calendar)'}</li>
                <li>{language === 'de' ? 'Zahlungsanbieter (z. B. Stripe, PayPal)' : 'Payment providers (e.g., Stripe, PayPal)'}</li>
                <li>{language === 'de' ? 'E-Mail-Dienste' : 'Email services'}</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-medium text-foreground mb-4">
                {language === 'de' ? '4. Cookies & Tracking' : '4. Cookies & Tracking'}
              </h2>
              <p className="text-foreground/70">
                {language === 'de'
                  ? 'Diese Website nutzt Cookies. Externe Inhalte (z. B. Buchungskalender, Karten) werden nur nach Einwilligung geladen. Sie können Ihre Cookie-Einstellungen jederzeit über den entsprechenden Link im Footer anpassen.'
                  : 'This website uses cookies. External content (e.g., booking calendar, maps) is only loaded after consent. You can adjust your cookie settings at any time via the corresponding link in the footer.'}
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-medium text-foreground mb-4">
                {language === 'de' ? '5. Ihre Rechte' : '5. Your Rights'}
              </h2>
              <p className="text-foreground/70 mb-4">
                {language === 'de'
                  ? 'Sie haben das Recht auf:'
                  : 'You have the right to:'}
              </p>
              <ul className="list-disc list-inside text-foreground/70 space-y-1">
                <li>{language === 'de' ? 'Auskunft über Ihre gespeicherten Daten' : 'Information about your stored data'}</li>
                <li>{language === 'de' ? 'Berichtigung unrichtiger Daten' : 'Correction of inaccurate data'}</li>
                <li>{language === 'de' ? 'Löschung Ihrer Daten' : 'Deletion of your data'}</li>
                <li>{language === 'de' ? 'Einschränkung der Verarbeitung' : 'Restriction of processing'}</li>
                <li>{language === 'de' ? 'Datenübertragbarkeit' : 'Data portability'}</li>
                <li>{language === 'de' ? 'Widerruf erteilter Einwilligungen' : 'Withdrawal of given consent'}</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-medium text-foreground mb-4">
                {language === 'de' ? '6. Beschwerderecht' : '6. Right to Complain'}
              </h2>
              <p className="text-foreground/70">
                {language === 'de'
                  ? 'Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Zuständig ist der Landesdatenschutzbeauftragte Ihres Bundeslandes.'
                  : 'You have the right to complain to a data protection supervisory authority. The state data protection officer of your federal state is responsible.'}
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Datenschutz = () => {
  return (
    <LanguageProvider>
      <DatenschutzContent />
    </LanguageProvider>
  );
};

export default Datenschutz;
