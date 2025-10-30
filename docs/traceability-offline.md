# Traceability — Offline behavior and recommendations

This short note explains the current behavior of the traceability client in the mobile app, the differences vs the `operationsClient` (which already includes auth injection + automatic enqueue-on-network-failure), the risks this difference creates, and recommended, low-risk UX and developer steps.

## Current state (code inspected)

- File: `apps/mobile/src/features/traceability/api/traceabilityApi.ts`
  - Uses an axios client with `baseURL: ENV.TRACEABILITY_BASE_URL`.
  - Has a TODO comment for auth token injection. The token is not attached today.
  - No response interceptor to automatically enqueue mutating requests on network failure.
  - Methods include `createEvent`, `syncOfflineEvents`, `getEventsByFarm` etc.
- Hooks: `useTraceability.ts` exposes `useCreateEvent`, `useSyncOfflineEvents`, etc. React Query usage is consistent with the rest of the app.

## How this differs from `operationsClient`

`operationsClient` implements three helpful behaviors:
1. Per-request auth token injection (reads token from storage and sets `Authorization` header).
2. A response interceptor which, on network-level failure for mutating requests (POST/PUT/PATCH/DELETE), enqueues the request with the app's offline queue and returns a synthetic 202 Accepted response so the UI can continue optimistically.
3. A `computeOperationsBase()` helper which maps container hostnames to `localhost` when running on web so browser-based builds reach services at host-mapped ports.

Traceability currently lacks (1) and (2), and it also lacks the browser `localhost` mapping which can cause web builds to fail to reach the traceability service when running via Docker Compose.

## Risks

- Events created via `createEvent` may fail when offline and currently will NOT be automatically enqueued. Unless calling `syncOfflineEvents` explicitly, those events could be lost from the user's perspective.
- Requests from web builds may not reach the traceability service if `ENV.TRACEABILITY_BASE_URL` points to a Docker service hostname (e.g. `http://traceability:4002`) — the browser cannot resolve container hostnames.
- Requests do not include the auth token by default — servers will reject calls that require authentication.

## Recommended small, low-risk approach (docs-first / UX)

This document recommends the non-invasive option first (no code changes) plus a short note and UX guidance for app developers and testers. If you later want parity, do the code changes in a separate PR.

1. Document the behavioral difference (this file).
2. Add a short UI note for product/testers: when the device is offline, instruct them to use the "Sync offline events" control (which calls `syncOfflineEvents`) rather than calling `Create Event` and expecting automatic retry. Consider adding a temporary on-screen hint where traceability is used.
3. For QA and local dev, test traceability sync by using the `syncOfflineEvents` flow:

   - Create events while offline and store them locally using the same format expected by `syncOfflineEvents`.
   - Use the debug UI or run a script to call `syncOfflineEvents` once network is back.

4. Keep the `traceabilityApi` code under review; if you want automatic enqueueing UX later, implement the code parity changes in a separate feature branch.

## How to reach parity later (recommended implementation steps)

If you decide to make traceability behave like `operationsClient`, implement the following in `apps/mobile/src/features/traceability/api/traceabilityApi.ts`:

- Add a helper `computeTraceabilityBase()` that mirrors `operationsClient.computeOperationsBase()`: when `typeof window !== 'undefined'` map Docker hostnames to `localhost` and default to port `4002`.

- Import `getAuthToken` and attach the Authorization header per-request:
  - `const token = await getAuthToken(); if (token) config.headers.Authorization = `Bearer ${token}`;`

- Add a response interceptor that:
  - On network-level errors (no `error.response`) and mutating HTTP methods (POST/PUT/PATCH/DELETE), calls `enqueueRest({ method, url, body, headers })` and returns a synthetic `{ data: { queued: true }, status: 202 }` response.

- Keep `syncOfflineEvents` as the explicit batch-sync mechanism; the enqueue-on-failure approach makes the UX tolerant of intermittent connectivity but `syncOfflineEvents` can be used as a catch-all manual sync or for background sync.

## Quick smoke-test steps (manual)

1. Start the monorepo services locally with Docker Compose (from repo root):

```bash
npm install
docker compose up -d mongo redis
# then bring services up as needed, or use `make docker-up` if available
```

2. From a device or simulator running the mobile app (or from the app's debug panel), attempt to call traceability `createEvent` while simulating offline. If parity is implemented, the call should return 202 with `{ queued: true }`.

3. Re-enable network and trigger the background queue processor or call `syncOfflineEvents` to confirm events are delivered and the server stores them.

4. For browser-based testing, ensure `TRACEABILITY_BASE_URL` is reachable via `http://localhost:4002` or implement the compute-base mapping so web builds can reach the container-mapped port.

## UX recommendations (short)

- Surface a lightweight "Events queued offline" indicator in the traceability screens when events are queued (count badge).
- Provide a manual "Sync queued events" button for testers and users.
- Show a clear toast/success when queued items are successfully synced.
- In devices with background processing permitted, run periodic sync attempts when connectivity is regained.

## Notes & next steps

- This file documents the current gap and a recommended approach. If you'd like, I can implement the parity changes in `traceabilityApi.ts`, add a small smoke test, and add a demo UI for queued events. I left that work as a separate todo item in the project's todo list so we can implement it safely in a feature branch.

- Related files to edit if you approve implementation: `apps/mobile/src/features/traceability/api/traceabilityApi.ts`, optionally `apps/mobile/src/lib/api/common.ts` (to factor `computeBase` helper), and a small demo screen under `apps/mobile/src/features/traceability/demo`.

---

Created: October 30, 2025
