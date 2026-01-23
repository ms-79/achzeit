// Zentrale Konfigurationsdatei für rechtliche Angaben
// Ersetze alle [PLATZHALTER] mit deinen echten Daten

export const LEGAL_CONFIG = {
  // Unternehmensdaten
  company: {
    name: 'M. und M. Siegmann GbR',
    street: 'Hofheimer Str. 17',
    zip: '65824',
    city: 'Schwalbach',
    country: 'Deutschland',
    email: 'info@achzeit.de',
    phone: '[TELEFON]',
    fax: '[FAX]', // optional, leer lassen wenn nicht vorhanden
  },

  // Vertretungsberechtigte (bei GbR die Gesellschafter)
  representatives: 'M. Siegmann und M. Siegmann',

  // Registerdaten (falls vorhanden, bei GbR meist nicht)
  register: {
    court: '', // z.B. 'Amtsgericht Frankfurt am Main'
    number: '', // z.B. 'HRB 12345'
    type: '', // z.B. 'Handelsregister'
  },

  // Umsatzsteuer-ID (falls vorhanden)
  vatId: '[UST_ID]', // z.B. 'DE123456789'

  // Datenschutz-Kontakt
  dataProtection: {
    responsible: 'M. und M. Siegmann GbR',
    contact: 'info@achzeit.de',
  },

  // Streitbeilegung
  disputeResolution: {
    participates: false, // true wenn Teilnahme an Streitbeilegung
    note: 'Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
  },

  // Hosting-Anbieter
  hosting: {
    name: 'Lovable / Vercel',
    address: 'Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA',
    privacyUrl: 'https://vercel.com/legal/privacy-policy',
  },

  // Cookie/Consent Konfiguration
  consent: {
    // Cookiebot ID - ersetze mit deiner echten ID
    cookiebotId: '[COOKIEBOT_ID]',
    // Alternative: Consentmanager ID
    consentmanagerId: '[CM_ID]',
    // Welchen CMP verwendest du? 'cookiebot' | 'consentmanager' | 'custom'
    provider: 'custom' as const,
  },

  // Externe Dienste (für Datenschutzerklärung)
  services: {
    analytics: {
      enabled: false,
      provider: 'Google Analytics',
      privacyUrl: 'https://policies.google.com/privacy',
    },
    booking: {
      enabled: true,
      provider: 'Hostaway',
      privacyUrl: 'https://www.hostaway.com/privacy-policy',
    },
    contactForm: {
      enabled: true,
      provider: 'Web3Forms',
      privacyUrl: 'https://web3forms.com/privacy',
    },
    maps: {
      enabled: false,
      provider: 'Google Maps',
      privacyUrl: 'https://policies.google.com/privacy',
    },
  },
};

// Cookie-Kategorien für das Consent-Banner
export const COOKIE_CATEGORIES = {
  necessary: {
    id: 'necessary',
    name: {
      de: 'Notwendig',
      en: 'Necessary',
    },
    description: {
      de: 'Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.',
      en: 'These cookies are essential for the basic functions of the website and cannot be disabled.',
    },
    required: true,
  },
  functional: {
    id: 'functional',
    name: {
      de: 'Funktional',
      en: 'Functional',
    },
    description: {
      de: 'Diese Cookies ermöglichen erweiterte Funktionen wie Spracheinstellungen und personalisierte Inhalte.',
      en: 'These cookies enable enhanced functionality such as language settings and personalized content.',
    },
    required: false,
  },
  statistics: {
    id: 'statistics',
    name: {
      de: 'Statistik',
      en: 'Statistics',
    },
    description: {
      de: 'Diese Cookies helfen uns zu verstehen, wie Besucher unsere Website nutzen, um sie zu verbessern.',
      en: 'These cookies help us understand how visitors use our website so we can improve it.',
    },
    required: false,
  },
  marketing: {
    id: 'marketing',
    name: {
      de: 'Marketing',
      en: 'Marketing',
    },
    description: {
      de: 'Diese Cookies werden verwendet, um Werbung anzuzeigen, die für Sie relevant ist.',
      en: 'These cookies are used to display advertising that is relevant to you.',
    },
    required: false,
  },
};

// Typ für Cookie-Consent
export type CookieConsent = {
  necessary: boolean;
  functional: boolean;
  statistics: boolean;
  marketing: boolean;
  timestamp: string;
};

// Standard-Consent (nur notwendige Cookies)
export const DEFAULT_CONSENT: CookieConsent = {
  necessary: true,
  functional: false,
  statistics: false,
  marketing: false,
  timestamp: '',
};

// LocalStorage Key für Consent
export const CONSENT_STORAGE_KEY = 'achzeit-cookie-consent';
