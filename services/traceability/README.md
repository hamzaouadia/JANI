# Traceability Service# Traceability Service



> **Blockchain-ready event tracking and supply chain traceability**Traceability is an Express + Mongoose microservice that records on-farm events (planting, irrigation, harvest, inspections) so other JANI components can build timelines and compliance reports. The codebase favors clarity and explicit validation over blockchain extras that are mentioned in older docs.



The Traceability Service handles all supply chain events, providing a complete audit trail from farm to consumer with QR code generation and blockchain integration readiness.## Capabilities



## 📋 Overview- REST API under `/api/events` for CRUD operations on traceability events.

- Extensive Joi validation covering event type, metadata, attachments, and location.

- **Type**: TypeScript/JavaScript Express Service- Mongoose schema with indexes on farm, plot, type, and occurrence date for fast queries.

- **Port**: 5002 (default)- Basic verification workflow: mark events as `verified`, capture `verifiedBy`, and expose helpers for timelines.

- **Database**: MongoDB (separate from auth database)- Health endpoints (`/health`, `/health/detailed`, `/health/ready`, `/health/live`) that report MongoDB status and process metrics.

- **Package Manager**: pnpm

- **Features**: Event tracking, QR codes, blockchain-ready## Project Layout



## 🎯 Responsibilities```

src/

1. **Event Tracking**  index.js            # Express bootstrap, middleware, Mongo connection, graceful shutdown

   - Record all supply chain events  routes/

   - Planting, harvesting, processing, shipping events    events.js         # REST handlers plus bulk insert and farm timeline helpers

   - Complete audit trail    health.js         # Liveness, readiness, and detailed health probes

  models/

2. **QR Code Generation**    TraceabilityEvent.js  # Mongoose schema, indexes, statics, and instance helpers

   - Generate unique QR codes for lots/batches.env.example           # Sample configuration values

   - Link to traceability dataDockerfile             # Production image definition

   - Consumer-facing traceability```



3. **Blockchain Integration**## Environment

   - Merkle tree generation

   - Hash-based verification| Variable | Purpose | Default |

   - Immutable event logs| --- | --- | --- |

| `PORT` | HTTP port for the Express server | `3004` |

4. **Lot Management**| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/jani_traceability` |

   - Track lot/batch information| `ALLOWED_ORIGINS` | Comma-separated list of origins allowed by CORS | `http://localhost:3000,http://localhost:8081` |

   - Link events to specific lots| `NODE_ENV` | Runtime mode toggling logging and error output | `development` |

   - Farm-to-consumer journey| `TRACEABILITY_SERVICE_URL` | Public URL used by other services | `http://localhost:3004` |

| `JWT_SECRET` | Shared secret when protecting routes with auth middleware (currently optional) | _(unset)_ |

## 🚀 Quick Start

Copy `.env.example` to `.env` and adjust for your environment.

### Prerequisites

## Local Development

- Node.js 20.18.3+

- pnpm 10.x```bash

- MongoDB runningcd services/traceability

pnpm install

### Installationpnpm dev

```

```bash

cd services/traceability`pnpm dev` runs the service with nodemon so changes under `src/` reload automatically. For a production-like run, use `pnpm start` (plain Node.js) after ensuring MongoDB is up.

pnpm install

```### MongoDB



### Environment VariablesThe service expects a Mongo instance with a database named `jani_traceability`. If you are using the root `docker compose` setup, start everything with:



```bash```bash

# Databasedocker compose up -d mongo traceability

MONGO_URI=mongodb://localhost:27017/jani_traceability```



# ServerOtherwise run a local Mongo container:

PORT=5002

```bash

# Securitydocker run --rm -d -p 27017:27017 --name mongo mongo:7

ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8081```



# Rate LimitingIndexes are defined within the model, so no additional migration step is required.

RATE_LIMIT_WINDOW_MS=900000

RATE_LIMIT_MAX_REQUESTS=100## API Highlights

```

### Health

### Development

| Method | Path | Purpose |

```bash| --- | --- | --- |

# Development with hot reload| `GET` | `/health` | Liveness probe with basic service metadata. |

pnpm run dev| `GET` | `/health/live` | Lightweight readiness probe used by containers. |

| `GET` | `/health/ready` | Checks Mongo connectivity before reporting ready. |

# Production| `GET` | `/health/detailed` | Extended metrics including uptime, memory, and Mongo connection info. |

pnpm start

### Events (`/api/events`)

# Tests

pnpm test| Method | Path | Purpose |

```| --- | --- | --- |

| `GET` | `/api/events` | List events with filters (`farmId`, `plotId`, `type`, date range, `verified`, `syncStatus`). |

## 📡 API Reference| `GET` | `/api/events/:id` | Fetch a single event document with populated `userId`/`verifiedBy`. |

| `POST` | `/api/events` | Create an event, assign a UUID `eventId`, and persist metadata/attachments. |

### Base URL| `PUT` | `/api/events/:id` | Update an existing event using the same Joi schema as creation. |

| `DELETE` | `/api/events/:id` | Remove an event. |

```| `POST` | `/api/events/bulk` | Validate and insert multiple events (returns per-item validation errors). |

http://localhost:5002| `GET` | `/api/events/farm/:farmId/timeline` | Chronological farm (or optional plot) event stream. |

```| `GET` | `/api/events/farm/:farmId/summary` | Aggregated counts by event type for dashboard summaries. |



### Health CheckResponses follow a consistent envelope: `{ success, data, message? }`. Validation issues return HTTP 400 with an `errors` array.



```http## Data Model

GET /health

```- `TraceabilityEvent` documents store `eventId` (UUID), `type`, timestamps, farm/plot references, metadata, attachments, verification flags, and sync status fields.

- Virtual `farmState` groups events by lifecycle phase; static helpers provide `getFarmTimeline` and `getEventsByFarm` query shortcuts.

**Response:**- Instance helpers `markAsVerified` and `markAsSynced` wrap common status updates to keep audit fields consistent.

```json- Mongo indexes (farm + occurredAt, plot + occurredAt, type + occurredAt, user + occurredAt, eventId unique) live inside the schema so collections self-heal on startup.

{

  "status": "healthy",## Security & Middleware

  "service": "traceability",

  "timestamp": "2025-10-28T10:00:00Z",- Helmet, CORS, and express-rate-limit are registered before routes.

  "database": "connected"- JSON and URL-encoded bodies are limited to 10 MB to avoid oversized uploads.

}- Joi validation enforces allowed event types, restricts attachment URLs, and ensures geolocation bounds.

```- Health routes provide readiness/liveness endpoints that can be wired into Docker Compose or Kubernetes probes.



### Get All Events## Testing & Quality



```http- `pnpm test` points to Jest; add route tests under `src/__tests__` when logic grows.

GET /api/events- Manual smoke test: start Mongo, run `pnpm dev`, and call `GET /health` plus `POST /api/events` with sample payloads.

```- When changing schemas, rerun a filtered query (`GET /api/events?limit=1`) to confirm serialization still matches expectations.



**Response:**## Operational Notes

```json

{- The service logs to stdout; plug into the platform's log stack (e.g., Loki, CloudWatch) in production.

  "success": true,- Graceful shutdown closes the HTTP server and Mongo connection on `SIGINT`/`SIGTERM` to avoid dangling connections.

  "count": 25,- `/api/events/bulk` is the heaviest route—monitor it for rate limiting or batching needs if mobile clients upload offline packets.

  "events": [- When exposing the service externally, add JWT/authorization middleware; the scaffolding is ready via `JWT_SECRET` but currently disabled by default.

    {
      "id": "evt_123",
      "type": "planting",
      "lotId": "lot_456",
      "farmId": "farm_789",
      "timestamp": "2025-10-15T08:00:00Z",
      "location": {
        "latitude": 34.0522,
        "longitude": -118.2437
      },
      "metadata": {
        "crop": "Tomatoes",
        "variety": "Roma",
        "quantity": 1000,
        "unit": "seedlings"
      }
    }
  ]
}
```

### Create Event

```http
POST /api/events
Content-Type: application/json

{
  "type": "harvesting",
  "lotId": "lot_456",
  "farmId": "farm_789",
  "timestamp": "2025-10-28T10:00:00Z",
  "location": {
    "latitude": 34.0522,
    "longitude": -118.2437
  },
  "metadata": {
    "crop": "Tomatoes",
    "quantity": 500,
    "unit": "kg",
    "quality": "Grade A"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Event created successfully",
  "event": {
    "id": "evt_124",
    "type": "harvesting",
    "lotId": "lot_456",
    "createdAt": "2025-10-28T10:00:00Z"
  }
}
```

### Get Events for Lot

```http
GET /api/events/lot/:lotId
```

**Response:**
```json
{
  "success": true,
  "lotId": "lot_456",
  "events": [
    {
      "type": "planting",
      "timestamp": "2025-10-15T08:00:00Z"
    },
    {
      "type": "irrigation",
      "timestamp": "2025-10-20T09:00:00Z"
    },
    {
      "type": "harvesting",
      "timestamp": "2025-10-28T10:00:00Z"
    }
  ]
}
```

### Generate QR Code

```http
POST /api/qr/generate
Content-Type: application/json

{
  "lotId": "lot_456",
  "data": {
    "farmName": "Green Valley Farm",
    "crop": "Tomatoes",
    "harvestDate": "2025-10-28"
  }
}
```

**Response:**
```json
{
  "success": true,
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "url": "https://jani.com/trace/lot_456"
}
```

## 🏗️ Architecture

### Database Schema

**Events Collection:**
```javascript
{
  _id: ObjectId,
  type: String,          // 'planting', 'irrigation', 'harvesting', etc.
  lotId: String,         // Lot/batch identifier
  farmId: String,        // Farm identifier
  timestamp: Date,       // When event occurred
  location: {
    latitude: Number,
    longitude: Number
  },
  metadata: Object,      // Event-specific data
  hash: String,          // Blockchain hash
  previousHash: String,  // Link to previous event
  createdAt: Date,
  updatedAt: Date
}
```

### Event Types

- `planting` - Seeds/seedlings planted
- `irrigation` - Field watered
- `fertilization` - Fertilizer applied
- `pest_treatment` - Pesticide applied
- `harvesting` - Crops harvested
- `processing` - Post-harvest processing
- `packaging` - Products packaged
- `shipping` - Shipment created
- `receiving` - Shipment received
- `quality_check` - Quality inspection

## 🔒 Security

- **Helmet.js**: Security headers
- **CORS**: Configurable origin whitelist
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Mongoose schema validation
- **Size Limits**: 10MB request body limit

## 📊 Monitoring

```bash
# Check service health
curl http://localhost:5002/health

# View all events
curl http://localhost:5002/api/events

# Check specific lot
curl http://localhost:5002/api/events/lot/lot_456
```

## 🧪 Testing

```bash
# Run tests
pnpm test

# Coverage
pnpm test --coverage
```

## 🚀 Deployment

### Docker

```bash
docker build -t jani-traceability .
docker run -p 5002:5002 \
  -e MONGO_URI=mongodb://mongo:27017/jani_traceability \
  jani-traceability
```

---

**Built with Express and MongoDB**
