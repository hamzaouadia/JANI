# Full Mobile App Sequence Diagram

This file documents the full mobile app request flows represented in `sequence-diagram-full.mmd`.

Included flows:

- Authentication: signup, login, me
- Fetching farms (list & single by id) via the `operations` service
- Fetching partners/exporters via `auth` service data route
- Orders: list and create via `operations` service
- Traceability events: capture, optional media upload (pre-signed URL or direct), and event creation
- Offline queue behavior: enqueueing failed writes and background sync processing
- Unauthorized (401) handling and token lifecycle (SecureStore / AsyncStorage)

Render the diagram locally:

```bash
# Render the main diagram
npm run docs:diagram

# Render the farms/partners or full diagram directly with mermaid-cli
npx -y @mermaid-js/mermaid-cli -i docs/sequence-diagram-full.mmd -o docs/sequence-diagram-full.svg
npx -y @mermaid-js/mermaid-cli -i docs/sequence-diagram-full.mmd -o docs/sequence-diagram-full.png
```

Key file references in the repo:

- `apps/mobile/src/lib/api/authClient.ts` (auth HTTP client + token injection)
- `apps/mobile/src/lib/api/operationsClient.ts` (operations service client)
- `apps/mobile/src/lib/api/traceabilityClient.ts` (traceability client)
- `apps/mobile/src/storage/tokenStorage.ts` (secure token persistence)
- `apps/mobile/src/lib/offline/restQueue` and `apps/mobile/src/providers/SyncBootstrap.tsx` (offline queue & processor)
- `apps/mobile/src/providers/AppProviders.tsx` (bootstraps sync, sqlite wrapper, query client)
- `apps/mobile/src/lib/api/farms.ts`, `partners.ts`, `orders.ts`, `events.ts` (domain helpers)
- `services/auth`, `services/operations`, `services/traceability` (backend services & controllers)

If you want, I can generate and commit the SVG/PNG of this diagram for convenience — say the word and I'll render and add the files to `docs/`.
