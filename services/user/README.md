# User Service

The user service stores farm records and membership metadata that sit on the edge between authentication and operations. It exposes a small Express API, talks to MongoDB with Mongoose, and relies on JWTs issued by the auth service for access control.

## Capabilities

- Creates and lists farms owned by the authenticated user (`/farms`).
- Lets collaborators link into a farm via identifier + access code (`/farms/link`).
- Rotates and validates access codes using `crypto.scryptSync` with per-farm salt.
- Tracks farm history entries any time metadata changes or notes are appended.
- Supports lightweight member management (owner adds members → `FarmMember` records).
- Provides `/data/orders` as a demo feed of outbound shipment data for the mobile app.
- `/health` reports Mongo connectivity with ready-state codes suitable for probes.

## Project Layout

```
server.js      # Express bootstrap, schemas, routes, Mongo connection
package.json   # npm scripts and dependencies (ESM, no build step)
```

All logic currently lives in `server.js`; split into modules as the service grows.

## Environment

| Variable | Purpose | Default |
| --- | --- | --- |
| `PORT` | HTTP port exposed by the service | `5000` |
| `MONGO_URI` | Mongo connection string | `mongodb://localhost:27017/jani` |
| `MONGO_DB` | Database name | `jani` |
| `JWT_SECRET` | Secret used to verify Bearer tokens from the auth service | `dev-secret-change-me` |

Set these via `.env` or shell exports before starting the service.

## Local Development

```bash
cd services/user
npm install
npm start
```

The service runs directly with Node (ES modules). You should see `User service listening on <port>` and Mongo connection logs.

### Health Check

```bash
curl http://localhost:5000/health
```

Example response:

```json
{
  "service": "JANI User Service",
  "status": "healthy",
  "version": "1.0.0",
  "mongodb": { "status": "connected", "readyState": 1 }
}
```

## Key Endpoints

### Farm Management

| Method | Path | Notes |
| --- | --- | --- |
| `POST` | `/farms` | Create a farm; optional `identifier`, `location`, `accessCode`, `data` payload. |
| `GET` | `/farms` | List farms where the user is owner or member. Use `?mine=1` to return only owned farms. |
| `GET` | `/farms/search?q=<term>` | Case-insensitive prefix search on identifier and fuzzy match on name. |
| `GET` | `/farms/:id` | Fetch farm details (requires ownership or membership). |
| `PATCH` | `/farms/:id` | Update metadata (`name`, `location`, `status`, `notes`, `data`) and append to history. |

### Access & Membership

| Method | Path | Notes |
| --- | --- | --- |
| `POST` | `/farms/link` | Join a farm using `identifier` + `accessCode` (hashed with scrypt). |
| `PATCH` | `/farms/:id/access-code` | Owners rotate the farm’s access code (re-hash + history entry). |
| `POST` | `/farms/:id/members` | Owners add/overwrite a member record with a role (`viewer` default). |

### Notes & History

| Method | Path | Notes |
| --- | --- | --- |
| `POST` | `/farms/:id/updates` | Append a free-form history entry (`change`, `note`). |
| `GET` | `/farms/:id/history` | Retrieve recorded history entries. |

### Data Feeds

| Method | Path | Notes |
| --- | --- | --- |
| `GET` | `/data/orders` | Returns generated order summaries for dashboard/mobile demos. |

All routes above (except `/health`) require `Authorization: Bearer <jwt>` where the JWT’s subject or user id fields match the auth service.

## Data Model Highlights

- `Farm` documents store owner ID, optional identifier, location/status metadata, access code salt/hash, arbitrary `data`, and a history array.
- `FarmMember` documents link `userId` + `farmId` with a role (`owner`, `admin`, `viewer`). Inserted during link flows or owner-managed membership updates.
- Access codes are hashed using `crypto.scryptSync(accessCode, salt, 64)` and compared with `crypto.timingSafeEqual` to avoid timing leaks.

## Operational Notes

- There is no seed script—create test farms via the API or Mongo shell.
- The JWT middleware simply trusts the provided secret; integrate JWKS or distributed signing if auth requirements tighten.
- Orders endpoint returns synthetic data; swap it out once a real supply-chain integration exists.
- Consider moving schemas and helpers into their own files if additional endpoints are introduced.
