# Auth Service

JANI’s Auth service handles account onboarding, credential verification, and a handful of data workflows (farms, partners, sync events) that were originally bootstrapped inside authentication. The codebase is TypeScript-first (ts-node in dev, `tsc` build for prod) and speaks to MongoDB via Mongoose.

## Capabilities

- `/auth` routes for signup, login, `verify`, and a JWT-protected `me` endpoint.
- `/data` routes surface farm linking plus partner and order lookups used by the mobile app.
- `/sync` implements a lightweight event log with sequence numbers, push/pull batching, and presigned upload handshakes for media.
- `/media/prepare` returns S3 presigned URLs using AWS SDK v3 so clients can upload files directly.
- `/jobs/merkle/run` computes and stores daily Merkle roots per owner to verify event integrity later.
- `/health` reports Mongo connection health and basic runtime metadata for probes.

## Project Layout

```
src/
  index.ts           # Express bootstrap, CORS setup, route mounting, Mongo connection
  config.ts          # Environment variable helpers (JWT secret, S3 config, etc.)
  controllers.ts     # Signup/login/me handlers and JWT issuance
  routes.ts          # `/auth/*` definitions
  dataRoutes.ts      # Auth-protected farm/partner/order endpoints
  syncRoutes.ts      # Event push/pull, media completion hooks
  jobsRoutes.ts      # Merkle root job endpoint
  media.ts           # S3 presign helper
  middleware/        # JWT auth middleware and request typings
  dataModels.ts      # Mongoose schemas for farms/partners/orders (subset mirrors seed data)
  syncModels.ts      # Sync event + sequence counter models
  merkleModels.ts    # Merkle root storage + helper utilities
  scripts/           # Seed scripts (`seedUsers.ts`, `seedDemoData.ts`)
```

## Environment

| Variable | Purpose | Default |
| --- | --- | --- |
| `PORT` | HTTP port exposed by the service | `4000` |
| `MONGO_URI` | Connection string for MongoDB | `mongodb://mongo:27017/jani-auth` |
| `JWT_SECRET` | HMAC secret for signing access tokens | _(required)_ |
| `CORS_ORIGIN` | Comma-separated allowlist for browsers | _(unset → mirrors request origin)_ |
| `AWS_REGION`/`AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` | Credentials used when presigning S3 uploads | _(unset)_ |
| `AWS_UPLOAD_BUCKET` | Target bucket for media uploads | _(unset)_ |

Copy `.env.example` (in repo root) or export variables before starting the service.

## Local Development

```bash
cd services/auth
pnpm install
pnpm dev
```

`pnpm dev` runs the service with `ts-node`, recompiling on change. For a compiled run:

```bash
pnpm build
pnpm start
```

### Health Check

```bash
curl http://localhost:4000/health
```

Example response:

```json
{
  "service": "JANI Auth Service",
  "status": "healthy",
  "version": "1.0.0",
  "uptime": 12.3,
  "mongodb": { "status": "connected", "readyState": 1 }
}
```

## Key Endpoints

| Method | Path | Notes |
| --- | --- | --- |
| `POST` | `/auth/signup` | Register a user; enforces role-specific identifiers and hashes password with bcrypt. |
| `POST` | `/auth/login` | Validate credentials and return a short-lived JWT (`15m`). |
| `POST` | `/auth/verify` | Requires `Authorization: Bearer`; returns `{ valid, user }` if token is valid. |
| `GET` | `/auth/me` | Returns current user profile (sans password). |
| `GET` | `/data/farms` | Authenticated farm listing used by mobile linking flows. |
| `POST` | `/data/farms/:id/link` | Toggle the farm linkage workflow. |
| `GET` | `/data/partners` | Partner lookup seeded for demos. |
| `GET` | `/data/orders` | Order lookup seeded for demos. |
| `POST` | `/media/prepare` | Accepts file manifest and responds with presigned upload targets. |
| `POST` | `/sync/push` | Accepts an array of client events, assigns server sequence numbers, and returns upload tasks. |
| `GET` | `/sync/pull?since=<seq>` | Stream events newer than the provided sequence number. |
| `POST` | `/jobs/merkle/run` | Compute Merkle root for the authenticated owner/date. |

All non-`/health` routes require `Authorization: Bearer <token>` issued by the signup/login flow.

## Seeding

Populate demo users and linked data for local testing:

```bash
pnpm seed:users    # farmer/exporter/admin accounts
pnpm seed:demo     # adds farms, partners, orders, events
```

Seed scripts expect the environment variables above to point at a reachable MongoDB instance.

## Testing Notes

The service currently lacks automated tests. When adding new logic, consider placing Jest/ts-node tests under a new `src/__tests__/` directory and wiring a `pnpm test` script that runs `ts-node` or `tsx`.

## Deployment Tips

- Run `pnpm build` inside CI/CD to emit `dist/` and deploy with `pnpm start` or `node dist/index.js`.
- Provide production-grade `JWT_SECRET` and limit CORS origins before shipping.
- Grant the service only presign permissions (e.g., AWS policy with `s3:PutObject`, `s3:AbortMultipartUpload`) scoped to the target bucket.
- Monitor `/sync/push` volume; it is chatty and may warrant rate limiting or background processing as usage grows.
