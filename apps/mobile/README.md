# JANI Mobile App# JANI Mobile App# JANI Mobile# JANI Mobile App



> **React Native + Expo mobile application for farmers and field workers**



The JANI Mobile App is an offline-first agricultural management application that enables farmers to manage farms, track activities, upload photos, and synchronize data when connectivity is available.> **Farmer-focused mobile application for field data capture and farm management**



## 📋 Overview



- **Framework**: React Native 0.81.5A React Native mobile application built with Expo that enables farmers to manage their farms, track activities, and synchronize data offline-first with the JANI platform.Expo + React Native companion app for the JANI traceability platform. The client focuses on field and logistics workflows, surfaces live supply chain signals, and remains usable when connectivity drops.## Overview

- **Platform**: Expo SDK 54

- **Language**: TypeScript 5.9

- **State Management**: Zustand + React Query

- **Navigation**: React Navigation 7## 📋 Overview

- **Offline Storage**: AsyncStorage + SQLite

- **Package Manager**: npm



## ✨ Key Features- **Framework**: React Native 0.81.5## Core CapabilitiesThe **JANI Mobile App** is a comprehensive React Native application built with Expo, designed for farmers and agricultural workers to track farm activities, manage traceability events, and access real-time agricultural intelligence. The app features offline-first architecture, comprehensive farm management, and seamless synchronization with the JANI platform backend.



### 🌾 Farm Management- **Platform**: Expo SDK 54.0.17

- Create and edit farms

- Manage multiple plots per farm- **Language**: TypeScript 5.9 (strict mode)- Role-aware navigation driven by Zustand (`src/stores/authStore.ts`) and a shared tab map (`src/navigation/config/simplifiedNavigation.ts`).

- Track farm members and roles

- Generate farm access codes- **State Management**: Zustand + React Query v5

- View farm statistics

- **Storage**: AsyncStorage + expo-sqlite- Auth flows (signup, login, profile updates) call `services/auth` via `src/features/auth/api/authApi.ts` and persist sessions with AsyncStorage + SecureStore.## Architecture

### 📊 Activity Tracking

- Log planting activities- **Package Manager**: npm

- Track irrigation schedules

- Record fertilization- Farms, orders, partners, and traceability views use React Query with axios clients in `src/lib/api/*` to reach the user, traceability, and operations services.

- Monitor pest control

- Document harvesting## ✨ Features



### 📸 Photo Management- Offline touches: persisted React Query cache (`src/lib/offline/persistence.ts`), local capture drafts (`src/features/capture`), and retry handlers for 401 responses.### Technology Stack

- Capture farm photos

- Attach images to activities### 🌾 Farm Management

- Offline photo queue

- Automatic cloud sync- View all farms linked to user account- Feature modules live under `src/features/*`; shared primitives live in `src/components`, `src/navigation`, `src/providers`, and `src/theme`.

- Photo galleries

- See farm details (location, area, plots)

### 🔄 Offline-First Architecture

- Full offline functionality- Browse plots with crop information- **Framework**: React Native 0.81.5 with Expo SDK 54.0.17

- Queue-based sync system

- Conflict resolution- Track plot lifecycle stages

- Background synchronization

- Automatic retry logic## Project Layout- **Language**: TypeScript 5.x (strict mode)



### 📱 Additional Features### 📝 Activity Tracking

- QR code scanning for product traceability

- Multi-language support (EN, FR)- Log daily field activities```- **Navigation**: React Navigation 7.x (Stack + Bottom Tabs)

- Push notifications

- Location tracking- Capture photos with geotags

- Dark mode support

- Biometric authentication- Track resource usage (water, fertilizers, pesticides)apps/mobile/- **State Management**: Zustand 5.x + React Query (TanStack Query 5.x)



## 🚀 Quick Start- Offline activity creation



### Prerequisites├── App.tsx                # Provider + navigation bootstrap- **Offline Storage**: Expo SQLite + AsyncStorage



- **Node.js** 20.19.4+### 🔄 Offline-First Architecture

- **npm** 11.6.2+

- **Expo CLI** (optional - will use npx)- Full offline data capture├── app.config.js          # Expo config + env passthrough- **Backend Integration**: Axios with React Query hooks

- **iOS Simulator** or **Android Emulator** (for local testing)

- **Expo Go** app (for physical device testing)- Background synchronization



### Installation- Automatic conflict resolution├── src/- **UI Components**: Custom components + Expo built-ins



```bash- Queue-based sync system

cd apps/mobile

npm install│   ├── config/            # ENV helpers, constants- **Forms**: React Hook Form with Zod validation

```

### 📦 Order Management

### Running the App

- View export orders│   ├── features/          # Business flows (auth, farms, orders, capture, ...)- **Camera**: Expo Camera + Image Picker

```bash

# Start Expo dev server- Link orders to farm lots

npm start

- Track order status│   ├── lib/               # API clients, offline helpers, analytics stubs- **Location**: Expo Location with background tracking

# Run on iOS simulator

npm run ios- QR code generation



# Run on Android emulator│   ├── navigation/        # Stack + tab navigators- **QR Codes**: Expo Barcode Scanner + react-native-qrcode-svg

npm run android

### 👥 Partner Network

# Run in web browser (limited functionality)

npm run web- View partner list│   ├── providers/         # React context providers (query, capture, theme)

```

- See partner details

### Development with Physical Device

- Track partner relationships│   ├── stores/            # Zustand slices### Key Features

1. Install **Expo Go** on your iOS or Android device

2. Run `npm start`

3. Scan the QR code with:

   - **iOS**: Camera app## 🚀 Quick Start│   ├── theme/             # Design tokens + ThemeProvider

   - **Android**: Expo Go app



## 📁 Project Structure

### Prerequisites│   └── utils/             # Logging, formatting, test helpers#### 1. **Offline-First Architecture**

```

apps/mobile/

├── src/

│   ├── components/          # Reusable UI components- Node.js 20.18.3+└── tests (Jest)           # Configured via `jest.config.js`

│   │   ├── Button.tsx

│   │   ├── Card.tsx- npm 11.6.2+

│   │   ├── Input.tsx

│   │   └── ...- iOS Simulator (macOS) or Android Emulator```- **Local Database**: SQLite for structured data storage

│   │

│   ├── features/            # Feature-based modules- Expo Go app (for physical device testing)

│   │   ├── auth/

│   │   ├── farms/- **Async Storage**: Key-value store for settings and cache

│   │   ├── activities/

│   │   ├── photos/### Installation

│   │   └── sync/

│   │## Environment Variables- **Background Sync**: Automatic synchronization when online

│   ├── navigation/          # Navigation configuration

│   │   ├── RootNavigator.tsx```bash

│   │   ├── AuthNavigator.tsx

│   │   └── MainNavigator.tsxcd apps/mobileThe Expo config reads `apps/mobile/.env` (see `app.config.js`) and falls back to sensible defaults. Adjust the values to match your running services.- **Conflict Resolution**: Smart merge strategies for data conflicts

│   │

│   ├── lib/                 # API clients and utilitiesnpm install

│   │   ├── api/

│   │   │   ├── authClient.ts```- **Queue Management**: Pending operations queue with retry logic

│   │   │   ├── traceabilityClient.ts

│   │   │   ├── farms.ts

│   │   │   ├── orders.ts

│   │   │   └── events.ts### Environment Setup| Name | Purpose | Default |

│   │   └── utils/

│   │

│   ├── stores/              # Zustand state management

│   │   ├── authStore.tsThe app uses environment variables from the root `.env` file:| ---- | ------- | ------- |#### 2. **Farm Management**

│   │   ├── farmStore.ts

│   │   ├── syncStore.ts

│   │   └── settingsStore.ts

│   │```bash| `API_BASE_URL` | Base URL for user/data APIs (`/farms`, `/data/orders`, ...) | `http://localhost:5000` |

│   ├── storage/             # Offline storage

│   │   ├── asyncStorage.ts# Auth Service URL

│   │   ├── sqliteStorage.ts

│   │   └── queueManager.tsAUTH_SERVICE_URL=http://localhost:4000| `AUTH_BASE_URL` | Auth service (`/auth/login`, `/auth/signup`) | `http://localhost:4000` |- **Farm Registration**: Create and manage multiple farms

│   │

│   ├── hooks/               # Custom React hooks

│   │   ├── useAuth.ts

│   │   ├── useFarms.ts# For physical device testing, use your machine's IP| `TRACEABILITY_BASE_URL` | Traceability service public API | `http://localhost:5002` |- **Plot Management**: Subdivide farms into plots with GPS coordinates

│   │   ├── useSync.ts

│   │   └── useLocation.ts# AUTH_SERVICE_URL=http://192.168.1.100:4000

│   │

│   ├── providers/           # Context providers```| `OPERATIONS_BASE_URL` | Operations service API | `http://localhost:4003` |- **Crop Tracking**: Monitor crop lifecycle from planting to harvest

│   │   └── AppProviders.tsx

│   │

│   ├── theme/               # Styling and theming

│   │   ├── colors.ts### Development- **Farm States**: Track 5-stage farming lifecycle:

│   │   ├── spacing.ts

│   │   └── typography.ts

│   │

│   ├── types/               # TypeScript types```bashAndroid emulators automatically swap `localhost` for `10.0.2.2` (`src/config/env.ts`). For physical devices set the LAN IP or tunnel URL.  - Planning

│   │   ├── api.types.ts

│   │   ├── farm.types.ts# Start Expo development server

│   │   └── activity.types.ts

│   │npm start  - Planting

│   ├── constants/           # App constants

│   └── config/              # Configuration files

│

├── assets/                  # Images, fonts, etc.# Or start specific platform## Running Locally  - Growing

├── App.tsx                  # Root component

├── app.json                 # Expo configurationnpm run ios        # iOS Simulator

├── package.json

└── tsconfig.jsonnpm run android    # Android Emulator1. Install once: `cd apps/mobile && npm install` (Expo SDK 54).  - Harvesting

```

npm run web        # Web browser

## 🎯 Core Functionality

```2. Start the dependent services (`docker compose up -d auth user traceability operations`).  - Completed

### Authentication



```typescript

import { useAuth } from '@/hooks/useAuth';### Running on Device3. Launch Metro: `npm start`.



function LoginScreen() {

  const { login, isLoading } = useAuth();

1. Install Expo Go app on your phone4. Open a client:#### 3. **Traceability System**

  const handleLogin = async () => {

    await login({2. Start development server: `npm start`

      email: 'farmer@example.com',

      password: 'password123'3. Scan QR code with:   - press `a` (Android emulator)

    });

  };   - iOS: Camera app



  return (   - Android: Expo Go app   - press `w` (web preview)- **Event Capture**: Record 26+ types of farm activities

    <Button onPress={handleLogin} loading={isLoading}>

      Login

    </Button>

  );## 📱 App Structure   - scan the QR code with Expo Go (device must share the LAN)- **Photo Documentation**: Attach multiple photos to events

}

```



### Farm Management### Navigation Structure- **GPS Tagging**: Automatic location capture for events



```typescript

import { useFarms } from '@/hooks/useFarms';

```Inside Docker or remote sessions set `EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0` and `REACT_NATIVE_PACKAGER_HOSTNAME=<host-ip>` as needed (see root `.env`).- **Timestamp Recording**: Accurate event timestamping

function FarmsScreen() {

  const { farms, isLoading, createFarm } = useFarms();App



  const handleCreate = async () => {├── Auth Stack (Not Logged In)- **QR Code Generation**: Generate traceability QR codes

    await createFarm({

      name: 'Green Valley Farm',│   ├── Login Screen

      location: 'California',

      area: 100│   └── Signup Screen## Key Flows & APIs- **Event Chain**: View complete history for products

    });

  };│



  if (isLoading) return <Loading />;└── Main Stack (Logged In)- **Authentication** – `src/features/auth/screens/*` call `loginRequest` / `signupRequest`, hydrate the auth store, set axios headers, and persist the session.



  return (    ├── Home Tab

    <FlatList

      data={farms}    │   ├── Dashboard- **Home** – `HomeScreen` surfaces highlighted suppliers by mapping farm metadata from the user service (`GET /farms`).#### 4. **Smart Features**

      renderItem={({ item }) => <FarmCard farm={item} />}

    />    │   └── Farm List

  );

}    │- **Farms** – Stack navigator under `src/navigation/farms` drives list, detail editing, and membership flows against `/farms`, `/farms/:id`, `/farms/link`, etc.

```

    ├── Farms Tab

### Offline Sync

    │   ├── Farm List- **Orders** – `src/features/orders` renders the shipment board backed by `/data/orders` (demo endpoint in the user service) with filtering and animated metrics.- **AI Recommendations**: Crop suggestions based on conditions (planned)

```typescript

import { useSync } from '@/hooks/useSync';    │   ├── Farm Details



function SyncButton() {    │   └── Plot Details- **Capture** – `src/features/capture` lets teams log traceability events, attach demo media, and queue them for sync once online.- **Weather Integration**: Real-time weather data and forecasts

  const { sync, isSyncing, queueCount } = useSync();

    │

  return (

    <Button onPress={sync} loading={isSyncing}>    ├── Activities Tab- **Admin** – Additional tabs unlock for role `admin`, surfacing analytics and management prototypes backed by local or demo data.- **Pest Alerts**: Early warning system for pest outbreaks

      Sync {queueCount > 0 && `(${queueCount} pending)`}

    </Button>    │   ├── Activity List

  );

}    │   └── Create Activity- **Quality Assessment**: Automated produce grading (planned)

```

    │

### Photo Upload

    ├── Orders Tab## Testing & Quality- **Yield Predictions**: ML-based harvest predictions

```typescript

import * as ImagePicker from 'expo-image-picker';    │   └── Order List

import { usePhotoUpload } from '@/hooks/usePhotoUpload';

    │- Type-check: `npm run typecheck`

function PhotoCapture() {

  const { uploadPhoto } = usePhotoUpload();    └── Profile Tab



  const takePhoto = async () => {        └── User Profile- Lint: `npm run lint`#### 5. **User Experience**

    const result = await ImagePicker.launchCameraAsync({

      quality: 0.8,```

      allowsEditing: true

    });- Tests (Jest + Testing Library): `npm test`



    if (!result.canceled) {### Key Features by Screen

      await uploadPhoto(result.assets[0].uri, {

        farmId: 'farm_123',- Formatter: `npm run format`- **Intuitive Navigation**: Bottom tab + stack navigation

        activityId: 'activity_456'

      });#### 🏠 Dashboard

    }

  };- Summary statistics- All checks: `npm run check`- **Modern UI**: Card-based layouts with animations



  return <Button onPress={takePhoto}>Take Photo</Button>;- Recent activities

}

```- Quick actions- **Haptic Feedback**: Tactile responses for interactions



## 🎨 UI Components- Sync status indicator



The app uses custom components built with React Native primitives:## Troubleshooting- **Loading States**: Skeleton screens and loading indicators



- **Button** - Primary, secondary, outline variants#### 🌾 Farm List

- **Card** - Container with shadow and padding

- **Input** - Text input with validation- All farms for user- **401 loop or empty screens** – Confirm the services are reachable and the base URLs resolve. A 401 triggers `setUnauthorizedHandler`, clearing the session so you must log in again.- **Error Handling**: User-friendly error messages

- **Select** - Dropdown picker

- **DatePicker** - Date selection- Farm cards with key info

- **PhotoGrid** - Image gallery

- **LoadingSpinner** - Activity indicator- Pull-to-refresh- **Android cannot hit the API** – Verify the resolved host (Metro logs it on boot). Override via `.env` if it is not `10.0.2.2` or the LAN IP.- **Dark Mode**: Full dark mode support (planned)

- **EmptyState** - Empty list placeholder

- Search and filter

## 📡 API Integration

- **Stale query data** – React Query persists for 12 hours. Log out via the profile screen or clear app storage to refresh.

### API Clients

#### 📍 Farm Details

```typescript

// Auth API- Farm information## Project Structure

import { authClient } from '@/lib/api/authClient';

await authClient.login(email, password);- GPS location map

await authClient.me();

- Plot list```

// Farms API

import { farmsAPI } from '@/lib/api/farms';- Activity historyapps/mobile/

await farmsAPI.getFarms();

await farmsAPI.createFarm(data);├── App.tsx                      # Root component



// Events API#### 🌱 Plot Details├── index.ts                     # Entry point

import { eventsAPI } from '@/lib/api/events';

await eventsAPI.createEvent(eventData);- Crop information├── app.config.js                # Expo configuration

await eventsAPI.getEventsByLot(lotId);

```- Lifecycle stage├── package.json                 # Dependencies



### Environment Variables- Area and yield tracking├── tsconfig.json                # TypeScript config



Create a `.env` file in `apps/mobile`:- Associated activities├── jest.config.js               # Test configuration



```bash├── babel.config.js              # Babel configuration

EXPO_PUBLIC_AUTH_API=http://192.168.1.100:4000

EXPO_PUBLIC_TRACEABILITY_API=http://192.168.1.100:5002#### ✅ Activity List├── assets/                      # Static assets

EXPO_PUBLIC_OPERATIONS_API=http://192.168.1.100:5003

```- All logged activities│   ├── icon.png                 # App icon



**Note**: Replace `192.168.1.100` with your local machine's IP address.- Filter by type/date│   ├── splash-icon.png          # Splash screen



## 🗄️ State Management- Photos and metadata│   └── adaptive-icon.png        # Android adaptive icon



### Zustand Stores- Sync status└── src/



```typescript    ├── components/              # Reusable UI components

// authStore.ts

export const useAuthStore = create<AuthStore>((set) => ({#### ➕ Create Activity    │   ├── ui/                  # Base UI components

  user: null,

  token: null,- Activity type selection    │   │   ├── Button.tsx

  setUser: (user) => set({ user }),

  setToken: (token) => set({ token }),- Date/time picker    │   │   ├── Card.tsx

  logout: () => set({ user: null, token: null })

}));- Photo capture    │   │   ├── Input.tsx



// farmStore.ts- GPS tagging    │   │   └── ...

export const useFarmStore = create<FarmStore>((set) => ({

  farms: [],- Offline queue    │   ├── layout/              # Layout components

  selectedFarm: null,

  setFarms: (farms) => set({ farms }),    │   │   ├── Screen.tsx

  selectFarm: (farm) => set({ selectedFarm: farm })

}));## 🗂️ Folder Structure    │   │   ├── Container.tsx

```

    │   │   └── ...

### React Query

```    │   └── farm/                # Farm-specific components

```typescript

import { useQuery, useMutation } from '@tanstack/react-query';apps/mobile/    │       ├── FarmCard.tsx



// Query├── src/    │       ├── PlotCard.tsx

const { data, isLoading } = useQuery({

  queryKey: ['farms'],│   ├── components/          # Reusable UI components    │       └── FarmStateTracker.tsx

  queryFn: () => farmsAPI.getFarms()

});│   │   ├── Button.tsx    ├── features/                # Feature modules



// Mutation│   │   ├── Card.tsx    │   ├── auth/                # Authentication

const { mutate } = useMutation({

  mutationFn: (data) => farmsAPI.createFarm(data),│   │   ├── Input.tsx    │   │   ├── screens/

  onSuccess: () => {

    queryClient.invalidateQueries(['farms']);│   │   └── ...    │   │   ├── hooks/

  }

});│   │    │   │   └── api/

```

│   ├── features/            # Feature modules    │   ├── farms/               # Farm management

## 🔄 Offline Architecture

│   │   ├── auth/    │   │   ├── screens/

```

┌─────────────────────────────────────────┐│   │   │   ├── screens/    │   │   │   ├── FarmStatesScreen.tsx

│          Mobile App                     │

├─────────────────────────────────────────┤│   │   │   ├── components/    │   │   │   ├── FarmStateDetailScreen.tsx

│                                         │

│  User Action (Create Activity)          ││   │   │   └── hooks/    │   │   │   ├── FarmListScreen.tsx

│         ↓                               │

│  Check Network                          ││   │   ├── farms/    │   │   │   └── FarmDetailScreen.tsx

│    ├─ Online  → API Call → Success     │

│    └─ Offline → Queue → AsyncStorage   ││   │   ├── activities/    │   │   ├── hooks/

│                                         │

│  Background Sync (when online)          ││   │   ├── orders/    │   │   │   ├── useFarms.ts

│    ├─ Read Queue                        │

│    ├─ Batch Sync to Server              ││   │   └── profile/    │   │   │   └── usePlots.ts

│    ├─ Handle Conflicts                  │

│    └─ Clear Queue                       ││   │    │   │   └── api/

│                                         │

└─────────────────────────────────────────┘│   ├── lib/                 # Libraries and utilities    │   ├── traceability/        # Traceability events

```

│   │   ├── api/             # API clients    │   │   ├── screens/

## 🧪 Testing

│   │   │   ├── authClient.ts    │   │   ├── hooks/

```bash

# Run tests│   │   │   ├── client.ts    │   │   └── api/

npm test

│   │   │   ├── farms.ts    │   ├── capture/             # Photo/video capture

# Run with coverage

npm test -- --coverage│   │   │   ├── orders.ts    │   ├── activity/            # Activity tracking



# Run in watch mode│   │   │   ├── users.ts    │   ├── dashboard/           # Analytics dashboard

npm test -- --watch

│   │   │   └── events.ts    │   ├── profile/             # User profile

# Lint

npm run lint│   │   └── utils/           # Helper functions    │   └── settings/            # App settings



# Type check│   │    ├── navigation/              # Navigation configuration

npm run typecheck

│   ├── navigation/          # React Navigation setup    │   ├── RootNavigator.tsx    # Root navigator

# Full check (lint + typecheck + test)

npm run check│   │   ├── AppNavigator.tsx    │   ├── AuthNavigator.tsx    # Auth flow

```

│   │   ├── AuthStack.tsx    │   ├── MainNavigator.tsx    # Main app flow

### Current Test Status

│   │   └── MainStack.tsx    │   └── types.ts             # Navigation types

- **Total Tests**: 6

- **Passing**: 4 (67%)│   │    ├── providers/               # Context providers

- **Failing**: 2 (missing mocks for expo-secure-store and netinfo)

│   ├── providers/           # Context providers    │   ├── AppProviders.tsx     # Combined providers

**Passing Tests:**

- ✅ Component rendering│   │   └── AuthProvider.tsx    │   ├── QueryProvider.tsx    # React Query

- ✅ Navigation flow

- ✅ State management│   │    │   └── ThemeProvider.tsx    # Theme context

- ✅ API mocking

│   ├── stores/              # Zustand stores    ├── stores/                  # Zustand stores

**Needs Work:**

- ❌ Secure storage tests (needs mock)│   │   ├── authStore.ts    │   ├── authStore.ts         # Authentication state

- ❌ Network info tests (needs mock)

│   │   ├── farmStore.ts    │   ├── syncStore.ts         # Sync status

## 📱 Navigation Structure

│   │   └── syncStore.ts    │   └── settingsStore.ts     # App settings

```

┌─────────────────────────────────────────┐│   │    ├── lib/                     # External integrations

│          Root Navigator                 │

├─────────────────────────────────────────┤│   ├── storage/             # AsyncStorage utilities    │   ├── api/                 # API client

│                                         │

│  ┌─────────────────────────────────┐   ││   │   └── index.ts    │   │   ├── client.ts        # Axios instance

│  │    Auth Stack (logged out)      │   │

│  │  • Login                         │   ││   │    │   │   ├── auth.ts          # Auth endpoints

│  │  • Signup                        │   │

│  │  • Forgot Password               │   ││   ├── theme/               # Design system    │   │   ├── farms.ts         # Farm endpoints

│  └─────────────────────────────────┘   │

│                                         ││   │   ├── colors.ts    │   │   └── traceability.ts  # Traceability endpoints

│  ┌─────────────────────────────────┐   │

│  │    Main Stack (logged in)       │   ││   │   ├── spacing.ts    │   └── db/                  # Local database

│  │                                  │   │

│  │  Bottom Tabs:                    │   ││   │   └── typography.ts    │       ├── database.ts      # SQLite setup

│  │    • Farms (Stack)               │   │

│  │    • Activities (Stack)          │   ││   │    │       ├── migrations.ts    # DB migrations

│  │    • Photos (Stack)              │   │

│  │    • Profile (Stack)             │   ││   ├── types/               # TypeScript types    │       └── queries.ts       # Common queries

│  │                                  │   │

│  │  Modals:                         │   ││   │   ├── api.ts    ├── hooks/                   # Custom hooks

│  │    • QR Scanner                  │   │

│  │    • Photo Viewer                │   ││   │   ├── models.ts    │   ├── useAuth.ts           # Authentication

│  │    • Settings                    │   │

│  └─────────────────────────────────┘   ││   │   └── navigation.ts    │   ├── useSync.ts           # Synchronization

│                                         │

└─────────────────────────────────────────┘│   │    │   ├── useFarmState.ts      # Farm state logic

```

│   └── __tests__/           # Test files    │   └── useLocation.ts       # GPS location

## 🚀 Build & Deployment

│       └── ...    ├── utils/                   # Utility functions

### Development Build

│    │   ├── validation.ts        # Zod schemas

```bash

# Install EAS CLI├── assets/                  # Images, fonts, etc.    │   ├── formatting.ts        # Data formatting

npm install -g eas-cli

├── App.tsx                  # Root component    │   ├── haptics.ts           # Haptic feedback

# Login to Expo

eas login├── index.ts                 # Entry point    │   └── storage.ts           # Async storage



# Configure project├── app.json                 # Expo configuration    ├── theme/                   # Theme configuration

eas build:configure

├── package.json    │   ├── ThemeProvider.tsx    # Theme context

# Create development build

eas build --profile development --platform ios└── tsconfig.json    │   ├── colors.ts            # Color palette

eas build --profile development --platform android

``````    │   ├── spacing.ts           # Spacing system



### Production Build    │   └── typography.ts        # Font styles



```bash## 🔌 API Integration    ├── constants/               # App constants

# iOS

eas build --profile production --platform ios    │   ├── farmStates.ts        # Farm state definitions



# Android### Auth Client    │   ├── traceabilityEvents.ts # Event types

eas build --profile production --platform android

    │   └── config.ts            # App configuration

# Submit to stores

eas submit --platform ios```typescript    └── __mocks__/               # Test mocks

eas submit --platform android

```import { authClient } from '@/lib/api/authClient';        ├── expo-camera.ts



## 📦 Dependencies        ├── expo-location.ts



### Core// Login        └── ...

- `expo`: ~54.0.17

- `react`: 18.2.0const { token, user } = await authClient.login({```

- `react-native`: 0.81.5

- `typescript`: 5.9  email: 'farmer@example.com',



### Navigation  password: 'SecurePass123!'## Installation & Setup

- `@react-navigation/native`: ^7.1.18

- `@react-navigation/native-stack`: ^7.3.27});

- `@react-navigation/bottom-tabs`: ^7.4.8

### Prerequisites

### State & Data

- `zustand`: ^5.0.6// Get current user

- `@tanstack/react-query`: ^5.90.2

- `axios`: ^1.12.2const user = await authClient.me();- Node.js 20.x or higher



### Offline & Storage```- npm or pnpm package manager

- `@react-native-async-storage/async-storage`: 2.2.0

- `expo-sqlite`: ~16.0.8- Expo CLI

- `expo-secure-store`: ~15.0.7

### Farms API- iOS Simulator (macOS) or Android Emulator

### Camera & Media

- `expo-camera`: ~17.0.8- Physical device for testing (recommended)

- `expo-image-picker`: ~17.0.8

- `expo-file-system`: ~19.0.17```typescript



### Location & Sensorsimport { getFarms, getFarm } from '@/lib/api/farms';### Install Dependencies

- `expo-location`: ~19.0.7

- `expo-barcode-scanner`: ~14.0.1



### UI & Animation// Get all farms```bash

- `react-native-reanimated`: ~4.1.1

- `react-native-gesture-handler`: ~2.28.0const farms = await getFarms();cd apps/mobile

- `expo-linear-gradient`: ^15.0.7

npm install

## 🐛 Known Issues

// Get specific farm```

1. **Expo Secure Store Mock Missing**

   - 2 tests failing due to missing mockconst farm = await getFarm('farm_123');

   - Low priority - core functionality works

```### Environment Configuration

2. **Network Info Mock Missing**

   - Tests for offline detection need proper mock



## 🤝 Contributing### Orders APICreate `.env` file in `apps/mobile/`:



1. Follow TypeScript strict mode

2. Use existing component patterns

3. Write tests for new features```typescript```bash

4. Update documentation

import { getOrders } from '@/lib/api/orders';# API Configuration

---

API_URL=http://localhost:4000

**Built with React Native, Expo, and ❤️ for farmers**

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
