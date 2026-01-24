import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/contexts/LanguageContext';

const BuchungsbedingungenContent = () => {
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
          <h1 className="font-display text-3xl md:text-4xl font-light text-foreground mb-8">
            {language === 'de' ? 'Buchungsbedingungen' : 'Booking Terms'}
          </h1>

          <div className="prose prose-lg max-w-none text-foreground/80 space-y-8">
            <section>
              <h2 className="font-display text-xl font-medium text-foreground mb-4">
                {language === 'de' ? 'Buchung & Zahlung' : 'Booking & Payment'}
              </h2>
              <p className="text-foreground/70">
                {language === 'de'
                  ? 'Die Buchung wird mit Erhalt der Buchungsbestätigung verbindlich. Der Gesamtbetrag (100%) ist bei Buchung fällig.'
                  : 'The booking becomes binding upon receipt of the booking confirmation. The full amount (100%) is due upon booking.'}
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-medium text-foreground mb-4">
                {language === 'de' ? 'Stornierung' : 'Cancellation'}
              </h2>
              <ul className="list-none space-y-2 text-foreground/70">
                <li>
                  <strong>{language === 'de' ? 'Bis 30 Tage vor Anreise:' : 'Up to 30 days before arrival:'}</strong>{' '}
                  {language === 'de' ? 'Kostenfreie Stornierung' : 'Free cancellation'}
                </li>
                <li>
                  <strong>{language === 'de' ? '29–14 Tage vor Anreise:' : '29–14 days before arrival:'}</strong>{' '}
                  {language === 'de' ? '50% des Gesamtbetrags' : '50% of the total amount'}
                </li>
                <li>
                  <strong>{language === 'de' ? 'Ab 13 Tage vor Anreise:' : 'From 13 days before arrival:'}</strong>{' '}
                  {language === 'de' ? '100% des Gesamtbetrags' : '100% of the total amount'}
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-medium text-foreground mb-4">
                {language === 'de' ? 'An- und Abreise' : 'Check-in & Check-out'}
              </h2>
              <ul className="list-none space-y-2 text-foreground/70">
                <li>
                  <strong>Check-in:</strong>{' '}
                  {language === 'de' ? 'Ab 16:00 Uhr' : 'From 4:00 PM'}
                </li>
                <li>
                  <strong>Check-out:</strong>{' '}
                  {language === 'de' ? 'Bis 11:00 Uhr' : 'Until 11:00 AM'}
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-medium text-foreground mb-4">
                {language === 'de' ? 'Hausregeln' : 'House Rules'}
              </h2>
              <ul className="list-disc list-inside text-foreground/70 space-y-1">
                <li>{language === 'de' ? 'Rauchverbot im gesamten Haus' : 'No smoking in the entire house'}</li>
                <li>{language === 'de' ? 'Keine Partys oder lauten Veranstaltungen' : 'No parties or loud events'}</li>
                <li>{language === 'de' ? 'Keine Haustiere erlaubt' : 'No pets allowed'}</li>
                <li>{language === 'de' ? 'Ruhezeiten von 22:00 bis 07:00 Uhr' : 'Quiet hours from 10:00 PM to 7:00 AM'}</li>
              </ul>
            </section>


            <section>
              <h2 className="font-display text-xl font-medium text-foreground mb-4">
                {language === 'de' ? 'Haftung' : 'Liability'}
              </h2>
              <p className="text-foreground/70">
                {language === 'de'
                  ? 'Die Nutzung des Ferienhauses und aller Einrichtungen erfolgt auf eigene Gefahr. Der Vermieter haftet nicht für Unfälle, Verletzungen oder Schäden, die durch unsachgemäße Nutzung entstehen.'
                  : 'The use of the holiday home and all facilities is at your own risk. The landlord is not liable for accidents, injuries, or damage caused by improper use.'}
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-medium text-foreground mb-4">
                {language === 'de' ? 'Schlussbestimmungen' : 'Final Provisions'}
              </h2>
              <p className="text-foreground/70">
                {language === 'de'
                  ? 'Es gilt deutsches Recht. Gerichtsstand ist Kempten (Allgäu). Sollten einzelne Bestimmungen dieser Bedingungen unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.'
                  : 'German law applies. The place of jurisdiction is Kempten (Allgäu). Should individual provisions of these terms be invalid, the validity of the remaining provisions shall remain unaffected.'}
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Buchungsbedingungen = () => {
  return (
    <LanguageProvider>
      <BuchungsbedingungenContent />
    </LanguageProvider>
  );
};

export default Buchungsbedingungen;
