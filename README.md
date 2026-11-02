# Upgrade Gaming PCs

Website: [upgradegamingpcs.com](https://upgradegamingpcs.com)

The current app is in `project/`. It uses React 18, TypeScript, Vite 5, Tailwind, and React Router. Routes are `/`, `/services`, `/products`, `/about`, and `/contact`. The nested `project/Site1.0/project/` folder contains an older copy.

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

Vite writes the build to `project/dist/`. `npm run preview` serves that built output. The current `build` script does not run a separate TypeScript check or test suite.

## Review changes before release

1. Create a feature branch and open a pull request against `main`.
2. Wait for the GitHub build check and Netlify Deploy Preview to complete.
3. Open the preview URL to review the actual hosted app. Check desktop/mobile layouts and refresh each affected route directly.
4. Iterate on the branch; successful pushes update the PR's Netlify preview.
5. Merge or publish to production only after an explicit release instruction from the site owner. Verify the live site after release.

Netlify project `website3-2` uses `main` for production. The root `netlify.toml` records base directory `project`, build command `npm run build`, publish directory `dist` relative to that base, and Node.js 22. The SPA route fallback is kept in `project/public/_redirects`.

The GitHub workflow installs locked dependencies and builds the app on pull requests and pushes to `main`. It does not publish the site. Netlify handles previews and production deployment through the existing repository connection. An automatic production deploy can follow a merge to `main`, so treat that merge as a release action.

## Adding a CMS or login later

The current app has no CMS, authentication, database, or server-side API. Choose those services when the feature requirements are known.

Use separate staging content, test users, and preview credentials for development. Set distinct Netlify variable values for production and previews; variables otherwise default to all contexts. Configure authentication callback URLs and allowed API origins for the preview URL. Keep private credentials server-side; values prefixed with `VITE_` are bundled into browser JavaScript.

For Netlify Functions, redirects, and context-specific variables, use Netlify Dev locally and then validate the hosted preview. Test complete login and editing flows against real staging services. A persistent staging branch can be added if a stable review URL or CMS draft preview becomes useful.

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
