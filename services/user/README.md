# User Service

The user service is a lightweight Express façade that currently exposes a `/health` endpoint. It is intended to grow into a dedicated profile and account metadata API consumed by the web and mobile clients.

## Requirements

- Node.js 20+
- npm (ships with Node)

## Environment Variables

| Variable | Description              | Default |
|----------|--------------------------|---------|
| `PORT`   | Port to listen on        | `5000`  |

Create a `.env` file locally if you need to override the port.

## Install & Run

```bash
# Install dependencies
npm install

# Start the service
npm start

# Start in development mode with hot reload (if you add nodemon)
npm run dev

# Docker usage
docker build -t jani-user .
docker run --env-file .env -p 5000:5000 jani-user
```

The service logs `User service listening on <port>` when ready.

## Endpoints

| Method | Route       | Description           |
|--------|-------------|-----------------------|
| `GET`  | `/health`   | Returns `{ status: "ok" }` |

Extend `server.js` to add new routes as the domain model evolves.
