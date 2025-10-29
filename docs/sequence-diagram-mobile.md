# Mobile-only Sequence Diagram

This diagram focuses on mobile-only behavior and flows:

- App startup and hydration of stores
- Login flow and token persistence
- Fetching farms and local caching
- Capturing traceability events with photos and offline enqueue
- Background sync replaying queued items and uploading media
- Token expiry and 401 handling

Render the diagram locally with mermaid-cli:

```bash
npx -y @mermaid-js/mermaid-cli -i docs/sequence-diagram-mobile.mmd -o docs/sequence-diagram-mobile.svg
npx -y @mermaid-js/mermaid-cli -i docs/sequence-diagram-mobile.mmd -o docs/sequence-diagram-mobile.png
```

Key mobile files referenced:

- `apps/mobile/src/providers/AppProviders.tsx` (initializes sync and offline queue)
- `apps/mobile/src/stores/*` (authStore, settingsStore)
- `apps/mobile/src/lib/api/*` (authClient, operationsClient, traceabilityClient)
- `apps/mobile/src/storage/tokenStorage.ts` (SecureStore fallback)
- `apps/mobile/src/lib/offline/restQueue` (queue implementation)

If you'd like I can render and commit the SVG/PNG for this mobile-only diagram. Say the word and I'll render and push them.
