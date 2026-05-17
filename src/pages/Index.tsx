import { lazy, Suspense } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/sections/HeroSection';
import Footer from '@/components/Footer';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import StickyMobileCTA from '@/components/StickyMobileCTA';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';

// Lazy load below-the-fold sections for faster initial page load
const HouseSection = lazy(() => import('@/components/sections/HouseSection'));
const AmenitiesSection = lazy(() => import('@/components/sections/AmenitiesSection'));
const GallerySection = lazy(() => import('@/components/sections/GallerySection'));
const ReviewsSection = lazy(() => import('@/components/sections/ReviewsSection'));
const AvailabilitySection = lazy(() => import('@/components/sections/AvailabilitySection'));
const FaqSection = lazy(() => import('@/components/sections/FaqSection'));
const LocationSection = lazy(() => import('@/components/sections/LocationSection'));
const ContactSection = lazy(() => import('@/components/sections/ContactSection'));

// Simple loading skeleton for sections
const SectionSkeleton = () => (
  <div className="min-h-[50vh] flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <Suspense fallback={<SectionSkeleton />}>
          <HouseSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <AmenitiesSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <GallerySection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <ReviewsSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <AvailabilitySection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <FaqSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <LocationSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <ContactSection />
        </Suspense>
      </main>
      <Footer />
      <StickyMobileCTA />
      <WhatsAppFloatingButton />
      {/* <CookieConsentBanner /> */}
    </div>
  );
};

export default Index;
