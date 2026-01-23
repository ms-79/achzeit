import { Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { CONSENT_STORAGE_KEY } from '@/constants/legal';

interface CookieSettingsButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showIcon?: boolean;
  className?: string;
}

/**
 * Button zum Öffnen der Cookie-Einstellungen
 * Löscht den gespeicherten Consent und zeigt das Banner erneut
 */
const CookieSettingsButton = ({
  variant = 'ghost',
  size = 'sm',
  showIcon = true,
  className = '',
}: CookieSettingsButtonProps) => {
  const { language } = useLanguage();

  const handleOpenSettings = () => {
    // Lösche den gespeicherten Consent um das Banner erneut anzuzeigen
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    // Reload um Banner zu triggern
    window.location.reload();
  };

  const label = language === 'de' ? 'Cookie-Einstellungen' : 'Cookie Settings';

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleOpenSettings}
      className={`gap-2 ${className}`}
    >
      {showIcon && <Cookie className="w-4 h-4" />}
      {label}
    </Button>
  );
};

export default CookieSettingsButton;
