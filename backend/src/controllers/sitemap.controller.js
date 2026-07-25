const fs = require('fs');
const path = require('path');
const BlogModel = require('../models/blog.model');
const PropertyModel = require('../models/property.model');

const formatDate = (dateStr) => {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];
    return d.toISOString().split('T')[0];
  } catch (e) {
    return new Date().toISOString().split('T')[0];
  }
};

const escapeXml = (unsafe) => {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

const generateSitemapXml = async () => {
  const baseUrl = (process.env.FRONTEND_URL || 'https://brokerlessrealty.com').replace(/\/+$/, '');
  const today = new Date().toISOString().split('T')[0];

  // Fetch dynamic content from Database
  const [blogs, properties] = await Promise.all([
    BlogModel.findAll().catch(err => {
      console.error('Error fetching blogs for sitemap:', err);
      return [];
    }),
    PropertyModel.findAll().catch(err => {
      console.error('Error fetching properties for sitemap:', err);
      return [];
    })
  ]);

  // Define core static routes
  const staticPages = [
    { path: '', priority: '1.0', changefreq: 'daily' },
    { path: 'properties', priority: '0.9', changefreq: 'daily' },
    { path: 'about', priority: '0.7', changefreq: 'weekly' },
    { path: 'contact', priority: '0.7', changefreq: 'weekly' },
    { path: 'blog', priority: '0.8', changefreq: 'daily' },
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // 1. Static Pages (Both clean URL and HashRouter URL)
  staticPages.forEach(page => {
    const cleanUrl = page.path ? `${baseUrl}/${page.path}` : `${baseUrl}/`;
    const hashUrl = `${baseUrl}/#/${page.path}`;

    xml += `  <url>\n    <loc>${escapeXml(cleanUrl)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>\n`;
    xml += `  <url>\n    <loc>${escapeXml(hashUrl)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>\n`;
  });

  // 2. Dynamic Blog Posts
  blogs.forEach(blog => {
    const slug = blog.slug || blog.id;
    const lastMod = formatDate(blog.updated_at || blog.created_at || blog.date);
    const cleanUrl = `${baseUrl}/blog/${slug}`;
    const hashUrl = `${baseUrl}/#/blog/${slug}`;

    xml += `  <url>\n    <loc>${escapeXml(cleanUrl)}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    xml += `  <url>\n    <loc>${escapeXml(hashUrl)}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  });

  // 3. Dynamic Properties
  properties.forEach(prop => {
    const propId = prop.id;
    const lastMod = formatDate(prop.updated_at || prop.created_at);
    const cleanUrl = `${baseUrl}/property/${propId}`;
    const hashUrl = `${baseUrl}/#/property/${propId}`;

    xml += `  <url>\n    <loc>${escapeXml(cleanUrl)}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    xml += `  <url>\n    <loc>${escapeXml(hashUrl)}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  });

  xml += '</urlset>';
  return xml;
};

const generateSitemap = async (req, res) => {
  try {
    const xml = await generateSitemapXml();

    // Sync static file copy to frontend public directory if present
    try {
      const publicPath = path.join(__dirname, '..', '..', '..', 'frontend', 'public', 'sitemap.xml');
      const publicDir = path.dirname(publicPath);
      if (fs.existsSync(publicDir)) {
        fs.writeFileSync(publicPath, xml, 'utf8');
      }
    } catch (e) {
      // Ignore write errors in containerized environments
    }

    res.header('Content-Type', 'application/xml');
    res.status(200).send(xml);
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
};

module.exports = { generateSitemap, generateSitemapXml };
