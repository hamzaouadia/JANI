# mobile-design (scaffold)

This folder is a small scaffold for a mobile app using the same tech choices as the repo's `apps/mobile` package (Expo + React Native + TypeScript + Jest).

What's included:

- `src/` — minimal Expo app (`App.tsx`, entry `index.tsx`)
- `lib/` — small helper
- `__tests__/` — sample Jest test
- `package.json` & `tsconfig.json` — minimal scripts and config to match the monorepo conventions

To finish setup:

1. From the repo root, add this package to your workspace (if desired) in `package.json` workspaces.
2. Run your package manager (npm/pnpm/yarn) to install dependencies.
3. Run `npm run start` from this folder to start the Expo dev tools (after installing dependencies).

If you want, I can add `mobile-design` to the monorepo `workspaces` in the root `package.json` and run an initial `npm install` for you.
