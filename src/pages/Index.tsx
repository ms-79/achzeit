import { lazy, Suspense } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/sections/HeroSection';
import Footer from '@/components/Footer';
import CookieConsentBanner from '@/components/CookieConsentBanner';

// Lazy load below-the-fold sections for faster initial page load
const HouseSection = lazy(() => import('@/components/sections/HouseSection'));
const GallerySection = lazy(() => import('@/components/sections/GallerySection'));
const AvailabilitySection = lazy(() => import('@/components/sections/AvailabilitySection'));
const ReviewsSection = lazy(() => import('@/components/sections/ReviewsSection'));
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
          <GallerySection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <AvailabilitySection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <ReviewsSection />
        <Suspense fallback={<SectionSkeleton />}>
          <LocationSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <ContactSection />
        </Suspense>
      </main>
      <Footer />
      {/* <CookieConsentBanner /> */}
    </div>
  );
};

export default Index;
