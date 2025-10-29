# JANI Mobile App

> Offline-first React Native mobile application for farmers and field workers

## Overview

The JANI Mobile App is a comprehensive agricultural management tool built with Expo and React Native. It empowers farmers and field workers to manage farms, log activities, capture field photos, scan QR codes, and synchronize data with the JANI platform—even when offline.

---

## Tech Stack

- **Framework:** React Native 0.81.5
- **Platform:** Expo SDK ~54.0.17
- **Language:** TypeScript 5.9 (strict mode)
- **State Management:** Zustand + React Query v5
- **Storage:** AsyncStorage + expo-sqlite
- **Navigation:** React Navigation 7

---

## Features

### Core Functionality
- 🌾 **Farm Management:** Create, view, and manage farms
- 📍 **Plot Tracking:** GPS-based plot boundaries and mapping
- ✅ **Activity Logging:** Record agricultural activities with timestamps
- 📸 **Photo Capture:** Take and tag field photos with location
- 🔍 **QR Code Scanning:** Scan codes for product traceability
- 🔄 **Offline-First:** Works without internet, syncs when online
- 👤 **User Profiles:** Farmer and field worker accounts

### User Experience
- Modern UI with card layouts and smooth animations
- Intuitive bottom tab and stack navigation
- Dark mode support (planned)
- Haptic feedback for key actions
- Loading states and error handling

### Data & Sync
- Local data persistence with AsyncStorage
- SQLite for complex queries and offline storage
- Background sync and conflict resolution
- Sync status indicators and error logs

---

## Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator

### Installation
```bash
cd apps/mobile
npm install
```

### Development
```bash
# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Environment Setup
Create a `.env` file:
```bash
EXPO_PUBLIC_AUTH_API=http://192.168.1.100:4000
EXPO_PUBLIC_TRACEABILITY_API=http://192.168.1.100:5002
EXPO_PUBLIC_OPERATIONS_API=http://192.168.1.100:5003
```
Replace `192.168.1.100` with your local machine's IP address.

---

## Project Structure
```
apps/mobile/
├── App.tsx                 # Root component
├── src/
│   ├── components/         # Reusable UI components
│   ├── features/           # Feature modules (auth, farms, activities)
│   ├── navigation/         # Navigation configuration
│   ├── lib/api/            # API clients
│   ├── stores/             # Zustand state stores
│   ├── storage/            # AsyncStorage + SQLite
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript types
│   ├── theme/              # Theme configuration
│   └── constants/          # App constants
├── assets/                 # Images and static files
└── package.json
```

---

## Main Screens & Flows

- **Dashboard:** View farm stats, recent activities, and quick actions
- **Farm List:** Browse all farms, search, and filter
- **Farm Details:** See farm info, GPS map, plots, and history
- **Plot Details:** Crop info, lifecycle, yield tracking, activities
- **Activity List:** All logged activities, filter by type/date, sync status
- **Create Activity:** Select type, date, add photos, GPS tagging, offline queue
- **Profile:** User settings, sync management, logout

---

## Architecture & Data Flow

### State Management
- **Zustand:** Global state for auth, farms, sync
- **React Query:** API data with caching, background updates

### Storage
- **AsyncStorage:** Simple key-value storage for user/session
- **SQLite:** Complex queries, offline-first data, sync queue

### Offline Sync
- Activities and changes are queued locally when offline
- Background sync runs when network is available
- Conflict resolution ensures data integrity
- Sync status and errors are shown in the app

---

## API Integration

API endpoints are configured via environment variables. Main clients:
- **authClient:** Login, profile, session
- **farmsAPI:** Get/create farms, update farm data
- **eventsAPI:** Log activities, fetch event history

---

## Scripts
```bash
npm start           # Start Metro bundler
npm run ios         # Run on iOS simulator
npm run android     # Run on Android emulator
npm run lint        # Run ESLint
npm run format      # Run Prettier
npm test            # Run tests
npm run typecheck   # TypeScript checks
```

---

## Building for Production

### EAS Build
```bash
# Install EAS CLI
npm install -g eas-cli
# Build for iOS
eas build --platform ios
# Build for Android
eas build --platform android
```

---

## Troubleshooting & Tips

### Metro won't start
```bash
npx expo start -c  # Clear cache
```

### iOS build fails
```bash
cd ios && pod install && cd ..
```

### Android build fails
```bash
cd android && ./gradlew clean && cd ..
```

### API connection issues
- Verify backend services are running
- Check `.env` file has correct IP addresses
- For Android emulator, use `10.0.2.2` for localhost
- For physical devices, use your computer's LAN IP

### Sync not working
- Check network connectivity
- Verify sync queue in app settings
- Review background fetch permissions
- Check error logs in the app

### Common Issues
- **Stale data:** Log out or clear app storage to refresh
- **401 errors:** Session expired, log in again
- **Photo upload fails:** Check permissions and network

---

## Performance Optimization

- Images are compressed before upload
- Lists use pagination and lazy loading
- Hermes engine enabled by default
- React Query caches API responses
- SQLite for fast local queries

---

## Contributing

1. Use TypeScript strict mode
2. Prefer functional components and hooks
3. Write tests for new features
4. Document complex logic in code
5. Follow Expo and React Native best practices

---

## License
Proprietary - JANI Platform
