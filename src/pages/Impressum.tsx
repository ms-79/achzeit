import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/contexts/LanguageContext';

const ImpressumContent = () => {
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
            {language === 'de' ? 'Impressum' : 'Legal Notice'}
          </h1>

          <div className="prose prose-lg max-w-none text-foreground/80 space-y-8">
            <section>
              <h2 className="font-display text-xl font-medium text-foreground mb-4">
                {language === 'de' ? 'Angaben gemäß § 5 TMG' : 'Information according to § 5 TMG'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-foreground mb-2">
                    {language === 'de' ? 'Anbieter' : 'Provider'}
                  </h3>
                  <p className="text-foreground/70">
                    M. und M. Siegmann GbR<br />
                    Hofheimer Str. 17<br />
                    65824 Schwalbach<br />
                    Deutschland
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-foreground mb-2">
                    {language === 'de' ? 'Vertreten durch' : 'Represented by'}
                  </h3>
                  <p className="text-foreground/70">
                    Markus Siegmann
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-foreground mb-2">
                    {language === 'de' ? 'Kontakt' : 'Contact'}
                  </h3>
                  <p className="text-foreground/70">
                    E-Mail: info@achzeit.de
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-foreground mb-2">
                    {language === 'de' ? 'Rechtsform' : 'Legal Form'}
                  </h3>
                  <p className="text-foreground/70">
                    {language === 'de' ? 'Gesellschaft bürgerlichen Rechts (GbR)' : 'Civil law partnership (GbR)'}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-foreground mb-2">
                    {language === 'de' ? 'Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV' : 'Responsible for content according to § 18 para. 2 MStV'}
                  </h3>
                  <p className="text-foreground/70">
                    Markus Siegmann<br />
                    Hofheimer Str. 17<br />
                    65824 Schwalbach
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-medium text-foreground mb-4">
                {language === 'de' ? 'Haftung für Inhalte' : 'Liability for Content'}
              </h2>
              <p className="text-foreground/70">
                {language === 'de' 
                  ? 'Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.'
                  : 'As a service provider, we are responsible for our own content on these pages in accordance with § 7 para. 1 TMG under general laws. However, according to §§ 8 to 10 TMG, we as a service provider are not obliged to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.'}
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-medium text-foreground mb-4">
                {language === 'de' ? 'Haftung für Links' : 'Liability for Links'}
              </h2>
              <p className="text-foreground/70">
                {language === 'de'
                  ? 'Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.'
                  : 'Our website contains links to external third-party websites over whose content we have no influence. Therefore, we cannot accept any liability for this external content. The respective provider or operator of the pages is always responsible for the content of the linked pages.'}
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Impressum = () => {
  return (
    <LanguageProvider>
      <ImpressumContent />
    </LanguageProvider>
  );
};

export default Impressum;
