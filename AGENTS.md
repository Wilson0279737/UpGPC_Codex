# Working on Upgrade Gaming PCs

## Project layout

- The current app lives in `project/`: React, TypeScript, Vite, and Tailwind.
- `project/Site1.0/project/` is an older copy. Work in the top-level `project/` unless a task specifically targets the older copy.
- Netlify project `website3-2` serves `https://upgradegamingpcs.com` from production branch `main`.
- Keep the SPA fallback in `project/public/_redirects` so direct route visits work.

## Change and release workflow

1. Make each change on a feature branch and open a pull request.
2. Build the app and review the actual Netlify Deploy Preview. Include the preview URL and validation results in the PR.
3. Check desktop and mobile layouts, navigation, and direct visits to affected routes.
4. Wait for an explicit production release instruction before merging into `main`, publishing a production deploy, or changing production settings. A request to build or preview a feature authorizes preview work.
5. After an approved release, verify the live site and record the deployed commit.

## Independent review workflow

- The implementing agent owns the feature branch, code changes, validation, preview, and integration. The owner's other Chrome account provides an independent review when its use is authorized.
- Hand the reviewer the exact commit, task, constraints, relevant source, and actual preview URL when available. Label source-only reviews explicitly.
- Verify each finding before changing code; distinguish reproducible bugs from design proposals. Record accepted decisions and validation in the PR and project documentation.
- See [the UX redesign record](docs/UX-REDESIGN.md) for the research, design direction, review findings, and task-based checks.

## Local validation

Use Node.js 22. Run commands from `project/`:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Install locked dependencies after checkout or dependency changes. Run `npm run build` for changes that affect the app or deployment. The GitHub workflow checks installation and the production build. The build validates CMS content, creates the public catalog and isolated practice seed, checks TypeScript, then runs Vite. `npm test` runs the content and account-session tests; GitHub runs those groups after the build.

For future functions or Netlify-specific routing, use Netlify Dev with the preview/development context and verify the hosted preview too.

## Future CMS and login work

- Establish the required editing roles, content, and user journeys before selecting a provider.
- Use staging content, test users, and separate non-production service configuration for previews. Configure Netlify context-specific variables explicitly.
- Exercise real sign-in, sign-out, recovery, authorization, and persistence flows in the preview when they are introduced.
- Configure allowed callback URLs and CORS origins for the preview environment. Keep secrets in server-side variables; `VITE_*` values are public browser configuration.
- Preserve the existing production data and release behavior until an explicit release is approved.

See `README.md` for the original live baseline and backup reference.
