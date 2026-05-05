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
models/        Sample .glb 3D models (not bundled by default)
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
