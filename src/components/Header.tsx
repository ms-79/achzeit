import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import logoAchzeit from '@/assets/logo-achzeit-transparent.png';

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we're on a subpage (not the homepage)
  const isSubpage = location.pathname !== '/';

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
    { key: 'nav.location', href: '#location' },
    { key: 'nav.contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    setIsMobileMenuOpen(false);
    
    if (isSubpage) {
      // Navigate to homepage with hash
      navigate('/' + href);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const goHome = () => {
    if (isSubpage) {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // On subpages, always show the "scrolled" style
  const showScrolledStyle = isScrolled || isSubpage;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        showScrolledStyle
          ? 'bg-[#f5f0e8]/95 backdrop-blur-md shadow-soft py-3'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo - visible when scrolled or on subpages */}
        {showScrolledStyle ? (
          <button
            onClick={goHome}
            className="flex items-center"
          >
            <img 
              src={logoAchzeit} 
              alt="ACHZEIT" 
              className="h-10 md:h-12 w-auto transition-all duration-300"
            />
          </button>
        ) : (
          <div className="h-10 md:h-12" />
        )}

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.filter(item => item.key !== 'nav.book').map((item) => (
            <button
              key={item.key}
              onClick={() => scrollToSection(item.href)}
              className={`text-sm tracking-wide transition-colors duration-300 hover:opacity-70 ${
                showScrolledStyle ? 'text-foreground' : 'text-alpine-snow'
              }`}
            >
              {t(item.key)}
            </button>
          ))}
          
          {/* Language Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`text-sm px-2 py-1 rounded transition-all flex items-center gap-1 ${
                  showScrolledStyle 
                    ? 'text-foreground hover:bg-muted' 
                    : 'text-alpine-snow hover:bg-alpine-snow/10'
                }`}
              >
                {language.toUpperCase()}
                <ChevronDown size={14} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[80px]">
              <DropdownMenuItem 
                onClick={() => setLanguage('de')}
                className={language === 'de' ? 'bg-muted' : ''}
              >
                Deutsch
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setLanguage('en')}
                className={language === 'en' ? 'bg-muted' : ''}
              >
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Book Button - Always visible */}
          <Button
            onClick={() => scrollToSection('#availability')}
            className="ml-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {t('nav.book')}
          </Button>
        </nav>

        {/* Mobile: Book Button + Menu Button */}
        <div className="lg:hidden flex items-center gap-2">
          <Button
            onClick={() => scrollToSection('#availability')}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {t('nav.book')}
          </Button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 transition-colors ${
              showScrolledStyle ? 'text-foreground' : 'text-alpine-snow'
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
          
          <div className="pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-2">{language === 'de' ? 'Sprache' : 'Language'}</p>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => {
                  setLanguage('de');
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left text-sm px-3 py-2 rounded transition-colors ${
                  language === 'de' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
                }`}
              >
                Deutsch
              </button>
              <button
                onClick={() => {
                  setLanguage('en');
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left text-sm px-3 py-2 rounded transition-colors ${
                  language === 'en' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
