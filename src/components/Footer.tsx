import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { MessageCircle, MapPin } from 'lucide-react';
import logoAchzeit from '@/assets/logo-achzeit-transparent.webp';
import { buildWhatsAppUrl, WHATSAPP_DISPLAY } from '@/lib/whatsapp';

const Footer = () => {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { href: '/#house', label: t('nav.house') },
    { href: '/#amenities', label: t('nav.amenities') },
    { href: '/#gallery', label: t('nav.gallery') },
    { href: '/#location', label: t('nav.location') },
    { href: '/#availability', label: t('nav.availability') },
    { href: '/#faq', label: t('nav.faq') },
    { href: '/#contact', label: t('nav.contact') },
  ];

  const legalLinks = [
    { to: '/impressum', label: language === 'de' ? 'Impressum' : 'Legal Notice' },
    { to: '/datenschutz', label: language === 'de' ? 'Datenschutz' : 'Privacy Policy' },
    { to: '/buchungsbedingungen', label: t('footer.legal.agb') },
    { to: '/cookies', label: language === 'de' ? 'Cookie-Einstellungen' : 'Cookie Settings' },
  ];

  return (
    <footer className="bg-alpine-pine text-alpine-snow">
      <div className="container mx-auto px-6 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link to="/">
              <img
                src={logoAchzeit}
                alt="ACHZEIT"
                className="h-14 w-auto brightness-0 invert hover:opacity-80 transition-opacity"
              />
            </Link>
            <p className="mt-4 font-display text-xl text-alpine-snow">ACHZEIT Family Retreat</p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-alpine-snow/70">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {t('footer.location')}
            </p>
            <p className="mt-4 max-w-xs text-sm italic text-alpine-snow/70">
              "{t('footer.tagline')}"
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-display text-lg text-alpine-snow mb-4">{t('footer.nav')}</h3>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-alpine-snow/70 hover:text-alpine-snow transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / Booking */}
          <div>
            <h3 className="font-display text-lg text-alpine-snow mb-4">{t('footer.contact')}</h3>
            <div className="flex flex-col gap-3 text-sm">
              <a
                href="/#availability"
                className="inline-flex items-center justify-center rounded-full bg-alpine-gold px-5 py-2.5 font-medium text-alpine-gold-foreground hover:bg-alpine-gold/90 transition-colors w-fit"
              >
                {t('footer.book')}
              </a>
              <a
                href={buildWhatsAppUrl(t('whatsapp.prefill'))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-alpine-snow/80 hover:text-alpine-snow transition-colors"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                {t('footer.whatsapp')} · {WHATSAPP_DISPLAY}
              </a>
              <a
                href="mailto:info@achzeit.de"
                className="text-alpine-snow/80 hover:text-alpine-snow transition-colors"
              >
                info@achzeit.de
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-alpine-snow/15 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-sm text-alpine-snow/60">
            © {currentYear} ACHZEIT – Family Retreat. {t('footer.rights')}.
          </p>
          <nav>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {legalLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-alpine-snow/60 hover:text-alpine-snow transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
