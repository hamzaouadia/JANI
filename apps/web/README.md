# Web App (apps/web)

Next.js 15 application that powers the JANI marketing site and authenticated dashboard experience. It consumes the `services/auth` API for session handling and is designed to run either as part of the Docker Compose stack or independently during development.

## Prerequisites

- Node.js 20.x
- npm 10+
- Docker (optional, for full-stack testing)
- Root-level `.env` with `WEB_PORT`, `NEXT_PUBLIC_AUTH_URL`, and `JWT_SECRET`

## Installation

From the repo root:

```bash
npm install --workspace apps/web
```

This will create `apps/web/node_modules` using the workspace-aware npm configuration. Re-run the command whenever `package.json` changes.

## Development

```bash
npm run dev --workspace apps/web
```

The app listens on `http://localhost:3000` by default. When running alongside Docker Compose, ensure the port is not already bound by the containerised instance.

## Production Build

```bash
npm run build --workspace apps/web
npm run start --workspace apps/web
```

`npm run start` serves the production bundle using Next.js' Node runtime. In Docker Compose this command is executed automatically.

## Linting

```bash
npm run lint --workspace apps/web
```

The lint configuration mirrors the rules enforced in CI.

## Environment Variables

The web app expects the following values (usually provided via the root `.env` when using Docker Compose):

| Variable                | Description                                          |
| ----------------------- | ---------------------------------------------------- |
| `WEB_PORT`              | Port exposed when running in Docker                  |
| `NEXT_PUBLIC_AUTH_URL`  | Base URL of the Auth service used for client calls   |
| `JWT_SECRET`            | Shared secret for validating tokens server-side      |

For standalone development you can inject them via a `.env.local` file in `apps/web`.

## Working with Docker Compose

When you run `make` from the repository root, the web container is built and started automatically. Use this flow to validate cross-service behaviour, especially authentication and API gateway integration.

## Related Docs

- [Root README](../../README.md) – monorepo overview and shared tooling
