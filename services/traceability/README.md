# Traceability Service

Traceability is an Express + Mongoose microservice that records on-farm events (planting, irrigation, harvest, inspections) so other JANI components can build timelines and compliance reports. The codebase favors clarity and explicit validation over blockchain extras that are mentioned in older docs.

## Capabilities

- REST API under `/api/events` for CRUD operations on traceability events.
- Extensive Joi validation covering event type, metadata, attachments, and location.
- Mongoose schema with indexes on farm, plot, type, and occurrence date for fast queries.
- Basic verification workflow: mark events as `verified`, capture `verifiedBy`, and expose helpers for timelines.
- Health endpoints (`/health`, `/health/detailed`, `/health/ready`, `/health/live`) that report MongoDB status and process metrics.

## Project Layout

```
src/
  index.js            # Express bootstrap, middleware, Mongo connection, graceful shutdown
  routes/
    events.js         # REST handlers plus bulk insert and farm timeline helpers
    health.js         # Liveness, readiness, and detailed health probes
  models/
    TraceabilityEvent.js  # Mongoose schema, indexes, statics, and instance helpers
.env.example           # Sample configuration values
Dockerfile             # Production image definition
```

## Environment

| Variable | Purpose | Default |
| --- | --- | --- |
| `PORT` | HTTP port for the Express server | `3004` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/jani_traceability` |
| `ALLOWED_ORIGINS` | Comma-separated list of origins allowed by CORS | `http://localhost:3000,http://localhost:8081` |
| `NODE_ENV` | Runtime mode toggling logging and error output | `development` |
| `TRACEABILITY_SERVICE_URL` | Public URL used by other services | `http://localhost:3004` |
| `JWT_SECRET` | Shared secret when protecting routes with auth middleware (currently optional) | _(unset)_ |

Copy `.env.example` to `.env` and adjust for your environment.

## Local Development

```bash
cd services/traceability
pnpm install
pnpm dev
```

`pnpm dev` runs the service with nodemon so changes under `src/` reload automatically. For a production-like run, use `pnpm start` (plain Node.js) after ensuring MongoDB is up.

### MongoDB

The service expects a Mongo instance with a database named `jani_traceability`. If you are using the root `docker compose` setup, start everything with:

```bash
docker compose up -d mongo traceability
```

Otherwise run a local Mongo container:

```bash
docker run --rm -d -p 27017:27017 --name mongo mongo:7
```

Indexes are defined within the model, so no additional migration step is required.

## API Highlights

### Health

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Liveness probe with basic service metadata. |
| `GET` | `/health/live` | Lightweight readiness probe used by containers. |
| `GET` | `/health/ready` | Checks Mongo connectivity before reporting ready. |
| `GET` | `/health/detailed` | Extended metrics including uptime, memory, and Mongo connection info. |

### Events (`/api/events`)

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/events` | List events with filters (`farmId`, `plotId`, `type`, date range, `verified`, `syncStatus`). |
| `GET` | `/api/events/:id` | Fetch a single event document with populated `userId`/`verifiedBy`. |
| `POST` | `/api/events` | Create an event, assign a UUID `eventId`, and persist metadata/attachments. |
| `PUT` | `/api/events/:id` | Update an existing event using the same Joi schema as creation. |
| `DELETE` | `/api/events/:id` | Remove an event. |
| `POST` | `/api/events/bulk` | Validate and insert multiple events (returns per-item validation errors). |
| `GET` | `/api/events/farm/:farmId/timeline` | Chronological farm (or optional plot) event stream. |
| `GET` | `/api/events/farm/:farmId/summary` | Aggregated counts by event type for dashboard summaries. |

Responses follow a consistent envelope: `{ success, data, message? }`. Validation issues return HTTP 400 with an `errors` array.

## Data Model

- `TraceabilityEvent` documents store `eventId` (UUID), `type`, timestamps, farm/plot references, metadata, attachments, verification flags, and sync status fields.
- Virtual `farmState` groups events by lifecycle phase; static helpers provide `getFarmTimeline` and `getEventsByFarm` query shortcuts.
- Instance helpers `markAsVerified` and `markAsSynced` wrap common status updates to keep audit fields consistent.
- Mongo indexes (farm + occurredAt, plot + occurredAt, type + occurredAt, user + occurredAt, eventId unique) live inside the schema so collections self-heal on startup.

## Security & Middleware

- Helmet, CORS, and express-rate-limit are registered before routes.
- JSON and URL-encoded bodies are limited to 10 MB to avoid oversized uploads.
- Joi validation enforces allowed event types, restricts attachment URLs, and ensures geolocation bounds.
- Health routes provide readiness/liveness endpoints that can be wired into Docker Compose or Kubernetes probes.

## Testing & Quality

- `pnpm test` points to Jest; add route tests under `src/__tests__` when logic grows.
- Manual smoke test: start Mongo, run `pnpm dev`, and call `GET /health` plus `POST /api/events` with sample payloads.
- When changing schemas, rerun a filtered query (`GET /api/events?limit=1`) to confirm serialization still matches expectations.

## Operational Notes

- The service logs to stdout; plug into the platform's log stack (e.g., Loki, CloudWatch) in production.
- Graceful shutdown closes the HTTP server and Mongo connection on `SIGINT`/`SIGTERM` to avoid dangling connections.
- `/api/events/bulk` is the heaviest route—monitor it for rate limiting or batching needs if mobile clients upload offline packets.
- When exposing the service externally, add JWT/authorization middleware; the scaffolding is ready via `JWT_SECRET` but currently disabled by default.
