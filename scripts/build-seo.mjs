// Generates sitemap.xml + robots.txt and stamps canonical/og:url in index.html
// from SITE_URL in landing-page/js/config.js. Run after changing SITE_URL or the resource data:
//   node scripts/build-seo.mjs
import { readFileSync, writeFileSync } from "node:fs";

// All paths are relative to the landing-page folder, whatever the current directory is.
const p = (file) => new URL("../landing-page/" + file, import.meta.url);

const config = readFileSync(p("js/config.js"), "utf8");
const siteUrl = config.match(/SITE_URL:\s*"([^"]+)"/)[1].replace(/\/?$/, "/");

const resources = JSON.parse(readFileSync(p("data/resources.json"), "utf8"));
const esc = (s) => s.replace(/&/g, "&amp;");
const urls = [siteUrl];
writeFileSync(
  p("sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${esc(u)}</loc></url>`).join("\n") +
    `\n</urlset>\n`
);

writeFileSync(p("robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`);

const stamp = (file, url) => {
  let html = readFileSync(p(file), "utf8");
  html = html.replace(/(<link rel="canonical" href=")[^"]*"/, `$1${url}"`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*"/, `$1${url}"`);
  writeFileSync(p(file), html);
};
stamp("index.html", siteUrl);

console.log(`SITE_URL = ${siteUrl}\nsitemap.xml: ${urls.length} URLs`);

// JSON-LD ItemList of all resources (helps crawlers see the catalogue without running JavaScript)
{
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Zoe\u2019s Learning Library resources",
    numberOfItems: resources.length,
    itemListElement: resources.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: r.title,
      url: r.url
    }))
  };
  const json = JSON.stringify(itemList, null, 2).replace(/</g, "\u003c");
  const block = "<!-- ItemList:start -->\n<script type=\"application/ld+json\">\n" + json + "\n</script>\n<!-- ItemList:end -->";
  let html = readFileSync(p("index.html"), "utf8");
  html = html.replace(/<!-- ItemList:start -->[\s\S]*?<!-- ItemList:end -->/, () => block);
  writeFileSync(p("index.html"), html);
  console.log("ItemList: " + resources.length + " resources");
}
