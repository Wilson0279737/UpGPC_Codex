# Google customer accounts

The account page lets customers sign in with Google, save gaming PCs, and return to a shortlist. Browsing, contacting the shop, and visiting the showroom require no account. Saving does not reserve a PC or lock a price. Listings no longer in the catalog remain removable from the saved list.

## Current status

The frontend is implemented and defaults off with `VITE_CUSTOMER_ACCOUNTS=false`. The existing preview returns 404 for `/.netlify/identity/settings` (rechecked November 14, 2026). No Netlify Identity service, provider configuration, production settings, or live user data was changed. There is no connected Netlify management tool in this session to enable the service.

With the feature off, public navigation and catalog save controls stay hidden and the app makes no Identity requests. Direct visits to `/account` explain that sign-in is unavailable and offer a route back to the catalog. A functioning Google button appears only when the feature is enabled and the actual service reports Google enabled; no demonstration login is presented as a real account.

## Staging setup

1. Create or select an isolated Netlify test project connected to `codex/cms-preview`. Preserve the existing `website3-2` production settings and users.
2. Enable Netlify Identity on the test project. Enable the Google external provider in Identity's registration settings. The Netlify default Google OAuth app can be used; custom Google credentials are optional for a separately branded consent flow.
3. Configure registration to match the desired customer access. Keep test users in this staging service and grant them no CMS or staff roles.
4. Set build variable `VITE_CUSTOMER_ACCOUNTS=true` for this staging deployment only, then rebuild. This is a public feature flag, not a credential. Keep secrets out of `VITE_*` variables and Git.
5. Use `/account` on the staging origin to test the actual provider. SDK 2.x uses the current origin's `/.netlify/identity`; it has no browser override for an unrelated Identity URL.
6. Verify a real Google login, provider cancellation, logout, a reload, and a new browser sign-in. Save/remove a genuine staging listing and verify the list on the second signed-in browser. Check expired access and removal of a saved system from the public catalog.
7. After those checks and the owner's separate release instruction, configure production deliberately and verify the released behavior. Do not treat the current draft PR or a mocked test as production approval.

## Behavior and boundaries

- Google provides the customer identity. The website never handles the Google password.
- SDK authentication callbacks can arrive at the root; the app completes them on `/account` and removes sensitive callback fragments from the URL.
- Saved PC IDs are stored in that user's Identity profile metadata. Account information is never committed to GitHub content or included in a website build.
- Staff authorization is separate. Google/customer sign-in does not authorize Sveltia writes or confer `editor`/`admin` roles.
- Saved IDs and return paths are bounded and validated. Unknown/sold systems can be removed without exposing draft listing data.
- Session cookies may require Google sign-in again after a full browser restart. The saved list remains with the account and returns on sign-in.
- Keep failures honest: an unconfirmed save or failed logout must not be displayed as a success.
- Temporary service and profile failures offer a retry in the account page. Retrying reads the current account and server profile again; an old cached shortlist is not presented as a confirmed result. Concurrent retries are ignored.

## Verification

`npm run test:auth` has 15 checks covering default-disabled behavior, current-account isolation, metadata preservation, failure handling, timeout/retry recovery, late responses after account changes, payload limits, and allowed return paths. Tests use isolated substitutes for the Identity service and contain no real credentials. Hosted Google consent, provider configuration, and real authenticated persistence remain pending staging activation.

Official references: [Identity setup](https://docs.netlify.com/manage/security/secure-access-to-sites/identity/get-started/), [Google and registration](https://docs.netlify.com/manage/security/secure-access-to-sites/identity/registration-login/), [current SDK](https://www.npmjs.com/package/@netlify/identity).
