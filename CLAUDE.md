# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application for "Conexão Brigada" (Fire Brigade Connection), a platform to help users find and register volunteer fire brigades in Brazil. The app uses the App Router architecture and includes Google Maps integration for visualizing brigade locations.

## Development Commands

```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

Package manager: `npm` (per `package-lock.json`). There is no `engines` field pinning the Node version.

## Architecture

### Next.js App Router Structure

The application uses Next.js 15 App Router with the following structure:

- `src/app/page.js` - Root route (lives under `(public)/`) that renders the home page
- `src/app/layout.js` - Root layout: `<html>` / `<body>` + Auth0 `<Providers>`. Header/Footer are rendered by the `(public)` group, not here.
- `src/app/providers.js` - Auth0Provider wired for both public and admin routes. Forwards `audience` from `NEXT_PUBLIC_AUTH0_AUDIENCE` so admin writes can request an access token.
- `src/app/(public)/layout.js` - Renders `<Header/>` + `<Footer/>` for every public page. `(public)` is a route group and does not appear in URLs — `/home`, `/viewBrigadesPage`, `/FAQPage`, etc. keep their paths.
- `src/app/(public)/home/` - Main home page with brigade search and news feed
- `src/app/(public)/brigadesPage/` - Brigade profile pages
- `src/app/(public)/viewBrigadesPage/` - Brigade list/map viewer
- `src/app/(public)/viewCampaignsPage/` - Campaign list/viewer
- `src/app/(public)/contactPage/` - Contact form
- `src/app/(public)/FAQPage/` - FAQ page
- `src/app/(public)/protectPage/` - Auth0-protected route example
- `src/app/admin/` - Admin panel (login, redefinir-senha, brigadas, artigos, faqs, usuarios). Gated by `RequireAdmin`.

### Path Aliases

`jsconfig.json` defines `@/*` → `./src/*`. Use `@/app/...` for imports across the codebase rather than relative paths — this matches existing usage.

### Authentication

The app uses Auth0 for authentication:

- Auth0Provider is configured in `src/app/providers.js` and wraps `<html><body>` in `src/app/layout.js` so both public and admin routes have Auth0 context.
- Auth0 config is loaded from env vars via `src/app/config.js` (`NEXT_PUBLIC_AUTH0_DOMAIN`, `NEXT_PUBLIC_AUTH0_CLIENT_ID`, `NEXT_PUBLIC_AUTH0_AUDIENCE`).
- Protected routes use `withAuthenticationRequired` HOC (see `src/app/(public)/protectPage/page.js`). Admin routes use `RequireAdmin` (`src/app/admin/components/requireAdmin.js`), which layers an Auth0 role-claim check on top.
- Pages must use `"use client"` when accessing Auth0 hooks.
- Admin panel writes to `/api/*` require an access token — `src/app/admin/layout.js` registers a token provider (`src/lib/apiAuth.js`) that reads a token via `getAccessTokenSilently` for the audience configured above. The backend is expected to verify Auth0 tokens; see `Back-CSR-Fire-Brigades/src/middleware/auth.ts`.

### Google Maps Integration

- Uses `@vis.gl/react-google-maps` for map display
- GoogleMap component in `src/app/components/googleMap.js`
- API key stored in `.env.local` as `NEXT_PUBLIC_MAPS_API_KEY`
- Map ID stored as `NEXT_PUBLIC_MAP_ID`
- Geocoding utility in `src/app/test_components/prototype_location_converter.js` uses `@googlemaps/google-maps-services-js` and reads a separate key from `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — reuse this var rather than introducing a new one

### Shared Components

Reusable components are in `src/app/components/`:
- `header.js` - Main navigation header
- `footer.js` - Footer component
- `googleMap.js` - Google Maps integration
- `button.js`, `input.js`, `label.js`, `select.js` - Form components
- `table.js`, `tableRow.js` - Table components
- `loading.js` - Loading spinner
- `saveModal.js` - Save confirmation modal

### Page-Specific Components

Components specific to a page are colocated in that page's directory (e.g., `src/app/home/components/`).

### Utilities

- `src/app/validators/` - Input validators (email, phone, text, url, number, date)
- `src/app/formatters/` - Data formatters (phone formatter)
- `src/app/constants/` - Constant data (Brazilian states, cities, icons, FAQ questions)
- `src/lib/api.js` - API client (public GETs + authenticated writes with per-resource helpers). Reads a bearer token via `src/lib/apiAuth.js`.
- `src/lib/apiAuth.js` - Token provider bridge between Auth0's React context and the plain-JS API client.
- `src/lib/supabaseStorage.js` - Public-bucket image upload helper (dynamically imports `@supabase/supabase-js`).

### Styling

- Global styles in `src/app/globals.css`
- CSS Modules for component-specific styles (`.module.css` files colocated with components)
- Primary font: Montserrat (weight 500), loaded via Next.js font optimization
- Secondary font: Poppins, loaded from Google Fonts

## Important Conventions

### Client Components

Most pages are client components (`"use client"`) — primarily because they consume Auth0 hooks. When adding a new page that uses `useAuth0`, hooks, or browser APIs, mark it `"use client"`.

### Environment Variables

Required environment variables in `.env.local`:
- `NEXT_PUBLIC_API_BASE_URL` - Base URL of `Back-CSR-Fire-Brigades` (default `http://localhost:4000`)
- `NEXT_PUBLIC_MAPS_API_KEY` - Google Maps API key (for `@vis.gl/react-google-maps` display)
- `NEXT_PUBLIC_MAP_ID` - Google Maps Map ID
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Geocoding API key used by `prototype_location_converter.js`
- `NEXT_PUBLIC_AUTH0_DOMAIN` - Auth0 tenant domain (e.g. `dev-xxx.us.auth0.com`)
- `NEXT_PUBLIC_AUTH0_CLIENT_ID` - Auth0 SPA client id
- `NEXT_PUBLIC_AUTH0_AUDIENCE` - Auth0 API audience — required for admin writes so the SDK issues an access token accepted by the backend
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL, only needed for the admin image-upload flow (Storage)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key, only needed for the admin image-upload flow

Additional Auth0 setup for admin gating: add an Auth0 Action that puts the user's roles on the ID/access token under the namespaced claim `https://conexaobrigada.com/roles` (values `admin` / `super_admin`). Both the frontend `RequireAdmin` and the backend admin middleware are expected to read this claim.

Note: `.env.local` contains actual credentials and should not be committed, but currently exists in the repository.

### Testing

No test framework is configured — `package.json` declares no Jest, Vitest, Playwright, or Cypress, and there are no test files. Before adding tests, ask the user which framework to adopt.

### Brazilian Context

The application is designed for Brazilian users:
- UI text is in Portuguese
- Address validation uses Brazilian format
- State/city data is Brazilian-specific (see `src/app/constants/cidadesPorEstado.js` and `estados.js`)
- Google Maps bounds are set to Brazil in geocoding utilities
