import { lazy, Suspense } from 'react';
import Seo from '@/components/Seo';
import { FAQS } from '@/data/faq';
import Header from '@/components/Header';
import HeroSection from '@/components/sections/HeroSection';
import Footer from '@/components/Footer';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import StickyMobileCTA from '@/components/StickyMobileCTA';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';

// FAQPage structured data — built from the same source as the visible FAQ so the
// markup and on-page content always match (Google requirement for FAQ rich results).
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.de.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

// Lazy load below-the-fold sections for faster initial page load
const WelcomeSection = lazy(() => import('@/components/sections/WelcomeSection'));
const WhySection = lazy(() => import('@/components/sections/WhySection'));
const AudienceSection = lazy(() => import('@/components/sections/AudienceSection'));
const HouseSection = lazy(() => import('@/components/sections/HouseSection'));
const AmenitiesSection = lazy(() => import('@/components/sections/AmenitiesSection'));
const GallerySection = lazy(() => import('@/components/sections/GallerySection'));
const ReviewsSection = lazy(() => import('@/components/sections/ReviewsSection'));
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
      <Seo
        title="ACHZEIT Family & Friends Retreat – Ferienhaus im Allgäu für Familien & Freunde"
        description="Modernes Ferienhaus in Fischen im Allgäu mit Sauna, Kamin, Outdoor-Grill, Garten und Platz für bis zu 7 Gäste. Ideal für Familien, Freunde und Gruppen bis 6 Erwachsene."
        path="/"
        jsonLd={faqJsonLd}
      />
      <Header />
      <main className="relative">
        <HeroSection />
        <div>
          <Suspense fallback={<SectionSkeleton />}>
            <WelcomeSection />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <WhySection />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <AudienceSection />
          </Suspense>
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
            <FaqSection />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <LocationSection />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <ContactSection />
          </Suspense>
        </div>
      </main>
      <Footer />
      <StickyMobileCTA />
      <WhatsAppFloatingButton />
      {/* <CookieConsentBanner /> */}
    </div>
  );
};

export default Index;
