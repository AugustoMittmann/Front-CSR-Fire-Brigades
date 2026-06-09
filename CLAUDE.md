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

- `src/app/page.js` - Root route that renders the home page
- `src/app/layout.js` - Root layout with Auth0Provider wrapper and global fonts
- `src/app/home/` - Main home page with brigade search and news feed
- `src/app/brigadesPage/` - Brigade profile pages
- `src/app/viewBrigadesPage/` - Brigade list/map viewer
- `src/app/viewCampaignsPage/` - Campaign list/viewer
- `src/app/contactPage/` - Contact form
- `src/app/FAQPage/` - FAQ page
- `src/app/frequentQuestionsPage/` - Alternative FAQ-style page (separate route from `FAQPage/`)
- `src/app/protectPage/` - Auth0-protected route example
- `src/app/test_components/` - Testing/prototype components

### Path Aliases

`jsconfig.json` defines `@/*` → `./src/*`. Use `@/app/...` for imports across the codebase rather than relative paths — this matches existing usage.

### Authentication

The app uses Auth0 for authentication:

- Auth0Provider is configured in `src/app/home/providers.js` and wraps the entire app in `layout.js`
- Auth0 config is stored in `src/app/auth_config.json` (domain, clientId) — note this file is **committed** with real dev-tenant values, so editing them changes authentication behavior
- Protected routes use `withAuthenticationRequired` HOC (see `src/app/protectPage/page.js`)
- Pages must use `"use client"` when accessing Auth0 hooks

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

- `src/app/validators/` - Input validators (email, phone, text)
- `src/app/formatters/` - Data formatters (phone formatter)
- `src/app/constants/` - Constant data (Brazilian states, cities, icons, FAQ questions)

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
- `NEXT_PUBLIC_MAPS_API_KEY` - Google Maps API key (for `@vis.gl/react-google-maps` display)
- `NEXT_PUBLIC_MAP_ID` - Google Maps Map ID
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Geocoding API key used by `prototype_location_converter.js`

Note: `.env.local` contains actual credentials and should not be committed, but currently exists in the repository.

### Testing

No test framework is configured — `package.json` declares no Jest, Vitest, Playwright, or Cypress, and there are no test files. Before adding tests, ask the user which framework to adopt.

### Brazilian Context

The application is designed for Brazilian users:
- UI text is in Portuguese
- Address validation uses Brazilian format
- State/city data is Brazilian-specific (see `src/app/constants/cidadesPorEstado.js` and `estados.js`)
- Google Maps bounds are set to Brazil in geocoding utilities
