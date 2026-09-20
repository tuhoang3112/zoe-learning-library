// Generates sitemap.xml + robots.txt and stamps canonical/og:url in index.html
// from SITE_URL in js/config.js. Run after changing SITE_URL:
//   node scripts/build-seo.mjs
import { readFileSync, writeFileSync } from "node:fs";

const config = readFileSync("js/config.js", "utf8");
const siteUrl = config.match(/SITE_URL:\s*"([^"]+)"/)[1].replace(/\/?$/, "/");

const esc = (s) => s.replace(/&/g, "&amp;");
const urls = [siteUrl];
writeFileSync(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${esc(u)}</loc></url>`).join("\n") +
    `\n</urlset>\n`
);

writeFileSync("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`);

const stamp = (file, url) => {
  let html = readFileSync(file, "utf8");
  html = html.replace(/(<link rel="canonical" href=")[^"]*"/, `$1${url}"`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*"/, `$1${url}"`);
  writeFileSync(file, html);
};
stamp("index.html", siteUrl);

console.log(`SITE_URL = ${siteUrl}\nsitemap.xml: ${urls.length} URLs`);
