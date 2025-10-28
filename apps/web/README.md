# JANI Web Application# JANI Web Application# JANI Web# JANI Web Application



> **Next.js web platform for marketing, dashboards, and consumer traceability**



The JANI Web Application provides a modern web interface for marketing, admin dashboards, exporter portals, and consumer-facing product traceability features.> **Next.js web platform for marketing, dashboards, and consumer traceability**



## 📋 Overview



- **Framework**: Next.js 15.4.7 (App Router)A modern Next.js web application providing marketing pages, admin dashboards, and product traceability for the JANI platform.Next.js 15 application that combines the public marketing site with lightweight dashboard prototypes used to exercise the platform services.## Overview

- **UI Library**: React 18.2.0

- **Styling**: Tailwind CSS 4

- **Animations**: Framer Motion + GSAP

- **Language**: TypeScript 5## 📋 Overview

- **Package Manager**: npm



## ✨ Key Features

- **Framework**: Next.js 15.4.7 (App Router)## Feature OverviewThe **JANI Web Application** is a modern Next.js-based web platform that provides marketing presence, dashboard interfaces, and administrative tools for the JANI agricultural traceability ecosystem. Built with Next.js 15, React 19, and Tailwind CSS 4, it offers a fast, responsive, and SEO-optimized experience for farmers, exporters, and consumers.

### 🌐 Marketing Site

- Landing page with hero section- **UI Library**: React 18.2.0

- Supply chain visualization

- Business value propositions- **Styling**: Tailwind CSS 4- Landing page (`src/app/page.tsx`) showcases the JANI story with animated sections and custom components under `src/components`.

- Team showcase

- Interactive animations- **Animations**: Framer Motion + GSAP

- Call-to-action sections

- **Language**: TypeScript 5.x- Authentication flow (`/login`) posts to `/api/auth/login`, which forwards credentials to `services/auth` and stores the issued token in an HTTP-only cookie.## Architecture

### 📊 Admin Dashboard

- User management (CRUD)- **Package Manager**: npm

- Farm management

- Exporter management- Middleware (`src/middleware.ts`) protects `/dashboard`, `/admin`, and `/exporter` routes by checking for the `token`/`auth-token` cookie and verifying it with the auth service when possible.

- Traceability monitoring

- Analytics and reports## ✨ Features

- System settings

- Farmer dashboard (`/dashboard/farms`) calls the user service (`/farms`, `/farms/search`, etc.) from the browser. It currently expects the JWT to be available in `localStorage` (copy the token returned by the auth service if you need to demo the flow).### Technology Stack

### 👨‍💼 Exporter Portal

- Lot management### 🌐 Marketing Site

- Order tracking

- Export documentation- Landing page with hero section- Exporter and consumer trace views render curated mock data (see `src/app/exporter` and `src/app/trace`) to demonstrate UI states without depending on live services.

- Performance analytics

- QR code generation- Supply chain visualization



### 🔍 Consumer Traceability- Business value proposition- Admin prototypes (`/admin`) access service health endpoints from server actions (`src/app/admin/actions.ts`), requiring a cookie token. Use the `/api/auth/direct-login` route with the documented admin credentials for quick access.- **Framework**: Next.js 15.4.7 (App Router)

- QR code scan results

- Product journey visualization- Team section

- Farm information display

- Event timeline- Interactive animations- **React**: React 19.1.0 with Server Components

- Photo galleries

- Sustainability metrics



### 🎨 UI/UX### 📊 Admin Dashboard## Technology Stack- **Styling**: Tailwind CSS 4.0 (with PostCSS)

- Responsive design (mobile-friendly)

- Dark/light mode support- User management

- Smooth animations

- Neumorphic design elements- Farm analytics- Next.js 15 (App Router) + React 19- **Animations**: Framer Motion 12.x + GSAP 3.x

- Interactive data visualizations

- Order tracking

## 🚀 Quick Start

- Traceability monitoring- Tailwind CSS 4 + custom CSS modules- **Authentication**: Kinde Auth (OAuth 2.0 / OIDC)

### Prerequisites

- Settings management

- **Node.js** 20.18.3+

- **npm** 11.6.2+- Server Actions, Route Handlers, Middleware- **3D Graphics**: Three.js 0.180.0



### Installation### 🔍 Consumer Traceability



```bash- QR code scanning- TypeScript 5 (strict), ESLint, and Prettier- **API Integration**: Axios + JWT

cd apps/web

npm install- Product journey visualization

```

- Farm information- **Form Validation**: Zod 3.x

### Development

- Photo timeline

```bash

# Start development server- Sustainability metrics## Project Layout- **TypeScript**: TypeScript 5.x (strict mode)

npm run dev



# Access at http://localhost:3000

```### 👨‍💼 Exporter Dashboard```



### Production- Lot management



```bash- Order trackingapps/web/### Key Features

# Build for production

npm run build- Export documentation



# Start production server- Analytics├── next.config.ts

npm start



# Production server runs on port 3000

```## 🚀 Quick Start├── package.json#### 1. **Marketing Website**



## 📁 Project Structure



```### Prerequisites├── public/                 # Static marketing assets

apps/web/

├── src/

│   ├── app/                    # Next.js App Router

│   │   ├── page.tsx            # Landing page- Node.js 20.18.3+├── src/- **Landing Page**: Hero section with 3D animations

│   │   ├── layout.tsx          # Root layout

│   │   ├── globals.css         # Global styles- npm 11.6.2+

│   │   │

│   │   ├── admin/              # Admin dashboard│   ├── app/                # App Router routes (landing, login, dashboards, APIs)- **Features Showcase**: Product capabilities and benefits

│   │   │   ├── page.tsx        # Dashboard home

│   │   │   ├── layout.tsx      # Admin layout### Installation

│   │   │   ├── users/          # User management

│   │   │   ├── farms/          # Farm management│   ├── components/         # Marketing + dashboard components- **Pricing Plans**: Subscription tiers for farmers and exporters

│   │   │   ├── exporters/      # Exporter management

│   │   │   ├── analytics/      # Analytics```bash

│   │   │   ├── traceability/   # Traceability monitoring

│   │   │   └── settings/       # System settingscd apps/web│   ├── libs/               # Shared types- **About Us**: Company information and mission

│   │   │

│   │   ├── exporter/           # Exporter portalnpm install

│   │   │   └── lots/           # Lot management

│   │   │```│   └── utils/              # Helpers reused across routes- **Contact**: Contact form with email integration

│   │   ├── dashboard/          # User dashboard

│   │   │   └── farms/          # Farm overview

│   │   │

│   │   ├── login/              # Login page### Development└── tsconfig.json- **Blog**: Content management for agricultural insights

│   │   └── trace/              # Traceability pages

│   │       └── [id]/           # Dynamic lot tracing

│   │

│   ├── components/             # React components```bash```- **Testimonials**: Customer success stories

│   │   ├── NavBar.tsx

│   │   ├── Footer.tsx# Start development server

│   │   ├── Button.tsx

│   │   ├── HeroSection.tsxnpm run dev- **FAQ**: Common questions and answers

│   │   ├── SupplyChainSection.tsx

│   │   ├── BusinessSection.tsx

│   │   ├── TeamSection.tsx

│   │   ├── Chatbot.tsx# Access at http://localhost:3000## Environment Configuration

│   │   └── NeumorphicEffect.tsx

│   │```

│   ├── utils/                  # Utility functions

│   │   └── ...Copy `.env.example` to `.env.local` and adjust as needed.#### 2. **Dashboard Application**

│   │

│   └── middleware.ts           # Next.js middleware### Production Build

│

├── public/

│   ├── images/                 # Static images

│   └── videos/                 # Static videos```bash

│

├── next.config.ts              # Next.js configuration# Build for production| Variable | Purpose | Default |- **Farmer Dashboard**: Farm analytics, activity tracking, yield reports

├── tailwind.config.js          # Tailwind configuration

├── tsconfig.json               # TypeScript configurationnpm run build

└── package.json

```| -------- | ------- | ------- |- **Exporter Dashboard**: Traceability verification, batch tracking, compliance



## 🎯 Key Pages# Start production server



### Landing Page (`/`)npm start| `AUTH_SERVICE_URL` | Base URL for the auth microservice used by API routes | `http://localhost:4000` |- **Admin Dashboard**: User management, system analytics, configuration



Features:```

- Animated hero section

- Supply chain visualization| `NEXT_PUBLIC_USER_URL` | Browser-facing base URL for the user service (`/farms` APIs) | `http://localhost:5000` |- **Real-time Updates**: Live data synchronization

- Business value cards

- Interactive carousel**Note**: Build currently has known issues with SSG (static site generation) on 404 pages. Use development mode for active development.

- Team member showcase

- Newsletter signup| `JWT_SECRET` | Required by `/api/guest` for issuing demo tokens | _(none)_ |- **Data Visualization**: Charts, graphs, and metrics

- Contact form

## 📁 Project Structure

```typescript

import HeroSection from '@/components/HeroSection';| `NEXT_PUBLIC_APP_URL` | Optional public origin (used by some links) | `http://localhost:3000` |- **Report Generation**: PDF export for compliance

import SupplyChainSection from '@/components/SupplyChainSection';

import BusinessSection from '@/components/BusinessSection';```



export default function Home() {apps/web/

  return (

    <main>├── src/

      <HeroSection />

      <SupplyChainSection />│   ├── app/                    # Next.js App RouterIf you are running everything through Docker Compose, the defaults align with the service hostnames. When accessing services from the host, use `http://localhost:<port>`.#### 3. **Traceability Portal**

      <BusinessSection />

    </main>│   │   ├── page.tsx            # Landing page

  );

}│   │   ├── layout.tsx          # Root layout

```

│   │   ├── globals.css         # Global styles

### Admin Dashboard (`/admin`)

│   │   ├── admin/              # Admin dashboard## Local Development- **QR Code Scanner**: Scan product QR codes for traceability

#### Dashboard Home

- Platform statistics│   │   │   ├── page.tsx

- Recent activities

- User growth charts│   │   │   ├── layout.tsx```bash- **Product Journey**: Visual timeline from farm to consumer

- System health

│   │   │   ├── users/

#### Users Management (`/admin/users`)

- List all users│   │   │   ├── farms/cd apps/web- **Certificate Verification**: Validate organic/quality certifications

- Create/edit/delete users

- Role assignment│   │   │   ├── exporters/

- Activity logs

│   │   │   ├── analytics/npm install- **Farm Information**: View farm details and practices

#### Farms Management (`/admin/farms`)

- Farm directory│   │   │   ├── traceability/

- Farm details

- Member management│   │   │   └── settings/npm run dev- **Event History**: Complete audit trail of product handling

- Plot overview

│   │   ├── exporter/           # Exporter dashboard

#### Exporters Management (`/admin/exporters`)

- Exporter profiles│   │   │   └── lots/```- **Share Traceability**: Social media sharing capabilities

- Export history

- Documentation│   │   ├── dashboard/          # User dashboard

- Compliance tracking

│   │   │   └── farms/

#### Traceability (`/admin/traceability`)

- Event monitoring│   │   ├── login/              # Login page

- Lot tracking

- QR code management│   │   └── trace/              # Traceability pagesThe dev server listens on `http://localhost:3000`. Run `docker compose up -d auth user` from the repo root to make the backend APIs available.#### 4. **Exporter Tools**

- Audit trails

│   │       └── [id]/

#### Analytics (`/admin/analytics`)

- Platform metrics│   │

- User engagement

- Farm productivity│   ├── components/             # React components

- Export volumes

│   │   ├── NavBar.tsx### Available Scripts- **Batch Management**: Create and manage export batches

### Exporter Portal (`/exporter`)

│   │   ├── Footer.tsx

#### Lots Management (`/exporter/lots`)

- Create and manage lots│   │   ├── Button.tsx- `npm run dev` – start Next.js in development mode- **Compliance Tracking**: Monitor regulatory requirements

- Track inventory

- Generate QR codes│   │   ├── HeroSection.tsx

- Export documentation

- Shipping management│   │   ├── SupplyChainSection.tsx- `npm run build` – production build- **Documentation**: Generate export documents (phytosanitary, etc.)



### Product Traceability (`/trace/[id]`)│   │   ├── BusinessSection.tsx



Consumer-facing page showing:│   │   ├── TeamSection.tsx- `npm start` – serve the built app- **Shipment Tracking**: Real-time shipment status

- Product information

- Farm origin│   │   ├── Chatbot.tsx

- Event timeline

- Photo gallery│   │   └── NeumorphicEffect.tsx- `npm run lint` – ESLint- **Quality Reports**: Aggregate quality data

- Certifications

- Sustainability data│   │



```typescript│   ├── utils/                  # Utility functions- `npm run typecheck` – TypeScript project references- **Invoice Management**: Financial tracking

// app/trace/[id]/page.tsx

export default async function TracePage({ params }: { params: { id: string } }) {│   │   └── ...

  const events = await getEventsByLot(params.id);

  │   │

  return (

    <div>│   └── middleware.ts           # Next.js middleware

      <ProductHeader lotId={params.id} />

      <EventTimeline events={events} />│## Data Flow Reference## Project Structure

      <PhotoGallery events={events} />

    </div>├── public/

  );

}│   ├── images/| Route | Source | Notes |

```

│   └── videos/

## 🎨 Components

│| ----- | ------ | ----- |```

### Custom Components

├── next.config.ts              # Next.js configuration

#### Button

```tsx├── tailwind.config.js          # Tailwind configuration| `/api/auth/login` | `AUTH_SERVICE_URL` (`/auth/login`) | Sets `token` cookie on success |apps/web/

import Button from '@/components/Button';

├── tsconfig.json               # TypeScript configuration

<Button

  text="Get Started"└── package.json| `/api/auth/verify` | `AUTH_SERVICE_URL` (`/auth/verify`) | Used by middleware for token checks |├── next.config.ts               # Next.js configuration

  border="#8b4513"

  backgroundHover="#8b4513"```

  onClick={() => console.log('Clicked')}

/>| `/dashboard/farms` | `NEXT_PUBLIC_USER_URL` (`/farms`, `/farms/:id`, `/farms/link`) | Requires `Bearer` token in local storage |├── package.json                 # Dependencies

```

## 🎨 Key Pages

#### NeumorphicEffect

```tsx| `/exporter/*` | Local mock data | No service dependency |├── tsconfig.json                # TypeScript config

import NeumorphicEffect from '@/components/NeumorphicEffect';

### Landing Page (`/`)

<NeumorphicEffect pressEffect={true}>

  <div className="p-6">- Hero section with animations| `/trace/*` | Local mock data | Demonstration of consumer experience |├── tailwind.config.ts           # Tailwind CSS config

    <h2>Card Content</h2>

  </div>- Supply chain visualization

</NeumorphicEffect>

```- Business value propositions| `/admin` | Auth + traceability service health endpoints | Requests originate from server actions |├── postcss.config.mjs           # PostCSS config



#### NavBar- Interactive carousel

```tsx

import NavBar from '@/components/NavBar';- Team showcase├── eslint.config.mjs            # ESLint configuration



<NavBar />- Call-to-action sections

```

## Troubleshooting├── .env.local                   # Environment variables

## 🎨 Styling

### Admin Dashboard (`/admin`)

### Tailwind CSS

- **Dashboard**: Overview statistics- **Redirected back to `/login`** – confirm a `token` or `auth-token` cookie exists. Use the direct admin login (`POST /api/auth/direct-login`) or the guest login (`GET /api/guest`) while developing.├── public/                      # Static assets

```tsx

<div className="flex items-center justify-center min-h-screen bg-gray-100">- **Users**: User management

  <h1 className="text-4xl font-bold text-green-600">

    JANI Platform- **Farms**: Farm management- **Farms dashboard shows “Please login first.”** – the page looks for `localStorage.token`. Copy the JWT from the cookie (browser dev tools) into local storage or adapt the login flow to mirror the mobile app storage.│   ├── images/                  # Image assets

  </h1>

</div>- **Exporters**: Exporter management

```

- **Traceability**: Event tracking- **CORS/404 errors when calling services** – verify the services are running and reachable at the configured URLs. In Docker, use service hostnames (e.g., `http://jani-user:5000`).│   │   ├── logo.svg

### Custom Animations

- **Analytics**: Performance metrics

#### Framer Motion

```tsx- **Settings**: System configuration- **Type errors during build** – run `npm run lint` and `npm run typecheck` to surface actionable issues.│   │   ├── hero-bg.jpg

import { motion } from 'framer-motion';



<motion.div

  initial={{ opacity: 0, y: 20 }}### Exporter Portal (`/exporter`)│   │   └── ...

  animate={{ opacity: 1, y: 0 }}

  transition={{ duration: 0.5 }}- Lot management│   └── videos/                  # Video assets

>

  <Content />- Export orders│       └── demo.mp4

</motion.div>

```- Traceability events├── libs/                        # Shared libraries



#### GSAP│   └── types.ts                 # Type definitions

```tsx

import { useEffect, useRef } from 'react';### Product Traceability (`/trace/[id]`)└── src/

import { gsap } from 'gsap';

- QR code result page    ├── middleware.ts            # Next.js middleware (auth, etc.)

export function AnimatedSection() {

  const ref = useRef(null);- Product journey    ├── app/                     # App Router pages

  

  useEffect(() => {- Farm details    │   ├── layout.tsx           # Root layout

    gsap.fromTo(ref.current,

      { opacity: 0, y: 50 },- Event timeline    │   ├── page.tsx             # Landing page

      { opacity: 1, y: 0, duration: 1 }

    );    │   ├── globals.css          # Global styles

  }, []);

  ## 🎯 Components    │   ├── api/                 # API routes

  return <div ref={ref}>Content</div>;

}    │   │   ├── auth/

```

### Custom Components    │   │   ├── farms/

## 🔐 Authentication

    │   │   └── traceability/

Currently using custom JWT-based authentication:

**Button:**    │   ├── login/               # Login page

```typescript

// middleware.ts```tsx    │   │   └── page.tsx

import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';import Button from '@/components/Button';    │   ├── dashboard/           # Dashboard pages



export function middleware(request: NextRequest) {    │   │   ├── layout.tsx       # Dashboard layout

  const token = request.cookies.get('token')?.value;

  <Button    │   │   ├── page.tsx         # Dashboard home

  if (!token && request.nextUrl.pathname.startsWith('/admin')) {

    return NextResponse.redirect(new URL('/login', request.url));  text="Get Started"    │   │   ├── farms/

  }

    border="#8b4513"    │   │   ├── analytics/

  return NextResponse.next();

}  backgroundHover="#8b4513"    │   │   └── settings/

```

/>    │   ├── trace/               # Traceability portal

## 📡 API Integration

```    │   │   ├── [code]/          # Dynamic product page

### Environment Variables

    │   │   └── scanner/         # QR scanner page

Create a `.env.local` file:

**NeumorphicEffect:**    │   └── exporter/            # Exporter section

```bash

# API Endpoints```tsx    │       ├── layout.tsx

NEXT_PUBLIC_AUTH_API=http://localhost:4000

NEXT_PUBLIC_TRACEABILITY_API=http://localhost:5002import NeumorphicEffect from '@/components/NeumorphicEffect';    │       ├── page.tsx

NEXT_PUBLIC_OPERATIONS_API=http://localhost:5003

    │       ├── batches/

# Feature Flags

NEXT_PUBLIC_ENABLE_CHAT=true<NeumorphicEffect pressEffect={true}>    │       ├── compliance/

NEXT_PUBLIC_ENABLE_ANALYTICS=true

  <h1>Content</h1>    │       └── reports/

# Auth

JWT_SECRET=your-secret-key-change-in-production</NeumorphicEffect>    ├── components/              # React components

```

```    │   ├── layout/              # Layout components

### API Calls

    │   │   ├── Header.tsx

```typescript

// Example API client**NavBar:**    │   │   ├── Footer.tsx

export async function getFarms() {

  const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API}/data/farms`, {```tsx    │   │   ├── Sidebar.tsx

    headers: {

      'Authorization': `Bearer ${token}`,import NavBar from '@/components/NavBar';    │   │   └── Navigation.tsx

      'Content-Type': 'application/json'

    }    │   ├── ui/                  # UI components

  });

  <NavBar />    │   │   ├── Button.tsx

  return response.json();

}```    │   │   ├── Card.tsx

```

    │   │   ├── Input.tsx

## ⚙️ Configuration

## 🎨 Styling    │   │   ├── Modal.tsx

### Next.js Config

    │   │   └── ...

```typescript

// next.config.ts### Tailwind CSS 4    │   ├── dashboard/           # Dashboard components

import { NextConfig } from "next";

    │   │   ├── StatsCard.tsx

const nextConfig: NextConfig = {

  reactStrictMode: true,```tsx    │   │   ├── Chart.tsx

  experimental: {

    optimizePackageImports: ['lucide-react', 'framer-motion'],<div className="flex items-center justify-center min-h-screen bg-gray-100">    │   │   ├── FarmTable.tsx

  },

  images: {  <h1 className="text-4xl font-bold text-green-600">JANI</h1>    │   │   └── ...

    remotePatterns: [

      {</div>    │   ├── marketing/           # Marketing components

        protocol: 'https',

        hostname: 's3.example.com',```    │   │   ├── Hero.tsx

      },

    ],    │   │   ├── Features.tsx

  },

};### Custom Animations    │   │   ├── Pricing.tsx



export default nextConfig;    │   │   └── Testimonials.tsx

```

```tsx    │   └── trace/               # Traceability components

### Tailwind Config

import { motion } from 'framer-motion';    │       ├── ProductTimeline.tsx

```javascript

// tailwind.config.js    │       ├── QRScanner.tsx

module.exports = {

  content: [<motion.div    │       └── CertificateBadge.tsx

    './src/app/**/*.{js,ts,jsx,tsx,mdx}',

    './src/components/**/*.{js,ts,jsx,tsx,mdx}',  initial={{ opacity: 0, y: 20 }}    └── utils/                   # Utility functions

  ],

  theme: {  animate={{ opacity: 1, y: 0 }}        ├── api.ts               # API client

    extend: {

      colors: {  transition={{ duration: 0.5 }}        ├── auth.ts              # Auth helpers

        'jani-green': '#4ade80',

        'jani-brown': '#8b4513',>        ├── formatting.ts        # Data formatting

      },

    },  Content        └── validation.ts        # Zod schemas

  },

  plugins: [],</motion.div>```

};

``````



## 🧪 Testing## Installation & Setup



```bash## 🔐 Authentication

# Lint

npm run lint### Prerequisites



# Type checkCurrently using custom JWT-based authentication. Future integration with Auth Service planned.

npm run typecheck

- Node.js 20.x or higher

# Both

npm run lint && npm run typecheck## 🧪 Testing- npm or pnpm package manager

```

- Git

### Current Status

```bash

- ✅ **Lint**: 0 errors

- ✅ **TypeCheck**: 0 errors# Lint### Install Dependencies

- ❌ **Build**: Known SSG issue on 404 page

npm run lint

## 🐛 Known Issues

```bash

### Build Failure (React Error #31)

# Type checkcd apps/web

**Issue**: Static site generation fails on 404 page  

**Error**: `Error: Element type is invalid: expected a string`  npm run typechecknpm install

**Impact**: Cannot create production build with `next build`  

**Workaround**: Use `npm run dev` for development  ```

**Status**: Under investigation - likely Next.js 15 + React 18 compatibility

# Full CI (lint + typecheck + build)

**Temporary Solution:**

- Development server works perfectlynpm run build### Environment Configuration

- Use `npm run dev` for local development

- Production deployment uses dev mode or custom server```



## 🚀 DeploymentCreate `.env.local` file in `apps/web/`:



### Vercel (Recommended)### Current Status



```bash```bash

# Install Vercel CLI

npm i -g vercel- ✅ Lint: Passing (0 errors)# Kinde Auth Configuration



# Deploy- ✅ TypeCheck: Passing (0 errors)KINDE_CLIENT_ID=your-client-id

vercel

- ❌ Build: Known SSG issue on 404 pageKINDE_CLIENT_SECRET=your-client-secret

# Production deployment

vercel --prodKINDE_ISSUER_URL=https://your-domain.kinde.com

```

## ⚙️ ConfigurationKINDE_SITE_URL=http://localhost:3000

### Docker

KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000

```bash

# Build### Next.js ConfigKINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard

docker build -t jani-web .



# Run

docker run -p 3000:3000 jani-web```typescript# API Configuration

```

// next.config.tsNEXT_PUBLIC_API_URL=http://localhost:4000

### Manual Deployment

import { NextConfig } from "next";NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:4000

```bash

# Build (if build issue is resolved)NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:5000

npm run build

const nextConfig: NextConfig = {NEXT_PUBLIC_TRACEABILITY_SERVICE_URL=http://localhost:3004

# Start production server

npm start  reactStrictMode: true,

```

  experimental: {# Feature Flags

## 📦 Dependencies

    optimizePackageImports: ['lucide-react', 'framer-motion'],NEXT_PUBLIC_ENABLE_3D_GRAPHICS=true

### Core

- `next`: 15.4.7  },NEXT_PUBLIC_ENABLE_ANALYTICS=true

- `react`: 18.2.0

- `react-dom`: 18.2.0};NEXT_PUBLIC_ENABLE_BLOG=false

- `typescript`: 5.x



### UI/UX

- `tailwindcss`: 4.xexport default nextConfig;# External Services

- `framer-motion`: ^12.23.21

- `gsap`: ^3.13.0```NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-maps-key

- `lucide-react`: ^0.540.0 (icons)

NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

### Authentication

- `jose`: ^6.1.0 (JWT)### Environment Variables```

- `jwt-decode`: ^4.0.0



### Utilities

- `zod`: ^3.25.76 (validation)```bash### Running the Application



## 📖 Scripts# API Endpoints



```bashNEXT_PUBLIC_AUTH_API=http://localhost:4000#### Development Mode

npm run dev          # Development server (port 3000)

npm run build        # Production build (currently has issues)NEXT_PUBLIC_TRACEABILITY_API=http://localhost:5002

npm start            # Start production server

npm run lint         # Lint code```bash

npm run typecheck    # Type checking

```# Feature Flagsnpm run dev



## 🎯 RoadmapNEXT_PUBLIC_ENABLE_CHAT=true```



### Short Term```

- [ ] Fix build SSG issue

- [ ] Add error boundariesApplication available at `http://localhost:3000`

- [ ] Implement custom 404/500 pages

- [ ] Add unit tests## 🚀 Deployment

- [ ] Improve accessibility

#### Production Build

### Long Term

- [ ] Integrate with Auth Service### Vercel (Recommended)

- [ ] Real-time notifications

- [ ] Advanced analytics dashboard```bash

- [ ] Mobile app deep linking

- [ ] Multi-language support```bash# Build application



## 🤝 Contributing# Install Vercel CLInpm run build



1. Follow Next.js 15 best practicesnpm i -g vercel

2. Use TypeScript strict mode

3. Follow Tailwind CSS conventions# Start production server

4. Test on multiple browsers

5. Ensure responsive design# Deploynpm start



---vercel```



**Built with Next.js, React, and Tailwind CSS**```


#### Linting

### Docker

```bash

```bashnpm run lint

# Build```

docker build -t jani-web .

## Core Features Deep Dive

# Run

docker run -p 3000:3000 jani-web### 1. Landing Page

```

**Hero Section:**

### Manual Build- Animated 3D background with Three.js

- Compelling headline and CTA

```bash- Auto-playing demo video

# Build- Scroll-triggered animations

npm run build

**Features Section:**

# Start- Grid layout with icon cards

npm start- Hover animations

```- Responsive design

- Feature highlights

## 🐛 Known Issues

**Testimonials:**

1. **Build Failure on 404 Page**- Customer quotes

   - Issue: Static page generation fails with React error #31- Avatar images

   - Impact: Cannot create production build- Company logos

   - Workaround: Use `npm run dev` for development- Carousel/slider

   - Status: Under investigation (Next.js 15 + React 18 compatibility)

**Pricing:**

2. **Missing Error Boundaries**- Tier comparison table

   - Custom error pages needed- Feature checkmarks

   - 404 and 500 pages to be implemented- Monthly/annual toggle

- CTA buttons

## 📚 Dependencies

### 2. Authentication

### Core

- `next`: 15.4.7**Kinde Auth Integration:**

- `react`: 18.2.0```typescript

- `react-dom`: 18.2.0import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

- `typescript`: 5.x

export async function GET() {

### UI/UX  const { getUser } = getKindeServerSession();

- `tailwindcss`: 4.x  const user = await getUser();

- `framer-motion`: ^12.23.21  

- `gsap`: ^3.13.0  if (!user) {

- `lucide-react`: ^0.540.0    return redirect('/api/auth/login');

  }

### Utilities  

- `jose`: ^6.1.0 (JWT)  return NextResponse.json({ user });

- `zod`: ^3.25.76 (Validation)}

```

## 📖 Scripts

**Protected Routes:**

```bash```typescript

npm run dev          # Development server// middleware.ts

npm run build        # Production buildimport { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';

npm start            # Start production server

npm run lint         # Lint codeexport default withAuth({

npm run typecheck    # Type checking  isReturnToCurrentPage: true,

```  publicPaths: ['/', '/about', '/contact', '/trace/:path*']

});

## 📄 License

export const config = {

This project is proprietary software. All rights reserved.  matcher: ['/dashboard/:path*', '/exporter/:path*']

};

---```



**Built with Next.js, React, and Tailwind CSS**### 3. Dashboard Pages


**Farm Analytics:**
```tsx
export default function DashboardPage() {
  const { data: analytics } = useFarmAnalytics();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Farms"
        value={analytics.totalFarms}
        icon={<FarmIcon />}
        trend={+5.2}
      />
      <StatsCard
        title="Active Plots"
        value={analytics.activePlots}
        icon={<PlotIcon />}
        trend={+12.4}
      />
      <StatsCard
        title="This Month's Harvest"
        value={`${analytics.harvestKg} kg`}
        icon={<HarvestIcon />}
        trend={+8.1}
      />
      <StatsCard
        title="Quality Score"
        value={`${analytics.qualityScore}%`}
        icon={<QualityIcon />}
        trend={+2.3}
      />
    </div>
  );
}
```

**Data Tables:**
```tsx
<DataTable
  columns={[
    { key: 'name', label: 'Farm Name', sortable: true },
    { key: 'location', label: 'Location' },
    { key: 'size', label: 'Size (ha)', sortable: true },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' }
  ]}
  data={farms}
  pagination={true}
  searchable={true}
  onRowClick={(farm) => router.push(`/dashboard/farms/${farm.id}`)}
/>
```

**Charts & Visualizations:**
```tsx
import { LineChart, BarChart, PieChart } from '@/components/charts';

<LineChart
  data={yieldData}
  xKey="date"
  yKey="yield"
  title="Yield Trends"
  height={300}
/>
```

### 4. Traceability Portal

**QR Scanner:**
```tsx
'use client';

import { QrScanner } from '@/components/trace/QrScanner';

export default function ScannerPage() {
  const router = useRouter();
  
  const handleScan = (code: string) => {
    // Navigate to product page
    router.push(`/trace/${code}`);
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Scan Product QR Code</h1>
      <QrScanner onScan={handleScan} />
    </div>
  );
}
```

**Product Journey:**
```tsx
export default async function ProductPage({ params }: { params: { code: string } }) {
  const product = await getProductByCode(params.code);
  
  return (
    <div>
      <ProductHeader product={product} />
      <Timeline events={product.events} />
      <FarmInformation farm={product.farm} />
      <Certifications certificates={product.certificates} />
      <ShareButtons url={`/trace/${params.code}`} />
    </div>
  );
}
```

### 5. Exporter Dashboard

**Batch Management:**
```tsx
export default function BatchesPage() {
  const { data: batches } = useBatches();
  const { mutate: createBatch } = useCreateBatch();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Export Batches</h1>
        <Button onClick={() => setShowCreateModal(true)}>
          Create New Batch
        </Button>
      </div>
      
      <BatchTable
        batches={batches}
        onView={(batch) => router.push(`/exporter/batches/${batch.id}`)}
        onExport={(batch) => exportBatchDocuments(batch.id)}
      />
    </div>
  );
}
```

## API Routes

### Server-Side API Routes

**Farm API:**
```typescript
// app/api/farms/route.ts
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const farms = await fetchFarmsFromBackend(user.id);
  return NextResponse.json(farms);
}

export async function POST(request: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const body = await request.json();
  const farm = await createFarmInBackend(user.id, body);
  
  return NextResponse.json(farm, { status: 201 });
}
```

**Traceability API:**
```typescript
// app/api/trace/[code]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  const productData = await fetchTraceabilityData(params.code);
  
  if (!productData) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  
  return NextResponse.json(productData);
}
```

## Styling & Design System

### Tailwind CSS Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          900: '#064e3b'
        },
        secondary: {
          500: '#8b5cf6',
          600: '#7c3aed'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 3s infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
};

export default config;
```

### Component Examples

**Button Component:**
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200';
  
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
    ghost: 'text-primary-600 hover:bg-primary-50'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

## Animations

### Framer Motion

```tsx
import { motion } from 'framer-motion';

export function AnimatedCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
}
```

### GSAP Animations

```tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function AnimatedSection({ children }: { children: React.ReactNode }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  }, []);
  
  return <div ref={sectionRef}>{children}</div>;
}
```

## Performance Optimization

### Next.js Optimization

**Image Optimization:**
```tsx
import Image from 'next/image';

<Image
  src="/images/farm.jpg"
  alt="Farm"
  width={800}
  height={600}
  priority={true}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

**Dynamic Imports:**
```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});
```

**Route Prefetching:**
```tsx
import Link from 'next/link';

<Link href="/dashboard" prefetch={true}>
  Go to Dashboard
</Link>
```

### Server Components

```tsx
// app/dashboard/page.tsx (Server Component)
export default async function DashboardPage() {
  // Fetch data on server
  const farms = await fetchFarms();
  
  return (
    <div>
      <h1>Dashboard</h1>
      <FarmList farms={farms} />
    </div>
  );
}
```

### Caching Strategy

```typescript
// app/api/farms/route.ts
export const revalidate = 60; // Revalidate every 60 seconds

export async function GET() {
  const farms = await fetchFarms();
  return NextResponse.json(farms);
}
```

## SEO & Meta Tags

```tsx
// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JANI - Agricultural Traceability Platform',
  description: 'Track your farm produce from seed to table with blockchain-ready traceability',
  keywords: ['agriculture', 'traceability', 'farming', 'organic'],
  authors: [{ name: 'JANI Platform' }],
  openGraph: {
    title: 'JANI - Agricultural Traceability Platform',
    description: 'Track your farm produce from seed to table',
    images: ['/images/og-image.jpg'],
    url: 'https://jani.com',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JANI Platform',
    description: 'Agricultural Traceability Platform',
    images: ['/images/twitter-card.jpg']
  }
};
```

## Testing

### Unit Tests

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    screen.getByText('Click me').click();
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### E2E Tests (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('/login');
  
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('/dashboard');
});
```

## Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod
```

### Docker Deployment

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables

Production environment variables should be set in Vercel dashboard or deployment platform.

## Performance Metrics

### Core Web Vitals

Target metrics:
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Lighthouse Scores

Target scores:
- **Performance**: > 90
- **Accessibility**: > 95
- **Best Practices**: > 95
- **SEO**: > 95

## License

Proprietary - JANI Platform © 2025

## Changelog

### Version 1.0.0 (October 2025)

**Features:**
- ✅ Marketing website with 3D animations
- ✅ Farmer dashboard with analytics
- ✅ Exporter tools and batch management
- ✅ Traceability portal with QR scanning
- ✅ Kinde authentication integration
- ✅ Responsive design (mobile-first)
- ✅ Server-side rendering (SSR)
- ✅ API routes with Next.js
- ✅ Tailwind CSS 4 styling
- ✅ Framer Motion animations
- ✅ SEO optimization
- ✅ Image optimization
- ✅ TypeScript strict mode

**Performance:**
- ✅ Fast page loads (< 2s FCP)
- ✅ Optimized bundle size
- ✅ Code splitting
- ✅ Image lazy loading
- ✅ Route prefetching

**Developer Experience:**
- ✅ Hot Module Replacement (HMR)
- ✅ TypeScript autocomplete
- ✅ ESLint + Prettier
- ✅ Component documentation
- ✅ API documentation

---

**Maintained by**: JANI Platform Development Team  
**Last Updated**: October 22, 2025  
**Version**: 1.0.0
