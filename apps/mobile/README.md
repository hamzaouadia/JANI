# JANI Mobile# JANI Mobile App



Expo + React Native companion app for the JANI traceability platform. The client focuses on field and logistics workflows, surfaces live supply chain signals, and remains usable when connectivity drops.## Overview



## Core CapabilitiesThe **JANI Mobile App** is a comprehensive React Native application built with Expo, designed for farmers and agricultural workers to track farm activities, manage traceability events, and access real-time agricultural intelligence. The app features offline-first architecture, comprehensive farm management, and seamless synchronization with the JANI platform backend.

- Role-aware navigation driven by Zustand (`src/stores/authStore.ts`) and a shared tab map (`src/navigation/config/simplifiedNavigation.ts`).

- Auth flows (signup, login, profile updates) call `services/auth` via `src/features/auth/api/authApi.ts` and persist sessions with AsyncStorage + SecureStore.## Architecture

- Farms, orders, partners, and traceability views use React Query with axios clients in `src/lib/api/*` to reach the user, traceability, and operations services.

- Offline touches: persisted React Query cache (`src/lib/offline/persistence.ts`), local capture drafts (`src/features/capture`), and retry handlers for 401 responses.### Technology Stack

- Feature modules live under `src/features/*`; shared primitives live in `src/components`, `src/navigation`, `src/providers`, and `src/theme`.

- **Framework**: React Native 0.81.5 with Expo SDK 54.0.17

## Project Layout- **Language**: TypeScript 5.x (strict mode)

```- **Navigation**: React Navigation 7.x (Stack + Bottom Tabs)

apps/mobile/- **State Management**: Zustand 5.x + React Query (TanStack Query 5.x)

├── App.tsx                # Provider + navigation bootstrap- **Offline Storage**: Expo SQLite + AsyncStorage

├── app.config.js          # Expo config + env passthrough- **Backend Integration**: Axios with React Query hooks

├── src/- **UI Components**: Custom components + Expo built-ins

│   ├── config/            # ENV helpers, constants- **Forms**: React Hook Form with Zod validation

│   ├── features/          # Business flows (auth, farms, orders, capture, ...)- **Camera**: Expo Camera + Image Picker

│   ├── lib/               # API clients, offline helpers, analytics stubs- **Location**: Expo Location with background tracking

│   ├── navigation/        # Stack + tab navigators- **QR Codes**: Expo Barcode Scanner + react-native-qrcode-svg

│   ├── providers/         # React context providers (query, capture, theme)

│   ├── stores/            # Zustand slices### Key Features

│   ├── theme/             # Design tokens + ThemeProvider

│   └── utils/             # Logging, formatting, test helpers#### 1. **Offline-First Architecture**

└── tests (Jest)           # Configured via `jest.config.js`

```- **Local Database**: SQLite for structured data storage

- **Async Storage**: Key-value store for settings and cache

## Environment Variables- **Background Sync**: Automatic synchronization when online

The Expo config reads `apps/mobile/.env` (see `app.config.js`) and falls back to sensible defaults. Adjust the values to match your running services.- **Conflict Resolution**: Smart merge strategies for data conflicts

- **Queue Management**: Pending operations queue with retry logic

| Name | Purpose | Default |

| ---- | ------- | ------- |#### 2. **Farm Management**

| `API_BASE_URL` | Base URL for user/data APIs (`/farms`, `/data/orders`, ...) | `http://localhost:5000` |

| `AUTH_BASE_URL` | Auth service (`/auth/login`, `/auth/signup`) | `http://localhost:4000` |- **Farm Registration**: Create and manage multiple farms

| `TRACEABILITY_BASE_URL` | Traceability service public API | `http://localhost:5002` |- **Plot Management**: Subdivide farms into plots with GPS coordinates

| `OPERATIONS_BASE_URL` | Operations service API | `http://localhost:4003` |- **Crop Tracking**: Monitor crop lifecycle from planting to harvest

- **Farm States**: Track 5-stage farming lifecycle:

Android emulators automatically swap `localhost` for `10.0.2.2` (`src/config/env.ts`). For physical devices set the LAN IP or tunnel URL.  - Planning

  - Planting

## Running Locally  - Growing

1. Install once: `cd apps/mobile && npm install` (Expo SDK 54).  - Harvesting

2. Start the dependent services (`docker compose up -d auth user traceability operations`).  - Completed

3. Launch Metro: `npm start`.

4. Open a client:#### 3. **Traceability System**

   - press `a` (Android emulator)

   - press `w` (web preview)- **Event Capture**: Record 26+ types of farm activities

   - scan the QR code with Expo Go (device must share the LAN)- **Photo Documentation**: Attach multiple photos to events

- **GPS Tagging**: Automatic location capture for events

Inside Docker or remote sessions set `EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0` and `REACT_NATIVE_PACKAGER_HOSTNAME=<host-ip>` as needed (see root `.env`).- **Timestamp Recording**: Accurate event timestamping

- **QR Code Generation**: Generate traceability QR codes

## Key Flows & APIs- **Event Chain**: View complete history for products

- **Authentication** – `src/features/auth/screens/*` call `loginRequest` / `signupRequest`, hydrate the auth store, set axios headers, and persist the session.

- **Home** – `HomeScreen` surfaces highlighted suppliers by mapping farm metadata from the user service (`GET /farms`).#### 4. **Smart Features**

- **Farms** – Stack navigator under `src/navigation/farms` drives list, detail editing, and membership flows against `/farms`, `/farms/:id`, `/farms/link`, etc.

- **Orders** – `src/features/orders` renders the shipment board backed by `/data/orders` (demo endpoint in the user service) with filtering and animated metrics.- **AI Recommendations**: Crop suggestions based on conditions (planned)

- **Capture** – `src/features/capture` lets teams log traceability events, attach demo media, and queue them for sync once online.- **Weather Integration**: Real-time weather data and forecasts

- **Admin** – Additional tabs unlock for role `admin`, surfacing analytics and management prototypes backed by local or demo data.- **Pest Alerts**: Early warning system for pest outbreaks

- **Quality Assessment**: Automated produce grading (planned)

## Testing & Quality- **Yield Predictions**: ML-based harvest predictions

- Type-check: `npm run typecheck`

- Lint: `npm run lint`#### 5. **User Experience**

- Tests (Jest + Testing Library): `npm test`

- Formatter: `npm run format`- **Intuitive Navigation**: Bottom tab + stack navigation

- All checks: `npm run check`- **Modern UI**: Card-based layouts with animations

- **Haptic Feedback**: Tactile responses for interactions

## Troubleshooting- **Loading States**: Skeleton screens and loading indicators

- **401 loop or empty screens** – Confirm the services are reachable and the base URLs resolve. A 401 triggers `setUnauthorizedHandler`, clearing the session so you must log in again.- **Error Handling**: User-friendly error messages

- **Android cannot hit the API** – Verify the resolved host (Metro logs it on boot). Override via `.env` if it is not `10.0.2.2` or the LAN IP.- **Dark Mode**: Full dark mode support (planned)

- **Stale query data** – React Query persists for 12 hours. Log out via the profile screen or clear app storage to refresh.

## Project Structure

```
apps/mobile/
├── App.tsx                      # Root component
├── index.ts                     # Entry point
├── app.config.js                # Expo configuration
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── jest.config.js               # Test configuration
├── babel.config.js              # Babel configuration
├── assets/                      # Static assets
│   ├── icon.png                 # App icon
│   ├── splash-icon.png          # Splash screen
│   └── adaptive-icon.png        # Android adaptive icon
└── src/
    ├── components/              # Reusable UI components
    │   ├── ui/                  # Base UI components
    │   │   ├── Button.tsx
    │   │   ├── Card.tsx
    │   │   ├── Input.tsx
    │   │   └── ...
    │   ├── layout/              # Layout components
    │   │   ├── Screen.tsx
    │   │   ├── Container.tsx
    │   │   └── ...
    │   └── farm/                # Farm-specific components
    │       ├── FarmCard.tsx
    │       ├── PlotCard.tsx
    │       └── FarmStateTracker.tsx
    ├── features/                # Feature modules
    │   ├── auth/                # Authentication
    │   │   ├── screens/
    │   │   ├── hooks/
    │   │   └── api/
    │   ├── farms/               # Farm management
    │   │   ├── screens/
    │   │   │   ├── FarmStatesScreen.tsx
    │   │   │   ├── FarmStateDetailScreen.tsx
    │   │   │   ├── FarmListScreen.tsx
    │   │   │   └── FarmDetailScreen.tsx
    │   │   ├── hooks/
    │   │   │   ├── useFarms.ts
    │   │   │   └── usePlots.ts
    │   │   └── api/
    │   ├── traceability/        # Traceability events
    │   │   ├── screens/
    │   │   ├── hooks/
    │   │   └── api/
    │   ├── capture/             # Photo/video capture
    │   ├── activity/            # Activity tracking
    │   ├── dashboard/           # Analytics dashboard
    │   ├── profile/             # User profile
    │   └── settings/            # App settings
    ├── navigation/              # Navigation configuration
    │   ├── RootNavigator.tsx    # Root navigator
    │   ├── AuthNavigator.tsx    # Auth flow
    │   ├── MainNavigator.tsx    # Main app flow
    │   └── types.ts             # Navigation types
    ├── providers/               # Context providers
    │   ├── AppProviders.tsx     # Combined providers
    │   ├── QueryProvider.tsx    # React Query
    │   └── ThemeProvider.tsx    # Theme context
    ├── stores/                  # Zustand stores
    │   ├── authStore.ts         # Authentication state
    │   ├── syncStore.ts         # Sync status
    │   └── settingsStore.ts     # App settings
    ├── lib/                     # External integrations
    │   ├── api/                 # API client
    │   │   ├── client.ts        # Axios instance
    │   │   ├── auth.ts          # Auth endpoints
    │   │   ├── farms.ts         # Farm endpoints
    │   │   └── traceability.ts  # Traceability endpoints
    │   └── db/                  # Local database
    │       ├── database.ts      # SQLite setup
    │       ├── migrations.ts    # DB migrations
    │       └── queries.ts       # Common queries
    ├── hooks/                   # Custom hooks
    │   ├── useAuth.ts           # Authentication
    │   ├── useSync.ts           # Synchronization
    │   ├── useFarmState.ts      # Farm state logic
    │   └── useLocation.ts       # GPS location
    ├── utils/                   # Utility functions
    │   ├── validation.ts        # Zod schemas
    │   ├── formatting.ts        # Data formatting
    │   ├── haptics.ts           # Haptic feedback
    │   └── storage.ts           # Async storage
    ├── theme/                   # Theme configuration
    │   ├── ThemeProvider.tsx    # Theme context
    │   ├── colors.ts            # Color palette
    │   ├── spacing.ts           # Spacing system
    │   └── typography.ts        # Font styles
    ├── constants/               # App constants
    │   ├── farmStates.ts        # Farm state definitions
    │   ├── traceabilityEvents.ts # Event types
    │   └── config.ts            # App configuration
    └── __mocks__/               # Test mocks
        ├── expo-camera.ts
        ├── expo-location.ts
        └── ...
```

## Installation & Setup

### Prerequisites

- Node.js 20.x or higher
- npm or pnpm package manager
- Expo CLI
- iOS Simulator (macOS) or Android Emulator
- Physical device for testing (recommended)

### Install Dependencies

```bash
cd apps/mobile
npm install
```

### Environment Configuration

Create `.env` file in `apps/mobile/`:

```bash
# API Configuration
API_URL=http://localhost:4000
AUTH_SERVICE_URL=http://localhost:4000
USER_SERVICE_URL=http://localhost:5000
TRACEABILITY_SERVICE_URL=http://localhost:3004
OPERATIONS_BASE_URL=http://localhost:4003

# Feature Flags
ENABLE_OFFLINE_MODE=true
ENABLE_BACKGROUND_SYNC=true
ENABLE_LOCATION_TRACKING=true
ENABLE_AI_FEATURES=false

# Debug
DEBUG_MODE=false
LOG_LEVEL=info
```

### Running the App

#### Development Mode

```bash
# Start Expo dev server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run in web browser
npm run web
```

#### Production Build

```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production

# Both platforms
eas build --platform all --profile production
```

## Core Features Deep Dive

### 1. Authentication System

**Login Flow:**
```typescript
// Login with email/password
const { mutate: login } = useLogin();

login({
  email: 'farmer@example.com',
  password: 'SecurePass123!'
}, {
  onSuccess: (data) => {
    // Save token and user data
    authStore.setAuth(data.token, data.user);
    // Navigate to main app
    navigation.navigate('Main');
  }
});
```

**Token Management:**
- Automatic token refresh
- Secure token storage (Expo SecureStore)
- Token expiration handling
- Automatic logout on invalid token

### 2. Farm State Management

The app tracks farms through 5 distinct lifecycle stages:

#### Planning Stage
- Plot registration
- Land preparation
- Soil testing
- Resource planning
- Budget preparation

#### Planting Stage
- Seed selection
- Planting date recording
- Initial watering
- GPS coordinate capture
- Photo documentation

#### Growing Stage
- Irrigation tracking
- Fertilizer application
- Pest monitoring
- Weed control
- Growth progress photos

#### Harvesting Stage
- Harvest start date
- Collection tracking
- Quantity recording
- Quality assessment
- Post-harvest handling

#### Completed Stage
- Final yield calculation
- Quality grading
- Packaging
- Distribution
- Season summary

**Implementation:**
```typescript
// Get current farm state
const { state, progress, nextAction } = useFarmState(farmId);

// Update farm state
const { mutate: updateState } = useUpdateFarmState();
updateState({
  farmId,
  newState: 'growing',
  metadata: {
    transitionDate: new Date(),
    reason: 'Seeds germinated successfully'
  }
});
```

### 3. Traceability Event System

**Supported Event Types:**
- Plot registration
- Land preparation
- Soil testing
- Seed planting
- Transplanting
- Irrigation
- Fertilizer application
- Pesticide application
- Pruning
- Weeding
- Harvest start/collection/end
- Sorting & grading
- Washing
- Packaging
- Storage
- Transfer to exporter
- Quality inspection
- Cold storage
- Shipment dispatch
- Delivery confirmation
- Residue testing
- Certification audit

**Creating Events:**
```typescript
const { mutate: createEvent } = useCreateTraceabilityEvent();

createEvent({
  type: 'seed_planting',
  occurredAt: new Date(),
  plotId: 'plot-123',
  farmId: 'farm-456',
  metadata: {
    cropType: 'tomato',
    variety: 'Roma VF',
    quantity: 5000,
    quantityUnit: 'seeds'
  },
  location: currentLocation,
  photos: selectedPhotos
});
```

### 4. Offline Synchronization

**Sync Strategy:**
```typescript
// Background sync configuration
TaskManager.defineTask('background-sync', async () => {
  const syncStore = useSyncStore.getState();
  
  if (!syncStore.isSyncing && syncStore.hasPendingChanges) {
    await syncStore.syncAll();
  }
  
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

// Register background sync
await BackgroundFetch.registerTaskAsync('background-sync', {
  minimumInterval: 15 * 60, // 15 minutes
  stopOnTerminate: false,
  startOnBoot: true
});
```

**Conflict Resolution:**
- Server wins for data conflicts
- Client timestamp priority for same-user edits
- Manual resolution for critical conflicts
- Automatic merge for non-conflicting changes

### 5. Photo & Video Capture

**Camera Integration:**
```typescript
const { capturePhoto } = useCamera();

// Capture photo with metadata
const photo = await capturePhoto({
  quality: 0.8,
  base64: false,
  exif: true
});

// Attach to event
addPhotoToEvent(eventId, photo.uri);
```

**Image Optimization:**
- Automatic compression
- EXIF data preservation
- Thumbnail generation
- Batch upload support

### 6. GPS Location Tracking

**Location Features:**
```typescript
const { location, startTracking, stopTracking } = useLocation();

// Start foreground tracking
await startTracking({
  accuracy: Location.Accuracy.High,
  timeInterval: 5000,
  distanceInterval: 10
});

// Get current location
const currentLocation = await Location.getCurrentPositionAsync({
  accuracy: Location.Accuracy.Highest
});
```

**Background Location:**
- Task-based location updates
- Geofencing support
- Battery-optimized tracking
- Location history

## UI Components

### Base Components

**Button Component:**
```typescript
<Button
  variant="primary"      // primary, secondary, outline, ghost
  size="medium"          // small, medium, large
  loading={isLoading}
  disabled={!isValid}
  onPress={handleSubmit}
  leftIcon={<Icon name="save" />}
>
  Save Farm
</Button>
```

**Card Component:**
```typescript
<Card
  variant="elevated"     // flat, elevated, outlined
  padding="medium"       // none, small, medium, large
  onPress={handlePress}
>
  <Card.Header>
    <Card.Title>Farm Title</Card.Title>
    <Card.Subtitle>Location</Card.Subtitle>
  </Card.Header>
  <Card.Content>
    {/* Content */}
  </Card.Content>
  <Card.Actions>
    <Button>View</Button>
  </Card.Actions>
</Card>
```

**Input Component:**
```typescript
<Input
  label="Farm Name"
  placeholder="Enter farm name"
  value={farmName}
  onChangeText={setFarmName}
  error={errors.farmName}
  leftIcon={<Icon name="farm" />}
  rightIcon={<Icon name="clear" onPress={clear} />}
  autoCapitalize="words"
  returnKeyType="next"
/>
```

### Farm Components

**FarmStateTracker:**
```typescript
<FarmStateTracker
  currentState="growing"
  progress={65}
  nextAction="Apply fertilizer"
  daysInState={45}
  onStatePress={handleStatePress}
  compact={false}
  vertical={true}
/>
```

**FarmCard:**
```typescript
<FarmCard
  farm={farm}
  onPress={() => navigation.navigate('FarmDetail', { farmId: farm.id })}
  showProgress={true}
  showMembers={true}
/>
```

## State Management

### Zustand Stores

**Auth Store:**
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
  clearAuth: () => set({ token: null, user: null, isAuthenticated: false })
}));
```

**Sync Store:**
```typescript
interface SyncState {
  isSyncing: boolean;
  lastSyncTime: Date | null;
  hasPendingChanges: boolean;
  pendingCount: number;
  syncAll: () => Promise<void>;
  syncEntity: (entity: string, id: string) => Promise<void>;
}
```

### React Query

**Farm Queries:**
```typescript
// Fetch farms
const { data: farms, isLoading } = useFarmsList({
  mine: true,
  status: 'active'
});

// Fetch single farm
const { data: farm } = useFarm(farmId);

// Create farm
const { mutate: createFarm } = useCreateFarm();

// Update farm
const { mutate: updateFarm } = useUpdateFarm();
```

**Query Configuration:**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,     // 5 minutes
      cacheTime: 10 * 60 * 1000,     // 10 minutes
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true
    },
    mutations: {
      retry: 1
    }
  }
});
```

## Navigation

### Navigation Structure

```
Root Navigator (Stack)
├── Auth Stack
│   ├── Login
│   ├── Register
│   └── ForgotPassword
└── Main Navigator (Bottom Tabs)
    ├── Home Tab (Stack)
    │   ├── HomeScreen
    │   └── FarmDetail
    ├── Farms Tab (Stack)
    │   ├── FarmsList
    │   ├── FarmDetail
    │   ├── PlotDetail
    │   ├── FarmStates
    │   └── FarmStateDetail
    ├── Capture Tab (Stack)
    │   ├── CaptureHome
    │   ├── Camera
    │   └── PhotoReview
    ├── Activity Tab (Stack)
    │   ├── ActivityList
    │   └── ActivityDetail
    └── Profile Tab (Stack)
        ├── ProfileScreen
        └── Settings
```

### Navigation Examples

```typescript
// Navigate to screen
navigation.navigate('FarmDetail', { farmId: '123' });

// Go back
navigation.goBack();

// Replace screen
navigation.replace('Login');

// Reset navigation state
navigation.reset({
  index: 0,
  routes: [{ name: 'Home' }]
});
```

## Testing

### Test Structure

```
src/
├── __tests__/
│   ├── components/
│   ├── hooks/
│   ├── screens/
│   └── utils/
└── __mocks__/
    ├── expo-camera.ts
    ├── expo-location.ts
    └── @react-navigation/
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- FarmCard.test.tsx
```

### Example Tests

```typescript
describe('FarmCard', () => {
  it('renders farm name and location', () => {
    const farm = {
      id: '1',
      name: 'Test Farm',
      location: 'Test Location'
    };
    
    const { getByText } = render(<FarmCard farm={farm} />);
    
    expect(getByText('Test Farm')).toBeTruthy();
    expect(getByText('Test Location')).toBeTruthy();
  });
  
  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <FarmCard farm={mockFarm} onPress={onPress} />
    );
    
    fireEvent.press(getByTestId('farm-card'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

## Performance Optimization

### React Native Performance

- **Memoization**: Use `React.memo` for expensive components
- **useMemo/useCallback**: Prevent unnecessary re-renders
- **FlatList**: Use for long lists with `windowSize` optimization
- **Image Optimization**: Lazy loading and caching
- **Navigation**: Use `getFocusedRouteNameFromRoute` for conditional rendering

### Bundle Size Optimization

```javascript
// babel.config.js
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    ['react-native-reanimated/plugin'],
    ['transform-remove-console', { exclude: ['error', 'warn'] }]
  ]
};
```

### Memory Management

- Clear listeners on unmount
- Cancel pending requests
- Cleanup timers and intervals
- Optimize image sizes
- Use image caching

## Deployment

### App Store Submission

**iOS App Store:**
```bash
# Build production app
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

**Google Play Store:**
```bash
# Build production app
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android
```

### Over-the-Air Updates (OTA)

```bash
# Publish update to production
eas update --branch production --message "Bug fixes and improvements"

# Publish to staging
eas update --branch staging
```

### App Configuration

**app.config.js:**
```javascript
export default {
  expo: {
    name: 'JANI Farm',
    slug: 'jani-farm',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash-icon.png',
      backgroundColor: '#10B981'
    },
    updates: {
      fallbackToCacheTimeout: 0,
      url: 'https://u.expo.dev/your-project-id'
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      bundleIdentifier: 'com.jani.farm',
      supportsTablet: true,
      infoPlist: {
        NSCameraUsageDescription: 'Allow JANI to access camera for farm documentation',
        NSLocationWhenInUseUsageDescription: 'Allow JANI to access location for GPS tagging',
        NSLocationAlwaysUsageDescription: 'Allow JANI to track location for activity logging'
      }
    },
    android: {
      package: 'com.jani.farm',
      permissions: [
        'CAMERA',
        'ACCESS_FINE_LOCATION',
        'ACCESS_COARSE_LOCATION',
        'READ_EXTERNAL_STORAGE',
        'WRITE_EXTERNAL_STORAGE'
      ]
    },
    plugins: [
      'expo-camera',
      'expo-location',
      'expo-image-picker',
      [
        'expo-barcode-scanner',
        {
          cameraPermission: 'Allow JANI to access camera for scanning QR codes'
        }
      ]
    ]
  }
};
```

## Troubleshooting

### Common Issues

**Metro Bundler Issues:**
```bash
# Clear Metro cache
npx expo start -c

# Reset cache and reinstall
rm -rf node_modules
npm install
```

**Native Module Issues:**
```bash
# iOS
cd ios && pod install && cd ..

# Android
cd android && ./gradlew clean && cd ..
```

**Build Failures:**
```bash
# Clear Expo cache
expo prebuild --clean

# Check EAS build logs
eas build:list
```

## License

Proprietary - JANI Platform © 2025

## Changelog

### Version 1.0.0 (October 2025)

**Features:**
- ✅ Complete farm management system
- ✅ 5-stage farm lifecycle tracking
- ✅ Traceability event system (26+ event types)
- ✅ Offline-first architecture
- ✅ Background synchronization
- ✅ Photo/video capture with GPS
- ✅ QR code generation and scanning
- ✅ Modern UI with animations
- ✅ Haptic feedback
- ✅ React Query integration
- ✅ TypeScript strict mode
- ✅ Comprehensive testing setup

**Performance:**
- ✅ Optimized bundle size
- ✅ Fast startup time
- ✅ Smooth animations (60 FPS)
- ✅ Efficient memory usage

**Developer Experience:**
- ✅ Hot reloading
- ✅ TypeScript autocomplete
- ✅ ESLint + Prettier
- ✅ Jest testing framework
- ✅ Comprehensive documentation

---

**Maintained by**: JANI Platform Development Team  
**Last Updated**: October 22, 2025  
**Version**: 1.0.0
