import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle } from 'lucide-react';

const KurtaxeDanke = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-alpine-forest/10 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-alpine-forest" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-display text-foreground mb-4">
          {t('kurtaxe.thanksTitle')}
        </h1>

        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
          {t('kurtaxe.thanksMessage')}
        </p>

        <div className="w-16 h-0.5 bg-alpine-stone mx-auto mb-8" />

        <p className="text-muted-foreground text-sm mb-10">
          {t('kurtaxe.confirmationEmail')}
        </p>

        <Button variant="alpine" size="lg" onClick={() => navigate('/')}>
          {t('kurtaxe.backHome')}
        </Button>
      </div>
    </div>
  );
};

export default KurtaxeDanke;
