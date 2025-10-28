# User Service# User Service



> **User and farm management service**The user service stores farm records and membership metadata that sit on the edge between authentication and operations. It exposes a small Express API, talks to MongoDB with Mongoose, and relies on JWTs issued by the auth service for access control.



The User Service manages user profiles, farm assignments, and access control for the JANI platform.## Capabilities



## 📋 Overview- Creates and lists farms owned by the authenticated user (`/farms`).

- Lets collaborators link into a farm via identifier + access code (`/farms/link`).

- **Type**: JavaScript Express Service- Rotates and validates access codes using `crypto.scryptSync` with per-farm salt.

- **Port**: 5000 (default)- Tracks farm history entries any time metadata changes or notes are appended.

- **Database**: MongoDB- Supports lightweight member management (owner adds members → `FarmMember` records).

- **Package Manager**: npm- Provides `/data/orders` as a demo feed of outbound shipment data for the mobile app.

- `/health` reports Mongo connectivity with ready-state codes suitable for probes.

## 🎯 Responsibilities

## Project Layout

1. **User Management**

   - Create, read, update, delete users```

   - User profile managementserver.js      # Express bootstrap, schemas, routes, Mongo connection

   - Role assignmentpackage.json   # npm scripts and dependencies (ESM, no build step)

```

2. **Farm Assignment**

   - Link users to farmsAll logic currently lives in `server.js`; split into modules as the service grows.

   - Manage farm ownership

   - Access control## Environment



3. **Access Control**| Variable | Purpose | Default |

   - Permission management| --- | --- | --- |

   - Role-based access| `PORT` | HTTP port exposed by the service | `5000` |

   - User authorization| `MONGO_URI` | Mongo connection string | `mongodb://localhost:27017/jani` |

| `MONGO_DB` | Database name | `jani` |

## 🚀 Quick Start| `JWT_SECRET` | Secret used to verify Bearer tokens from the auth service | `dev-secret-change-me` |



```bashSet these via `.env` or shell exports before starting the service.

cd services/user

npm install## Local Development

npm start

``````bash

cd services/user

### Environment Variablesnpm install

npm start

```bash```

MONGODB_URI=mongodb://localhost:27017/jani_users

PORT=5000The service runs directly with Node (ES modules). You should see `User service listening on <port>` and Mongo connection logs.

```

### Health Check

## 📡 API Reference

```bash

### Base URLcurl http://localhost:5000/health

``````

http://localhost:5000

```Example response:



### Endpoints```json

{

```http  "service": "JANI User Service",

GET    /api/users           # List all users  "status": "healthy",

POST   /api/users           # Create user  "version": "1.0.0",

GET    /api/users/:id       # Get user by ID  "mongodb": { "status": "connected", "readyState": 1 }

PUT    /api/users/:id       # Update user}

DELETE /api/users/:id       # Delete user```

GET    /health              # Health check

```## Key Endpoints



### Example: Create User### Farm Management



```http| Method | Path | Notes |

POST /api/users| --- | --- | --- |

Content-Type: application/json| `POST` | `/farms` | Create a farm; optional `identifier`, `location`, `accessCode`, `data` payload. |

| `GET` | `/farms` | List farms where the user is owner or member. Use `?mine=1` to return only owned farms. |

{| `GET` | `/farms/search?q=<term>` | Case-insensitive prefix search on identifier and fuzzy match on name. |

  "email": "farmer@example.com",| `GET` | `/farms/:id` | Fetch farm details (requires ownership or membership). |

  "name": "John Farmer",| `PATCH` | `/farms/:id` | Update metadata (`name`, `location`, `status`, `notes`, `data`) and append to history. |

  "role": "farmer",

  "farmIds": ["farm_123"]### Access & Membership

}

```| Method | Path | Notes |

| --- | --- | --- |

## 🏗️ Database Schema| `POST` | `/farms/link` | Join a farm using `identifier` + `accessCode` (hashed with scrypt). |

| `PATCH` | `/farms/:id/access-code` | Owners rotate the farm’s access code (re-hash + history entry). |

```javascript| `POST` | `/farms/:id/members` | Owners add/overwrite a member record with a role (`viewer` default). |

{

  _id: ObjectId,### Notes & History

  email: String,

  name: String,| Method | Path | Notes |

  role: String,| --- | --- | --- |

  farmIds: [String],| `POST` | `/farms/:id/updates` | Append a free-form history entry (`change`, `note`). |

  createdAt: Date,| `GET` | `/farms/:id/history` | Retrieve recorded history entries. |

  updatedAt: Date

}### Data Feeds

```

| Method | Path | Notes |

## 🚀 Deployment| --- | --- | --- |

| `GET` | `/data/orders` | Returns generated order summaries for dashboard/mobile demos. |

```bash

docker build -t jani-user .All routes above (except `/health`) require `Authorization: Bearer <jwt>` where the JWT’s subject or user id fields match the auth service.

docker run -p 5000:5000 jani-user

```## Data Model Highlights



---- `Farm` documents store owner ID, optional identifier, location/status metadata, access code salt/hash, arbitrary `data`, and a history array.

- `FarmMember` documents link `userId` + `farmId` with a role (`owner`, `admin`, `viewer`). Inserted during link flows or owner-managed membership updates.

**Built with Express and MongoDB**- Access codes are hashed using `crypto.scryptSync(accessCode, salt, 64)` and compared with `crypto.timingSafeEqual` to avoid timing leaks.


## Operational Notes

- There is no seed script—create test farms via the API or Mongo shell.
- The JWT middleware simply trusts the provided secret; integrate JWKS or distributed signing if auth requirements tighten.
- Orders endpoint returns synthetic data; swap it out once a real supply-chain integration exists.
- Consider moving schemas and helpers into their own files if additional endpoints are introduced.
