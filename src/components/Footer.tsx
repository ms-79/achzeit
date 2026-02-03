import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import logoAchzeit from '@/assets/logo-achzeit-transparent.webp';

const Footer = () => {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();

  const legalLinks = [
    { to: '/impressum', label: language === 'de' ? 'Impressum' : 'Legal Notice' },
    { to: '/datenschutz', label: language === 'de' ? 'Datenschutz' : 'Privacy Policy' },
    { to: '/cookies', label: language === 'de' ? 'Cookie-Einstellungen' : 'Cookie Settings' },
    { to: '/buchungsbedingungen', label: language === 'de' ? 'Buchungsbedingungen' : 'Booking Terms' },
  ];

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-6">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-6">
            <Link to="/">
              <img 
                src={logoAchzeit} 
                alt="ACHZEIT" 
                className="h-14 md:h-16 w-auto mx-auto brightness-0 invert hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>

          {/* Tagline */}
          <p className="text-primary-foreground/80 font-light italic mb-8 max-w-md mx-auto">
            "{t('footer.tagline')}"
          </p>

          {/* Legal Links */}
          <nav className="mb-6">
            <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
              {legalLinks.map((link, index) => (
                <li key={link.to} className="flex items-center">
                  <Link 
                    to={link.to}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                  {index < legalLinks.length - 1 && (
                    <span className="ml-4 text-primary-foreground/30">|</span>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Divider */}
          <div className="w-16 h-px bg-primary-foreground/20 mx-auto mb-6" />

          {/* Copyright */}
          <p className="text-sm text-primary-foreground/60">
            © {currentYear} ACHZEIT – Family Retreat. {t('footer.rights')}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
