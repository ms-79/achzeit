import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import Seo from '@/components/Seo';
import { CheckCircle } from 'lucide-react';
import achzeitLogo from '@/assets/achzeit-logo.png';

const KurbeitragDanke = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <Seo title="Vielen Dank – ACHZEIT" path="/kurbeitrag-danke" noindex />
      <div className="max-w-lg w-full text-center">
        <div className="flex justify-center mb-10">
          <img
            src={achzeitLogo}
            alt="ACHZEIT"
            className="w-40 h-auto mix-blend-multiply"
          />
        </div>

        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-alpine-forest/10 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-alpine-forest" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-display text-foreground mb-4">
          {t('kurbeitrag.thanksTitle')}
        </h1>

        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
          {t('kurbeitrag.thanksMessage')}
        </p>

        <div className="w-16 h-0.5 bg-alpine-stone mx-auto mb-10" />

        <Button variant="alpine" size="lg" onClick={() => navigate('/')}>
          {t('kurbeitrag.backHome')}
        </Button>
      </div>
    </div>
  );
};

export default KurbeitragDanke;