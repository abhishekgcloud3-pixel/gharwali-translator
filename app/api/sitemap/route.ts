import { NextResponse } from 'next/server';
import { ROUTES } from '@/lib/constants';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://garhwaliseva.example.com';
  const lastmod = new Date().toISOString().split('T')[0];

  const routes = [
    { path: ROUTES.home, changefreq: 'daily', priority: 1.0 },
    { path: ROUTES.about, changefreq: 'weekly', priority: 0.8 },
    { path: ROUTES.learn, changefreq: 'weekly', priority: 0.8 },
    { path: ROUTES.faq, changefreq: 'monthly', priority: 0.6 },
    { path: ROUTES.songs, changefreq: 'daily', priority: 0.9 },
    { path: ROUTES.contribute, changefreq: 'daily', priority: 0.7 },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <lastmod>${lastmod}</lastmod>
  </url>
  ${routes
    .map(
      (route) => `
  <url>
    <loc>${baseUrl}${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
    <lastmod>${lastmod}</lastmod>
  </url>`
    )
    .join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  });
}
