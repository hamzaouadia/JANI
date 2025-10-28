# Auth Service# Auth Service# Auth Service



> **Authentication, data management, and synchronization service**



The Auth Service is the core backend service for the JANI platform, handling user authentication, farm/partner/order data management, offline synchronization, media uploads, and background jobs.> **Primary authentication and data management service for JANI Platform**JANI’s Auth service handles account onboarding, credential verification, and a handful of data workflows (farms, partners, sync events) that were originally bootstrapped inside authentication. The codebase is TypeScript-first (ts-node in dev, `tsc` build for prod) and speaks to MongoDB via Mongoose.



## 📋 Overview



- **Type**: TypeScript Express ServiceThe Auth Service is the central hub of the JANI platform, handling authentication, user management, farm data, offline synchronization, media uploads, and background job processing.## Capabilities

- **Port**: 4000 (default)

- **Database**: MongoDB

- **Package Manager**: pnpm

- **Auth**: JWT-based authentication## 📋 Overview- `/auth` routes for signup, login, `verify`, and a JWT-protected `me` endpoint.



## 🎯 Core Responsibilities- `/data` routes surface farm linking plus partner and order lookups used by the mobile app.



1. **User Authentication** - Signup, login, token verification- **Type**: TypeScript Express Service- `/sync` implements a lightweight event log with sequence numbers, push/pull batching, and presigned upload handshakes for media.

2. **Data Management** - Farms, partners, orders CRUD operations

3. **Offline Synchronization** - Queue-based sync for mobile offline mode- **Port**: 4000 (default)- `/media/prepare` returns S3 presigned URLs using AWS SDK v3 so clients can upload files directly.

4. **Media Management** - S3/MinIO upload preparation and tracking

5. **Background Jobs** - Merkle tree generation for blockchain readiness- **Database**: MongoDB- `/jobs/merkle/run` computes and stores daily Merkle roots per owner to verify event integrity later.



## 🚀 Quick Start- **Cache**: Redis- `/health` reports Mongo connection health and basic runtime metadata for probes.



```bash- **Storage**: MinIO (S3-compatible)

cd services/auth

pnpm install- **Package Manager**: pnpm## Project Layout

pnpm run dev

```



### Environment Variables## 🎯 Responsibilities```



```bashsrc/

MONGODB_URI=mongodb://localhost:27017/jani

JWT_SECRET=your-secret-key-change-in-production1. **Authentication & Authorization**  index.ts           # Express bootstrap, CORS setup, route mounting, Mongo connection

PORT=4000

S3_ENDPOINT=http://localhost:9000   - User signup and login  config.ts          # Environment variable helpers (JWT secret, S3 config, etc.)

S3_ACCESS_KEY=minioadmin

S3_SECRET_KEY=minioadmin   - JWT token generation and validation  controllers.ts     # Signup/login/me handlers and JWT issuance

S3_BUCKET=jani-media

```   - Role-based access control (Farmer, Exporter, Admin)  routes.ts          # `/auth/*` definitions



## 📡 API Reference  dataRoutes.ts      # Auth-protected farm/partner/order endpoints



### Base URL2. **Data Management**  syncRoutes.ts      # Event push/pull, media completion hooks

```

http://localhost:4000   - Farms, plots, and crop management  jobsRoutes.ts      # Merkle root job endpoint

```

   - Partners and orders  media.ts           # S3 presign helper

### Authentication Routes (`/auth`)

   - User profiles  middleware/        # JWT auth middleware and request typings

#### Sign Up

```http  dataModels.ts      # Mongoose schemas for farms/partners/orders (subset mirrors seed data)

POST /auth/signup

Content-Type: application/json3. **Offline Synchronization**  syncModels.ts      # Sync event + sequence counter models



{   - Event-based sync system  merkleModels.ts    # Merkle root storage + helper utilities

  "email": "farmer@example.com",

  "password": "SecurePass123!",   - Conflict resolution  scripts/           # Seed scripts (`seedUsers.ts`, `seedDemoData.ts`)

  "name": "John Farmer",

  "role": "farmer"   - Client-server state management```

}

```



**Response:**4. **Media Management**## Environment

```json

{   - Image and file uploads to S3/MinIO

  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",

  "user": {   - Pre-signed URL generation| Variable | Purpose | Default |

    "id": "user_123",

    "email": "farmer@example.com",   - Media metadata tracking| --- | --- | --- |

    "name": "John Farmer",

    "role": "farmer"| `PORT` | HTTP port exposed by the service | `4000` |

  }

}5. **Background Jobs**| `MONGO_URI` | Connection string for MongoDB | `mongodb://mongo:27017/jani-auth` |

```

   - Merkle tree generation for blockchain| `JWT_SECRET` | HMAC secret for signing access tokens | _(required)_ |

#### Login

```http   - Scheduled tasks| `CORS_ORIGIN` | Comma-separated allowlist for browsers | _(unset → mirrors request origin)_ |

POST /auth/login

Content-Type: application/json   - Data processing| `AWS_REGION`/`AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` | Credentials used when presigning S3 uploads | _(unset)_ |



{| `AWS_UPLOAD_BUCKET` | Target bucket for media uploads | _(unset)_ |

  "email": "farmer@example.com",

  "password": "SecurePass123!"## 🚀 Quick Start

}

```Copy `.env.example` (in repo root) or export variables before starting the service.



#### Verify Token### Prerequisites

```http

POST /auth/verify## Local Development

Authorization: Bearer <token>

```- Node.js 20.18.3+



#### Get Current User- pnpm 10.x```bash

```http

GET /auth/me- MongoDB running on `mongodb://localhost:27017`cd services/auth

Authorization: Bearer <token>

```- Redis running on `redis://localhost:6379`pnpm install



### Data Routes (`/data`)- MinIO running on `http://localhost:9000`pnpm dev



#### Get Farms```

```http

GET /data/farms### Installation

Authorization: Bearer <token>

````pnpm dev` runs the service with `ts-node`, recompiling on change. For a compiled run:



**Response:**```bash

```json

{cd services/auth```bash

  "farms": [

    {pnpm installpnpm build

      "id": "farm_123",

      "name": "Green Valley Farm",```pnpm start

      "location": "California",

      "owner": "user_123",```

      "plots": 5,

      "totalArea": "100 acres"### Environment Variables

    }

  ]### Health Check

}

```Create `.env` or set environment variables:



#### Link Farm to User```bash

```http

POST /data/farms/:id/link```bashcurl http://localhost:4000/health

Authorization: Bearer <token>

Content-Type: application/json# Database```



{MONGO_URI=mongodb://localhost:27017/jani-ai-auth

  "userId": "user_456",

  "role": "member"MONGODB_URI=mongodb://localhost:27017/jani-ai-authExample response:

}

```



#### Get Partners# Authentication```json

```http

GET /data/partnersJWT_SECRET=your-super-secret-jwt-key-change-in-production{

Authorization: Bearer <token>

```JWT_EXPIRES_IN=7d  "service": "JANI Auth Service",



#### Get Orders  "status": "healthy",

```http

GET /data/orders# Server  "version": "1.0.0",

Authorization: Bearer <token>

```PORT=4000  "uptime": 12.3,



### Sync Routes (`/sync`)  "mongodb": { "status": "connected", "readyState": 1 }



#### Push Offline Events# Storage (MinIO/S3)}

```http

POST /sync/pushS3_ENDPOINT=http://localhost:9000```

Authorization: Bearer <token>

Content-Type: application/jsonS3_REGION=us-east-1



{S3_BUCKET=jani-media## Key Endpoints

  "events": [

    {S3_ACCESS_KEY=minioadmin

      "type": "planting",

      "farmId": "farm_123",S3_SECRET_KEY=minioadmin| Method | Path | Notes |

      "plotId": "plot_456",

      "timestamp": "2025-10-28T10:00:00Z",S3_FORCE_PATH_STYLE=true| --- | --- | --- |

      "data": {

        "crop": "tomatoes",| `POST` | `/auth/signup` | Register a user; enforces role-specific identifiers and hashes password with bcrypt. |

        "quantity": 500

      }# Redis (optional)| `POST` | `/auth/login` | Validate credentials and return a short-lived JWT (`15m`). |

    }

  ]REDIS_URL=redis://localhost:6379| `POST` | `/auth/verify` | Requires `Authorization: Bearer`; returns `{ valid, user }` if token is valid. |

}

```| `GET` | `/auth/me` | Returns current user profile (sans password). |



**Features:**# CORS| `GET` | `/data/farms` | Authenticated farm listing used by mobile linking flows. |

- Batch event synchronization

- Media upload supportCORS_ORIGIN=http://localhost:3000,exp://192.168.1.100:8081| `POST` | `/data/farms/:id/link` | Toggle the farm linkage workflow. |

- Conflict resolution

- Queue management```| `GET` | `/data/partners` | Partner lookup seeded for demos. |



#### Commit Sync| `GET` | `/data/orders` | Order lookup seeded for demos. |

```http

POST /sync/commit### Development| `POST` | `/media/prepare` | Accepts file manifest and responds with presigned upload targets. |

Authorization: Bearer <token>

Content-Type: application/json| `POST` | `/sync/push` | Accepts an array of client events, assigns server sequence numbers, and returns upload tasks. |



{```bash| `GET` | `/sync/pull?since=<seq>` | Stream events newer than the provided sequence number. |

  "syncId": "sync_789"

}# Start development server with hot reload| `POST` | `/jobs/merkle/run` | Compute Merkle root for the authenticated owner/date. |

```

pnpm run dev

#### Complete Media Upload

```httpAll non-`/health` routes require `Authorization: Bearer <token>` issued by the signup/login flow.

POST /sync/media/:id/complete

Authorization: Bearer <token># Build TypeScript

```

pnpm run build## Seeding

#### Pull Server Data

```http

GET /sync/pull

Authorization: Bearer <token># Start production serverPopulate demo users and linked data for local testing:

```

pnpm start

### Media Routes (`/media`)

```bash

#### Prepare Upload

```http# Run testspnpm seed:users    # farmer/exporter/admin accounts

POST /media/prepare

Authorization: Bearer <token>pnpm testpnpm seed:demo     # adds farms, partners, orders, events

Content-Type: application/json

``````

{

  "filename": "farm-photo.jpg",

  "contentType": "image/jpeg",

  "size": 2048576### Seeding DataSeed scripts expect the environment variables above to point at a reachable MongoDB instance.

}

```



**Response:**```bash## Testing Notes

```json

{# Seed demo data (farms, users, orders, partners)

  "uploadUrl": "https://s3.example.com/...",

  "mediaId": "media_123",pnpm run seed:demoThe service currently lacks automated tests. When adding new logic, consider placing Jest/ts-node tests under a new `src/__tests__/` directory and wiring a `pnpm test` script that runs `ts-node` or `tsx`.

  "expiresAt": "2025-10-28T11:00:00Z"

}

```

# Or run individual seed scripts## Deployment Tips

### Job Routes (`/jobs`)

node seed-all-data.js

#### Ping (Health Check)

```httpnode seed-traceability-events.js- Run `pnpm build` inside CI/CD to emit `dist/` and deploy with `pnpm start` or `node dist/index.js`.

GET /jobs/ping

``````- Provide production-grade `JWT_SECRET` and limit CORS origins before shipping.



#### Run Merkle Tree Generation- Grant the service only presign permissions (e.g., AWS policy with `s3:PutObject`, `s3:AbortMultipartUpload`) scoped to the target bucket.

```http

POST /jobs/merkle/run## 📡 API Reference- Monitor `/sync/push` volume; it is chatty and may warrant rate limiting or background processing as usage grows.

Authorization: Bearer <token>

Content-Type: application/json

### Base URL

{

  "farmId": "farm_123"```

}http://localhost:4000

``````



### Health Check### Health Check

```http

GET /health```http

```GET /health

```

**Response:**

```json**Response:**

{```json

  "service": "JANI Auth Service",{

  "status": "healthy",  "service": "JANI Auth Service",

  "timestamp": "2025-10-28T10:30:00.000Z",  "status": "healthy",

  "version": "1.0.0",  "timestamp": "2025-10-28T10:00:00Z",

  "uptime": 3600.5,  "version": "1.0.0",

  "mongodb": {  "uptime": 3600,

    "status": "connected",  "mongodb": {

    "readyState": 1    "status": "connected",

  }    "readyState": 1

}  }

```}

```

## 🏗️ Database Schema

---

### User Model

```typescript### Authentication Routes (`/auth`)

{

  _id: ObjectId,#### Sign Up

  email: string,

  password: string (hashed),```http

  name: string,POST /auth/signup

  role: 'farmer' | 'exporter' | 'admin',Content-Type: application/json

  farms: ObjectId[],

  createdAt: Date,{

  updatedAt: Date  "email": "farmer@example.com",

}  "password": "SecurePass123!",

```  "name": "John Farmer",

  "role": "farmer"

### Farm Model}

```typescript```

{

  _id: ObjectId,**Response:**

  name: string,```json

  location: {{

    address: string,  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",

    coordinates: [number, number]  "user": {

  },    "id": "507f1f77bcf86cd799439011",

  owner: ObjectId,    "email": "farmer@example.com",

  members: ObjectId[],    "name": "John Farmer",

  plots: ObjectId[],    "role": "farmer"

  totalArea: number,  }

  createdAt: Date,}

  updatedAt: Date```

}

```#### Login



### Sync Event Model```http

```typescriptPOST /auth/login

{Content-Type: application/json

  _id: ObjectId,

  userId: ObjectId,{

  type: string,  "email": "farmer@example.com",

  farmId: ObjectId,  "password": "SecurePass123!"

  plotId: ObjectId,}

  timestamp: Date,```

  data: object,

  synced: boolean,**Response:**

  syncedAt: Date```json

}{

```  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",

  "user": {

## 🔐 Security    "id": "507f1f77bcf86cd799439011",

    "email": "farmer@example.com",

- **JWT Authentication**: All protected routes require valid JWT token    "name": "John Farmer",

- **Password Hashing**: bcrypt with salt rounds    "role": "farmer"

- **CORS**: Configurable allowed origins  }

- **Rate Limiting**: Coming soon}

- **Input Validation**: Request body validation```

- **SQL Injection**: Protected by Mongoose ORM

#### Verify Token

## 🧪 Testing

```http

```bashPOST /auth/verify

# Run testsAuthorization: Bearer <token>

pnpm test```



# Run with coverage**Response:**

pnpm test:coverage```json

{

# Lint  "valid": true,

pnpm run lint  "user": {

    "id": "507f1f77bcf86cd799439011",

# Type check    "email": "farmer@example.com",

pnpm run typecheck    "role": "farmer"

```  }

}

## 🚀 Deployment```



### Docker#### Get Current User



```bash```http

docker build -t jani-auth .GET /auth/me

docker run -p 4000:4000 \Authorization: Bearer <token>

  -e MONGODB_URI=mongodb://mongo:27017/jani \```

  -e JWT_SECRET=production-secret \

  jani-auth**Response:**

``````json

{

### Docker Compose  "id": "507f1f77bcf86cd799439011",

  "email": "farmer@example.com",

```yaml  "name": "John Farmer",

auth:  "role": "farmer",

  build: ./services/auth  "createdAt": "2025-01-15T10:00:00Z"

  ports:}

    - "4000:4000"```

  environment:

    - MONGODB_URI=mongodb://mongo:27017/jani---

    - JWT_SECRET=${JWT_SECRET}

  depends_on:### Data Routes (`/data`)

    - mongo

    - redisAll data routes require authentication.

```

#### Get Farms

## 📊 Architecture

```http

```GET /data/farms

┌─────────────────────────────────────────┐Authorization: Bearer <token>

│          Auth Service (4000)            │```

├─────────────────────────────────────────┤

│                                         │**Response:**

│  /auth    → Authentication              │```json

│  /data    → Farms, Partners, Orders     │{

│  /sync    → Offline Synchronization     │  "farms": [

│  /media   → Upload Management           │    {

│  /jobs    → Background Jobs             │      "id": "farm_123",

│  /health  → Service Status              │      "name": "Green Valley Farm",

│                                         │      "location": {

├─────────────────────────────────────────┤        "latitude": 34.0522,

│                                         │        "longitude": -118.2437

│  ┌──────────┐  ┌──────────┐  ┌───────┐│      },

│  │ MongoDB  │  │  Redis   │  │ MinIO ││      "area": 50,

│  │ (Users,  │  │ (Cache,  │  │ (S3)  ││      "unit": "hectares",

│  │  Farms)  │  │  Jobs)   │  │       ││      "plots": [

│  └──────────┘  └──────────┘  └───────┘│        {

└─────────────────────────────────────────┘          "id": "plot_456",

```          "name": "North Field",

          "crop": "Tomatoes",

---          "area": 10

        }

**Built with Express, TypeScript, and MongoDB**      ]

    }
  ]
}
```

#### Link Farm to User

```http
POST /data/farms/:id/link
Authorization: Bearer <token>
```

Links a farm to the authenticated user.

#### Get Partners

```http
GET /data/partners
Authorization: Bearer <token>
```

**Response:**
```json
{
  "partners": [
    {
      "id": "partner_789",
      "name": "Export Corp",
      "type": "exporter",
      "contact": {
        "email": "contact@exportcorp.com",
        "phone": "+1234567890"
      }
    }
  ]
}
```

#### Get Orders

```http
GET /data/orders
Authorization: Bearer <token>
```

**Response:**
```json
{
  "orders": [
    {
      "id": "order_101",
      "farmId": "farm_123",
      "partnerId": "partner_789",
      "crop": "Tomatoes",
      "quantity": 1000,
      "unit": "kg",
      "status": "pending",
      "createdAt": "2025-10-20T10:00:00Z"
    }
  ]
}
```

---

### Sync Routes (`/sync`)

Handles offline synchronization between mobile clients and server.

#### Push Events

```http
POST /sync/push
Authorization: Bearer <token>
Content-Type: application/json

{
  "clientSeq": 5,
  "deviceId": "device_abc123",
  "events": [
    {
      "clientId": "evt_local_1",
      "type": "activity.created",
      "occurredAt": "2025-10-28T09:00:00Z",
      "payload": {
        "plotId": "plot_456",
        "type": "irrigation",
        "description": "Watered the field"
      },
      "media": [
        {
          "clientId": "media_local_1",
          "checksum": "abc123def456",
          "size": 245678,
          "type": "image",
          "mimeType": "image/jpeg"
        }
      ]
    }
  ]
}
```

**Response:**
```json
{
  "lastSeq": 42,
  "results": [
    {
      "clientId": "evt_local_1",
      "status": "success",
      "serverId": "evt_server_42"
    }
  ],
  "mediaUploads": [
    {
      "id": "media_server_1",
      "clientId": "media_local_1",
      "uploadUrl": "https://s3.amazonaws.com/...",
      "method": "PUT",
      "headers": {
        "Content-Type": "image/jpeg"
      }
    }
  ]
}
```

#### Commit Sync

```http
POST /sync/commit
Authorization: Bearer <token>
Content-Type: application/json

{
  "clientSeq": 5
}
```

Commits the sync transaction.

#### Complete Media Upload

```http
POST /sync/media/:id/complete
Authorization: Bearer <token>
```

Marks a media upload as complete.

#### Pull Changes

```http
GET /sync/pull?since=40
Authorization: Bearer <token>
```

**Response:**
```json
{
  "events": [
    {
      "seq": 41,
      "type": "order.created",
      "occurredAt": "2025-10-28T10:00:00Z",
      "payload": {
        "orderId": "order_102",
        "farmId": "farm_123"
      }
    }
  ],
  "lastSeq": 42
}
```

---

### Media Routes (`/media`)

#### Prepare Upload

```http
POST /media/prepare
Authorization: Bearer <token>
Content-Type: application/json

{
  "files": [
    {
      "name": "farm-photo.jpg",
      "type": "image/jpeg",
      "size": 245678
    }
  ]
}
```

**Response:**
```json
{
  "uploads": [
    {
      "id": "media_abc123",
      "uploadUrl": "https://s3.amazonaws.com/jani-media/abc123.jpg?...",
      "method": "PUT",
      "headers": {
        "Content-Type": "image/jpeg"
      }
    }
  ]
}
```

---

### Jobs Routes (`/jobs`)

#### Ping

```http
GET /jobs/ping
```

Health check for jobs router.

#### Run Merkle Tree Generation

```http
POST /jobs/merkle/run
Authorization: Bearer <token>
```

Triggers blockchain merkle tree generation for traceability.

---

## 🏗️ Architecture

### Database Schema

**Users Collection:**
```typescript
{
  _id: ObjectId,
  email: string,
  password: string (hashed),
  name: string,
  role: 'farmer' | 'exporter' | 'admin',
  identifier: string,
  createdAt: Date
}
```

**Farms Collection:**
```typescript
{
  _id: ObjectId,
  name: string,
  location: {
    latitude: number,
    longitude: number
  },
  area: number,
  unit: string,
  plots: Array<{
    id: string,
    name: string,
    crop: string,
    area: number
  }>,
  ownerId: ObjectId
}
```

**SyncEvents Collection:**
```typescript
{
  _id: ObjectId,
  seq: number,
  ownerRole: string,
  ownerIdentifier: string,
  clientId: string,
  type: string,
  actorRole: string,
  occurredAt: Date,
  payload: Object,
  media: Array<MediaReference>
}
```

### File Structure

```
services/auth/
├── src/
│   ├── index.ts              # Main entry point
│   ├── routes.ts             # Auth routes (/auth)
│   ├── dataRoutes.ts         # Data routes (/data)
│   ├── syncRoutes.ts         # Sync routes (/sync)
│   ├── mediaRoutes.ts        # Media routes (/media)
│   ├── jobsRoutes.ts         # Jobs routes (/jobs)
│   ├── controllers.ts        # Auth controllers
│   ├── dataControllers.ts    # Data controllers
│   ├── database.ts           # MongoDB connection
│   ├── config.ts             # Configuration
│   ├── media.ts              # S3/MinIO media handling
│   ├── utils.ts              # Utilities
│   ├── dataModels.ts         # Data models
│   ├── syncModels.ts         # Sync models
│   ├── merkleModels.ts       # Merkle tree models
│   ├── userModel.ts          # User model
│   └── middleware/
│       └── authMiddleware.ts # JWT authentication
├── seed-all-data.js          # Seed script
├── seed-farms.json           # Seed data
├── seed-users.json           # Seed data
├── seed-orders.json          # Seed data
├── seed-partners.json        # Seed data
├── package.json
└── tsconfig.json
```

## 🔒 Security

- **Password Hashing**: bcrypt/scrypt with salt rounds
- **JWT Tokens**: HS256 algorithm with configurable expiry
- **CORS**: Configurable origin whitelist
- **Auth Middleware**: Protects all authenticated routes
- **Role-Based Access**: Different permissions per role

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test routes.test.ts

# Coverage report
pnpm test --coverage
```

## 📊 Monitoring

### Health Check

Check service health:
```bash
curl http://localhost:4000/health
```

### Logs

The service logs all requests and errors to console. In production, configure structured logging (e.g., Winston, Pino).

## 🚀 Deployment

### Docker

```bash
# Build image
docker build -t jani-auth .

# Run container
docker run -p 4000:4000 \
  -e MONGO_URI=mongodb://mongo:27017/jani \
  -e JWT_SECRET=your-secret \
  jani-auth
```

### Docker Compose

```bash
# Start with other services
docker-compose up -d auth

# View logs
docker-compose logs -f auth
```

## 🐛 Troubleshooting

### MongoDB Connection Issues

```bash
# Check MongoDB is running
docker-compose ps mongo

# Check connection
mongosh mongodb://localhost:27017/jani-ai-auth
```

### JWT Token Errors

- Ensure `JWT_SECRET` is set and consistent
- Check token expiry with `JWT_EXPIRES_IN`
- Verify `Authorization: Bearer <token>` header format

### S3/MinIO Upload Failures

- Verify MinIO is running: `curl http://localhost:9000/minio/health/live`
- Check `S3_ACCESS_KEY` and `S3_SECRET_KEY`
- Ensure bucket exists: Create via MinIO console

## 📚 Related Documentation

- [Root README](../../README.md) - Platform overview
- [Mobile App](../../apps/mobile/README.md) - Mobile client documentation
- [API Testing](../../scripts/check-auth-api.js) - API test scripts

---

**Built with TypeScript, Express, and MongoDB**
