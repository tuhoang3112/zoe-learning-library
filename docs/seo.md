# SEO & Search Console

## What is implemented

- Semantic HTML (`header`, `nav`, `main`, `section`, `footer`, `h1`/`h2`), unique `<title>` and meta description per page
- Canonical URL on every page
- `sitemap.xml` (home page) and `robots.txt` (allows everything, points to the sitemap)

## Known V1 limitation

Resource cards link straight to the external site, so there are no per-resource pages to index; only the home page is in the sitemap. If SEO for individual resources becomes a goal, generate one static page per resource from `resources.json` and add them to the sitemap.

## Setting the site URL

1. Set `SITE_URL` in `js/config.js` to the real deployed URL (e.g. `https://<user>.github.io/zoe-learning-library/`).
2. Run `node scripts/build-seo.mjs` — regenerates `sitemap.xml`, `robots.txt` and the canonical / `og:url` tags.

Note: on a GitHub Pages project site (`user.github.io/repo/`) `robots.txt` is not read by crawlers because it is not at the domain root. It takes effect with a custom domain.

## Search Console verification

1. Add a URL-prefix property in Google Search Console.
2. Choose the **HTML tag** method and copy the token.
3. In `index.html`, replace `GOOGLE_VERIFICATION_TOKEN` in
   `<meta name="google-site-verification" content="GOOGLE_VERIFICATION_TOKEN">`.
4. Deploy, click Verify, then submit `sitemap.xml`.

Do not commit an invented token. With a custom domain, DNS verification is an alternative.
