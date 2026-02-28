import { useEffect, useRef, useState, useCallback } from 'react';
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

const GuestGuideStickyNav = () => {
  const [activeSection, setActiveSection] = useState('zugang');
  const scrollRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Track active section via IntersectionObserver
  useEffect(() => {
    const ids = navItems.map((n) => n.target);
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: `-${NAV_HEIGHT + 8}px 0px -60% 0px`,
        threshold: 0,
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Auto-scroll the nav strip so the active button is visible
  useEffect(() => {
    const btn = buttonRefs.current.get(activeSection);
    if (btn && scrollRef.current) {
      const container = scrollRef.current;
      const scrollLeft = btn.offsetLeft - container.clientWidth / 2 + btn.clientWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeSection]);

  const handleClick = useCallback((target: string) => {
    const el = document.getElementById(target);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  return (
    <nav
      className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border/60"
      style={{ height: NAV_HEIGHT }}
    >
      <div
        ref={scrollRef}
        className="flex items-center gap-2 px-4 h-full overflow-x-auto scrollbar-hide max-w-3xl mx-auto"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {navItems.map((item) => {
          const isActive = activeSection === item.target;
          return (
            <button
              key={item.target}
              ref={(el) => {
                if (el) buttonRefs.current.set(item.target, el);
              }}
              onClick={() => handleClick(item.target)}
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
