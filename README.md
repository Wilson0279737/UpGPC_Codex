# Upgrade Gaming PCs

Website: [upgradegamingpcs.com](https://upgradegamingpcs.com)

The current app is in `project/`. It uses React 18, TypeScript, Vite 5, Tailwind, and React Router. Routes are `/`, `/services`, `/products`, `/about`, and `/contact`. The nested `project/Site1.0/project/` folder contains an older copy. The owner editor is at `/admin/`, with a browser-only practice editor at `/admin/demo.html`.

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

Vite writes the build to `project/dist/`. `npm run preview` serves that built output. The build validates CMS content, generates the public catalog and practice data, checks TypeScript, and then builds Vite. `npm run test:content` checks catalog visibility and content validation rules.

## Review changes before release

1. Create a feature branch and open a pull request against `main`.
2. Wait for the GitHub build check and Netlify Deploy Preview to complete.
3. Open the preview URL to review the actual hosted app. Check desktop/mobile layouts and refresh each affected route directly.
4. Iterate on the branch; successful pushes update the PR's Netlify preview.
5. Merge or publish to production only after an explicit release instruction from the site owner. Verify the live site after release.

Netlify project `website3-2` uses `main` for production. The root `netlify.toml` records base directory `project`, build command `npm run build`, publish directory `dist` relative to that base, and Node.js 22. The SPA route fallback is kept in `project/public/_redirects`.

The GitHub workflow installs locked dependencies and builds the app on pull requests and pushes to `main`. It does not publish the site. Netlify handles previews and production deployment through the existing repository connection. An automatic production deploy can follow a merge to `main`, so treat that merge as a release action.

## Website content management

The CMS uses Sveltia with the existing GitHub repository. It is for the owner and trusted repository writers, without a new customer login system or database. Website copy and contact details are in `project/src/content/site.json`; services are in `services.json`; each PC is a separate JSON file in `products/`. Uploaded photos are in `project/public/uploads/`.

The editor commits only to `codex/cms-preview`. Keep its pull request open so saved edits rebuild the Netlify Deploy Preview. Production still requires an explicit release instruction. The CMS may label saving as publishing; here that only updates the configured preview branch. Do not retarget the CMS to `main` without a separate release decision.

First sign-in uses a GitHub fine-grained access token restricted to this repository with Contents read/write. OAuth is not advertised because no OAuth app has been configured. No credentials belong in the repository, CMS fields, or `VITE_*` variables. Read the [owner editing guide](project/public/admin/help.html) and [CMS implementation and verification notes](CMS.md). Sveltia stores the token in browser local storage; sign out on shared computers and revoke expired or exposed tokens in GitHub.

The practice editor uses Sveltia's virtual test repository, with copies of public page content and a clearly labeled draft sample. It cannot write to GitHub. Draft and sold real PCs are omitted from the generated public catalog and practice data. GitHub remains a public repository, so drafts must still contain only publishable information. The file-backed content is loaded at build time; after a local edit, rebuild or restart the dev server.

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
