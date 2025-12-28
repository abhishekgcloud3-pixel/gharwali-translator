export const COLORS = {
  primary: '#0D5C3E',
  secondary: '#8B4513',
  accent: '#87CEEB',
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

export const ROUTES = {
  home: '/',
  songs: '/songs',
  about: '/about',
  learn: '/learn',
  faq: '/faq',
  contribute: '/contribute',
};

export const SITE_CONFIG = {
  name: 'Garhwali Seva',
  description: 'Preserving the Garhwali language through translation, education, and community. A free, open-source platform for Uttarakhand culture.',
  keywords: [
    'Garhwali',
    'Uttarakhand',
    'language preservation',
    'translation',
    'Garhwali dictionary',
    'Garhwali culture',
    'Indian languages',
    'endangered languages',
    'Hindi translation',
    'English translation',
  ],
  authors: [{ name: 'Garhwali Seva Community' }],
  creator: 'Garhwali Seva',
  publisher: 'Garhwali Seva',
  og: {
    siteName: 'Garhwali Seva',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@GarhwaliSeva',
    creator: '@GarhwaliSeva',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const DICTIONARY_CATEGORIES = [
  'phrase',
  'noun',
  'verb',
  'adjective',
  'adverb',
  'song_phrase',
] as const;

export type DictionaryCategory = typeof DICTIONARY_CATEGORIES[number];

export const TRANSLATION_TARGETS = ['hindi', 'english'] as const;
export type TargetLanguage = typeof TRANSLATION_TARGETS[number];

export const API_RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
};

export const VERSION = '1.0.0';
