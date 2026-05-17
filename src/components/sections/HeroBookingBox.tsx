import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const HeroBookingBox = () => {
  const { t } = useLanguage();
  const [guests, setGuests] = useState(2);

  const scrollToAvailability = () => {
    document.querySelector('#availability')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <aside
      className="w-full rounded-2xl border border-border bg-card shadow-medium p-5 md:p-6 lg:sticky lg:top-24"
      aria-label={t('hero.book.title')}
    >
      <p className="font-display text-xl md:text-[1.4rem] leading-snug text-foreground mb-4">
        {t('hero.book.title')}
      </p>

      {/* Date pills */}
      <div className="grid grid-cols-2 rounded-xl border border-border overflow-hidden mb-3">
        <button
          onClick={scrollToAvailability}
          className="text-left px-3.5 py-2.5 border-r border-border hover:bg-muted/40 transition-colors"
        >
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-foreground/80">
            {t('hero.book.checkin')}
          </span>
          <span className="block text-sm text-muted-foreground mt-0.5">
            {t('hero.book.addDate')}
          </span>
        </button>
        <button
          onClick={scrollToAvailability}
          className="text-left px-3.5 py-2.5 hover:bg-muted/40 transition-colors"
        >
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-foreground/80">
            {t('hero.book.checkout')}
          </span>
          <span className="block text-sm text-muted-foreground mt-0.5">
            {t('hero.book.addDate')}
          </span>
        </button>
      </div>

      {/* Guests */}
      <label className="block rounded-xl border border-border px-3.5 py-2.5 mb-4 cursor-pointer hover:bg-muted/40 transition-colors">
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-foreground/80">
          {t('hero.book.guests')}
        </span>
        <select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full bg-transparent text-sm text-foreground outline-none appearance-none cursor-pointer mt-0.5"
        >
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? t('hero.book.guest.one') : t('hero.book.guest.many')}
            </option>
          ))}
        </select>
      </label>

      <Button
        variant="alpine"
        size="lg"
        className="w-full"
        onClick={scrollToAvailability}
      >
        {t('hero.book.cta')}
      </Button>

      <p className="text-[11px] leading-snug text-muted-foreground text-center mt-3">
        {t('hero.book.trust')}
      </p>
    </aside>
  );
};

export default HeroBookingBox;