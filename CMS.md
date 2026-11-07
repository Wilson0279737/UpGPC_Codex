# Upgrade Gaming PCs CMS

## Scope

Owner/trusted repository writers can edit the home banner, about section, contact page introduction, shared contact details and visiting note, service cards, catalog introduction, and individual PC listings. Existing branding, photography, pages, warranties, and payment claims remain as they were. There are no invented systems, prices, performance claims, customer accounts, payments, or customer records.

Sveltia CMS provides the editing interface and GitHub integration. This keeps content in the existing repository and works with the existing Netlify previews. The chosen initial sign-in is a repository-scoped GitHub access token, requiring no new paid service, OAuth app, identity database, or production setting changes. An OAuth convenience flow can be added separately if desired.

## Routes and data

- `/admin/`: owner welcome and real GitHub editor.
- `/admin/help.html`: first sign-in, editing, token recovery, and release instructions.
- `/admin/demo.html`: isolated, browser-persistent practice editor, seeded during build.
- `project/src/content/site.json`: website copy and shared contact information.
- `project/src/content/services.json`: service cards.
- `project/src/content/products/*.json`: one PC per file; new entries default to draft.
- `project/public/uploads/`: uploaded photographs.

Available and reserved PCs appear in `/products`, with available systems first. Draft and sold systems are excluded during the build, not just hidden with CSS. Empty inventory has useful contact and Marketplace actions. An omitted price shows “Call for pricing”; no checkout or reservation transaction is implied. Inquiry links include the PC name in the email subject.

The generated catalog and practice seed are ignored by Git and refreshed at build time. Rebuild after editing local source content. The CMS commits relative to the repository root, so paths include `project/`; public photo URLs start at `/uploads/`.

## Preview and release

The initial preview branch is `codex/cms-preview`. Keep its draft pull request open to refresh the Netlify preview on each CMS save. Never use production content credentials for additional staging services. No new environment variables or callback URLs are needed for token sign-in.

The `Publish` action within the editor commits to the configured preview branch. It does not merge to `main` or publish production. The owner's explicit release instruction is still required for that separate action. If this branch is merged later, establish the next persistent staging/release review arrangement before continuing edits; a closed PR no longer provides updating PR previews.

## Validation and limits

`npm run build` checks content, generates practice fixtures and the public catalog, type-checks, and builds. `npm run test:content` checks visibility, preview targeting, price/status constraints, contact links, and required photos/alternate text. Invalid content fails the preview build with field-specific messages, retaining the previous successful deployment.

GitHub enforces repository write authorization. The CMS is a client application, and its configuration contains no secret. Its documented sign-in stores the owner's token in browser local storage. Use a trusted browser, short token expiry, Contents read/write for this repository only, and sign out/revoke in GitHub as appropriate. GitHub provides password and account recovery. The editor intentionally hides unconfigured OAuth sign-in.

Authentication against the owner's GitHub account requires their own token. Without it, real remote sign-in, sign-out, token recovery, and browser-to-GitHub saving cannot be certified. Practice editing and persistence exercise the UI but are not a substitute for that final authenticated check. No owner token was generated, extracted, or reused from another application.

The CMS script is loaded on demand from the official package CDN, following Sveltia's documented installation; the public website does not load it. Its availability and future updates are external dependencies. The initial editor is for trusted repository writers, not an account system with custom per-field roles.

References: [Sveltia installation](https://sveltiacms.app/en/docs/start), [GitHub backend and token permissions](https://sveltiacms.app/en/docs/backends/github), [isolated test backend](https://sveltiacms.app/en/docs/backends/test).
