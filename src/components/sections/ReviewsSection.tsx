import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ScrollReveal from '@/components/ScrollReveal';
import { Star, Quote } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Review {
  id: number;
  reviewerName: string;
  rating: number;
  review: string;
  submittedAt: string;
  arrivalDate: string;
  departureDate: string;
}

const ReviewsSection = () => {
  const { language } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Review | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('reviews', {
          body: { locale: language },
        });
        if (error) throw error;
        setReviews(data.reviews || []);
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [language]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    // Hostaway uses 0-10 scale, convert to 5 stars
    const stars = Math.round(rating / 2);
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < stars ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6">
          <div className="flex justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) return null;

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <section id="reviews" className="section-padding bg-background">
      <div className="container mx-auto px-6">
        <ScrollReveal className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            {language === 'de' ? 'Gästebewertungen' : 'Guest Reviews'}
          </h2>
          <p className="text-lg text-muted-foreground tracking-wide">
            {language === 'de' ? 'Was unsere Gäste sagen' : 'What our guests say'}
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            {renderStars(avgRating)}
            <span className="text-foreground font-medium">
              {(avgRating / 2).toFixed(1)}
            </span>
            <span className="text-muted-foreground text-sm">
              ({reviews.length} {language === 'de' ? 'Bewertungen' : 'reviews'})
            </span>
          </div>
          <div className="alpine-divider mt-6" />
        </ScrollReveal>

        <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <ScrollReveal key={review.id} delay={index * 0.1}>
              <div className="bg-card rounded-lg border border-border/50 p-6 shadow-sm h-full flex flex-col">
                <Quote className="w-6 h-6 text-primary/30 mb-3 shrink-0" />
                <p
                  className="text-foreground/80 text-sm leading-relaxed flex-1 mb-2 overflow-hidden"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 7,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  "{review.review}"
                </p>
                <button
                  type="button"
                  onClick={() => setActive(review)}
                  className="text-xs font-medium text-primary hover:underline self-start mb-4"
                >
                  {language === 'de' ? 'Mehr lesen' : 'Read more'}
                </button>
                <div className="border-t border-border/30 pt-4 mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground text-sm">
                      {review.reviewerName}
                    </span>
                    <span className="flex items-center gap-1.5">
                      {renderStars(review.rating)}
                      <span className="text-xs font-medium text-foreground tabular-nums">
                        {(review.rating / 2).toFixed(1).replace('.', ',')}
                      </span>
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 block">
                    {formatDate(review.submittedAt)}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card">
            {active && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between gap-4 font-display text-2xl pr-8">
                    <span>{active.reviewerName}</span>
                    <span className="flex items-center gap-2 mr-2">
                      {renderStars(active.rating)}
                      <span className="text-sm font-medium text-foreground tabular-nums">
                        {(active.rating / 2).toFixed(1).replace('.', ',')}
                      </span>
                    </span>
                  </DialogTitle>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(active.submittedAt)}
                  </span>
                </DialogHeader>
                <Quote className="w-6 h-6 text-primary/30" />
                <p className="text-foreground/85 text-sm leading-relaxed whitespace-pre-line">
                  "{active.review}"
                </p>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default ReviewsSection;
