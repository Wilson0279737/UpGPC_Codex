# Upgrade Gaming PCs

The active site is in this directory. `Site1.0/` is an archived predecessor, not part of the application build. Keep it separate from deployment.

## Local development

Use Node.js 22.19 or newer and npm. Node 24 was used for this audit. Production remains a static site; no Node server is required by the deployed site.

```sh
npm ci
npm run dev
```

Development listens on localhost. To review the actual production output, including page metadata and 404 behavior:

```sh
npm run build
npm run preview
```

The preview is available at http://127.0.0.1:4173. Set `PORT` to use another local port.

## Validation

```sh
npm run typecheck
npm run lint
npm run build
npm test
npm audit
```

Browser tests use an installed Google Chrome. If needed, install the test browser with `npx playwright install chrome`. The tests start a production preview automatically if one is not already running. Rebuild after changing application source.

The suite checks all five pages at 320, 390, 768, and 1440 pixels; automated accessibility; image loading; internal links; keyboard navigation; route focus; contact destinations; deferred maps; reduced motion; old links; raw HTML SEO; and 404 responses. It does not send calls, email, or messages.

## Rendering and images

The project still uses React 18, React Router, Vite, Tailwind CSS, and Lucide. `scripts/build.mjs` produces the ordinary browser bundle, then uses React's server renderer to write HTML for each existing route and the missing-page view. The browser hydrates that HTML. There is no new application framework or production rendering service.

Route metadata and structured data live in `src/config/seo.ts`. Keep the five route paths synchronized with `src/App.tsx`, `public/sitemap.xml`, and `public/_redirects` if adding pages. The build takes the render list from the metadata configuration. Business identity and schema contact fields are in `src/config/site.ts`.

Responsive WebP files are checked in under `public/optimized/responsive/`, with their dimensions and source sets in `src/config/images.ts`. Original images are preserved. Regenerate variants after replacing source images:

```sh
npm run images
```

`ResponsiveImage` supplies explicit dimensions and a source set. Set an accurate `sizes` value at each call site. Keep the home hero eager/high priority, and below-the-fold imagery lazy. Google Maps is only mounted after the visitor expands it; the direct directions link always works.

## Hosting review before deployment

The repository's existing `_redirects` and Git history indicate Netlify. Hosting account settings were not accessed or changed. Expected settings are build base `project`, build command `npm run build`, and publish directory `dist` (relative to the base). Verify those settings and the Node version in the host before approving a deployment.

The local changes to deployment behavior are:

- Each existing route serves its own generated HTML. Both a normal page refresh and in-app navigation must work.
- `/pages/repair.html` and `/pages/products.html`, found in the archived site's links, redirect permanently to `/services` and `/products`.
- Unmatched routes and missing assets return `404.html` with status 404, replacing the previous blanket home-page rewrite. The 404 page has `noindex,follow`.
- `_headers` adds `nosniff`, a standard cross-origin referrer policy, and immutable caching only for Vite's hashed `/assets/` files. Original images and HTML do not receive immutable caching.

The local preview implements static-page serving, legacy redirects, true 404 responses, and gzip compression. It is for local review, not a replacement hosting server. Netlify's redirect ordering, Pretty URLs setting, CDN compression/cache headers, HTTP/HTTPS and domain redirects must be checked on an approved deploy preview before production. No DNS, HSTS, CSP, account, analytics, or form infrastructure was changed.

Do not publish `.prerender/`, `Site1.0/`, `node_modules/`, tests, or local audit artifacts; publish only `dist/`.

The audit was completed locally. The owner subsequently authorized publishing a review branch; production deployment still requires separate approval. See `AUDIT.md` for findings and measurements.
