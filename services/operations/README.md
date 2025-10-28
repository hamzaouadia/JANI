# Operations Service# Operations Service



> **Farm operations and activities management**Operations is a lightweight Express + Mongoose microservice that keeps farms, fields, and field activities in sync across JANI. It exposes CRUD endpoints and helper workflows that the mobile and web apps call to manage day-to-day agronomy operations.



The Operations Service handles day-to-day farm operations, activity logging, and resource tracking.## Capabilities



## 📋 Overview- REST API for farms, fields, and activity planning, including validation via Zod.

- Geo-aware storage for field boundaries (Polygon/MultiPolygon) with MongoDB indexes.

- **Type**: TypeScript Express Service- Farm linkage workflow that toggles `linked` status and tracks follow-up actions.

- **Port**: 5003 (default)- Demo data and migration scripts to quickly bootstrap a local database.

- **Database**: MongoDB- All HTTP endpoints are mounted under `/api/*` (e.g. `/api/farms`); existing clients keep working without additional proxies.

- **Package Manager**: pnpm

## Service Layout

## 🎯 Responsibilities

```

1. **Activity Management**src/

   - Log farm activities  config.ts          # Environment defaults and shared settings

   - Track operations  index.ts           # Express bootstrap, middleware, and graceful shutdown

   - Resource usage monitoring  constants/         # Enumerations such as user roles

  models/            # Mongoose schemas for farms, fields, activities

2. **Operation Types**  routes/            # Express routers mounted under /farms, /fields, /activities

   - Planting activities  scripts/           # Seed + migration helpers for local workflows

   - Irrigation logs  utils/             # Small helpers (e.g. ObjectId parsing)

   - Fertilization records```

   - Pest management

   - Harvest operations## Environment



3. **Resource Tracking**| Variable | Purpose | Default |

   - Water usage| --- | --- | --- |

   - Fertilizer consumption| `SERVICE_NAME` | Label returned by `/health` and logs | `operations-service` |

   - Pesticide application| `PORT` | HTTP port used by the Express server | `4003` |

   - Labor hours| `MONGO_URI` | MongoDB connection string | `mongodb://mongo:27017/jani-operations` |



## 🚀 Quick StartLoad these from the root `.env` or export them before starting the service.



```bash## Getting Started

cd services/operations

pnpm install```bash

pnpm run devcd services/operations

```pnpm install

pnpm dev

### Environment Variables```



```bashThe dev script uses `ts-node` and watches the TypeScript sources. Use `pnpm build && pnpm start` when you need the compiled `dist/` output.

MONGODB_URI=mongodb://localhost:27017/jani_operations

PORT=5003A basic health probe is available at `GET /health`.

```

## Data Workflows

## 📡 API Reference

- `pnpm seed` – Populates demo farms, fields, and activities. The script is idempotent and safe to rerun.

### Base URL- `pnpm migrate:auth-data` – Pulls authoritative farm data from the auth service (run after both services are online).

```

http://localhost:5003MongoDB indexes are defined directly on the Mongoose schemas; no separate migration step is required.

```

## API Surface

### Endpoints

### Farms (`/api/farms`)

```http

GET    /api/operations           # List operations| Method | Path | Purpose |

POST   /api/operations           # Create operation| --- | --- | --- |

GET    /api/operations/:id       # Get operation| `GET` | `/api/farms` | List farms with filters on status, owner role, owner identifier, and linkage.

PUT    /api/operations/:id       # Update operation| `POST` | `/api/farms` | Create a farm; validates credentials and captures linkage metadata.

DELETE /api/operations/:id       # Delete operation| `GET` | `/api/farms/search` | Autocomplete search across name, identifier, crop, and registration ID.

GET    /api/operations/farm/:id  # Get farm operations| `GET` | `/api/farms/:id` | Fetch a farm plus a summary of related fields.

GET    /health                    # Health check| `POST` | `/api/farms/:id/link` | Validate an access code and mark the farm as linked.

```

### Fields (`/api/fields`)

### Example: Create Operation

| Method | Path | Purpose |

```http| --- | --- | --- |

POST /api/operations| `GET` | `/api/fields` | List fields, optionally filtered by `farmId`.

Content-Type: application/json| `POST` | `/api/fields` | Create a field with validated sensors and boundary data.

| `GET` | `/api/fields/:id` | Retrieve a single field (with its parent farm summary).

{| `PUT` | `/api/fields/:id` | Update field details, sensors, next actions, or linkage.

  "type": "irrigation",| `DELETE` | `/api/fields/:id` | Remove a field.

  "farmId": "farm_123",| `GET` | `/api/fields/:id/boundary` | Return the GeoJSON boundary (or `null` when unset).

  "plotId": "plot_456",| `PUT` | `/api/fields/:id/boundary` | Replace the boundary after geometry validation.

  "date": "2025-10-28",

  "duration": 120,### Activities (`/api/activities`)

  "resources": {

    "water": {| Method | Path | Purpose |

      "amount": 500,| --- | --- | --- |

      "unit": "liters"| `GET` | `/api/activities` | List activities filtered by farm, field, or status.

    }| `POST` | `/api/activities` | Create an activity tied to a farm (and optionally a field).

  },| `GET` | `/api/activities/:id` | Fetch a single activity record.

  "notes": "Regular irrigation cycle"| `PUT` | `/api/activities/:id` | Update schedules, status, or supporting notes.

}| `DELETE` | `/api/activities/:id` | Delete an activity.

```

### Health

## 🏗️ Database Schema

| Method | Path | Purpose |

```typescript| --- | --- | --- |

{| `GET` | `/health` | Lightweight service probe that reports status, uptime, and service label.

  _id: ObjectId,

  type: string,## Running with Docker Compose

  farmId: string,

  plotId: string,The root `docker-compose.yml` declares an `operations` service. After running `docker compose up -d` at the repo root, the container serves traffic on the port listed in `.env` (default `4003`). Ensure MongoDB is also running (`docker compose up -d mongo`).

  date: Date,

  duration: number,## Testing Checklist

  resources: {

    [key: string]: {- `pnpm lint` – ESLint against the TypeScript sources.

      amount: number,- `pnpm build` – Compiles TypeScript and verifies type safety.

      unit: string- `pnpm seed` – Optional smoke check to ensure database connectivity.

    }

  },Run the relevant commands before opening a PR that touches this service.

  notes: string,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

```bash
docker build -t jani-operations .
docker run -p 5003:5003 jani-operations
```

---

**Built with TypeScript and Express**
