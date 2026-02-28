import { useEffect, useRef } from 'react';
import {
  Key,
  Wifi,
  Baby,
  Flame,
  Trash2,
  AlertTriangle,
  UtensilsCrossed,
  Mountain,
  Zap,
  ShoppingCart,
} from 'lucide-react';

const navItems = [
  { icon: Key, label: 'Zugang', target: 'zugang' },
  { icon: Wifi, label: 'WLAN', target: 'wlan' },
  { icon: Baby, label: 'Familie', target: 'familie' },
  { icon: Flame, label: 'Sauna', target: 'sauna' },
  { icon: UtensilsCrossed, label: 'Restaurants', target: 'restaurants' },
  { icon: ShoppingCart, label: 'Einkaufen', target: 'einkaufen' },
  { icon: Mountain, label: 'Ausflüge', target: 'ausfluege' },
  { icon: Zap, label: 'E-Auto', target: 'e-auto' },
  { icon: Trash2, label: 'Check-out', target: 'checkout' },
  { icon: AlertTriangle, label: 'Notfall', target: 'notfall' },
];

const NAV_HEIGHT = 56;

interface Props {
  activeSection: string;
  onNavClick: (section: string) => void;
}

const GuestGuideStickyNav = ({ activeSection, onNavClick }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Auto-scroll the nav strip so the active button is visible
  useEffect(() => {
    const btn = buttonRefs.current.get(activeSection);
    if (btn && scrollRef.current) {
      const container = scrollRef.current;
      const scrollLeft = btn.offsetLeft - container.clientWidth / 2 + btn.clientWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeSection]);

  return (
    <nav
      className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border/60"
      style={{ height: NAV_HEIGHT }}
    >
      <div
        ref={scrollRef}
        className="flex items-center gap-2 px-4 h-full overflow-x-auto scrollbar-hide mx-auto max-w-[56rem]"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
      >
        {navItems.map((item) => {
          const isActive = activeSection === item.target;
          return (
            <button
              key={item.target}
              ref={(el) => {
                if (el) buttonRefs.current.set(item.target, el);
              }}
              onClick={() => onNavClick(item.target)}
              className={`
                flex items-center gap-1.5 whitespace-nowrap shrink-0
                px-3.5 py-2 rounded-full text-sm font-medium
                border transition-colors duration-200
                ${
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-foreground/30'
                }
              `}
            >
              <item.icon size={14} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default GuestGuideStickyNav;
