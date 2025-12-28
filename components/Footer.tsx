import Link from 'next/link';
import { SITE_CONFIG, ROUTES } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-10 md:py-12 mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
            >
              <span className="font-bold text-primary text-lg">
                {SITE_CONFIG.name}
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-md">
              {SITE_CONFIG.description} Promoting the rich heritage, language, and culture of Uttarakhand.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              Built with love for the Garhwali community.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={ROUTES.learn} className="text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded">
                  Learn Garhwali
                </Link>
              </li>
              <li>
                <Link href={ROUTES.songs} className="text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded">
                  Song Translator
                </Link>
              </li>
              <li>
                <Link href={ROUTES.contribute} className="text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded">
                  Contribute
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={ROUTES.about} className="text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded">
                  About
                </Link>
              </li>
              <li>
                <Link href={ROUTES.faq} className="text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded">
                  FAQ
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
