# IKEA Furniture

A React + TypeScript single-page storefront for browsing IKEA-style furniture, built with Vite, Tailwind CSS, Zustand, and React Router.

## Tech stack

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [React Router](https://reactrouter.com/) (`createBrowserRouter`) for routing
- [Zustand](https://github.com/pmndrs/zustand) for state management
- [Lucide](https://lucide.dev/) icons

## Getting started

Requires Node.js 18+ and npm.

```bash
npm install
npm run dev
```

The dev server runs at http://localhost:5173.

## Scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start the Vite dev server            |
| `npm run build`     | Type-check and produce a prod build  |
| `npm run preview`   | Preview the production build locally |
| `npm run typecheck` | Run TypeScript without emitting      |
| `npm run lint`      | Run ESLint                           |

## WebSpatial (3D / spatial catalog)

The catalog is integrated with [WebSpatial](https://webspatial.dev/) so it runs
as a spatial app inside a WebSpatial Runtime (e.g. Apple Vision Pro via
WebSpatial Builder, or PICO OS 6), while remaining a normal 2D website
everywhere else.

- JSX is routed through the SDK runtime via `jsxImportSource:
  '@webspatial/react-sdk'` (set in both `tsconfig.app.json` and the Vite React
  plugin).
- Each catalog card renders its product's `models/*.glb` asset with the
  WebSpatial `<Model>` component (`src/components/product/ProductModel.tsx`).
  On non-spatial browsers it falls back to the original 2D product image.
- Tapping a model opens it in its own draggable `volume` Spatial Scene
  (`/spatial/:productId`, see `src/pages/SpatialView.tsx`), where it can be
  moved, repositioned and pinch-scaled.

To preview as a packaged spatial app (requires `@webspatial/builder`,
`@webspatial/platform-visionos` and Xcode):

```bash
npm run dev        # serve the site
npm run spatial    # webspatial-builder run --base=http://localhost:5173/
```

See [`confusion.md`](./confusion.md) for integration notes and friction points.

## Project structure

```
src/
  components/   UI and layout components
  data/         Static product / category data
  lib/          Utilities
  pages/        Route components (Home, Category, Product, Cart, ...)
  store/        Zustand stores
  types/        Shared TypeScript types
  router.tsx    Route definitions
  main.tsx      App entrypoint
public/         Static assets served at the root
models/        Product .glb 3D models (bundled via import.meta.glob)
```

## Deploying to Vercel

This repo is preconfigured for Vercel.

1. Push the repo to GitHub / GitLab / Bitbucket.
2. In the Vercel dashboard click **Add New… → Project** and import the repository.
3. Accept the auto-detected framework preset (**Vite**). The defaults are correct:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
4. Click **Deploy**.

`vercel.json` rewrites every path to `/` so client-side routes (`/product/:id`, `/cart`, …) resolve to `index.html` on direct navigation and refresh.

### Deploying from the CLI

```bash
npm i -g vercel
vercel        # preview deployment
vercel --prod # production deployment
```
