Frontend Dev Assignment — Worker Directory (Next.js + TypeScript + Tailwind)

A modern, responsive worker directory built with Next.js 15, React 19, TypeScript, Tailwind CSS v4, and Zustand.
Users can browse workers, filter/sort/search, view a minimal worker detail page (image, name, service, price + “Contact me”), and see a service overview. A small 3D orb demo (three.js) is optionally included to showcase interactive UI polish.

 Features

Browse & search

Search by name/service/location

Filter by service, max price

Sort (name A→Z/Z→A, price low→high/high→low; rating supported if data present)

Worker detail page

On click, open /workers/[id] showing image, name, service, price, Contact me

Separate “Contact me” page /workers/[id]/contact (stub UI you can wire later)

Service overview (/api/services)

Aggregated stats (count & price range per service)

State management

Lightweight store with Zustand

Performance

Debounced/deferred search work with useDeferredValue

Dynamic import for non-critical components

Styling

Tailwind CSS v4 utilities and responsive design

3D Orb demo

Tiny three.js component; runs smoothly and cleans up on unmount

Testing

Jest + @testing-library: unit tests for Filters and WorkerCard

 Tech Stack

Next.js 15.x

React 19.x + TypeScript

Tailwind CSS v4

Zustand for app state

Jest + @testing-library/react for tests

three.js (optional orb)

 Project Structure
.
├─ workers.json                  # Seed data
├─ next.config.mjs               # Next config 
├─ jest.config.mjs               # Jest config 
├─ jest.setup.ts                 # Testing Library 
├─ src/
│  └─ app/
│     ├─ globals.css             # Tailwind v4 entry
│     ├─ layout.tsx              # App layout
│     ├─ page.tsx                # Home: list + filters + stats
│     ├─ components/
│     │  ├─ Header.tsx
│     │  ├─ Filters.tsx
│     │  ├─ WorkerCard.tsx
│     │  ├─ ServiceStats.tsx
│     │  └─ Orb.tsx              # (optional) 3D orb component
│     ├─ hooks/
│     │  └─ useWorkersStore.ts   # Zustand store
│     ├─ types/
│     │  └─ workers.ts           # `Worker` type
│     ├─ lib/
│     │  └─ workers.ts           # read one worker by id
│     ├─ workers/
│     │  ├─ [id]/page.tsx        # Worker detail 
│     │  └─ [id]/contact/page.tsx# Contact page 
│     └─ api/
│        ├─ workers/route.ts     # GET list 
│        ├─ workers/[id]/route.ts# GET single 
│        └─ services/route.ts    # GET aggregated service stats
└─ __tests__/
   ├─ Filters.test.tsx
   └─ WorkerCard.test.tsx

 Getting Started
Prerequisites

Node.js 18+

npm or pnpm/yarn

1) Install
npm install

2) Data: workers.json

At the repo root, provide an array of worker objects:

[
  {
    "id": "1",
    "name": "Ravi Kumar",
    "service": "Plumber",
    "pricePerDay": 1200,
    "rating": 4.5,
    "image": "https://randomuser.me/api/portraits/men/32.jpg",
    "location": "Delhi"
  },
  {
    "id": "2",
    "name": "Asha",
    "service": "Electrician",
    "pricePerDay": 1500,
    "rating": 4.7,
    "image": "https://randomuser.me/api/portraits/women/31.jpg",
    "location": "Pune"
  }
]


Only the detail page requires: image, name, service, pricePerDay.
Rating/location are optional; if present they enhance filters/sorting.

3) Next images config (Next 15)

images.domains is deprecated. Use remotePatterns:

// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'randomuser.me', pathname: '/api/portraits/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' }
    ],
    // or: unoptimized: true
  }
}
export default nextConfig

4) Run the dev server
npm run dev


Open http://localhost:3000

 Usage
Search by typing in the top filters area (debounced for smooth typing).

Filter by service or price slider.

Sort by name/price (rating options appear if your JSON has ratings).

Click a worker card → goes to /workers/[id] showing:

image, name, service, price, Contact me button

Service overview at bottom summarizes counts & price stats per service.

Tests

Config: jest.config.mjs, jest.setup.ts (mocks next/image)

Run tests:

npm test


Suites:

Filters.test.tsx – renders inputs and dispatches store setters

WorkerCard.test.tsx – minimal card: image, name, service, price, link

If you see a VS Code terminal banner like
“jest v30.x is not yet supported in the Community edition of Console Ninja”,
it’s from an extension and does not block the test run. You can disable that extension or ignore the message.

 3D Orb Demo

File: src/app/components/Orb.tsx

Import without SSR and mount once (e.g. as corner widget):

import dynamic from 'next/dynamic'
const Orb = dynamic(() => import('./components/Orb'), { ssr: false })

// …
<Orb className="fixed bottom-4 right-4 z-50 w-28 h-28" />


Or full-screen background (non-blocking):

<Orb className="fixed inset-0 -z-10" />


If TypeScript complains about three types:

npm uninstall @types/three
npm i three@latest
# restart dev server and TS server

 Developer Notes
State & Performance

Zustand store powers filters and list preferences.

useDeferredValue keeps the UI responsive while filtering.

Dynamic import for ServiceStats and Orb to keep initial page fast.

Accessibility

Focus-visible outlines on interactive elements

Meaningful alt text for images

ARIA labels on links/cards

API Endpoints

GET /api/services → aggregated stats from workers.json

GET /api/workers/[id] → single worker (if route created)

POST /api/contact → stub handler (if created)

In dev, routes are non-cached using no-store.

   

 Scripts
{
  "dev": "next dev --turbopack",
  "build": "next build --turbopack",
  "start": "next start",
  "lint": "eslint",
  "test": "jest",
  "test:watch": "jest --watch"
}



 Credits

UI built with Tailwind v4 utilities.

Data model and flows aligned to the assignment brief.

 three.js orb to demonstrate interactive visuals.
