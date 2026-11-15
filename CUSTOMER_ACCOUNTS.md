# Google customer accounts

The account page lets customers sign in with Google, save gaming PCs, and return to a shortlist. Browsing, contacting the shop, and visiting the showroom require no account. Saving does not reserve a PC or lock a price. Listings no longer in the catalog remain removable from the saved list.

## Current status

Google customer sign-in is active on the isolated [account staging site](https://upgrade-gaming-pcs-staging.netlify.app/account), configured November 15, 2026. Netlify project `upgrade-gaming-pcs-staging` builds `codex/cms-preview` with `VITE_CUSTOMER_ACCOUNTS=true`, Identity enabled, open customer registration, and Google's default Netlify OAuth configuration. Google therefore names Netlify as the app during consent. No custom Google credentials or application secrets were added to Git.

The existing `website3-2` business website and its production branch `main` were not changed. The original PR Deploy Preview remains a separate, account-disabled review environment; use the staging link above for real Google login. Outside the staging project's environment, the frontend continues to default off with `VITE_CUSTOMER_ACCOUNTS=false`.

With the feature off, public navigation and catalog save controls stay hidden and the app makes no Identity requests. Direct visits to `/account` explain that sign-in is unavailable and offer a route back to the catalog. A functioning Google button appears only when the feature is enabled and the actual service reports Google enabled; no demonstration login is presented as a real account.

## Staging configuration and remaining release checks

1. Reuse Netlify project `upgrade-gaming-pcs-staging`, already connected to `codex/cms-preview`. Its base is `project`, build command is `npm run build`, publish directory is `dist`, and Node.js 22 is set by `netlify.toml`. Preserve the existing `website3-2` production settings and users.
2. Enable Netlify Identity on the test project. Enable the Google external provider in Identity's registration settings. The Netlify default Google OAuth app can be used; custom Google credentials are optional for a separately branded consent flow.
3. Configure registration to match the desired customer access. Ordinary customers receive no administrative roles. Administrative roles must be assigned explicitly through trusted Netlify management; the owner's staging account was manually assigned `admin` on November 15, 2026 at their request.
4. Set build variable `VITE_CUSTOMER_ACCOUNTS=true` for this staging deployment only, then rebuild. This is a public feature flag, not a credential. Keep secrets out of `VITE_*` variables and Git.
5. Use `/account` on the staging origin to test the actual provider. SDK 2.x uses the current origin's `/.netlify/identity`; it has no browser override for an unrelated Identity URL.
6. Real Google consent, return to `/account` without token fragments, signed-in profile display, empty shortlist loading, session persistence after reload, and logout were verified November 15. Before a full account/shortlist release, also exercise provider cancellation, account recovery, a separate browser sign-in, and expired access. Two genuine Marketplace PCs were later imported into the preview CMS on November 15; save/remove and second-browser persistence checks can now use those entries, including after a saved PC leaves the public catalog. These additional checks remain unverified. No inventory was invented.
7. After those checks and the owner's separate release instruction, configure production deliberately and verify the released behavior. Do not treat the current draft PR or a mocked test as production approval.

## Behavior and boundaries

- Google provides the customer identity. The website never handles the Google password.
- SDK authentication callbacks can arrive at the root; the app completes them on `/account` and removes sensitive callback fragments from the URL.
- Saved PC IDs are stored in that user's Identity profile metadata. Account information is never committed to GitHub content or included in a website build.
- Staff authorization is separate. Google/customer sign-in does not automatically authorize Sveltia writes or confer `editor`/`admin` roles.
- The owner's staging account has a manually assigned `admin` role in trusted Identity `app_metadata`, verified after reloading the Netlify user settings on November 15, 2026. Other customer accounts are not automatically elevated. Role updates take effect at the next login or token refresh.
- After a fresh profile reports the trusted `admin` role, `/account` shows a Website administration panel linking to `/admin/`. Ordinary customers and incomplete/failed profile loads do not show this panel. It is a navigation convenience, not a write authorization boundary.
- Sveltia still requires a separate GitHub editing key with repository Contents read/write permission. The CMS commits to `codex/cms-preview`; no GitHub credential or write service is supplied by the Google Identity role. The owner's separate editing-key setup was verified November 15, 2026: the real CMS loaded content, saved a reversible change to this preview branch, restored the exact original file, and reopened after reload without another key prompt. CMS sign-out, key replacement/recovery, and new-media commits remain unverified. Do not describe this as Google-only CMS editing. User-editable profile metadata must never authorize administrative writes.
- Saved IDs and return paths are bounded and validated. Unknown/sold systems can be removed without exposing draft listing data.
- Session cookies may require Google sign-in again after a full browser restart. The saved list remains with the account and returns on sign-in.
- Keep failures honest: an unconfirmed save or failed logout must not be displayed as a success.
- Temporary service and profile failures offer a retry in the account page. Retrying reads the current account and server profile again; an old cached shortlist is not presented as a confirmed result. Concurrent retries are ignored.

## Verification

`npm run test:auth` has 15 checks covering default-disabled behavior, current-account isolation, metadata preservation, failure handling, timeout/retry recovery, late responses after account changes, payload limits, and allowed return paths. Tests use isolated substitutes for the Identity service and contain no real credentials.

On November 15, 2026, the staging production build from application commit `55a7349` succeeded. A real Google login completed through Netlify Identity and returned to the clean `/account` URL. The signed-in profile and empty Saved PCs page loaded, the session survived a reload, and signing out returned to the Google button. The original login test used a staging-only account without staff or CMS roles. The owner's later requested `admin` Identity role was assigned separately; the role assignment did not add Google-to-CMS integration. Customer identities and credentials were not committed to this repository. Cross-browser saved-list persistence and the additional scenarios listed above remain unverified.

Official references: [Identity setup](https://docs.netlify.com/manage/security/secure-access-to-sites/identity/get-started/), [Google and registration](https://docs.netlify.com/manage/security/secure-access-to-sites/identity/registration-login/), [current SDK](https://www.npmjs.com/package/@netlify/identity), [trusted user roles](https://docs.netlify.com/manage/security/secure-access-to-sites/identity/manage-existing-users/).
