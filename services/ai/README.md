# AI Service

The AI service is a placeholder Express application reserved for future machine-assisted features. In its current form it only returns a health check response and serves as a template for integrating model-backed endpoints.

## Requirements

- Node.js 20+
- npm

## Environment Variables

| Variable | Description              | Default |
|----------|--------------------------|---------|
| `PORT`   | Port to bind the server  | `5001`  |

## Install & Run

```bash
npm install
npm start

# Docker workflow
docker build -t jani-ai .
docker run --env-file .env -p 5001:5001 jani-ai
```

The service prints `AI service listening on <port>` once it is accepting requests.

## Endpoint

| Method | Route     | Description           |
|--------|-----------|-----------------------|
| `GET`  | `/health` | Returns `{ status: "ok" }` |

Use this project as the baseline for wiring future AI-related functionality (e.g. calling foundation models, storing embeddings, or streaming agent responses).
