import { useLanguage } from '@/contexts/LanguageContext';
import logoAchzeit from '@/assets/logo-achzeit.png';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-6">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-6">
            <img 
              src={logoAchzeit} 
              alt="ACHZEIT" 
              className="h-14 md:h-16 w-auto mx-auto brightness-0 invert"
            />
          </div>

          {/* Tagline */}
          <p className="text-primary-foreground/80 font-light italic mb-8 max-w-md mx-auto">
            "{t('footer.tagline')}"
          </p>

          {/* Divider */}
          <div className="w-16 h-px bg-primary-foreground/20 mx-auto mb-6" />

          {/* Copyright */}
          <p className="text-sm text-primary-foreground/60">
            © {currentYear} ACHZEIT. {t('footer.rights')}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
