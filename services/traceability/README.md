# Traceability Service# Traceability Service# Traceability Service



> **Blockchain-ready event tracking and QR code generation**



The Traceability Service manages agricultural events, lot tracking, and QR code generation for complete supply chain transparency from farm to consumer.> **Blockchain-ready event tracking and supply chain traceability**Traceability is an Express + Mongoose microservice that records on-farm events (planting, irrigation, harvest, inspections) so other JANI components can build timelines and compliance reports. The codebase favors clarity and explicit validation over blockchain extras that are mentioned in older docs.



## 📋 Overview



- **Type**: JavaScript Express ServiceThe Traceability Service handles all supply chain events, providing a complete audit trail from farm to consumer with QR code generation and blockchain integration readiness.## Capabilities

- **Port**: 5002 (default, configurable as 3004)

- **Database**: MongoDB (separate `jani_traceability` database)

- **Package Manager**: pnpm

- **Security**: Helmet, CORS, Rate Limiting## 📋 Overview- REST API under `/api/events` for CRUD operations on traceability events.



## 🎯 Core Features- Extensive Joi validation covering event type, metadata, attachments, and location.



1. **Event Tracking** - Record all farm activities and supply chain events- **Type**: TypeScript/JavaScript Express Service- Mongoose schema with indexes on farm, plot, type, and occurrence date for fast queries.

2. **Lot Management** - Track produce lots through the supply chain

3. **QR Code Generation** - Generate scannable codes for product traceability- **Port**: 5002 (default)- Basic verification workflow: mark events as `verified`, capture `verifiedBy`, and expose helpers for timelines.

4. **Blockchain Ready** - Merkle tree structure for future blockchain integration

5. **Audit Trail** - Complete immutable history of all events- **Database**: MongoDB (separate from auth database)- Health endpoints (`/health`, `/health/detailed`, `/health/ready`, `/health/live`) that report MongoDB status and process metrics.



## 🚀 Quick Start- **Package Manager**: pnpm



```bash- **Features**: Event tracking, QR codes, blockchain-ready## Project Layout

cd services/traceability

pnpm install

pnpm run dev

```## 🎯 Responsibilities```



### Environment Variablessrc/



```bash1. **Event Tracking**  index.js            # Express bootstrap, middleware, Mongo connection, graceful shutdown

PORT=5002

MONGO_URI=mongodb://localhost:27017/jani_traceability   - Record all supply chain events  routes/

ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8081

NODE_ENV=development   - Planting, harvesting, processing, shipping events    events.js         # REST handlers plus bulk insert and farm timeline helpers

```

   - Complete audit trail    health.js         # Liveness, readiness, and detailed health probes

## 📡 API Reference

  models/

### Base URL

```2. **QR Code Generation**    TraceabilityEvent.js  # Mongoose schema, indexes, statics, and instance helpers

http://localhost:5002

```   - Generate unique QR codes for lots/batches.env.example           # Sample configuration values



### Root Endpoint   - Link to traceability dataDockerfile             # Production image definition

```http

GET /   - Consumer-facing traceability```

```



**Response:**

```json3. **Blockchain Integration**## Environment

{

  "service": "JANI Traceability Service",   - Merkle tree generation

  "version": "1.0.0",

  "status": "running",   - Hash-based verification| Variable | Purpose | Default |

  "endpoints": {

    "health": "/health",   - Immutable event logs| --- | --- | --- |

    "events": "/api/events",

    "docs": "/api/events/docs"| `PORT` | HTTP port for the Express server | `3004` |

  }

}4. **Lot Management**| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/jani_traceability` |

```

   - Track lot/batch information| `ALLOWED_ORIGINS` | Comma-separated list of origins allowed by CORS | `http://localhost:3000,http://localhost:8081` |

### Health Check

```http   - Link events to specific lots| `NODE_ENV` | Runtime mode toggling logging and error output | `development` |

GET /health

```   - Farm-to-consumer journey| `TRACEABILITY_SERVICE_URL` | Public URL used by other services | `http://localhost:3004` |



**Response:**| `JWT_SECRET` | Shared secret when protecting routes with auth middleware (currently optional) | _(unset)_ |

```json

{## 🚀 Quick Start

  "status": "healthy",

  "service": "JANI Traceability Service",Copy `.env.example` to `.env` and adjust for your environment.

  "timestamp": "2025-10-28T10:30:00.000Z",

  "mongodb": "connected"### Prerequisites

}

```## Local Development



### Event Management (`/api/events`)- Node.js 20.18.3+



#### Create Event- pnpm 10.x```bash

```http

POST /api/events- MongoDB runningcd services/traceability

Content-Type: application/json

pnpm install

{

  "type": "planting",### Installationpnpm dev

  "lotId": "LOT-2025-001",

  "farmId": "farm_123",```

  "plotId": "plot_456",

  "timestamp": "2025-10-28T08:00:00Z",```bash

  "data": {

    "crop": "tomatoes",cd services/traceability`pnpm dev` runs the service with nodemon so changes under `src/` reload automatically. For a production-like run, use `pnpm start` (plain Node.js) after ensuring MongoDB is up.

    "variety": "Roma",

    "quantity": 1000,pnpm install

    "unit": "seeds"

  },```### MongoDB

  "location": {

    "coordinates": [-122.4194, 37.7749],

    "address": "Green Valley Farm, Plot A"

  },### Environment VariablesThe service expects a Mongo instance with a database named `jani_traceability`. If you are using the root `docker compose` setup, start everything with:

  "performedBy": "user_123",

  "notes": "Spring planting season"

}

``````bash```bash



**Response:**# Databasedocker compose up -d mongo traceability

```json

{MONGO_URI=mongodb://localhost:27017/jani_traceability```

  "success": true,

  "event": {

    "id": "event_789",

    "type": "planting",# ServerOtherwise run a local Mongo container:

    "lotId": "LOT-2025-001",

    "timestamp": "2025-10-28T08:00:00Z",PORT=5002

    "createdAt": "2025-10-28T10:30:00.000Z"

  }```bash

}

```# Securitydocker run --rm -d -p 27017:27017 --name mongo mongo:7



#### List EventsALLOWED_ORIGINS=http://localhost:3000,http://localhost:8081```

```http

GET /api/events?lotId=LOT-2025-001&limit=50&page=1

```

# Rate LimitingIndexes are defined within the model, so no additional migration step is required.

**Query Parameters:**

- `lotId`: Filter by lot IDRATE_LIMIT_WINDOW_MS=900000

- `farmId`: Filter by farm

- `type`: Filter by event typeRATE_LIMIT_MAX_REQUESTS=100## API Highlights

- `startDate`: Filter events after date

- `endDate`: Filter events before date```

- `limit`: Results per page (default: 50)

- `page`: Page number (default: 1)### Health



**Response:**### Development

```json

{| Method | Path | Purpose |

  "success": true,

  "events": [```bash| --- | --- | --- |

    {

      "id": "event_789",# Development with hot reload| `GET` | `/health` | Liveness probe with basic service metadata. |

      "type": "planting",

      "lotId": "LOT-2025-001",pnpm run dev| `GET` | `/health/live` | Lightweight readiness probe used by containers. |

      "farmId": "farm_123",

      "timestamp": "2025-10-28T08:00:00Z",| `GET` | `/health/ready` | Checks Mongo connectivity before reporting ready. |

      "data": {...}

    }# Production| `GET` | `/health/detailed` | Extended metrics including uptime, memory, and Mongo connection info. |

  ],

  "pagination": {pnpm start

    "page": 1,

    "limit": 50,### Events (`/api/events`)

    "total": 125,

    "pages": 3# Tests

  }

}pnpm test| Method | Path | Purpose |

```

```| --- | --- | --- |

#### Get Single Event

```http| `GET` | `/api/events` | List events with filters (`farmId`, `plotId`, `type`, date range, `verified`, `syncStatus`). |

GET /api/events/:id

```## 📡 API Reference| `GET` | `/api/events/:id` | Fetch a single event document with populated `userId`/`verifiedBy`. |



#### Update Event| `POST` | `/api/events` | Create an event, assign a UUID `eventId`, and persist metadata/attachments. |

```http

PUT /api/events/:id### Base URL| `PUT` | `/api/events/:id` | Update an existing event using the same Joi schema as creation. |

Content-Type: application/json

| `DELETE` | `/api/events/:id` | Remove an event. |

{

  "notes": "Updated planting notes",```| `POST` | `/api/events/bulk` | Validate and insert multiple events (returns per-item validation errors). |

  "data": {

    "quantity": 1100http://localhost:5002| `GET` | `/api/events/farm/:farmId/timeline` | Chronological farm (or optional plot) event stream. |

  }

}```| `GET` | `/api/events/farm/:farmId/summary` | Aggregated counts by event type for dashboard summaries. |

```



#### Delete Event

```http### Health CheckResponses follow a consistent envelope: `{ success, data, message? }`. Validation issues return HTTP 400 with an `errors` array.

DELETE /api/events/:id

```



#### Get Events by Lot```http## Data Model

```http

GET /api/events/lot/:lotIdGET /health

```

```- `TraceabilityEvent` documents store `eventId` (UUID), `type`, timestamps, farm/plot references, metadata, attachments, verification flags, and sync status fields.

**Response:**

```json- Virtual `farmState` groups events by lifecycle phase; static helpers provide `getFarmTimeline` and `getEventsByFarm` query shortcuts.

{

  "success": true,**Response:**- Instance helpers `markAsVerified` and `markAsSynced` wrap common status updates to keep audit fields consistent.

  "lotId": "LOT-2025-001",

  "events": [```json- Mongo indexes (farm + occurredAt, plot + occurredAt, type + occurredAt, user + occurredAt, eventId unique) live inside the schema so collections self-heal on startup.

    {

      "type": "planting",{

      "timestamp": "2025-10-28T08:00:00Z",

      "data": {...}  "status": "healthy",## Security & Middleware

    },

    {  "service": "traceability",

      "type": "irrigation",

      "timestamp": "2025-10-30T06:00:00Z",  "timestamp": "2025-10-28T10:00:00Z",- Helmet, CORS, and express-rate-limit are registered before routes.

      "data": {...}

    },  "database": "connected"- JSON and URL-encoded bodies are limited to 10 MB to avoid oversized uploads.

    {

      "type": "harvesting",}- Joi validation enforces allowed event types, restricts attachment URLs, and ensures geolocation bounds.

      "timestamp": "2025-12-15T10:00:00Z",

      "data": {...}```- Health routes provide readiness/liveness endpoints that can be wired into Docker Compose or Kubernetes probes.

    }

  ],

  "timeline": {

    "started": "2025-10-28T08:00:00Z",### Get All Events## Testing & Quality

    "lastUpdate": "2025-12-15T10:00:00Z",

    "totalEvents": 15

  }

}```http- `pnpm test` points to Jest; add route tests under `src/__tests__` when logic grows.

```

GET /api/events- Manual smoke test: start Mongo, run `pnpm dev`, and call `GET /health` plus `POST /api/events` with sample payloads.

### QR Code Generation

```- When changing schemas, rerun a filtered query (`GET /api/events?limit=1`) to confirm serialization still matches expectations.

#### Generate QR Code for Lot

```http

GET /api/qr/generate/:lotId?format=png&size=300

```**Response:**## Operational Notes



**Query Parameters:**```json

- `format`: `png` or `svg` (default: png)

- `size`: Image size in pixels (default: 300){- The service logs to stdout; plug into the platform's log stack (e.g., Loki, CloudWatch) in production.



**Response:** QR code image file  "success": true,- Graceful shutdown closes the HTTP server and Mongo connection on `SIGINT`/`SIGTERM` to avoid dangling connections.



## 🎨 Event Types  "count": 25,- `/api/events/bulk` is the heaviest route—monitor it for rate limiting or batching needs if mobile clients upload offline packets.



The service supports various agricultural event types:  "events": [- When exposing the service externally, add JWT/authorization middleware; the scaffolding is ready via `JWT_SECRET` but currently disabled by default.



- **planting** - Crop planting activities    {

- **irrigation** - Watering schedules and amounts      "id": "evt_123",

- **fertilization** - Fertilizer application      "type": "planting",

- **pest_control** - Pesticide/herbicide application      "lotId": "lot_456",

- **harvesting** - Crop harvest events      "farmId": "farm_789",

- **processing** - Post-harvest processing      "timestamp": "2025-10-15T08:00:00Z",

- **packaging** - Product packaging      "location": {

- **storage** - Storage facility entry        "latitude": 34.0522,

- **transportation** - Shipping/transport events        "longitude": -118.2437

- **quality_check** - Quality inspections      },

- **certification** - Organic/other certifications      "metadata": {

- **sale** - Sale transactions        "crop": "Tomatoes",

- **custom** - Custom event types        "variety": "Roma",

        "quantity": 1000,

## 🏗️ Database Schema        "unit": "seedlings"

      }

### Event Model    }

```javascript  ]

{}

  _id: ObjectId,```

  type: String,           // Event type

  lotId: String,          // Lot identifier### Create Event

  farmId: String,         // Farm reference

  plotId: String,         // Plot/field reference```http

  timestamp: Date,        // When event occurredPOST /api/events

  data: {                 // Event-specific dataContent-Type: application/json

    crop: String,

    quantity: Number,{

    unit: String,  "type": "harvesting",

    ...  "lotId": "lot_456",

  },  "farmId": "farm_789",

  location: {  "timestamp": "2025-10-28T10:00:00Z",

    coordinates: [Number, Number],  // [longitude, latitude]  "location": {

    address: String    "latitude": 34.0522,

  },    "longitude": -118.2437

  performedBy: String,    // User ID  },

  notes: String,  "metadata": {

  metadata: {    "crop": "Tomatoes",

    temperature: Number,    "quantity": 500,

    humidity: Number,    "unit": "kg",

    weatherConditions: String    "quality": "Grade A"

  },  }

  photos: [String],       // S3 URLs}

  hash: String,           // Merkle tree hash```

  previousHash: String,   // Previous event hash

  createdAt: Date,**Response:**

  updatedAt: Date```json

}{

```  "success": true,

  "message": "Event created successfully",

## 🔐 Security Features  "event": {

    "id": "evt_124",

- **Helmet.js**: Security headers (XSS, CSRF protection)    "type": "harvesting",

- **CORS**: Configurable allowed origins    "lotId": "lot_456",

- **Rate Limiting**: 100 requests per 15 minutes per IP    "createdAt": "2025-10-28T10:00:00Z"

- **Input Validation**: Request body size limits (10MB)  }

- **Error Handling**: Sanitized error messages in production}

```

## 🔗 Blockchain Readiness

### Get Events for Lot

The service is designed for future blockchain integration:

```http

- **Merkle Tree Structure**: Events linked with cryptographic hashesGET /api/events/lot/:lotId

- **Immutable Records**: Events cannot be modified once committed```

- **Chain Verification**: Hash chain validates data integrity

- **Timestamp Proofs**: All events timestamped for auditing**Response:**

```json

## 🧪 Testing{

  "success": true,

```bash  "lotId": "lot_456",

# Run tests  "events": [

pnpm test    {

      "type": "planting",

# Lint      "timestamp": "2025-10-15T08:00:00Z"

pnpm run lint    },

    {

# Type check (if applicable)      "type": "irrigation",

pnpm run typecheck      "timestamp": "2025-10-20T09:00:00Z"

```    },

    {

## 🚀 Deployment      "type": "harvesting",

      "timestamp": "2025-10-28T10:00:00Z"

### Docker    }

  ]

```bash}

docker build -t jani-traceability .```

docker run -p 5002:5002 \

  -e MONGO_URI=mongodb://mongo:27017/jani_traceability \### Generate QR Code

  jani-traceability

``````http

POST /api/qr/generate

### Docker ComposeContent-Type: application/json



```yaml{

traceability:  "lotId": "lot_456",

  build: ./services/traceability  "data": {

  ports:    "farmName": "Green Valley Farm",

    - "5002:5002"    "crop": "Tomatoes",

  environment:    "harvestDate": "2025-10-28"

    - MONGO_URI=mongodb://mongo:27017/jani_traceability  }

    - ALLOWED_ORIGINS=http://localhost:3000}

  depends_on:```

    - mongo

```**Response:**

```json

## 📊 Usage Example{

  "success": true,

Complete product journey:  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",

  "url": "https://jani.com/trace/lot_456"

```bash}

# 1. Planting```

POST /api/events

{## 🏗️ Architecture

  "type": "planting",

  "lotId": "LOT-2025-TOMATO-001",### Database Schema

  "data": {"crop": "tomatoes", "quantity": 1000}

}**Events Collection:**

```javascript

# 2. Irrigation (multiple times){

POST /api/events  _id: ObjectId,

{  type: String,          // 'planting', 'irrigation', 'harvesting', etc.

  "type": "irrigation",  lotId: String,         // Lot/batch identifier

  "lotId": "LOT-2025-TOMATO-001",  farmId: String,        // Farm identifier

  "data": {"waterAmount": 500, "unit": "liters"}  timestamp: Date,       // When event occurred

}  location: {

    latitude: Number,

# 3. Harvesting    longitude: Number

POST /api/events  },

{  metadata: Object,      // Event-specific data

  "type": "harvesting",  hash: String,          // Blockchain hash

  "lotId": "LOT-2025-TOMATO-001",  previousHash: String,  // Link to previous event

  "data": {"yield": 2500, "unit": "kg"}  createdAt: Date,

}  updatedAt: Date

}

# 4. Generate QR for consumer```

GET /api/qr/generate/LOT-2025-TOMATO-001

### Event Types

# 5. Consumer scans QR → View complete journey

GET /api/events/lot/LOT-2025-TOMATO-001- `planting` - Seeds/seedlings planted

```- `irrigation` - Field watered

- `fertilization` - Fertilizer applied

---- `pest_treatment` - Pesticide applied

- `harvesting` - Crops harvested

**Built with Express, MongoDB, and Blockchain-Ready Architecture**- `processing` - Post-harvest processing

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
