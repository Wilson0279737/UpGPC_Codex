# Upgrade Gaming PCs CMS

## Scope

Owner/trusted repository writers can edit the home banner, about section, contact page introduction, shared contact details and visiting note, service cards, catalog introduction, and individual PC listings. Existing branding, photography, warranties, and payment claims are preserved. There are no invented systems, prices, performance claims, checkout transactions, or customer records in the content repository. Optional Google customer accounts and saved PCs use a separate Identity service. Google login is active on the isolated account staging site as of November 15, 2026; it remains disabled by default in other builds.

Sveltia CMS provides the editing interface and GitHub integration. This keeps content in the existing repository and works with the existing Netlify previews. The chosen initial sign-in is a repository-scoped GitHub access token, requiring no new paid service, OAuth app, identity database, or production setting changes. An OAuth convenience flow can be added separately if desired.

## Routes and data

- `/admin/`: owner welcome and real GitHub editor.
- `/admin/help.html`: first sign-in, editing, token recovery, and release instructions.
- `/admin/demo.html`: isolated, browser-persistent practice editor, seeded during build.
- `project/src/content/site.json`: website copy and shared contact information.
- `project/src/content/services.json`: service cards.
- `project/src/content/products/*.json`: one PC per file; new entries default to draft.
- `project/public/uploads/`: uploaded photographs.
- `project/src/content/sold.generated.json`: generated public Sold PCs archive; edit the individual product records instead.

The owner dashboard has a catalog snapshot, direct editing tasks, and individual PC quick-edit buttons. It reads `/admin/catalog.json`, generated from the same filtered source as the public catalog, so draft and sold entries are excluded from both outputs. Loading failures offer retry without blocking access to the editor. Owner tools open directly to inventory, page/contact content, or services; direct entry links also reopen after a reload and retain a collection route to return to. The loader has bounded connection errors and allows retry. New PC entries are checked before save with the same core rules used by the build. JPG/PNG/WebP uploads are renamed, resized, and converted to WebP; a missing PC photo description uses the PC name rather than failing a build.

Product, page/contact, and services editor previews use styled templates matching the public site. The responsive editing guide includes photo, availability, Marketplace, and access help. The separate practice welcome page explains its browser-only example data.

Available and reserved PCs appear in current stock on `/products`, with available systems first. Sold PCs appear separately at `/products#sold-pcs`; they are excluded from current-stock counts, filters, and save controls. Drafts are excluded from both public outputs during the build. Empty current inventory has useful contact and Marketplace actions. An omitted current price shows “Call for pricing”; no checkout or reservation transaction is implied. Inquiry links include the PC name in the email subject.

The Sold PCs archive has search, desktop/laptop filtering, last-listed price sorting, 12-listing pages, and direct detail links. Every card and detail view says Sold. Historical prices are labeled as last advertised prices, not confirmed final transaction amounts. Sold detail views offer the original Marketplace ad and an inquiry about similar systems. Existing saved-PC behavior still treats a sold system as no longer in current stock.

On November 15, 2026, the owner requested all of the sold gaming PCs from their Marketplace profile. The complete profile history exposed 158 sold listings. The import identified 127 confirmed gaming-computer listings. Three repeat pairs with identical names, photographs, and last-listed prices were combined, leaving 124 archive records: 121 desktops and 3 gaming laptops. It excludes office PCs, Macs, components, peripherals, consoles, and unrelated items. Stable Marketplace listing IDs are retained. Repeated names with different photographs or prices remain separate records. These counts describe archived listings, not a claim about distinct physical systems or completed transaction amounts. The imported fields come from the visible sold-card titles, prices, status, and photographs. Specifications are copied only when explicit in the listing title; unknown values stay blank.

All 127 original listing thumbnail files were downloaded locally (about 1.67 MB total); the three duplicate copies were removed from the final 124-photo archive, so the website does not rely on expiring Facebook URLs or a Facebook login. Gallery cards use those square photos at their intended size. Detailed original listing visits were curtailed when the Browser app stopped accepting calls after the complete profile index was captured; original-ad links provide additional details. No buyer messages, reviews, private customer information, or fabricated descriptions/specifications were imported. The imported description explains the sold/reference status and historical-price meaning. Facebook itself was not changed.

When listings exist, shoppers can search by name/specification, filter by availability, and sort by price. Unknown prices sort after known prices. Product cards show uncropped photos, availability, price, a four-part specification panel when supplied, and direct inquiry/Marketplace actions. Photos, titles, and the details control open a dialog with the full description and larger photo. The dialog locks background scrolling, keeps keyboard focus inside, closes with Escape, restores the opening control's focus, and keeps its close button accessible while scrolling. Compact account save buttons have descriptive labels and confirmed success/error feedback. The product hero prioritizes the on-site catalog, with Marketplace as an additional option. The home page leads with the editable headline; responsive images reduce transfer size, maps load on request, and mobile navigation supports keyboard use and Escape. New account and missing-page views are excluded from indexing.

On November 15, 2026, the owner's Marketplace profile showed five available/in-stock listings. The two complete PCs were imported into the real CMS: the $2,099 Flame RTX 4070 SUPER / i7-14700F system and the $99 HP Windows 11 workstation. Prices, availability, and specifications were checked against the actual ads and the gaming PC's photographed specification card. The other three ads were tile, a monitor, and peripherals, so they were not imported as PCs. Each PC uses a stable Marketplace listing ID in its filename and a downloaded copy of its real listing photo; expiring Facebook image URLs are not used by the website.

PC entries have optional `marketplaceUrl`, `marketplaceVerifiedOn`, and `formFactor` fields. System type is desktop or laptop; an omitted type is treated as desktop in the archive. A valid item URL adds a direct Marketplace button in the catalog and CMS preview; an optional date records the last availability check. Facebook price/status changes do **not** sync automatically. Mark a PC Sold to move it from current stock to the public archive, or Draft to hide it completely. No scraping service, Facebook session credential, or scheduled sync was added.

The generated current-stock/dashboard catalogs, sold archive, and practice seed are ignored by Git and refreshed at build time. Rebuild after editing local source content. The CMS commits relative to the repository root, so paths include `project/`; public photo URLs start at `/uploads/`.

Exact repeat ads combined in this import:

| PC | Retained listing ID | Matching repeat listing ID |
| --- | --- | --- |
| Fracture | 4468440066757768 | 1101690685704919 |
| Lyra | 980295877708624 | 1434982431199416 |
| Rune | 837932905618127 | 25294120263545010 |

## Preview and release

The preview branch is `codex/cms-preview`. The persistent staging project at `https://upgrade-gaming-pcs-staging.netlify.app` builds that branch independently of the PR Deploy Preview. Keep the draft pull request open to refresh its separate Netlify preview on each CMS save. Never use production content credentials for additional staging services. No new environment variables or callback URLs are needed for token sign-in.

The editor's save/publish action commits to the configured preview branch. It does not merge to `main` or publish production. The owner's explicit release instruction is still required for that separate action. After an approved merge, retain the staging branch, continue reviewing edits on the persistent staging site, and open the next release PR; a closed PR no longer provides updating PR previews. Direct owners to the persistent staging dashboard for new edits so its catalog snapshot and website links reflect the branch they are editing.

The custom production domain's `/admin` routes use temporary redirects to that persistent staging workspace. These host-specific rules leave the public website, Netlify previews, staging routes, and customer account callbacks unchanged. Owner approval to publish the reviewed CMS/catalog update was received on November 15, 2026 ("yes publish"); Google customer accounts remain staging-only for this release. The release PR records the resulting production commit and live verification.

## Validation and limits

`npm run build` checks content, generates practice fixtures and the public catalog, type-checks, and builds. `npm run test:content` checks visibility, filtering/sorting, preview targeting, price/status constraints, contact links, and photo references. `npm run test:auth` checks account/session behavior. Invalid content fails the preview build with field-specific messages, retaining the previous successful deployment.

GitHub enforces repository write authorization. The CMS is a client application, and its configuration contains no secret. Its documented sign-in stores the owner's token in browser local storage. Use a trusted browser, short token expiry, Contents read/write for this repository only, and sign out/revoke in GitHub as appropriate. GitHub provides password and account recovery. The editor intentionally hides unconfigured OAuth sign-in.

Verified November 15, 2026: the owner completed GitHub editing-key setup directly in the browser. The real CMS loaded repository content, saved a reversible whitespace-only change to `codex/cms-preview`, and restored the original file byte-for-byte. Independent repository reads confirmed both commits and the exact restoration. After reloading and reopening the editor, remembered authorization loaded the original content without another key prompt. CMS sign-out, key replacement/recovery, and new-media commits remain unverified. No editing key was read or committed to this repository.

Verified November 14, 2026: all five public pages plus account and missing-page views were checked locally at 320, 390, 768, and 1440 pixels, with direct visits, working image sources, and no horizontal overflow. Mobile navigation closes after route selection and Escape, restoring keyboard focus. Search/filter/price sorting and reappearing card visibility were exercised with five temporary local PC fixtures; draft/sold markers were absent from every browser asset. All fixtures were removed and the real empty catalog rebuilt before publication.

In a real Chrome practice session, contact phone and Google embed errors blocked saves with the expected shared validation messages. Service required-field errors blocked saves, and valid service edits saved. A PC name, cent-based price, reserved status, and selected seeded photo persisted after reload; the styled card preview loaded its 640px image. The in-app browser does not display the CMS's blob preview iframe reliably, so Chrome was used to verify it.

Verified November 15, 2026 after the visual update: the actual Netlify staging dashboard, guide, practice page, and public catalog were checked on desktop and mobile, including 320, 390, and 768 pixel widths without horizontal overflow. Search, clearing filters, no-result states, price sorting, and both real listing images were exercised. The details dialog's focus loop, Escape, focus restoration, and scroll locking were checked. Real owner quick-edit links and direct-entry reloads loaded the correct GitHub content; page/contact and both service card previews were inspected with Save disabled. No real inventory content was edited during this design check.

The isolated practice copy accepted a 3000 × 2000 test PNG and stored it as a 1600 × 1066 WebP. Its image, $899.99 price, reserved status, Marketplace URL, and valid check date were verified after closing and reopening the practice tab. An invalid February 29, 2026 check date blocked the save with the expected validation message. One reload remained at the editor splash; reopening the practice tab recovered its saved content. This certifies browser practice upload conversion/persistence, not a new-media GitHub commit. A separate temporary draft/sold fixture check confirmed both generated catalogs exclude hidden entries; those fixtures were removed immediately.

All 14 content tests and 15 account tests pass, alongside TypeScript and the production build. The two Marketplace checks cover item URL restrictions and real calendar dates. Earlier source lint reported zero errors and one existing React Fast Refresh advisory for the provider/hook module. The full dependency audit reported zero known advisories after compatible patches, Vite 6.4.6, and a scoped patched-minimatch override. The November 14 validation changed no calls, emails, real inventory, customer accounts, or production settings.

The CMS script is loaded on demand from the official package CDN, pinned to tested version 0.266.0, following Sveltia's documented installation; the public website does not load it. Its availability is an external dependency; update the pinned version deliberately and recheck practice saves/previews. The initial editor is for trusted repository writers, not an account system with custom per-field roles.

Customer Google sign-in does not replace Sveltia's GitHub editing permission. On November 15, 2026, the isolated Netlify project `upgrade-gaming-pcs-staging` was connected to this branch with customer accounts enabled and Google's default Identity provider. Real Google consent, profile loading, persistence across reload, and logout were verified on its [account page](https://upgrade-gaming-pcs-staging.netlify.app/account). The original PR preview still has no Identity connection. The business website's production account settings were not changed. See [customer account setup and remaining checks](CUSTOMER_ACCOUNTS.md); CMS sign-in and a reversible content save were verified separately; the remaining CMS checks are listed above.

References: [Sveltia installation](https://sveltiacms.app/en/docs/start), [GitHub backend and token permissions](https://sveltiacms.app/en/docs/backends/github), [isolated test backend](https://sveltiacms.app/en/docs/backends/test).
