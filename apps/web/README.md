# JANI Web# JANI Web Application



Next.js 15 application that combines the public marketing site with lightweight dashboard prototypes used to exercise the platform services.## Overview



## Feature OverviewThe **JANI Web Application** is a modern Next.js-based web platform that provides marketing presence, dashboard interfaces, and administrative tools for the JANI agricultural traceability ecosystem. Built with Next.js 15, React 19, and Tailwind CSS 4, it offers a fast, responsive, and SEO-optimized experience for farmers, exporters, and consumers.

- Landing page (`src/app/page.tsx`) showcases the JANI story with animated sections and custom components under `src/components`.

- Authentication flow (`/login`) posts to `/api/auth/login`, which forwards credentials to `services/auth` and stores the issued token in an HTTP-only cookie.## Architecture

- Middleware (`src/middleware.ts`) protects `/dashboard`, `/admin`, and `/exporter` routes by checking for the `token`/`auth-token` cookie and verifying it with the auth service when possible.

- Farmer dashboard (`/dashboard/farms`) calls the user service (`/farms`, `/farms/search`, etc.) from the browser. It currently expects the JWT to be available in `localStorage` (copy the token returned by the auth service if you need to demo the flow).### Technology Stack

- Exporter and consumer trace views render curated mock data (see `src/app/exporter` and `src/app/trace`) to demonstrate UI states without depending on live services.

- Admin prototypes (`/admin`) access service health endpoints from server actions (`src/app/admin/actions.ts`), requiring a cookie token. Use the `/api/auth/direct-login` route with the documented admin credentials for quick access.- **Framework**: Next.js 15.4.7 (App Router)

- **React**: React 19.1.0 with Server Components

## Technology Stack- **Styling**: Tailwind CSS 4.0 (with PostCSS)

- Next.js 15 (App Router) + React 19- **Animations**: Framer Motion 12.x + GSAP 3.x

- Tailwind CSS 4 + custom CSS modules- **Authentication**: Kinde Auth (OAuth 2.0 / OIDC)

- Server Actions, Route Handlers, Middleware- **3D Graphics**: Three.js 0.180.0

- TypeScript 5 (strict), ESLint, and Prettier- **API Integration**: Axios + JWT

- **Form Validation**: Zod 3.x

## Project Layout- **TypeScript**: TypeScript 5.x (strict mode)

```

apps/web/### Key Features

├── next.config.ts

├── package.json#### 1. **Marketing Website**

├── public/                 # Static marketing assets

├── src/- **Landing Page**: Hero section with 3D animations

│   ├── app/                # App Router routes (landing, login, dashboards, APIs)- **Features Showcase**: Product capabilities and benefits

│   ├── components/         # Marketing + dashboard components- **Pricing Plans**: Subscription tiers for farmers and exporters

│   ├── libs/               # Shared types- **About Us**: Company information and mission

│   └── utils/              # Helpers reused across routes- **Contact**: Contact form with email integration

└── tsconfig.json- **Blog**: Content management for agricultural insights

```- **Testimonials**: Customer success stories

- **FAQ**: Common questions and answers

## Environment Configuration

Copy `.env.example` to `.env.local` and adjust as needed.#### 2. **Dashboard Application**



| Variable | Purpose | Default |- **Farmer Dashboard**: Farm analytics, activity tracking, yield reports

| -------- | ------- | ------- |- **Exporter Dashboard**: Traceability verification, batch tracking, compliance

| `AUTH_SERVICE_URL` | Base URL for the auth microservice used by API routes | `http://localhost:4000` |- **Admin Dashboard**: User management, system analytics, configuration

| `NEXT_PUBLIC_USER_URL` | Browser-facing base URL for the user service (`/farms` APIs) | `http://localhost:5000` |- **Real-time Updates**: Live data synchronization

| `JWT_SECRET` | Required by `/api/guest` for issuing demo tokens | _(none)_ |- **Data Visualization**: Charts, graphs, and metrics

| `NEXT_PUBLIC_APP_URL` | Optional public origin (used by some links) | `http://localhost:3000` |- **Report Generation**: PDF export for compliance



If you are running everything through Docker Compose, the defaults align with the service hostnames. When accessing services from the host, use `http://localhost:<port>`.#### 3. **Traceability Portal**



## Local Development- **QR Code Scanner**: Scan product QR codes for traceability

```bash- **Product Journey**: Visual timeline from farm to consumer

cd apps/web- **Certificate Verification**: Validate organic/quality certifications

npm install- **Farm Information**: View farm details and practices

npm run dev- **Event History**: Complete audit trail of product handling

```- **Share Traceability**: Social media sharing capabilities



The dev server listens on `http://localhost:3000`. Run `docker compose up -d auth user` from the repo root to make the backend APIs available.#### 4. **Exporter Tools**



### Available Scripts- **Batch Management**: Create and manage export batches

- `npm run dev` – start Next.js in development mode- **Compliance Tracking**: Monitor regulatory requirements

- `npm run build` – production build- **Documentation**: Generate export documents (phytosanitary, etc.)

- `npm start` – serve the built app- **Shipment Tracking**: Real-time shipment status

- `npm run lint` – ESLint- **Quality Reports**: Aggregate quality data

- `npm run typecheck` – TypeScript project references- **Invoice Management**: Financial tracking



## Data Flow Reference## Project Structure

| Route | Source | Notes |

| ----- | ------ | ----- |```

| `/api/auth/login` | `AUTH_SERVICE_URL` (`/auth/login`) | Sets `token` cookie on success |apps/web/

| `/api/auth/verify` | `AUTH_SERVICE_URL` (`/auth/verify`) | Used by middleware for token checks |├── next.config.ts               # Next.js configuration

| `/dashboard/farms` | `NEXT_PUBLIC_USER_URL` (`/farms`, `/farms/:id`, `/farms/link`) | Requires `Bearer` token in local storage |├── package.json                 # Dependencies

| `/exporter/*` | Local mock data | No service dependency |├── tsconfig.json                # TypeScript config

| `/trace/*` | Local mock data | Demonstration of consumer experience |├── tailwind.config.ts           # Tailwind CSS config

| `/admin` | Auth + traceability service health endpoints | Requests originate from server actions |├── postcss.config.mjs           # PostCSS config

├── eslint.config.mjs            # ESLint configuration

## Troubleshooting├── .env.local                   # Environment variables

- **Redirected back to `/login`** – confirm a `token` or `auth-token` cookie exists. Use the direct admin login (`POST /api/auth/direct-login`) or the guest login (`GET /api/guest`) while developing.├── public/                      # Static assets

- **Farms dashboard shows “Please login first.”** – the page looks for `localStorage.token`. Copy the JWT from the cookie (browser dev tools) into local storage or adapt the login flow to mirror the mobile app storage.│   ├── images/                  # Image assets

- **CORS/404 errors when calling services** – verify the services are running and reachable at the configured URLs. In Docker, use service hostnames (e.g., `http://jani-user:5000`).│   │   ├── logo.svg

- **Type errors during build** – run `npm run lint` and `npm run typecheck` to surface actionable issues.│   │   ├── hero-bg.jpg

│   │   └── ...
│   └── videos/                  # Video assets
│       └── demo.mp4
├── libs/                        # Shared libraries
│   └── types.ts                 # Type definitions
└── src/
    ├── middleware.ts            # Next.js middleware (auth, etc.)
    ├── app/                     # App Router pages
    │   ├── layout.tsx           # Root layout
    │   ├── page.tsx             # Landing page
    │   ├── globals.css          # Global styles
    │   ├── api/                 # API routes
    │   │   ├── auth/
    │   │   ├── farms/
    │   │   └── traceability/
    │   ├── login/               # Login page
    │   │   └── page.tsx
    │   ├── dashboard/           # Dashboard pages
    │   │   ├── layout.tsx       # Dashboard layout
    │   │   ├── page.tsx         # Dashboard home
    │   │   ├── farms/
    │   │   ├── analytics/
    │   │   └── settings/
    │   ├── trace/               # Traceability portal
    │   │   ├── [code]/          # Dynamic product page
    │   │   └── scanner/         # QR scanner page
    │   └── exporter/            # Exporter section
    │       ├── layout.tsx
    │       ├── page.tsx
    │       ├── batches/
    │       ├── compliance/
    │       └── reports/
    ├── components/              # React components
    │   ├── layout/              # Layout components
    │   │   ├── Header.tsx
    │   │   ├── Footer.tsx
    │   │   ├── Sidebar.tsx
    │   │   └── Navigation.tsx
    │   ├── ui/                  # UI components
    │   │   ├── Button.tsx
    │   │   ├── Card.tsx
    │   │   ├── Input.tsx
    │   │   ├── Modal.tsx
    │   │   └── ...
    │   ├── dashboard/           # Dashboard components
    │   │   ├── StatsCard.tsx
    │   │   ├── Chart.tsx
    │   │   ├── FarmTable.tsx
    │   │   └── ...
    │   ├── marketing/           # Marketing components
    │   │   ├── Hero.tsx
    │   │   ├── Features.tsx
    │   │   ├── Pricing.tsx
    │   │   └── Testimonials.tsx
    │   └── trace/               # Traceability components
    │       ├── ProductTimeline.tsx
    │       ├── QRScanner.tsx
    │       └── CertificateBadge.tsx
    └── utils/                   # Utility functions
        ├── api.ts               # API client
        ├── auth.ts              # Auth helpers
        ├── formatting.ts        # Data formatting
        └── validation.ts        # Zod schemas
```

## Installation & Setup

### Prerequisites

- Node.js 20.x or higher
- npm or pnpm package manager
- Git

### Install Dependencies

```bash
cd apps/web
npm install
```

### Environment Configuration

Create `.env.local` file in `apps/web/`:

```bash
# Kinde Auth Configuration
KINDE_CLIENT_ID=your-client-id
KINDE_CLIENT_SECRET=your-client-secret
KINDE_ISSUER_URL=https://your-domain.kinde.com
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:4000
NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:5000
NEXT_PUBLIC_TRACEABILITY_SERVICE_URL=http://localhost:3004

# Feature Flags
NEXT_PUBLIC_ENABLE_3D_GRAPHICS=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_BLOG=false

# External Services
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-maps-key
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

### Running the Application

#### Development Mode

```bash
npm run dev
```

Application available at `http://localhost:3000`

#### Production Build

```bash
# Build application
npm run build

# Start production server
npm start
```

#### Linting

```bash
npm run lint
```

## Core Features Deep Dive

### 1. Landing Page

**Hero Section:**
- Animated 3D background with Three.js
- Compelling headline and CTA
- Auto-playing demo video
- Scroll-triggered animations

**Features Section:**
- Grid layout with icon cards
- Hover animations
- Responsive design
- Feature highlights

**Testimonials:**
- Customer quotes
- Avatar images
- Company logos
- Carousel/slider

**Pricing:**
- Tier comparison table
- Feature checkmarks
- Monthly/annual toggle
- CTA buttons

### 2. Authentication

**Kinde Auth Integration:**
```typescript
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  
  if (!user) {
    return redirect('/api/auth/login');
  }
  
  return NextResponse.json({ user });
}
```

**Protected Routes:**
```typescript
// middleware.ts
import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';

export default withAuth({
  isReturnToCurrentPage: true,
  publicPaths: ['/', '/about', '/contact', '/trace/:path*']
});

export const config = {
  matcher: ['/dashboard/:path*', '/exporter/:path*']
};
```

### 3. Dashboard Pages

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
