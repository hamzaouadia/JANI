# JANI Mobile App# JANI Mobile# JANI Mobile App



> **Farmer-focused mobile application for field data capture and farm management**



A React Native mobile application built with Expo that enables farmers to manage their farms, track activities, and synchronize data offline-first with the JANI platform.Expo + React Native companion app for the JANI traceability platform. The client focuses on field and logistics workflows, surfaces live supply chain signals, and remains usable when connectivity drops.## Overview



## 📋 Overview



- **Framework**: React Native 0.81.5## Core CapabilitiesThe **JANI Mobile App** is a comprehensive React Native application built with Expo, designed for farmers and agricultural workers to track farm activities, manage traceability events, and access real-time agricultural intelligence. The app features offline-first architecture, comprehensive farm management, and seamless synchronization with the JANI platform backend.

- **Platform**: Expo SDK 54.0.17

- **Language**: TypeScript 5.9 (strict mode)- Role-aware navigation driven by Zustand (`src/stores/authStore.ts`) and a shared tab map (`src/navigation/config/simplifiedNavigation.ts`).

- **State Management**: Zustand + React Query v5

- **Storage**: AsyncStorage + expo-sqlite- Auth flows (signup, login, profile updates) call `services/auth` via `src/features/auth/api/authApi.ts` and persist sessions with AsyncStorage + SecureStore.## Architecture

- **Package Manager**: npm

- Farms, orders, partners, and traceability views use React Query with axios clients in `src/lib/api/*` to reach the user, traceability, and operations services.

## ✨ Features

- Offline touches: persisted React Query cache (`src/lib/offline/persistence.ts`), local capture drafts (`src/features/capture`), and retry handlers for 401 responses.### Technology Stack

### 🌾 Farm Management

- View all farms linked to user account- Feature modules live under `src/features/*`; shared primitives live in `src/components`, `src/navigation`, `src/providers`, and `src/theme`.

- See farm details (location, area, plots)

- Browse plots with crop information- **Framework**: React Native 0.81.5 with Expo SDK 54.0.17

- Track plot lifecycle stages

## Project Layout- **Language**: TypeScript 5.x (strict mode)

### 📝 Activity Tracking

- Log daily field activities```- **Navigation**: React Navigation 7.x (Stack + Bottom Tabs)

- Capture photos with geotags

- Track resource usage (water, fertilizers, pesticides)apps/mobile/- **State Management**: Zustand 5.x + React Query (TanStack Query 5.x)

- Offline activity creation

├── App.tsx                # Provider + navigation bootstrap- **Offline Storage**: Expo SQLite + AsyncStorage

### 🔄 Offline-First Architecture

- Full offline data capture├── app.config.js          # Expo config + env passthrough- **Backend Integration**: Axios with React Query hooks

- Background synchronization

- Automatic conflict resolution├── src/- **UI Components**: Custom components + Expo built-ins

- Queue-based sync system

│   ├── config/            # ENV helpers, constants- **Forms**: React Hook Form with Zod validation

### 📦 Order Management

- View export orders│   ├── features/          # Business flows (auth, farms, orders, capture, ...)- **Camera**: Expo Camera + Image Picker

- Link orders to farm lots

- Track order status│   ├── lib/               # API clients, offline helpers, analytics stubs- **Location**: Expo Location with background tracking

- QR code generation

│   ├── navigation/        # Stack + tab navigators- **QR Codes**: Expo Barcode Scanner + react-native-qrcode-svg

### 👥 Partner Network

- View partner list│   ├── providers/         # React context providers (query, capture, theme)

- See partner details

- Track partner relationships│   ├── stores/            # Zustand slices### Key Features



## 🚀 Quick Start│   ├── theme/             # Design tokens + ThemeProvider



### Prerequisites│   └── utils/             # Logging, formatting, test helpers#### 1. **Offline-First Architecture**



- Node.js 20.18.3+└── tests (Jest)           # Configured via `jest.config.js`

- npm 11.6.2+

- iOS Simulator (macOS) or Android Emulator```- **Local Database**: SQLite for structured data storage

- Expo Go app (for physical device testing)

- **Async Storage**: Key-value store for settings and cache

### Installation

## Environment Variables- **Background Sync**: Automatic synchronization when online

```bash

cd apps/mobileThe Expo config reads `apps/mobile/.env` (see `app.config.js`) and falls back to sensible defaults. Adjust the values to match your running services.- **Conflict Resolution**: Smart merge strategies for data conflicts

npm install

```- **Queue Management**: Pending operations queue with retry logic



### Environment Setup| Name | Purpose | Default |



The app uses environment variables from the root `.env` file:| ---- | ------- | ------- |#### 2. **Farm Management**



```bash| `API_BASE_URL` | Base URL for user/data APIs (`/farms`, `/data/orders`, ...) | `http://localhost:5000` |

# Auth Service URL

AUTH_SERVICE_URL=http://localhost:4000| `AUTH_BASE_URL` | Auth service (`/auth/login`, `/auth/signup`) | `http://localhost:4000` |- **Farm Registration**: Create and manage multiple farms



# For physical device testing, use your machine's IP| `TRACEABILITY_BASE_URL` | Traceability service public API | `http://localhost:5002` |- **Plot Management**: Subdivide farms into plots with GPS coordinates

# AUTH_SERVICE_URL=http://192.168.1.100:4000

```| `OPERATIONS_BASE_URL` | Operations service API | `http://localhost:4003` |- **Crop Tracking**: Monitor crop lifecycle from planting to harvest



### Development- **Farm States**: Track 5-stage farming lifecycle:



```bashAndroid emulators automatically swap `localhost` for `10.0.2.2` (`src/config/env.ts`). For physical devices set the LAN IP or tunnel URL.  - Planning

# Start Expo development server

npm start  - Planting



# Or start specific platform## Running Locally  - Growing

npm run ios        # iOS Simulator

npm run android    # Android Emulator1. Install once: `cd apps/mobile && npm install` (Expo SDK 54).  - Harvesting

npm run web        # Web browser

```2. Start the dependent services (`docker compose up -d auth user traceability operations`).  - Completed



### Running on Device3. Launch Metro: `npm start`.



1. Install Expo Go app on your phone4. Open a client:#### 3. **Traceability System**

2. Start development server: `npm start`

3. Scan QR code with:   - press `a` (Android emulator)

   - iOS: Camera app

   - Android: Expo Go app   - press `w` (web preview)- **Event Capture**: Record 26+ types of farm activities



## 📱 App Structure   - scan the QR code with Expo Go (device must share the LAN)- **Photo Documentation**: Attach multiple photos to events



### Navigation Structure- **GPS Tagging**: Automatic location capture for events



```Inside Docker or remote sessions set `EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0` and `REACT_NATIVE_PACKAGER_HOSTNAME=<host-ip>` as needed (see root `.env`).- **Timestamp Recording**: Accurate event timestamping

App

├── Auth Stack (Not Logged In)- **QR Code Generation**: Generate traceability QR codes

│   ├── Login Screen

│   └── Signup Screen## Key Flows & APIs- **Event Chain**: View complete history for products

│

└── Main Stack (Logged In)- **Authentication** – `src/features/auth/screens/*` call `loginRequest` / `signupRequest`, hydrate the auth store, set axios headers, and persist the session.

    ├── Home Tab

    │   ├── Dashboard- **Home** – `HomeScreen` surfaces highlighted suppliers by mapping farm metadata from the user service (`GET /farms`).#### 4. **Smart Features**

    │   └── Farm List

    │- **Farms** – Stack navigator under `src/navigation/farms` drives list, detail editing, and membership flows against `/farms`, `/farms/:id`, `/farms/link`, etc.

    ├── Farms Tab

    │   ├── Farm List- **Orders** – `src/features/orders` renders the shipment board backed by `/data/orders` (demo endpoint in the user service) with filtering and animated metrics.- **AI Recommendations**: Crop suggestions based on conditions (planned)

    │   ├── Farm Details

    │   └── Plot Details- **Capture** – `src/features/capture` lets teams log traceability events, attach demo media, and queue them for sync once online.- **Weather Integration**: Real-time weather data and forecasts

    │

    ├── Activities Tab- **Admin** – Additional tabs unlock for role `admin`, surfacing analytics and management prototypes backed by local or demo data.- **Pest Alerts**: Early warning system for pest outbreaks

    │   ├── Activity List

    │   └── Create Activity- **Quality Assessment**: Automated produce grading (planned)

    │

    ├── Orders Tab## Testing & Quality- **Yield Predictions**: ML-based harvest predictions

    │   └── Order List

    │- Type-check: `npm run typecheck`

    └── Profile Tab

        └── User Profile- Lint: `npm run lint`#### 5. **User Experience**

```

- Tests (Jest + Testing Library): `npm test`

### Key Features by Screen

- Formatter: `npm run format`- **Intuitive Navigation**: Bottom tab + stack navigation

#### 🏠 Dashboard

- Summary statistics- All checks: `npm run check`- **Modern UI**: Card-based layouts with animations

- Recent activities

- Quick actions- **Haptic Feedback**: Tactile responses for interactions

- Sync status indicator

## Troubleshooting- **Loading States**: Skeleton screens and loading indicators

#### 🌾 Farm List

- All farms for user- **401 loop or empty screens** – Confirm the services are reachable and the base URLs resolve. A 401 triggers `setUnauthorizedHandler`, clearing the session so you must log in again.- **Error Handling**: User-friendly error messages

- Farm cards with key info

- Pull-to-refresh- **Android cannot hit the API** – Verify the resolved host (Metro logs it on boot). Override via `.env` if it is not `10.0.2.2` or the LAN IP.- **Dark Mode**: Full dark mode support (planned)

- Search and filter

- **Stale query data** – React Query persists for 12 hours. Log out via the profile screen or clear app storage to refresh.

#### 📍 Farm Details

- Farm information## Project Structure

- GPS location map

- Plot list```

- Activity historyapps/mobile/

├── App.tsx                      # Root component

#### 🌱 Plot Details├── index.ts                     # Entry point

- Crop information├── app.config.js                # Expo configuration

- Lifecycle stage├── package.json                 # Dependencies

- Area and yield tracking├── tsconfig.json                # TypeScript config

- Associated activities├── jest.config.js               # Test configuration

├── babel.config.js              # Babel configuration

#### ✅ Activity List├── assets/                      # Static assets

- All logged activities│   ├── icon.png                 # App icon

- Filter by type/date│   ├── splash-icon.png          # Splash screen

- Photos and metadata│   └── adaptive-icon.png        # Android adaptive icon

- Sync status└── src/

    ├── components/              # Reusable UI components

#### ➕ Create Activity    │   ├── ui/                  # Base UI components

- Activity type selection    │   │   ├── Button.tsx

- Date/time picker    │   │   ├── Card.tsx

- Photo capture    │   │   ├── Input.tsx

- GPS tagging    │   │   └── ...

- Offline queue    │   ├── layout/              # Layout components

    │   │   ├── Screen.tsx

## 🗂️ Folder Structure    │   │   ├── Container.tsx

    │   │   └── ...

```    │   └── farm/                # Farm-specific components

apps/mobile/    │       ├── FarmCard.tsx

├── src/    │       ├── PlotCard.tsx

│   ├── components/          # Reusable UI components    │       └── FarmStateTracker.tsx

│   │   ├── Button.tsx    ├── features/                # Feature modules

│   │   ├── Card.tsx    │   ├── auth/                # Authentication

│   │   ├── Input.tsx    │   │   ├── screens/

│   │   └── ...    │   │   ├── hooks/

│   │    │   │   └── api/

│   ├── features/            # Feature modules    │   ├── farms/               # Farm management

│   │   ├── auth/    │   │   ├── screens/

│   │   │   ├── screens/    │   │   │   ├── FarmStatesScreen.tsx

│   │   │   ├── components/    │   │   │   ├── FarmStateDetailScreen.tsx

│   │   │   └── hooks/    │   │   │   ├── FarmListScreen.tsx

│   │   ├── farms/    │   │   │   └── FarmDetailScreen.tsx

│   │   ├── activities/    │   │   ├── hooks/

│   │   ├── orders/    │   │   │   ├── useFarms.ts

│   │   └── profile/    │   │   │   └── usePlots.ts

│   │    │   │   └── api/

│   ├── lib/                 # Libraries and utilities    │   ├── traceability/        # Traceability events

│   │   ├── api/             # API clients    │   │   ├── screens/

│   │   │   ├── authClient.ts    │   │   ├── hooks/

│   │   │   ├── client.ts    │   │   └── api/

│   │   │   ├── farms.ts    │   ├── capture/             # Photo/video capture

│   │   │   ├── orders.ts    │   ├── activity/            # Activity tracking

│   │   │   ├── users.ts    │   ├── dashboard/           # Analytics dashboard

│   │   │   └── events.ts    │   ├── profile/             # User profile

│   │   └── utils/           # Helper functions    │   └── settings/            # App settings

│   │    ├── navigation/              # Navigation configuration

│   ├── navigation/          # React Navigation setup    │   ├── RootNavigator.tsx    # Root navigator

│   │   ├── AppNavigator.tsx    │   ├── AuthNavigator.tsx    # Auth flow

│   │   ├── AuthStack.tsx    │   ├── MainNavigator.tsx    # Main app flow

│   │   └── MainStack.tsx    │   └── types.ts             # Navigation types

│   │    ├── providers/               # Context providers

│   ├── providers/           # Context providers    │   ├── AppProviders.tsx     # Combined providers

│   │   └── AuthProvider.tsx    │   ├── QueryProvider.tsx    # React Query

│   │    │   └── ThemeProvider.tsx    # Theme context

│   ├── stores/              # Zustand stores    ├── stores/                  # Zustand stores

│   │   ├── authStore.ts    │   ├── authStore.ts         # Authentication state

│   │   ├── farmStore.ts    │   ├── syncStore.ts         # Sync status

│   │   └── syncStore.ts    │   └── settingsStore.ts     # App settings

│   │    ├── lib/                     # External integrations

│   ├── storage/             # AsyncStorage utilities    │   ├── api/                 # API client

│   │   └── index.ts    │   │   ├── client.ts        # Axios instance

│   │    │   │   ├── auth.ts          # Auth endpoints

│   ├── theme/               # Design system    │   │   ├── farms.ts         # Farm endpoints

│   │   ├── colors.ts    │   │   └── traceability.ts  # Traceability endpoints

│   │   ├── spacing.ts    │   └── db/                  # Local database

│   │   └── typography.ts    │       ├── database.ts      # SQLite setup

│   │    │       ├── migrations.ts    # DB migrations

│   ├── types/               # TypeScript types    │       └── queries.ts       # Common queries

│   │   ├── api.ts    ├── hooks/                   # Custom hooks

│   │   ├── models.ts    │   ├── useAuth.ts           # Authentication

│   │   └── navigation.ts    │   ├── useSync.ts           # Synchronization

│   │    │   ├── useFarmState.ts      # Farm state logic

│   └── __tests__/           # Test files    │   └── useLocation.ts       # GPS location

│       └── ...    ├── utils/                   # Utility functions

│    │   ├── validation.ts        # Zod schemas

├── assets/                  # Images, fonts, etc.    │   ├── formatting.ts        # Data formatting

├── App.tsx                  # Root component    │   ├── haptics.ts           # Haptic feedback

├── index.ts                 # Entry point    │   └── storage.ts           # Async storage

├── app.json                 # Expo configuration    ├── theme/                   # Theme configuration

├── package.json    │   ├── ThemeProvider.tsx    # Theme context

└── tsconfig.json    │   ├── colors.ts            # Color palette

```    │   ├── spacing.ts           # Spacing system

    │   └── typography.ts        # Font styles

## 🔌 API Integration    ├── constants/               # App constants

    │   ├── farmStates.ts        # Farm state definitions

### Auth Client    │   ├── traceabilityEvents.ts # Event types

    │   └── config.ts            # App configuration

```typescript    └── __mocks__/               # Test mocks

import { authClient } from '@/lib/api/authClient';        ├── expo-camera.ts

        ├── expo-location.ts

// Login        └── ...

const { token, user } = await authClient.login({```

  email: 'farmer@example.com',

  password: 'SecurePass123!'## Installation & Setup

});

### Prerequisites

// Get current user

const user = await authClient.me();- Node.js 20.x or higher

```- npm or pnpm package manager

- Expo CLI

### Farms API- iOS Simulator (macOS) or Android Emulator

- Physical device for testing (recommended)

```typescript

import { getFarms, getFarm } from '@/lib/api/farms';### Install Dependencies



// Get all farms```bash

const farms = await getFarms();cd apps/mobile

npm install

// Get specific farm```

const farm = await getFarm('farm_123');

```### Environment Configuration



### Orders APICreate `.env` file in `apps/mobile/`:



```typescript```bash

import { getOrders } from '@/lib/api/orders';# API Configuration

API_URL=http://localhost:4000

// Get all ordersAUTH_SERVICE_URL=http://localhost:4000

const orders = await getOrders();USER_SERVICE_URL=http://localhost:5000

```TRACEABILITY_SERVICE_URL=http://localhost:3004

OPERATIONS_BASE_URL=http://localhost:4003

### Traceability Events

# Feature Flags

```typescriptENABLE_OFFLINE_MODE=true

import { traceabilityClient } from '@/lib/api/traceabilityClient';ENABLE_BACKGROUND_SYNC=true

ENABLE_LOCATION_TRACKING=true

// Get events for a lotENABLE_AI_FEATURES=false

const events = await traceabilityClient.getEventsForLot('lot_456');

```# Debug

DEBUG_MODE=false

## 💾 State ManagementLOG_LEVEL=info

```

### Zustand Stores

### Running the App

**Auth Store:**

```typescript#### Development Mode

import { useAuthStore } from '@/stores/authStore';

```bash

const { user, token, login, logout } = useAuthStore();# Start Expo dev server

```npm start



**Farm Store:**# Run on iOS simulator

```typescriptnpm run ios

import { useFarmStore } from '@/stores/farmStore';

# Run on Android emulator

const { farms, currentFarm, setCurrentFarm } = useFarmStore();npm run android

```

# Run in web browser

### React Querynpm run web

```

```typescript

import { useQuery } from '@tanstack/react-query';#### Production Build

import { getFarms } from '@/lib/api/farms';

```bash

const { data, isLoading, error } = useQuery({# iOS

  queryKey: ['farms'],eas build --platform ios --profile production

  queryFn: getFarms

});# Android

```eas build --platform android --profile production



## 🔄 Offline Synchronization# Both platforms

eas build --platform all --profile production

### How It Works```



1. **Offline Actions**: User creates activities offline## Core Features Deep Dive

2. **Local Queue**: Actions stored in AsyncStorage

3. **Background Sync**: When online, queue is processed### 1. Authentication System

4. **Server Push**: Events sent to `/sync/push`

5. **Conflict Resolution**: Server handles conflicts**Login Flow:**

6. **Local Update**: UI updated with server response```typescript

// Login with email/password

### Sync Statusconst { mutate: login } = useLogin();



```typescriptlogin({

import { useSyncStore } from '@/stores/syncStore';  email: 'farmer@example.com',

  password: 'SecurePass123!'

const { isSyncing, lastSyncTime, syncQueue } = useSyncStore();}, {

```  onSuccess: (data) => {

    // Save token and user data

## 🧪 Testing    authStore.setAuth(data.token, data.user);

    // Navigate to main app

### Run Tests    navigation.navigate('Main');

  }

```bash});

# Run all tests```

npm test

**Token Management:**

# Run tests in watch mode- Automatic token refresh

npm run test:watch- Secure token storage (Expo SecureStore)

- Token expiration handling

# Run tests with coverage- Automatic logout on invalid token

npm test -- --coverage

```### 2. Farm State Management



### Test StructureThe app tracks farms through 5 distinct lifecycle stages:



```#### Planning Stage

src/__tests__/- Plot registration

├── components/- Land preparation

│   └── Button.test.tsx- Soil testing

├── features/- Resource planning

│   └── auth/- Budget preparation

│       └── Login.test.tsx

└── lib/#### Planting Stage

    └── api/- Seed selection

        └── authClient.test.ts- Planting date recording

```- Initial watering

- GPS coordinate capture

### Current Test Status- Photo documentation



- **Total Tests**: 6#### Growing Stage

- **Passing**: 4 (67%)- Irrigation tracking

- **Failing**: 2- Fertilizer application

- **Coverage**: ~60%- Pest monitoring

- Weed control

**Known Issues:**- Growth progress photos

- expo-secure-store mock needed

- @react-native-community/netinfo mock needed#### Harvesting Stage

- Harvest start date

## 🎨 UI Components- Collection tracking

- Quantity recording

### Design System- Quality assessment

- Post-harvest handling

```typescript

// Colors#### Completed Stage

import { colors } from '@/theme/colors';- Final yield calculation

- Quality grading

// Spacing- Packaging

import { spacing } from '@/theme/spacing';- Distribution

- Season summary

// Typography

import { typography } from '@/theme/typography';**Implementation:**

``````typescript

// Get current farm state

### Common Componentsconst { state, progress, nextAction } = useFarmState(farmId);



```typescript// Update farm state

// Buttonconst { mutate: updateState } = useUpdateFarmState();

import { Button } from '@/components/Button';updateState({

  farmId,

<Button  newState: 'growing',

  title="Submit"  metadata: {

  onPress={handleSubmit}    transitionDate: new Date(),

  variant="primary"    reason: 'Seeds germinated successfully'

  loading={isLoading}  }

/>});

```

// Input

import { Input } from '@/components/Input';### 3. Traceability Event System



<Input**Supported Event Types:**

  label="Email"- Plot registration

  value={email}- Land preparation

  onChangeText={setEmail}- Soil testing

  keyboardType="email-address"- Seed planting

/>- Transplanting

- Irrigation

// Card- Fertilizer application

import { Card } from '@/components/Card';- Pesticide application

- Pruning

<Card- Weeding

  title="Farm Name"- Harvest start/collection/end

  subtitle="Location"- Sorting & grading

  onPress={handlePress}- Washing

/>- Packaging

```- Storage

- Transfer to exporter

## 📦 Dependencies- Quality inspection

- Cold storage

### Core- Shipment dispatch

- `react-native`: 0.81.5- Delivery confirmation

- `expo`: ~54.0.17- Residue testing

- `typescript`: ~5.9.2- Certification audit



### Navigation**Creating Events:**

- `@react-navigation/native`: ^7.1.18```typescript

- `@react-navigation/native-stack`: ^7.3.27const { mutate: createEvent } = useCreateTraceabilityEvent();

- `@react-navigation/bottom-tabs`: ^7.4.8

createEvent({

### State Management  type: 'seed_planting',

- `zustand`: ^5.0.8  occurredAt: new Date(),

- `@tanstack/react-query`: ^5.90.2  plotId: 'plot-123',

  farmId: 'farm-456',

### Storage  metadata: {

- `@react-native-async-storage/async-storage`: 2.2.0    cropType: 'tomato',

- `expo-sqlite`: ~16.0.8    variety: 'Roma VF',

    quantity: 5000,

### Utilities    quantityUnit: 'seeds'

- `axios`: ^1.12.2  },

- `zod`: ^3.25.76  location: currentLocation,

- `nanoid`: ^5.1.6  photos: selectedPhotos

});

### Expo Modules```

- `expo-camera`: ~17.0.8

- `expo-location`: ~19.0.7### 4. Offline Synchronization

- `expo-image-picker`: ~17.0.8

- `expo-barcode-scanner`: ~14.0.1**Sync Strategy:**

```typescript

## 🔧 Configuration// Background sync configuration

TaskManager.defineTask('background-sync', async () => {

### app.config.js  const syncStore = useSyncStore.getState();

  

```javascript  if (!syncStore.isSyncing && syncStore.hasPendingChanges) {

export default {    await syncStore.syncAll();

  expo: {  }

    name: "JANI",  

    slug: "jani",  return BackgroundFetch.BackgroundFetchResult.NewData;

    version: "1.0.0",});

    orientation: "portrait",

    platforms: ["ios", "android"],// Register background sync

    ios: {await BackgroundFetch.registerTaskAsync('background-sync', {

      bundleIdentifier: "com.jani.app",  minimumInterval: 15 * 60, // 15 minutes

      supportsTablet: true  stopOnTerminate: false,

    },  startOnBoot: true

    android: {});

      package: "com.jani.app",```

      adaptiveIcon: {

        backgroundColor: "#ffffff"**Conflict Resolution:**

      }- Server wins for data conflicts

    }- Client timestamp priority for same-user edits

  }- Manual resolution for critical conflicts

};- Automatic merge for non-conflicting changes

```

### 5. Photo & Video Capture

### TypeScript Configuration

**Camera Integration:**

```json```typescript

{const { capturePhoto } = useCamera();

  "extends": "expo/tsconfig.base",

  "compilerOptions": {// Capture photo with metadata

    "strict": true,const photo = await capturePhoto({

    "skipLibCheck": true,  quality: 0.8,

    "jsx": "react-native",  base64: false,

    "paths": {  exif: true

      "@/*": ["./src/*"]});

    }

  }// Attach to event

}addPhotoToEvent(eventId, photo.uri);

``````



## 🐛 Troubleshooting**Image Optimization:**

- Automatic compression

### Metro Bundler Issues- EXIF data preservation

- Thumbnail generation

```bash- Batch upload support

# Clear cache

npm start -- --clear### 6. GPS Location Tracking



# Or**Location Features:**

expo start -c```typescript

```const { location, startTracking, stopTracking } = useLocation();



### iOS Build Issues// Start foreground tracking

await startTracking({

```bash  accuracy: Location.Accuracy.High,

# Clear pods  timeInterval: 5000,

cd ios && pod install --repo-update  distanceInterval: 10

```});



### Android Build Issues// Get current location

const currentLocation = await Location.getCurrentPositionAsync({

```bash  accuracy: Location.Accuracy.Highest

# Clean gradle});

cd android && ./gradlew clean```

```

**Background Location:**

### API Connection Issues- Task-based location updates

- Geofencing support

1. Check Auth Service is running: `curl http://localhost:4000/health`- Battery-optimized tracking

2. For physical devices, use machine IP instead of localhost- Location history

3. Check CORS settings in Auth Service

4. Verify network is same for device and server## UI Components



## 📚 Scripts### Base Components



```bash**Button Component:**

npm start              # Start Expo```typescript

npm run ios            # iOS Simulator<Button

npm run android        # Android Emulator  variant="primary"      // primary, secondary, outline, ghost

npm run web            # Web browser  size="medium"          // small, medium, large

npm test               # Run tests  loading={isLoading}

npm run lint           # Lint code  disabled={!isValid}

npm run typecheck      # TypeScript check  onPress={handleSubmit}

npm run check          # Lint + TypeCheck + Test  leftIcon={<Icon name="save" />}

```>

  Save Farm

## 🚀 Building for Production</Button>

```

### iOS

**Card Component:**

```bash```typescript

# Install EAS CLI<Card

npm install -g eas-cli  variant="elevated"     // flat, elevated, outlined

  padding="medium"       // none, small, medium, large

# Configure  onPress={handlePress}

eas build:configure>

  <Card.Header>

# Build for iOS    <Card.Title>Farm Title</Card.Title>

eas build --platform ios    <Card.Subtitle>Location</Card.Subtitle>

```  </Card.Header>

  <Card.Content>

### Android    {/* Content */}

  </Card.Content>

```bash  <Card.Actions>

# Build for Android    <Button>View</Button>

eas build --platform android  </Card.Actions>

</Card>

# Or build APK locally```

expo build:android

```**Input Component:**

```typescript

## 📄 License<Input

  label="Farm Name"

This project is proprietary software. All rights reserved.  placeholder="Enter farm name"

  value={farmName}

---  onChangeText={setFarmName}

  error={errors.farmName}

**Built with React Native, Expo, and TypeScript**  leftIcon={<Icon name="farm" />}

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
