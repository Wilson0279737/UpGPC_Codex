# Local website audit — September 22, 2026

Upgrade Gaming PCs was optimized and audited locally. The owner subsequently authorized publishing the changes to a review branch; production deployment remains unapproved. No hosting account change or customer communication was made. Review the production build at **http://127.0.0.1:4173/** while the local preview is running. Restart instructions are in `README.md`.

## A. Important findings

- The existing five-page React/Vite application built and rendered without application console errors. Its branding, photographs, business contact details, contact links, Marketplace integration, and main page URLs were retained.
- Every raw page response contained an empty application root and home-page metadata. Route-specific content, canonicals, and structured data only appeared after JavaScript ran. Unknown routes produced a blank application under a successful response.
- The home page opened with the location card; its main heading and product/repair calls to action were far down the page. The fixed-height lower banner could clip its content on narrow screens.
- Closed mobile navigation kept its links focusable. There was no skip link or route-change focus management, pinch zoom was restricted, and headings skipped levels on four pages. Hidden map content could still load and accept keyboard focus.
- The logo was a 371 kB PNG, photographs had no responsive sources or explicit intrinsic dimensions, and entrance animations delayed useful content. The structured-data logo path used incorrect capitalization for a case-sensitive host.
- The baseline dependency audit reported **22 advisories: 14 high, 5 moderate, 3 low**. These are package advisories, not 22 confirmed exploitable flaws in the deployed static site. No obvious credential patterns were found in the inspected source.
- The active site has no contact submission form or analytics script. The archived `Site1.0` contains a form that only logs input; it is not part of the active build. It was not reactivated or presented as a working form.

## B. Changes made

- Kept React 18, Vite, Tailwind, React Router, and the existing components. Added build-time HTML rendering and client hydration, with one shared metadata source, unique titles/descriptions/canonicals/social metadata, ComputerStore and Service data, and a real noindex 404 page. Removed the unsupported structured-data price-range assumption.
- Retained the five current URLs and added redirects for the two legacy HTML links found in the archive. Old home-page section links now lead to the relevant current pages.
- Put gaming PCs, computer repair, local service, and the main calls to action at the top of the home page. Kept “Play before you pay,” made the address actionable, exposed a mobile call button, improved contact-page wording, and added a phone alternative to Marketplace browsing.
- Generated responsive WebP variants without deleting original assets. Added image dimensions, eager/high-priority loading for the home hero, lazy loading for secondary images, and deferred Maps until the visitor requests it. Retained the working external directions link.
- Fixed hidden navigation, Escape dismissal, dismissal when keyboard focus leaves the menu, route focus, skip navigation, heading order, touch targets, pinch zoom, focus visibility, reduced motion, and mobile banner contrast. Static content is visible before hydration. Corrected the desktop About photo grid so the portrait occupies the intended final column instead of creating an extra mostly empty row.
- Updated vulnerable dependencies, including the security-supported Vite 6.4 line and compatible router/transitive packages. Added type checking to builds and development-only browser, accessibility, Lighthouse, and image tooling. No runtime framework, tracking script, or animation dependency was added.
- Added documented Netlify routing/header files and a localhost preview that serves the generated pages, gzip text, legacy redirects, and true 404s. No live hosting settings were changed.

Build-time rendering follows the existing React component tree and avoids requiring a production rendering server. This also follows [Google's guidance on prerendering for users and crawlers](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).

## C. Measured results

Single local home-page Lighthouse **13.5.0 mobile** runs, default simulated throttling, Chrome, fresh navigation, and gzip text compression in both previews:

| Measure | Baseline | Optimized |
| --- | ---: | ---: |
| Performance score | 78 | **99** |
| Accessibility score | 98 | **100** |
| SEO score | 100 | **100** |
| Best practices score | 100 | **100** |
| Largest Contentful Paint | 5.86 s | **1.87 s** |
| Total Blocking Time | 82 ms | **23 ms** |
| Cumulative Layout Shift | 0 | **0** |
| Total transferred data | 1,498 KiB | **165 KiB** |
| First Contentful Paint | 1.21 s | 1.42 s |
| Pages with content and correct metadata in initial HTML | 0 / 5 | **5 / 5** |
| Known dependency advisories | 22 | **0** |

Transfer size dropped **89%**, and simulated LCP dropped **68%**. The common 320-pixel logo variant is 8.8 kB, versus the original 371 kB PNG. The slightly later first paint is recorded above; the largest content now appears much sooner. Browser JavaScript grew modestly from 71.6 to 74.8 kB gzip, and CSS from 6.9 to 7.1 kB gzip, following security, responsive-image, and accessibility changes. The net page transfer reduction is primarily from images and deferring Maps.

Automated axe scans across five pages at desktop and mobile sizes went from eight heading-order violation instances across ten scans to **zero detected violations**. Automated checks are not a full WCAG certification. These are local lab results, not field Core Web Vitals or a promise of search rankings. Real INP and production LCP/CLS require field data; TBT is reported separately rather than represented as INP.

## D. Remaining owner decisions and checks

- Supply confirmed opening hours before displaying them or adding opening-hours schema. The site currently advises calling ahead.
- Confirm the scope and terms of the existing 90-day warranty and financing statements. Those existing claims were preserved; the archive contains different older warranty wording, which was not carried into the active site.
- Decide whether a working inquiry form, dedicated business email address, or on-site inventory is wanted. No unspecified mail backend, customer data collection, or inventory claims were added.
- Before authorizing production, verify the hosting base/build/output directories and Node version, then check the actual host's route rewrites, legacy 301s, missing-page status, compression, and cache/security headers on an approved deploy preview. After launch, review Search Console indexing and field performance.

## E. Changes intentionally avoided

- No redesign, React/Tailwind major migration, new runtime framework, new analytics, or dependency added solely for animation. Newer major tool/framework releases were reviewed but not adopted merely to be current; remaining non-vulnerable version drift is recorded in the local outdated-package report.
- No DNS, domain redirects, CSP, HSTS, authentication, payment, hosting-account, or production changes. The new `_redirects` and `_headers` are local deployment proposals, documented in `README.md`. Netlify-specific behavior still needs an approved host preview; the local server cannot certify CDN behavior. See [Netlify's routing documentation](https://docs.netlify.com/manage/routing/redirects/redirect-options/).
- No invented testimonials, business hours, prices, inventory, credentials, guarantees, or ratings. No Product offer/review schema was fabricated, and no breadcrumb hierarchy was invented for the flat site.
- Kept original photographs, unused originals, and the archived site because removing them could break historical asset links or discard useful source material. They do not add page transfer unless requested. The archive is excluded from active linting and application output; original public assets remain available.

## F. Substantially changed files

Paths below are relative to this `project` directory.

| Area | Files |
| --- | --- |
| Build and dependencies | `package.json`, `package-lock.json`, `eslint.config.js`, `scripts/build.mjs`, `scripts/preview.mjs` |
| Rendering and SEO | `index.html`, `src/main.tsx`, `src/entry-server.tsx`, `src/App.tsx`, `src/config/seo.ts`, `src/config/site.ts`, `src/components/SeoManager.tsx`, `src/pages/NotFoundPage.tsx` |
| Hosting proposals | `public/_redirects`, `public/_headers` |
| Navigation/accessibility | `src/components/Header.tsx`, `src/components/Layout.tsx`, `src/components/Footer.tsx`, `src/index.css`, `src/components/ui/siteStyles.ts` |
| Home, products, and contact | `src/pages/HomePage.tsx`, `src/components/Hero.tsx`, `src/components/MapSection.tsx`, `src/components/Contact.tsx`, `src/components/ContactPageHero.tsx`, `src/components/ProductsPageHero.tsx` |
| Shared images and headings | `scripts/optimize-images.mjs`, `src/config/images.ts`, `src/components/ui/ResponsiveImage.tsx`, `public/optimized/responsive/*`, plus image/heading updates in `AboutPageHero.tsx`, `AboutUsCollage.tsx`, `ServicesPageHero.tsx`, `ProductsShowcase.tsx`, and `ServicesSnapshot.tsx` under `src/components` |
| Validation/documentation | `playwright.config.ts`, `tests/site.spec.ts`, `README.md`, `AUDIT.md`, and repository-root `.gitignore` |

## G. Validation and local state

- Production build, TypeScript checking, and ESLint pass. Five complete pages and a 404 are generated.
- **25 browser tests pass**, covering all five routes at 320/390/768/1440 px; axe checks; loaded images; internal links; raw HTML metadata and JSON-LD; sitemap/robots; no-JavaScript content; keyboard navigation; route focus; contact link targets; deferred map behavior; old URLs; reduced motion; and missing-page responses.
- Final targeted checks also pass after preview compression and focus-outline refinements. Desktop/mobile screenshots were inspected in both passes. No visible horizontal overflow or application console errors were detected in the final page captures.
- Contact actions were checked without sending calls or email. Map behavior was tested with a controlled response; Google's external UI and Facebook inventory/account availability are outside the local test contract.
- `npm audit` reports zero known advisories for the active project. The audit was completed locally, followed by owner authorization to publish a review branch. Production deployment remains unapproved.

Raw baseline/optimized Lighthouse JSON, dependency reports, browser results, and screenshots are saved under the repository-root `audit/` directory, which is intentionally Git-ignored. The baseline Lighthouse CLI wrote its valid report before a Windows temporary-profile cleanup error; the later measurement used an explicit isolated profile and exited successfully.
