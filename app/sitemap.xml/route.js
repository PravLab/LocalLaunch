import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient'; // ✅ correct

export async function GET() {
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('slug');

  if (error) {
    console.error(error);
    return new NextResponse('Sitemap error', { status: 500 });
  }

  const staticUrls = [
    `<url><loc>https://locallaunch.in/</loc></url>`,
    `<url><loc>https://locallaunch.in/about</loc></url>`,
    `<url><loc>https://locallaunch.in/register</loc></url>`,
    `<url><loc>https://locallaunch.in/privacy-policy</loc></url>`,
    `<url><loc>https://locallaunch.in/terms&amp;conditions</loc></url>`
  ];

  const subdomainUrls = businesses.map((b) => {
    return `
      <url>
        <loc>https://${b.slug}.locallaunch.in</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
      </url>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticUrls.join('\n')}
      ${subdomainUrls}
    </urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    }
  });
}
