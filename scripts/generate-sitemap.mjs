// Generira sitemap.xml iz popisa prerenderiranih stranica nakon `ng build`.
import { readFileSync, writeFileSync } from 'node:fs';

const SITE_URL = 'https://avalena.hr';
const DIST = 'dist/kuca-za-najam';

const { routes } = JSON.parse(readFileSync(`${DIST}/prerendered-routes.json`, 'utf8'));
const urls = Object.keys(routes)
  .sort()
  .map((route) => `  <url><loc>${SITE_URL}${encodeURI(route)}</loc></url>`)
  .join('\n');

writeFileSync(
  `${DIST}/browser/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
console.log(`sitemap.xml: ${Object.keys(routes).length} URLs`);
