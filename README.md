# Upgrade Gaming PCs

Website: [upgradegamingpcs.com](https://upgradegamingpcs.com)

The current app is in `project/`. It uses React 18, TypeScript, Vite 6.4, Tailwind, and React Router. Routes are `/`, `/services`, `/products`, `/about`, and `/contact`. The nested `project/Site1.0/project/` folder contains an older copy. The owner editor is at `/admin/`, with a browser-only practice editor at `/admin/demo.html`.

## Run locally

Use Node.js 22 and run:

```sh
cd project
npm ci
npm run dev
```

For a production build and local build preview:

```sh
npm run build
npm run preview
```

Vite writes the build to `project/dist/`. `npm run preview` serves that built output. The build validates CMS content, generates the public catalog and practice data, checks TypeScript, and then builds Vite. `npm test` runs content and account-session checks. `npm run test:content` and `npm run test:auth` run each group separately.

## Review changes before release

1. Create a feature branch and open a pull request against `main`.
2. Wait for the GitHub build check and Netlify Deploy Preview to complete.
3. Open the preview URL to review the actual hosted app. Check desktop/mobile layouts and refresh each affected route directly.
4. Iterate on the branch; successful pushes update the PR's Netlify preview.
5. Merge or publish to production only after an explicit release instruction from the site owner. Verify the live site after release.

Netlify project `website3-2` uses `main` for production. The root `netlify.toml` records base directory `project`, build command `npm run build`, publish directory `dist` relative to that base, and Node.js 22. The SPA route fallback is kept in `project/public/_redirects`.

The GitHub workflow installs locked dependencies, builds the app, and runs content/account tests on pull requests and pushes to `main`. It does not publish the site. Netlify handles previews and production deployment through the existing repository connection. An automatic production deploy can follow a merge to `main`, so treat that merge as a release action.

## Website content management

The CMS uses Sveltia with the existing GitHub repository. It is for the owner and trusted repository writers, without a new customer login system or database. Website copy and contact details are in `project/src/content/site.json`; services are in `services.json`; each PC is a separate JSON file in `products/`. Uploaded photos are in `project/public/uploads/`.

The editor commits only to `codex/cms-preview`. The live site's `/admin` routes redirect to the [persistent owner workspace](https://upgrade-gaming-pcs-staging.netlify.app/admin/) so its dashboard and review links reflect that editing branch. Its Netlify staging project continues building saved edits after a PR closes. Retain the branch after a release and open the next PR against `main` for subsequent changes. Production still requires an explicit release instruction. The CMS may label saving as publishing; here that only updates the configured preview branch. Do not retarget the CMS to `main` without a separate release decision.

First sign-in uses a GitHub fine-grained access token restricted to this repository with Contents read/write. OAuth is not advertised because no OAuth app has been configured. No credentials belong in the repository, CMS fields, or `VITE_*` variables. Read the [owner editing guide](project/public/admin/help.html) and [CMS implementation and verification notes](CMS.md). Sveltia stores the token in browser local storage; sign out on shared computers and revoke expired or exposed tokens in GitHub.

The practice editor uses Sveltia's virtual test repository, with copies of public page content and a clearly labeled draft sample. It cannot write to GitHub. Draft and sold real PCs are omitted from current stock and practice data. Sold PCs have their own public archive at `/products#sold-pcs`, with historical prices, photos, search, type filters, and pagination; Draft hides a PC completely. The archive initially contains 124 sold gaming-computer records from 127 Marketplace listings, including 3 gaming laptops; three exact repeat ads were combined. GitHub remains a public repository, so drafts must still contain only publishable information. The practice seed includes an example photograph that stays outside the real catalog and uploads. The file-backed content is loaded at build time; after a local edit, rebuild or restart the dev server.

## Customer accounts

`/account` provides Google sign-in and a saved-PC shortlist through the current `@netlify/identity` SDK. This is separate from Sveltia's editor authorization. `VITE_CUSTOMER_ACCOUNTS` must equal `true`, and the connected Identity service must report its Google provider enabled. The reviewed branch enables the flag for production builds in `netlify.toml`; other build contexts default off unless explicitly enabled. With the flag off, public account links and save buttons stay hidden, and no Identity requests are made on normal page visits.

The isolated Netlify project `upgrade-gaming-pcs-staging` builds `codex/cms-preview` with Identity/Google enabled and `VITE_CUSTOMER_ACCOUNTS=true`. Its November 16, 2026 deployment `6afb3cce31f4038e8ce1b3fe` at application commit `6bbbe9d` passed real Google sign-in, selected-PC handoff, explicit save, reload persistence, removal, reload removal, and logout; the initial empty shortlist was restored. Use its [account preview](https://upgrade-gaming-pcs-staging.netlify.app/account) for real sign-in; the original PR Deploy Preview remains account-disabled. The staging branch was fast-forwarded to the reviewed application revision without service setting changes.

Production preflight on November 16 confirmed that `website3-2` already has Identity enabled at `https://upgradegamingpcs.com/.netlify/identity`, open registration, required email confirmation, and the default Google provider enabled. The existing live `/account` page offered Google sign-in; no service configuration changes were needed. The owner authorized the reviewed storefront's production release. These preflight results do not establish completion of that release; see [PR #6](https://github.com/Wilson0279737/UpGPC_Codex/pull/6) for the deployed commit and final live verification.

See [customer account setup and remaining checks](CUSTOMER_ACCOUNTS.md) and the owner guide. Customer profiles and saved lists belong to Identity, not to the public content repository. `npm run test:auth` checks session and profile-save behavior using isolated service doubles. The November 15 checks at `55a7349` remain historical evidence. Separate-browser persistence, provider cancellation, recovery, expired access, and removal after a saved PC leaves the public catalog remain unverified integration scenarios.

## Direct shop

`/shop` displays a Shopify collection and opens Shopify Checkout for the selected product. See [direct shop setup and release checks](docs/DIRECT-SHOP.md) for eBay catalog sync, Shopify, and Netlify configuration.

## Original live baseline and backup

The site was backed up to Google Drive on November 2, 2026, before this workflow setup. The private dated backup is held separately from this repository and contains deployed files, editable source, restore instructions, and archive checksums.

- Netlify deploy: `69bb3bb7cf0ab93c99b4d20b`, published March 18, 2026.
- Source commit: `61583d17c03899ab7e723826aa1aa74e9cda5018`.
- [Saved deployment details](https://app.netlify.com/projects/website3-2/deploys/69bb3bb7cf0ab93c99b4d20b).
- [Baseline version preview](https://69bb3bb7cf0ab93c99b4d20b--website3-2.netlify.app/).

## References

- [Netlify Deploy Previews](https://docs.netlify.com/deploy/deploy-types/deploy-previews/)
- [Netlify Dev](https://docs.netlify.com/api-and-cli-guides/cli-guides/local-development/)
- [Netlify environment variables](https://docs.netlify.com/build/environment-variables/overview/)

## Build maintenance

Use Node.js 22.19 or newer (Node.js 24 is also supported). Vite 6.4 receives security fixes without a framework migration. The lockfile includes current compatible dependency patches. A scoped override gives the TypeScript ESLint parser a patched `minimatch` 11 release; this requires Node.js 20/22 or newer and is checked by the source lint/build. Keep that override until the parser no longer requires the affected major. The archived `Site1.0/` is excluded from active linting.
