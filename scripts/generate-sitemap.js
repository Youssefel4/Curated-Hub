import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://elegant-tanuki-35cc2e.netlify.app'; // Production URL

async function generateSitemap() {
    console.log('🗺️  Starting sitemap generation...');

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing Supabase credentials in .env file');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Static routes
    const routes = [
        '',
        '/auth',
        '/onboarding',
        '/profile',
        '/about-us',
        '/contact',
        '/privacy-policy',
        '/terms-of-service',
    ];

    try {
        // Fetch interests for dynamic routes
        console.log('📦 Fetching interests...');
        const { data: interests } = await supabase
            .from('interests')
            .select('id');

        if (interests) {
            interests.forEach(interest => {
                routes.push(`/interest/${interest.id}`);
            });
        }

        // Generate XML
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
                .map(route => {
                    return `  <url>
    <loc>${SITE_URL}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${route === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`;
                })
                .join('\n')}
</urlset>`;

        // Ensure public directory exists
        const publicDir = path.join(__dirname, '../public');
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir);
        }

        // Write file
        fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
        console.log(`✅ Sitemap generated successfully at public/sitemap.xml with ${routes.length} URLs!`);

    } catch (error) {
        console.error('❌ Error generating sitemap:', error);
    }
}

generateSitemap();
