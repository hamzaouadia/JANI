# Copilot / AI Agent Instructions — JANI Platform

This short guide helps AI coding agents become productive in the JANI monorepo quickly. It focuses on facts and concrete commands found in the repository (no aspirational advice).

1) Big picture (what matters)
- Monorepo layout: `apps/` (frontend clients: `mobile`, `web`) and `services/` (microservices: `auth`, `user`, `traceability`, `ai`). Root orchestration is `docker-compose.yml`.
- Mobile: Expo + React Native (SDK ~54, RN 0.81.5). Mobile native dev runs with `apps/mobile` (development with `npm start`). A Docker-based Metro dev service is configured (`mobile` service in `docker-compose.yml`).
- Backends: each service runs independently. Key ports (from `.env` / `docker-compose.yml`): auth=4000, web=3000, traceability=5002, user=5000, ai=5001.
- Data seeding: `services/auth` contains seed scripts and JSON files (e.g. `seed-*.json` and `seed-all-data.js`). `seed-data` service in `docker-compose.yml` runs those.

2) Developer workflows & commands (use these; they are project-canonical)
- Bring core infra up (mongo / redis):
  ```bash
  docker compose up -d mongo redis
  ```
- Full local dev (monorepo):
  ```bash
  # root (installs and starts via docker-compose)
  npm install
  docker compose up -d

  # web dev
  cd apps/web
  npm install
  npm run dev

  # mobile dev (local)
  cd apps/mobile
  npm install
  npm start
  ```
- Start mobile inside Docker (used by CI/dev):
  ```bash
  docker compose up -d --build mobile
  ```
  Note: Dockerfile for mobile uses `npx expo start --lan` so Expo expects LAN mode.

- Seeding the DB (auth service):
  ```bash
  docker compose run --rm seed-data
  # or run from the auth service:
  cd services/auth
  pnpm run seed:demo  # check package.json scripts in services/auth
  ```

3) Project-specific conventions and patterns
- Services use pnpm where present (check `services/*/package.json`), while `apps/*` commonly use npm/expo.
- Environment variables: centralized at root `.env`. Service `docker-compose` entries use those values (e.g. `${AUTH_PORT}`). When modifying services, prefer reading `.env` to find ports.
- Mobile dev: Because Expo rejects `0.0.0.0` for host mode, the project uses `--lan` in Docker; inside containers set `EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0` and `REACT_NATIVE_PACKAGER_HOSTNAME` to host IP (`.env` adds `MOBILE_HOST`).
- API clients in mobile: `apps/mobile/src/lib/api/*` (files: `authClient.ts`, `client.ts`, `users.ts`, `farms.ts`, `orders.ts`, `partners.ts`, `events.ts`, `traceabilityClient.ts`). Copying these into a fresh mobile app is canonical for reconnecting UI to backend.
- Seed backups: `services/auth/` contains many `.backup` files (e.g. `seed-farms.json.backup`). These are intentional backups; do not delete without confirmation.

4) Integration points & cross-component communication
- Services talk over HTTP. The `auth` service is often the primary API (user/profile management). Traceability has its own DB and API.
- Media storage: `minio` (S3-compatible) is provisioned in `docker-compose.yml` — services use `S3_*` env vars.
- Frontends call backend services by hostnames defined in docker compose (e.g. `http://auth:${AUTH_PORT}`) — use container hostnames inside compose.

5) Lint/tests/build notes for agents
- Root targets in `Makefile`: `dev`, `docker-up`, `build`. Use `make` to find canonical flows.
- Linting/formatting commands are defined in package.json scripts at root (run `npm run lint`, `npm run format`).
- Type-check: run `npm run typecheck` in the package where you changed TS code.
- Prefer running single-service builds/tests locally before cross-repo changes to reduce CI cycles.

6) Safe cleanup rules (how to remove unused files safely)
- Non-destructive first: mark things as deprecated rather than deleting. Example: add `DEPRECATED.md` or move large backups into `archive/`.
- Do not remove seed files in `services/auth` without confirming; they are used by `seed-data` job.
- For code removal, prefer: (1) run linter (`npm run lint`) and the TS compiler, (2) run unit tests for the package, (3) open a small PR with deletion and CI results.

7) Examples and quick references
- Where to find API clients (mobile): `apps/mobile/src/lib/api/index.ts` exports the convenience functions used by screens.
- Mobile entry and startup: `apps/mobile/App.tsx` (fresh template shows `getUsers()` test screen)
- Docker config for mobile: `docker-compose.yml` service `mobile` and `apps/mobile/Dockerfile` (uses `npx expo start --lan`).
- Seed scripts: `services/auth/seed-all-data.js`, `services/auth/seed-traceability-events.js`.

8) When in doubt — immediate checks for an AI agent
- Is there a `package.json` in the package? Use that package's scripts.
- Check `docker-compose.yml` for service names/ports before using `localhost`.
- Run `pnpm` for services that contain `pnpm-lock.yaml`; otherwise `npm` for apps.

If anything here is out-of-date or you want the agent to follow stricter rules (for example automatic deletion PRs), tell me and I will update this file.
