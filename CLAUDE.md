# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 15 App Router application for "Conexão Brigada" — a platform to find and register volunteer fire brigades in Brazil. All UI text is in Portuguese. No backend exists yet; data is static/hardcoded.

## Development Commands

```bash
npm run dev      # Dev server on http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint via next lint
```

There is no test framework configured in this project.

## Architecture

### Rendering & Provider Chain

The root layout (`src/app/layout.js`) renders Header and Footer on every page, and wraps children in `<Providers>`. The `<Providers>` component (`src/app/home/providers.js`) is a `"use client"` boundary that sets up Auth0Provider. This means:

- The root layout is a **Server Component** (Header/Footer are server-rendered)
- All page content below `<Providers>` has access to Auth0 context
- `src/app/page.js` simply re-exports the `Home` component from `src/app/home/page.js`

### Auth0 Setup

- Config lives in `src/app/auth_config.json` (domain + clientId), read via `src/app/config.js` → `getConfig()`
- Auth0Provider's `redirect_uri` is set dynamically to `window.location.href`
- Protected routes use `withAuthenticationRequired` HOC (example in `src/app/protectPage/`)

### Google Maps

- `@vis.gl/react-google-maps` for map rendering (`src/app/components/googleMap.js`)
- `@googlemaps/google-maps-services-js` for geocoding (`src/app/test_components/prototype_location_converter.js`)
- Requires `NEXT_PUBLIC_MAPS_API_KEY` and `NEXT_PUBLIC_MAP_ID` in `.env.local`

### Icon System

All SVG icons are imported statically in `src/app/constants/icons.js` as a central registry (object with `{value, alt}` entries). Components access icons via `Icons.iconName.value` for the source and `Icons.iconName.alt` for alt text, used with Next.js `<Image>`.

### Component Patterns

- **Shared components** in `src/app/components/` — form primitives (`Input`, `Select`, `Button`, `Label`), `Table`/`TableRow`, `Loading`, `SaveModal`
- **Page-specific components** colocated in `src/app/<pageName>/components/`
- `Button` exports a `ButtonStyle` enum for variant styling
- Form pages (e.g., `contactPage`) use `document.getElementsByName()` for form data collection — no form library

### Constants & Validators

- `src/app/constants/` — Brazilian states (`estados.js`), cities by state (`cidadesPorEstado.js`), FAQ questions, contact reasons, icons
- `src/app/validators/` — email, phone, text validators
- `src/app/formatters/` — phone number formatter

### Styling

- CSS Modules (`.module.css` colocated with components) for component styles
- Global styles in `src/app/globals.css`
- Some pages also use plain `.css` imports (e.g., `contactPage/css.css`)
- Many pages use extensive inline styles with hardcoded values
- Fonts: Montserrat (weight 500, via `next/font`), Poppins (via Google Fonts `<link>` in layout)
- Brand colors: `#39542D` (dark green — primary text), `#DDA15E` (amber — accents), white

## Important Conventions

- Almost all pages are client components (`"use client"`) due to hooks and Auth0 context
- Import alias: `@/*` maps to `./src/*` (configured in `jsconfig.json`)
- Navigation uses Next.js `Link` and `useRouter` from `next/navigation`
- `prop-types` is available but lightly used
- `reactjs-popup` is used for popup/modal UI (e.g., filter popups)
