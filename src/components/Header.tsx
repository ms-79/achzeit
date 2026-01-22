import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import logoAchzeit from '@/assets/logo-achzeit.png';

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'nav.home', href: '#home' },
    { key: 'nav.house', href: '#house' },
    { key: 'nav.gallery', href: '#gallery' },
    { key: 'nav.availability', href: '#availability' },
    { key: 'nav.book', href: '#booking' },
    { key: 'nav.location', href: '#location' },
    { key: 'nav.contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-soft py-3'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => scrollToSection('#home')}
          className="flex items-center"
        >
          <img 
            src={logoAchzeit} 
            alt="ACHZEIT" 
            className={`h-10 md:h-12 w-auto transition-all duration-300 ${
              isScrolled ? '' : 'brightness-0 invert'
            }`}
          />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.filter(item => item.key !== 'nav.book').map((item) => (
            <button
              key={item.key}
              onClick={() => scrollToSection(item.href)}
              className={`text-sm tracking-wide transition-colors duration-300 hover:opacity-70 ${
                isScrolled ? 'text-foreground' : 'text-alpine-snow'
              }`}
            >
              {t(item.key)}
            </button>
          ))}
          
          {/* Language Toggle */}
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={() => setLanguage('de')}
              className={`text-sm px-2 py-1 rounded transition-all ${
                language === 'de'
                  ? isScrolled ? 'bg-primary text-primary-foreground' : 'bg-alpine-snow/20 text-alpine-snow'
                  : isScrolled ? 'text-muted-foreground hover:text-foreground' : 'text-alpine-snow/60 hover:text-alpine-snow'
              }`}
            >
              DE
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`text-sm px-2 py-1 rounded transition-all ${
                language === 'en'
                  ? isScrolled ? 'bg-primary text-primary-foreground' : 'bg-alpine-snow/20 text-alpine-snow'
                  : isScrolled ? 'text-muted-foreground hover:text-foreground' : 'text-alpine-snow/60 hover:text-alpine-snow'
              }`}
            >
              EN
            </button>
          </div>

          {/* Book Button - Always visible */}
          <Button
            onClick={() => scrollToSection('#booking')}
            className="ml-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {t('nav.book')}
          </Button>
        </nav>

        {/* Mobile: Book Button + Menu Button */}
        <div className="lg:hidden flex items-center gap-2">
          <Button
            onClick={() => scrollToSection('#booking')}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {t('nav.book')}
          </Button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 transition-colors ${
              isScrolled ? 'text-foreground' : 'text-alpine-snow'
            }`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-background/98 backdrop-blur-md shadow-medium transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <nav className="container mx-auto px-6 py-6 flex flex-col gap-4">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => scrollToSection(item.href)}
              className="text-left text-foreground py-2 border-b border-border/50 last:border-0"
            >
              {t(item.key)}
            </button>
          ))}
          
          <div className="flex items-center gap-2 pt-4">
            <button
              onClick={() => setLanguage('de')}
              className={`text-sm px-3 py-2 rounded ${
                language === 'de' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              }`}
            >
              Deutsch
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`text-sm px-3 py-2 rounded ${
                language === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              }`}
            >
              English
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
