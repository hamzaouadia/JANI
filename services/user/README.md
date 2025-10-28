# User Service# User Service# User Service



> **Farm and user management service**



The User Service manages user profiles, farm ownership, farm access control, and provides farm-related data operations for the JANI platform.> **User and farm management service**The user service stores farm records and membership metadata that sit on the edge between authentication and operations. It exposes a small Express API, talks to MongoDB with Mongoose, and relies on JWTs issued by the auth service for access control.



## 📋 Overview



- **Type**: JavaScript Express Service (ES Modules)The User Service manages user profiles, farm assignments, and access control for the JANI platform.## Capabilities

- **Port**: 5000 (default)

- **Database**: MongoDB

- **Package Manager**: npm

- **Auth**: JWT middleware## 📋 Overview- Creates and lists farms owned by the authenticated user (`/farms`).



## 🎯 Core Responsibilities- Lets collaborators link into a farm via identifier + access code (`/farms/link`).



1. **Farm Management** - Create, update, and manage farms- **Type**: JavaScript Express Service- Rotates and validates access codes using `crypto.scryptSync` with per-farm salt.

2. **User Access Control** - Link users to farms with specific roles

3. **Farm Search** - Query farms by various criteria- **Port**: 5000 (default)- Tracks farm history entries any time metadata changes or notes are appended.

4. **Farm History** - Track farm updates and changes

5. **Order Management** - Handle farm-related orders- **Database**: MongoDB- Supports lightweight member management (owner adds members → `FarmMember` records).

6. **Member Management** - Add/remove farm members

- **Package Manager**: npm- Provides `/data/orders` as a demo feed of outbound shipment data for the mobile app.

## 🚀 Quick Start

- `/health` reports Mongo connectivity with ready-state codes suitable for probes.

```bash

cd services/user## 🎯 Responsibilities

npm install

npm start## Project Layout

```

1. **User Management**

### Environment Variables

   - Create, read, update, delete users```

```bash

PORT=5000   - User profile managementserver.js      # Express bootstrap, schemas, routes, Mongo connection

MONGO_URI=mongodb://localhost:27017/jani

MONGO_DB=jani   - Role assignmentpackage.json   # npm scripts and dependencies (ESM, no build step)

JWT_SECRET=your-secret-key-change-in-production

``````



## 📡 API Reference2. **Farm Assignment**



### Base URL   - Link users to farmsAll logic currently lives in `server.js`; split into modules as the service grows.

```

http://localhost:5000   - Manage farm ownership

```

   - Access control## Environment

### Health Check

```http

GET /health

```3. **Access Control**| Variable | Purpose | Default |



**Response:**   - Permission management| --- | --- | --- |

```json

{   - Role-based access| `PORT` | HTTP port exposed by the service | `5000` |

  "service": "JANI User Service",

  "status": "healthy",   - User authorization| `MONGO_URI` | Mongo connection string | `mongodb://localhost:27017/jani` |

  "timestamp": "2025-10-28T10:30:00.000Z",

  "version": "1.0.0",| `MONGO_DB` | Database name | `jani` |

  "uptime": 3600.5,

  "mongodb": {## 🚀 Quick Start| `JWT_SECRET` | Secret used to verify Bearer tokens from the auth service | `dev-secret-change-me` |

    "status": "connected",

    "readyState": 1

  }

}```bashSet these via `.env` or shell exports before starting the service.

```

cd services/user

### Farm Management

npm install## Local Development

#### Create Farm

```httpnpm start

POST /farms

Authorization: Bearer <token>``````bash

Content-Type: application/json

cd services/user

{

  "name": "Green Valley Farm",### Environment Variablesnpm install

  "location": {

    "address": "123 Farm Road, California",npm start

    "coordinates": [-122.4194, 37.7749]

  },```bash```

  "area": 100,

  "areaUnit": "acres",MONGODB_URI=mongodb://localhost:27017/jani_users

  "crops": ["tomatoes", "lettuce", "carrots"]

}PORT=5000The service runs directly with Node (ES modules). You should see `User service listening on <port>` and Mongo connection logs.

```

```

**Response:**

```json### Health Check

{

  "success": true,## 📡 API Reference

  "farm": {

    "id": "farm_123",```bash

    "name": "Green Valley Farm",

    "owner": "user_123",### Base URLcurl http://localhost:5000/health

    "accessCode": "FARM-ABC123",

    "createdAt": "2025-10-28T10:30:00.000Z"``````

  }

}http://localhost:5000

```

```Example response:

#### List Farms

```http

GET /farms?page=1&limit=20

Authorization: Bearer <token>### Endpoints```json

```

{

**Query Parameters:**

- `page`: Page number (default: 1)```http  "service": "JANI User Service",

- `limit`: Results per page (default: 20)

- `ownerId`: Filter by ownerGET    /api/users           # List all users  "status": "healthy",

- `sort`: Sort field (default: createdAt)

POST   /api/users           # Create user  "version": "1.0.0",

**Response:**

```jsonGET    /api/users/:id       # Get user by ID  "mongodb": { "status": "connected", "readyState": 1 }

{

  "success": true,PUT    /api/users/:id       # Update user}

  "farms": [

    {DELETE /api/users/:id       # Delete user```

      "id": "farm_123",

      "name": "Green Valley Farm",GET    /health              # Health check

      "location": {...},

      "owner": "user_123",```## Key Endpoints

      "members": 3,

      "plots": 5

    }

  ],### Example: Create User### Farm Management

  "pagination": {

    "page": 1,

    "limit": 20,

    "total": 45,```http| Method | Path | Notes |

    "pages": 3

  }POST /api/users| --- | --- | --- |

}

```Content-Type: application/json| `POST` | `/farms` | Create a farm; optional `identifier`, `location`, `accessCode`, `data` payload. |



#### Search Farms| `GET` | `/farms` | List farms where the user is owner or member. Use `?mine=1` to return only owned farms. |

```http

GET /farms/search?q=valley&location=california{| `GET` | `/farms/search?q=<term>` | Case-insensitive prefix search on identifier and fuzzy match on name. |

Authorization: Bearer <token>

```  "email": "farmer@example.com",| `GET` | `/farms/:id` | Fetch farm details (requires ownership or membership). |



**Query Parameters:**  "name": "John Farmer",| `PATCH` | `/farms/:id` | Update metadata (`name`, `location`, `status`, `notes`, `data`) and append to history. |

- `q`: Search query (name, location)

- `location`: Filter by location  "role": "farmer",

- `crop`: Filter by crop type

- `minArea`: Minimum farm area  "farmIds": ["farm_123"]### Access & Membership

- `maxArea`: Maximum farm area

}

#### Get Farm by ID

```http```| Method | Path | Notes |

GET /farms/:id

Authorization: Bearer <token>| --- | --- | --- |

```

## 🏗️ Database Schema| `POST` | `/farms/link` | Join a farm using `identifier` + `accessCode` (hashed with scrypt). |

**Response:**

```json| `PATCH` | `/farms/:id/access-code` | Owners rotate the farm’s access code (re-hash + history entry). |

{

  "success": true,```javascript| `POST` | `/farms/:id/members` | Owners add/overwrite a member record with a role (`viewer` default). |

  "farm": {

    "id": "farm_123",{

    "name": "Green Valley Farm",

    "location": {  _id: ObjectId,### Notes & History

      "address": "123 Farm Road, California",

      "coordinates": [-122.4194, 37.7749]  email: String,

    },

    "owner": {  name: String,| Method | Path | Notes |

      "id": "user_123",

      "name": "John Farmer"  role: String,| --- | --- | --- |

    },

    "members": [  farmIds: [String],| `POST` | `/farms/:id/updates` | Append a free-form history entry (`change`, `note`). |

      {

        "userId": "user_456",  createdAt: Date,| `GET` | `/farms/:id/history` | Retrieve recorded history entries. |

        "name": "Jane Worker",

        "role": "worker",  updatedAt: Date

        "joinedAt": "2025-09-15T10:00:00Z"

      }}### Data Feeds

    ],

    "area": 100,```

    "areaUnit": "acres",

    "crops": ["tomatoes", "lettuce"],| Method | Path | Notes |

    "accessCode": "FARM-ABC123",

    "createdAt": "2025-10-28T10:30:00.000Z",## 🚀 Deployment| --- | --- | --- |

    "updatedAt": "2025-10-28T10:30:00.000Z"

  }| `GET` | `/data/orders` | Returns generated order summaries for dashboard/mobile demos. |

}

``````bash



#### Update Farmdocker build -t jani-user .All routes above (except `/health`) require `Authorization: Bearer <jwt>` where the JWT’s subject or user id fields match the auth service.

```http

PATCH /farms/:iddocker run -p 5000:5000 jani-user

Authorization: Bearer <token>

Content-Type: application/json```## Data Model Highlights



{

  "name": "Green Valley Organic Farm",

  "crops": ["tomatoes", "lettuce", "carrots", "peppers"],---- `Farm` documents store owner ID, optional identifier, location/status metadata, access code salt/hash, arbitrary `data`, and a history array.

  "certifications": ["organic", "fair-trade"]

}- `FarmMember` documents link `userId` + `farmId` with a role (`owner`, `admin`, `viewer`). Inserted during link flows or owner-managed membership updates.

```

**Built with Express and MongoDB**- Access codes are hashed using `crypto.scryptSync(accessCode, salt, 64)` and compared with `crypto.timingSafeEqual` to avoid timing leaks.

#### Link Farm to User

```http

POST /farms/link## Operational Notes

Authorization: Bearer <token>

Content-Type: application/json- There is no seed script—create test farms via the API or Mongo shell.

- The JWT middleware simply trusts the provided secret; integrate JWKS or distributed signing if auth requirements tighten.

{- Orders endpoint returns synthetic data; swap it out once a real supply-chain integration exists.

  "farmId": "farm_123",- Consider moving schemas and helpers into their own files if additional endpoints are introduced.

  "accessCode": "FARM-ABC123",
  "role": "worker"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully linked to farm",
  "farm": {
    "id": "farm_123",
    "name": "Green Valley Farm",
    "role": "worker"
  }
}
```

#### Add Farm Member
```http
POST /farms/:id/members
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user_789",
  "role": "supervisor",
  "permissions": ["view", "edit_plots", "create_activities"]
}
```

#### Add Farm Update
```http
POST /farms/:id/updates
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "harvest",
  "title": "Tomato Harvest Complete",
  "description": "Harvested 2500kg of tomatoes from Plot A",
  "data": {
    "crop": "tomatoes",
    "quantity": 2500,
    "unit": "kg",
    "quality": "Grade A"
  }
}
```

#### Update Farm Access Code
```http
PATCH /farms/:id/access-code
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "accessCode": "FARM-XYZ789",
  "message": "Access code regenerated"
}
```

#### Get Farm History
```http
GET /farms/:id/history?limit=50
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "history": [
    {
      "type": "update",
      "field": "crops",
      "oldValue": ["tomatoes"],
      "newValue": ["tomatoes", "lettuce"],
      "updatedBy": "user_123",
      "timestamp": "2025-10-28T10:30:00.000Z"
    },
    {
      "type": "member_added",
      "userId": "user_456",
      "role": "worker",
      "addedBy": "user_123",
      "timestamp": "2025-10-27T14:00:00.000Z"
    }
  ]
}
```

### Order Management

#### Get Orders
```http
GET /data/orders?farmId=farm_123&status=pending
Authorization: Bearer <token>
```

**Query Parameters:**
- `farmId`: Filter by farm
- `status`: Filter by order status (pending, confirmed, shipped, delivered)
- `startDate`: Orders after date
- `endDate`: Orders before date

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "id": "order_123",
      "farmId": "farm_123",
      "buyerId": "buyer_456",
      "items": [
        {
          "crop": "tomatoes",
          "quantity": 500,
          "unit": "kg",
          "pricePerUnit": 2.5
        }
      ],
      "totalAmount": 1250,
      "status": "pending",
      "createdAt": "2025-10-28T10:30:00.000Z"
    }
  ]
}
```

## 🏗️ Database Schema

### Farm Model
```javascript
{
  _id: ObjectId,
  name: String,
  location: {
    address: String,
    coordinates: [Number, Number] // [longitude, latitude]
  },
  owner: ObjectId,              // User reference
  members: [{
    userId: ObjectId,
    role: String,               // owner, manager, worker, viewer
    permissions: [String],
    joinedAt: Date
  }],
  area: Number,
  areaUnit: String,             // acres, hectares, sqm
  crops: [String],
  plots: [ObjectId],            // Plot references
  accessCode: String,           // Unique access code
  certifications: [String],     // organic, fair-trade, etc.
  status: String,               // active, inactive
  createdAt: Date,
  updatedAt: Date
}
```

### User Model
```javascript
{
  _id: ObjectId,
  email: String,
  name: String,
  phone: String,
  role: String,                 // farmer, exporter, admin
  farms: [ObjectId],            // Associated farms
  preferences: {
    language: String,
    notifications: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Security

- **JWT Authentication**: All routes protected with JWT middleware
- **Role-Based Access**: Owner/member permissions
- **Access Codes**: Secure farm linking mechanism
- **Input Validation**: Request validation for all endpoints

## 🧪 Testing

```bash
# Run tests
npm test

# Lint
npm run lint
```

## 🚀 Deployment

### Docker

```bash
docker build -t jani-user .
docker run -p 5000:5000 \
  -e MONGO_URI=mongodb://mongo:27017/jani \
  -e JWT_SECRET=production-secret \
  jani-user
```

### Docker Compose

```yaml
user:
  build: ./services/user
  ports:
    - "5000:5000"
  environment:
    - MONGO_URI=mongodb://mongo:27017/jani
    - JWT_SECRET=${JWT_SECRET}
  depends_on:
    - mongo
```

---

**Built with Express and MongoDB**
