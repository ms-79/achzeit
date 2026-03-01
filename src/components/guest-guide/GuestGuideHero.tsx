import { motion } from 'framer-motion';
import {
  Key, Wifi, Baby, Flame, Trash2, AlertTriangle,
  UtensilsCrossed, Mountain, Zap, ShoppingCart, MessageCircle,
} from 'lucide-react';
import logoAchzeit from '@/assets/logo-achzeit-transparent.webp';
import type { GuestData } from '@/pages/GuestGuide';
import GuestGuideLanguageToggle from './GuestGuideLanguageToggle';
import { useGuestGuideLocale } from './GuestGuideLanguageContext';
import { translations } from './translations';

interface Props {
  guestData: GuestData;
  onNavClick?: (section: string) => void;
}

const GuestGuideHero = ({ guestData, onNavClick }: Props) => {
  const { guestName, checkin, checkout } = guestData;
  const { locale } = useGuestGuideLocale();
  const t = translations;

  const quickActions = [
    { icon: Key, label: t.navZugang[locale], target: 'zugang' },
    { icon: Wifi, label: t.navWlan[locale], target: 'wlan' },
    { icon: Baby, label: t.navFamilie[locale], target: 'familie' },
    { icon: Flame, label: t.navSauna[locale], target: 'sauna' },
    { icon: ShoppingCart, label: t.navEinkaufen[locale], target: 'einkaufen' },
    { icon: UtensilsCrossed, label: t.navRestaurants[locale], target: 'restaurants' },
    { icon: Mountain, label: t.navAusfluege[locale], target: 'ausfluege' },
    { icon: Zap, label: t.navEAuto[locale], target: 'e-auto' },
    { icon: Trash2, label: t.navCheckout[locale], target: 'checkout' },
    { icon: AlertTriangle, label: t.navNotfall[locale], target: 'notfall' },
  ];

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '–';
    const d = new Date(dateStr);
    const loc = locale === 'de' ? 'de-DE' : locale === 'en' ? 'en-GB' : locale === 'es' ? 'es-ES' : locale === 'it' ? 'it-IT' : locale === 'fr' ? 'fr-FR' : 'nl-NL';
    const weekday = d.toLocaleDateString(loc, { weekday: 'short' }).replace('.', '');
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${weekday}, ${day}.${month}.${year}`;
  };

  return (
    <section className="relative bg-alpine-charcoal text-alpine-snow py-16 md:py-24 px-6">
      {/* Language Toggle - top right */}
      <div className="absolute top-4 right-4 z-10">
        <GuestGuideLanguageToggle />
      </div>

      <div className="max-w-3xl mx-auto text-center">
        <motion.img
          src={logoAchzeit}
          alt="ACHZEIT"
          className="w-28 md:w-36 mx-auto mb-8 brightness-0 invert opacity-80"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 0.6 }}
        />

        <motion.h1
          className="font-display text-4xl md:text-5xl lg:text-6xl mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {t.welcome[locale]} {guestName}
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-alpine-snow/70 mb-6 tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {t.heroSubtitle[locale]}
        </motion.p>

        {checkin && checkout && (
          <motion.div
            className="inline-block bg-alpine-snow/10 backdrop-blur-sm rounded-lg px-6 py-3 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-sm text-alpine-snow/60 uppercase tracking-widest mb-1">{t.stay[locale]}</p>
            <p className="text-alpine-snow/90 font-medium">
              {formatDate(checkin)} – {formatDate(checkout)}
            </p>
          </motion.div>
        )}

        <motion.p
          className="text-alpine-snow/60 max-w-xl mx-auto text-sm md:text-base leading-relaxed mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {t.heroIntro[locale]}
        </motion.p>

        {/* Quick Actions */}
        <motion.div
          className="flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {quickActions.map((action) => (
            <button
              key={action.target}
              onClick={() => onNavClick?.(action.target)}
              className="flex items-center gap-2 bg-alpine-snow/10 hover:bg-alpine-snow/20 text-alpine-snow/80 hover:text-alpine-snow px-4 py-2.5 rounded-lg text-sm transition-all duration-200"
            >
              <action.icon size={16} />
              <span>{action.label}</span>
            </button>
          ))}
        </motion.div>

        {/* WhatsApp Button */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <a
            href="https://wa.me/4915679656368"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebe57] text-white font-medium px-6 py-3.5 rounded-lg transition-colors duration-200"
          >
            <MessageCircle size={20} />
            <span>{t.whatsappCta[locale]}</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default GuestGuideHero;
