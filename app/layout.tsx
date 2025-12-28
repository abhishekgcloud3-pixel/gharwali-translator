import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SITE_CONFIG } from '@/lib/constants';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0D5C3E',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://garhwaliseva.example.com'),
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: SITE_CONFIG.authors,
  creator: SITE_CONFIG.creator,
  publisher: SITE_CONFIG.publisher,
  robots: SITE_CONFIG.robots,
  openGraph: {
    ...SITE_CONFIG.og,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: '/',
    siteName: SITE_CONFIG.og.siteName,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} - Garhwali Language Preservation`,
      },
    ],
  },
  twitter: {
    ...SITE_CONFIG.twitter,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: ['/og-image.png'],
  },
  icons: SITE_CONFIG.icons,
  manifest: SITE_CONFIG.manifest,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen overflow-x-hidden bg-background font-sans antialiased flex flex-col',
          inter.className
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Toaster />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
