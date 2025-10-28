# Operations Service# Operations Service# Operations Service



> **Farm operations and field activity management**



The Operations Service manages day-to-day farm operations, field management, and agricultural activities tracking for the JANI platform.> **Farm operations and activities management**Operations is a lightweight Express + Mongoose microservice that keeps farms, fields, and field activities in sync across JANI. It exposes CRUD endpoints and helper workflows that the mobile and web apps call to manage day-to-day agronomy operations.



## 📋 Overview



- **Type**: TypeScript Express ServiceThe Operations Service handles day-to-day farm operations, activity logging, and resource tracking.## Capabilities

- **Port**: 5003 (default)

- **Database**: MongoDB

- **Package Manager**: pnpm

- **Security**: Helmet, CORS## 📋 Overview- REST API for farms, fields, and activity planning, including validation via Zod.



## 🎯 Core Responsibilities- Geo-aware storage for field boundaries (Polygon/MultiPolygon) with MongoDB indexes.



1. **Farm Operations** - Manage farm-level operations and metadata- **Type**: TypeScript Express Service- Farm linkage workflow that toggles `linked` status and tracks follow-up actions.

2. **Field Management** - Track individual fields/plots within farms

3. **Activity Tracking** - Log planting, irrigation, fertilization, harvesting- **Port**: 5003 (default)- Demo data and migration scripts to quickly bootstrap a local database.

4. **Resource Management** - Monitor water, fertilizer, pesticide usage

5. **Operational Analytics** - Track farm productivity and efficiency- **Database**: MongoDB- All HTTP endpoints are mounted under `/api/*` (e.g. `/api/farms`); existing clients keep working without additional proxies.



## 🚀 Quick Start- **Package Manager**: pnpm



```bash## Service Layout

cd services/operations

pnpm install## 🎯 Responsibilities

pnpm run dev

``````



### Environment Variables1. **Activity Management**src/



```bash   - Log farm activities  config.ts          # Environment defaults and shared settings

PORT=5003

MONGO_URI=mongodb://localhost:27017/jani_operations   - Track operations  index.ts           # Express bootstrap, middleware, and graceful shutdown

SERVICE_NAME=JANI Operations Service

NODE_ENV=development   - Resource usage monitoring  constants/         # Enumerations such as user roles

```

  models/            # Mongoose schemas for farms, fields, activities

## 📡 API Reference

2. **Operation Types**  routes/            # Express routers mounted under /farms, /fields, /activities

### Base URL

```   - Planting activities  scripts/           # Seed + migration helpers for local workflows

http://localhost:5003

```   - Irrigation logs  utils/             # Small helpers (e.g. ObjectId parsing)



### Health Check   - Fertilization records```

```http

GET /health   - Pest management

```

   - Harvest operations## Environment

**Response:**

```json

{

  "status": "ok",3. **Resource Tracking**| Variable | Purpose | Default |

  "service": "JANI Operations Service",

  "uptime": 3600.5   - Water usage| --- | --- | --- |

}

```   - Fertilizer consumption| `SERVICE_NAME` | Label returned by `/health` and logs | `operations-service` |



### Farm Routes (`/api/farms`)   - Pesticide application| `PORT` | HTTP port used by the Express server | `4003` |



#### List Farms   - Labor hours| `MONGO_URI` | MongoDB connection string | `mongodb://mongo:27017/jani-operations` |

```http

GET /api/farms?page=1&limit=20

```

## 🚀 Quick StartLoad these from the root `.env` or export them before starting the service.

#### Create Farm

```http

POST /api/farms

Content-Type: application/json```bash## Getting Started



{cd services/operations

  "name": "Sunrise Farm",

  "location": {pnpm install```bash

    "address": "456 Country Road",

    "coordinates": [-122.0, 37.5]pnpm run devcd services/operations

  },

  "totalArea": 50,```pnpm install

  "areaUnit": "hectares"

}pnpm dev

```

### Environment Variables```

#### Get Farm

```http

GET /api/farms/:id

``````bashThe dev script uses `ts-node` and watches the TypeScript sources. Use `pnpm build && pnpm start` when you need the compiled `dist/` output.



#### Update FarmMONGODB_URI=mongodb://localhost:27017/jani_operations

```http

PUT /api/farms/:idPORT=5003A basic health probe is available at `GET /health`.

Content-Type: application/json

```

{

  "name": "Sunrise Organic Farm",## Data Workflows

  "certifications": ["organic"]

}## 📡 API Reference

```

- `pnpm seed` – Populates demo farms, fields, and activities. The script is idempotent and safe to rerun.

#### Delete Farm

```http### Base URL- `pnpm migrate:auth-data` – Pulls authoritative farm data from the auth service (run after both services are online).

DELETE /api/farms/:id

``````



#### Get Farm Statisticshttp://localhost:5003MongoDB indexes are defined directly on the Mongoose schemas; no separate migration step is required.

```http

GET /api/farms/:id/statistics```

```

## API Surface

**Response:**

```json### Endpoints

{

  "farmId": "farm_123",### Farms (`/api/farms`)

  "totalFields": 12,

  "totalArea": 50,```http

  "activeActivities": 25,

  "cropDistribution": {GET    /api/operations           # List operations| Method | Path | Purpose |

    "tomatoes": 15,

    "lettuce": 10,POST   /api/operations           # Create operation| --- | --- | --- |

    "carrots": 8

  },GET    /api/operations/:id       # Get operation| `GET` | `/api/farms` | List farms with filters on status, owner role, owner identifier, and linkage.

  "productivity": {

    "yieldPerHectare": 12500,PUT    /api/operations/:id       # Update operation| `POST` | `/api/farms` | Create a farm; validates credentials and captures linkage metadata.

    "waterUsage": 50000,

    "fertilizerUsage": 250DELETE /api/operations/:id       # Delete operation| `GET` | `/api/farms/search` | Autocomplete search across name, identifier, crop, and registration ID.

  }

}GET    /api/operations/farm/:id  # Get farm operations| `GET` | `/api/farms/:id` | Fetch a farm plus a summary of related fields.

```

GET    /health                    # Health check| `POST` | `/api/farms/:id/link` | Validate an access code and mark the farm as linked.

### Field Routes (`/api/fields`)

```

#### List Fields

```http### Fields (`/api/fields`)

GET /api/fields?farmId=farm_123&page=1&limit=20

```### Example: Create Operation



**Response:**| Method | Path | Purpose |

```json

{```http| --- | --- | --- |

  "success": true,

  "fields": [POST /api/operations| `GET` | `/api/fields` | List fields, optionally filtered by `farmId`.

    {

      "id": "field_456",Content-Type: application/json| `POST` | `/api/fields` | Create a field with validated sensors and boundary data.

      "farmId": "farm_123",

      "name": "Field A",| `GET` | `/api/fields/:id` | Retrieve a single field (with its parent farm summary).

      "area": 4.5,

      "areaUnit": "hectares",{| `PUT` | `/api/fields/:id` | Update field details, sensors, next actions, or linkage.

      "crop": "tomatoes",

      "status": "planted",  "type": "irrigation",| `DELETE` | `/api/fields/:id` | Remove a field.

      "soilType": "loamy",

      "irrigationType": "drip"  "farmId": "farm_123",| `GET` | `/api/fields/:id/boundary` | Return the GeoJSON boundary (or `null` when unset).

    }

  ]  "plotId": "plot_456",| `PUT` | `/api/fields/:id/boundary` | Replace the boundary after geometry validation.

}

```  "date": "2025-10-28",



#### Create Field  "duration": 120,### Activities (`/api/activities`)

```http

POST /api/fields  "resources": {

Content-Type: application/json

    "water": {| Method | Path | Purpose |

{

  "farmId": "farm_123",      "amount": 500,| --- | --- | --- |

  "name": "Field B",

  "area": 3.2,      "unit": "liters"| `GET` | `/api/activities` | List activities filtered by farm, field, or status.

  "areaUnit": "hectares",

  "crop": "lettuce",    }| `POST` | `/api/activities` | Create an activity tied to a farm (and optionally a field).

  "soilType": "sandy-loam",

  "irrigationType": "sprinkler",  },| `GET` | `/api/activities/:id` | Fetch a single activity record.

  "plantingDate": "2025-10-15"

}  "notes": "Regular irrigation cycle"| `PUT` | `/api/activities/:id` | Update schedules, status, or supporting notes.

```

}| `DELETE` | `/api/activities/:id` | Delete an activity.

#### Get Field

```http```

GET /api/fields/:id

```### Health



#### Update Field## 🏗️ Database Schema

```http

PUT /api/fields/:id| Method | Path | Purpose |

Content-Type: application/json

```typescript| --- | --- | --- |

{

  "crop": "carrots",{| `GET` | `/health` | Lightweight service probe that reports status, uptime, and service label.

  "status": "preparing",

  "expectedHarvestDate": "2025-12-20"  _id: ObjectId,

}

```  type: string,## Running with Docker Compose



#### Delete Field  farmId: string,

```http

DELETE /api/fields/:id  plotId: string,The root `docker-compose.yml` declares an `operations` service. After running `docker compose up -d` at the repo root, the container serves traffic on the port listed in `.env` (default `4003`). Ensure MongoDB is also running (`docker compose up -d mongo`).

```

  date: Date,

#### Get Field Activities

```http  duration: number,## Testing Checklist

GET /api/fields/:id/activities?limit=50

```  resources: {



#### Update Field Crop Rotation    [key: string]: {- `pnpm lint` – ESLint against the TypeScript sources.

```http

PUT /api/fields/:id/crop-rotation      amount: number,- `pnpm build` – Compiles TypeScript and verifies type safety.

Content-Type: application/json

      unit: string- `pnpm seed` – Optional smoke check to ensure database connectivity.

{

  "currentCrop": "carrots",    }

  "previousCrops": ["lettuce", "tomatoes"],

  "nextPlannedCrop": "beans",  },Run the relevant commands before opening a PR that touches this service.

  "rotationSchedule": "quarterly"

}  notes: string,

```  createdAt: Date,

  updatedAt: Date

### Activity Routes (`/api/activities`)}

```

#### List Activities

```http## 🚀 Deployment

GET /api/activities?farmId=farm_123&type=irrigation&startDate=2025-10-01&limit=50

``````bash

docker build -t jani-operations .

**Query Parameters:**docker run -p 5003:5003 jani-operations

- `farmId`: Filter by farm```

- `fieldId`: Filter by field

- `type`: Activity type (planting, irrigation, fertilization, etc.)---

- `startDate`: Activities after date

- `endDate`: Activities before date**Built with TypeScript and Express**

- `page`: Page number
- `limit`: Results per page

**Response:**
```json
{
  "success": true,
  "activities": [
    {
      "id": "activity_789",
      "type": "irrigation",
      "farmId": "farm_123",
      "fieldId": "field_456",
      "date": "2025-10-28",
      "duration": 120,
      "resources": {
        "water": {
          "amount": 5000,
          "unit": "liters"
        }
      },
      "performedBy": "user_123",
      "notes": "Regular irrigation cycle"
    }
  ]
}
```

#### Create Activity
```http
POST /api/activities
Content-Type: application/json

{
  "type": "fertilization",
  "farmId": "farm_123",
  "fieldId": "field_456",
  "date": "2025-10-28",
  "resources": {
    "fertilizer": {
      "type": "NPK 10-10-10",
      "amount": 50,
      "unit": "kg"
    }
  },
  "applicationMethod": "broadcast",
  "weatherConditions": {
    "temperature": 22,
    "humidity": 65,
    "windSpeed": 5
  },
  "performedBy": "user_123",
  "notes": "First fertilization this season"
}
```

**Activity Types:**
- `planting` - Crop planting
- `irrigation` - Watering
- `fertilization` - Fertilizer application
- `pest_control` - Pesticide/herbicide application
- `weeding` - Manual or mechanical weeding
- `pruning` - Plant pruning
- `harvesting` - Crop harvest
- `soil_preparation` - Tilling, plowing
- `maintenance` - General maintenance
- `inspection` - Field inspection

#### Get Activity
```http
GET /api/activities/:id
```

#### Update Activity
```http
PUT /api/activities/:id
Content-Type: application/json

{
  "notes": "Updated notes - completed earlier than expected",
  "duration": 90
}
```

#### Delete Activity
```http
DELETE /api/activities/:id
```

## 🏗️ Database Schema

### Farm Model
```typescript
{
  _id: ObjectId,
  name: string,
  location: {
    address: string,
    coordinates: [number, number]
  },
  totalArea: number,
  areaUnit: string,
  owner: ObjectId,
  certifications: string[],
  status: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Field Model
```typescript
{
  _id: ObjectId,
  farmId: ObjectId,
  name: string,
  area: number,
  areaUnit: string,
  crop: string,
  status: string,              // preparing, planted, growing, harvesting, fallow
  soilType: string,
  irrigationType: string,
  plantingDate: Date,
  expectedHarvestDate: Date,
  actualHarvestDate: Date,
  yield: {
    amount: number,
    unit: string
  },
  cropRotation: {
    previousCrops: string[],
    nextPlannedCrop: string
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Activity Model
```typescript
{
  _id: ObjectId,
  type: string,
  farmId: ObjectId,
  fieldId: ObjectId,
  date: Date,
  duration: number,            // minutes
  resources: {
    [key: string]: {
      type?: string,
      amount: number,
      unit: string
    }
  },
  applicationMethod: string,
  weatherConditions: {
    temperature: number,
    humidity: number,
    windSpeed: number,
    precipitation: number
  },
  performedBy: ObjectId,
  photos: string[],
  notes: string,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Security

- **Helmet.js**: Security headers
- **CORS**: Cross-origin protection
- **Input Validation**: Request validation
- **Error Handling**: Sanitized error responses

## 🧪 Testing

```bash
# Run tests
pnpm test

# Lint
pnpm run lint

# Type check
pnpm run typecheck
```

## 🚀 Deployment

### Docker

```bash
docker build -t jani-operations .
docker run -p 5003:5003 \
  -e MONGO_URI=mongodb://mongo:27017/jani_operations \
  jani-operations
```

### Docker Compose

```yaml
operations:
  build: ./services/operations
  ports:
    - "5003:5003"
  environment:
    - MONGO_URI=mongodb://mongo:27017/jani_operations
    - SERVICE_NAME=JANI Operations Service
  depends_on:
    - mongo
```

## 📊 Usage Example

```bash
# 1. Create a farm
POST /api/farms
{
  "name": "Sunrise Farm",
  "totalArea": 50
}

# 2. Create fields
POST /api/fields
{
  "farmId": "farm_123",
  "name": "Field A",
  "area": 5,
  "crop": "tomatoes"
}

# 3. Log planting activity
POST /api/activities
{
  "type": "planting",
  "farmId": "farm_123",
  "fieldId": "field_456",
  "resources": {
    "seeds": {"amount": 1000, "unit": "units"}
  }
}

# 4. Track irrigation
POST /api/activities
{
  "type": "irrigation",
  "fieldId": "field_456",
  "resources": {
    "water": {"amount": 5000, "unit": "liters"}
  }
}

# 5. Get farm statistics
GET /api/farms/farm_123/statistics
```

---

**Built with TypeScript, Express, and MongoDB**
