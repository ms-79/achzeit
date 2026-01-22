import { LanguageProvider } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import HeroSection from '@/components/sections/HeroSection';
import HouseSection from '@/components/sections/HouseSection';
import GallerySection from '@/components/sections/GallerySection';
import AvailabilitySection from '@/components/sections/AvailabilitySection';
import LocationSection from '@/components/sections/LocationSection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroSection />
          <HouseSection />
          <GallerySection />
          <AvailabilitySection />
          <LocationSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default Index;
