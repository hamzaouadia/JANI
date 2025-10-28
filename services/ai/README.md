# AI Service

The AI service is a minimal Express placeholder that keeps an endpoint available while the platform’s machine-learning features are being designed. It exposes a single health route and is wired for JSON payloads so future endpoints can land without extra setup.

## Capabilities

- `/health` returns service metadata, uptime, and a note explaining that the implementation is a stub.
- JSON body parsing is already enabled for incoming requests.
- Port selection happens through `PORT`, making the service deployable both locally and inside Docker Compose.

## Project Layout

```
server.js        # Express bootstrap and health endpoint
.env.example     # Sample environment configuration
Dockerfile       # Minimal container build
package.json     # Scripts and dependencies (Express only)
```

## Environment

| Variable | Purpose | Default |
| --- | --- | --- |
| `PORT` | HTTP port exposed by the service | `5001` |
| `NODE_ENV` | Future toggle for logging or feature flags | `development` |
| `AI_SERVICE_URL` | Optional URL other services can reference | `http://localhost:4003` |
| `OPENAI_API_KEY` | Placeholder credential for upcoming integrations | _(unset)_ |

Copy `.env.example` to `.env` (or export equivalent variables) before running locally.

## Local Development

```bash
cd services/ai
pnpm install
pnpm start
```

On startup you should see `AI service listening on <port>` in the terminal.

### Verify

```bash
curl http://localhost:5001/health
```

Expected response:

```json
{
  "service": "JANI AI Service",
  "status": "healthy",
  "timestamp": "2025-10-27T12:00:00.000Z",
  "version": "1.0.0",
  "uptime": 1.23,
  "note": "Placeholder service - AI integration pending"
}
```

## Docker

```bash
cd services/ai
docker build -t jani-ai-service .
docker run --rm -p 5001:5001 jani-ai-service
```

Docker Compose users can rely on the `ai` service declared at the repository root; it maps the port based on `.env` just like local runs.

## Next Steps

- Add authentication once real AI endpoints are available.
- Introduce structured logging and metrics before exposing inference workloads.
- Replace the placeholder health note with real capability information when integrations land.
