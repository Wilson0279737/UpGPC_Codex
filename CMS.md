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

Owner tools now open directly to inventory, page/contact content, or services. The loader has bounded connection errors and allows retry. New PC entries are checked before save with the same core rules used by the build. JPG/PNG/WebP uploads are renamed, resized, and converted to WebP; a missing PC photo description uses the PC name rather than failing a build.

Available and reserved PCs appear in `/products`, with available systems first. Draft and sold systems are excluded during the build, not just hidden with CSS. Empty inventory has useful contact and Marketplace actions. An omitted price shows “Call for pricing”; no checkout or reservation transaction is implied. Inquiry links include the PC name in the email subject.

When listings exist, shoppers can search by name/specification, filter by availability, and sort by price. Unknown prices sort after known prices. The product hero prioritizes the on-site catalog, with Marketplace as an additional option. The home page leads with the editable headline; responsive images reduce transfer size, maps load on request, and mobile navigation supports keyboard use and Escape. New account and missing-page views are excluded from indexing.

The generated catalog and practice seed are ignored by Git and refreshed at build time. Rebuild after editing local source content. The CMS commits relative to the repository root, so paths include `project/`; public photo URLs start at `/uploads/`.

## Preview and release

The initial preview branch is `codex/cms-preview`. Keep its draft pull request open to refresh the Netlify preview on each CMS save. Never use production content credentials for additional staging services. No new environment variables or callback URLs are needed for token sign-in.

The `Publish` action within the editor commits to the configured preview branch. It does not merge to `main` or publish production. The owner's explicit release instruction is still required for that separate action. If this branch is merged later, establish the next persistent staging/release review arrangement before continuing edits; a closed PR no longer provides updating PR previews.

## Validation and limits

`npm run build` checks content, generates practice fixtures and the public catalog, type-checks, and builds. `npm run test:content` checks visibility, filtering/sorting, preview targeting, price/status constraints, contact links, and photo references. `npm run test:auth` checks account/session behavior. Invalid content fails the preview build with field-specific messages, retaining the previous successful deployment.

GitHub enforces repository write authorization. The CMS is a client application, and its configuration contains no secret. Its documented sign-in stores the owner's token in browser local storage. Use a trusted browser, short token expiry, Contents read/write for this repository only, and sign out/revoke in GitHub as appropriate. GitHub provides password and account recovery. The editor intentionally hides unconfigured OAuth sign-in.

Verified November 15, 2026: the owner completed GitHub editing-key setup directly in the browser. The real CMS loaded repository content, saved a reversible whitespace-only change to `codex/cms-preview`, and restored the original file byte-for-byte. Independent repository reads confirmed both commits and the exact restoration. After reloading and reopening the editor, remembered authorization loaded the original content without another key prompt. CMS sign-out, key replacement/recovery, and new-media commits remain unverified. No editing key was read or committed to this repository.

Verified November 14, 2026: all five public pages plus account and missing-page views were checked locally at 320, 390, 768, and 1440 pixels, with direct visits, working image sources, and no horizontal overflow. Mobile navigation closes after route selection and Escape, restoring keyboard focus. Search/filter/price sorting and reappearing card visibility were exercised with five temporary local PC fixtures; draft/sold markers were absent from every browser asset. All fixtures were removed and the real empty catalog rebuilt before publication.

In a real Chrome practice session, contact phone and Google embed errors blocked saves with the expected shared validation messages. Service required-field errors blocked saves, and valid service edits saved. A PC name, cent-based price, reserved status, and selected seeded photo persisted after reload; the styled card preview loaded its 640px image. The in-app browser does not display the CMS's blob preview iframe reliably, so Chrome was used to verify it. A new local-file upload through the Chrome connector requires its file-access setting, which was left unchanged; new-upload conversion and real GitHub media commits still need the owner's authenticated browser check. Earlier practice uploads were exercised in the initial CMS session, but do not certify the changed optimization configuration.

All 12 content tests and 15 account tests pass, alongside TypeScript and the production build. Source lint has zero errors and one existing React Fast Refresh advisory for the provider/hook module. The full dependency audit reports zero known advisories after compatible patches, Vite 6.4.6, and a scoped patched-minimatch override. The November 14 validation changed no calls, emails, real inventory, customer accounts, or production settings.

The CMS script is loaded on demand from the official package CDN, pinned to tested version 0.266.0, following Sveltia's documented installation; the public website does not load it. Its availability is an external dependency; update the pinned version deliberately and recheck practice saves/previews. The initial editor is for trusted repository writers, not an account system with custom per-field roles.

Customer Google sign-in does not replace Sveltia's GitHub editing permission. On November 15, 2026, the isolated Netlify project `upgrade-gaming-pcs-staging` was connected to this branch with customer accounts enabled and Google's default Identity provider. Real Google consent, profile loading, persistence across reload, and logout were verified on its [account page](https://upgrade-gaming-pcs-staging.netlify.app/account). The original PR preview still has no Identity connection. The business website's production account settings were not changed. See [customer account setup and remaining checks](CUSTOMER_ACCOUNTS.md); CMS sign-in and a reversible content save were verified separately; the remaining CMS checks are listed above.

References: [Sveltia installation](https://sveltiacms.app/en/docs/start), [GitHub backend and token permissions](https://sveltiacms.app/en/docs/backends/github), [isolated test backend](https://sveltiacms.app/en/docs/backends/test).
