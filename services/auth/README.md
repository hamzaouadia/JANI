# Auth Service

Express + MongoDB microservice that issues JWT access tokens for the JANI platform. It exposes `/auth/signup` and `/auth/login` endpoints and stores password hashes in MongoDB.

## Requirements

- Node.js 20+
- pnpm 10 (installed via `corepack`)
- MongoDB instance (Docker Compose provides one at `mongodb://mongo:27017/jani`)

## Environment Variables

| Variable    | Description                                  | Default                                  |
|-------------|----------------------------------------------|------------------------------------------|
| `PORT`      | HTTP port to listen on                       | `4000`                                   |
| `MONGO_URI` | Mongo connection string                      | `mongodb://localhost:27017/jani-ai-auth` |
| `JWT_SECRET`| Signing key for issued access tokens         | `supersecret`                            |

Create a `.env` file in this directory for local overrides:

```dotenv
PORT=4000
MONGO_URI=mongodb://localhost:27017/jani-auth
JWT_SECRET=change-me
```

## Install & Run

```bash
# Install dependencies
corepack prepare pnpm@10 --activate
pnpm install --frozen-lockfile

# Type-check and build the project
pnpm run build

# Start the compiled service
pnpm run start

# Or run directly with Docker
docker build -t jani-auth .
docker run --env-file .env -p 4000:4000 jani-auth
```

The server logs indicate MongoDB connectivity and will print `✅ Auth service running on port ...` when ready.

## Available Scripts

| Script          | Purpose                       |
|-----------------|-------------------------------|
| `pnpm run dev`  | Start the service with ts-node (hot reload) |
| `pnpm run build`| Compile TypeScript to `dist/` |
| `pnpm run start`| Launch compiled output        |

## API

| Method | Route          | Description                    |
|--------|----------------|--------------------------------|
| `POST` | `/auth/signup` | Register a new account         |
| `POST` | `/auth/login`  | Authenticate and receive a JWT |

Both endpoints accept JSON payloads with `email` and `password` fields. Passwords are hashed with bcrypt before storage.

## Health Check

When running in Docker Compose, hit `http://localhost:4000/auth/signup` or check container logs. A dedicated `/health` route is not yet implemented.
