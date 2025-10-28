# Operations Service

Operations is a lightweight Express + Mongoose microservice that keeps farms, fields, and field activities in sync across JANI. It exposes CRUD endpoints and helper workflows that the mobile and web apps call to manage day-to-day agronomy operations.

## Capabilities

- REST API for farms, fields, and activity planning, including validation via Zod.
- Geo-aware storage for field boundaries (Polygon/MultiPolygon) with MongoDB indexes.
- Farm linkage workflow that toggles `linked` status and tracks follow-up actions.
- Demo data and migration scripts to quickly bootstrap a local database.
- All HTTP endpoints are mounted under `/api/*` (e.g. `/api/farms`); existing clients keep working without additional proxies.

## Service Layout

```
src/
  config.ts          # Environment defaults and shared settings
  index.ts           # Express bootstrap, middleware, and graceful shutdown
  constants/         # Enumerations such as user roles
  models/            # Mongoose schemas for farms, fields, activities
  routes/            # Express routers mounted under /farms, /fields, /activities
  scripts/           # Seed + migration helpers for local workflows
  utils/             # Small helpers (e.g. ObjectId parsing)
```

## Environment

| Variable | Purpose | Default |
| --- | --- | --- |
| `SERVICE_NAME` | Label returned by `/health` and logs | `operations-service` |
| `PORT` | HTTP port used by the Express server | `4003` |
| `MONGO_URI` | MongoDB connection string | `mongodb://mongo:27017/jani-operations` |

Load these from the root `.env` or export them before starting the service.

## Getting Started

```bash
cd services/operations
pnpm install
pnpm dev
```

The dev script uses `ts-node` and watches the TypeScript sources. Use `pnpm build && pnpm start` when you need the compiled `dist/` output.

A basic health probe is available at `GET /health`.

## Data Workflows

- `pnpm seed` – Populates demo farms, fields, and activities. The script is idempotent and safe to rerun.
- `pnpm migrate:auth-data` – Pulls authoritative farm data from the auth service (run after both services are online).

MongoDB indexes are defined directly on the Mongoose schemas; no separate migration step is required.

## API Surface

### Farms (`/api/farms`)

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/farms` | List farms with filters on status, owner role, owner identifier, and linkage.
| `POST` | `/api/farms` | Create a farm; validates credentials and captures linkage metadata.
| `GET` | `/api/farms/search` | Autocomplete search across name, identifier, crop, and registration ID.
| `GET` | `/api/farms/:id` | Fetch a farm plus a summary of related fields.
| `POST` | `/api/farms/:id/link` | Validate an access code and mark the farm as linked.

### Fields (`/api/fields`)

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/fields` | List fields, optionally filtered by `farmId`.
| `POST` | `/api/fields` | Create a field with validated sensors and boundary data.
| `GET` | `/api/fields/:id` | Retrieve a single field (with its parent farm summary).
| `PUT` | `/api/fields/:id` | Update field details, sensors, next actions, or linkage.
| `DELETE` | `/api/fields/:id` | Remove a field.
| `GET` | `/api/fields/:id/boundary` | Return the GeoJSON boundary (or `null` when unset).
| `PUT` | `/api/fields/:id/boundary` | Replace the boundary after geometry validation.

### Activities (`/api/activities`)

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/activities` | List activities filtered by farm, field, or status.
| `POST` | `/api/activities` | Create an activity tied to a farm (and optionally a field).
| `GET` | `/api/activities/:id` | Fetch a single activity record.
| `PUT` | `/api/activities/:id` | Update schedules, status, or supporting notes.
| `DELETE` | `/api/activities/:id` | Delete an activity.

### Health

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Lightweight service probe that reports status, uptime, and service label.

## Running with Docker Compose

The root `docker-compose.yml` declares an `operations` service. After running `docker compose up -d` at the repo root, the container serves traffic on the port listed in `.env` (default `4003`). Ensure MongoDB is also running (`docker compose up -d mongo`).

## Testing Checklist

- `pnpm lint` – ESLint against the TypeScript sources.
- `pnpm build` – Compiles TypeScript and verifies type safety.
- `pnpm seed` – Optional smoke check to ensure database connectivity.

Run the relevant commands before opening a PR that touches this service.
