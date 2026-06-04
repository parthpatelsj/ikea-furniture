# WebSpatial SDK Integration Confusion Log

## Setup / Installation

- The `llms-full.txt` doc lists `npm install @webspatial/react-sdk @webspatial/core-sdk`, but does not explain whether `@webspatial/core-sdk` is required directly or pulled in transitively as a peer dep. I ended up installing both because the doc says so, but the React SDK already lists it as a peer — would prefer one canonical install command.
- The doc shows two different ways to wire the JSX runtime (a `tsconfig.json` snippet and an `rsbuild.config.ts` snippet) but does **not** show the equivalent for `@vitejs/plugin-react`, which is what most React + Vite projects use. I had to guess that `react({ jsxImportSource: '@webspatial/react-sdk' })` was the right form. A Vite snippet next to the Rspack one would have been a one-line fix.
- `tsconfig.app.json` (the project-references file actually used to compile) is the file that needs `jsxImportSource`, not `tsconfig.json`. The doc just says "update tsconfig.json" without acknowledging that modern Vite/React templates split TS configs.
- It is not stated whether the SDK works at all in a plain browser with no WebSpatial runtime, or whether `<Model>` silently no-ops, throws, or shows an HTML fallback. There is also no mention of a polyfill path for development on a regular laptop, even though `initPolyfill` is exported. A sentence like "in non-XR browsers, `<Model>` renders an empty div — provide your own fallback" would unblock a lot of decisions.

## Model Component Usage

- The `<Model>` `src` prop is documented as taking a path to a GLB/GLTF, but the doc does not say:
  - whether the path is relative to the current document, the manifest scope, or the public root,
  - whether non-ASCII characters and spaces in filenames are supported (I renamed all of the `.glb` files to be safe),
  - whether a CORS or MIME-type configuration is required for self-hosted models.
- The `Model` declared type is `React.ForwardRefExoticComponent<Omit<{ ... }, ...>>` — the actual prop shape has to be reverse-engineered from the SDK's `.d.ts`. The docs page should list the supported props (`src`, `enable-xr`, `autoPlay`, `loop`, `onLoad`, `onError`, `style`, etc.) explicitly.
- The relationship between the `enable-xr` HTML attribute and the `Model` component is unclear. `Model` already implies a 3D container; do you still need `enable-xr` on it, or is it implicit? I added it everywhere just to be safe.
- The doc shows `<Model style={{ width: '400px', height: '400px' }} />`, but does not explain what fills that 2D box on a non-XR device, nor whether the model auto-fits, retains aspect ratio, or gets cropped.

## Spatial Interaction Behavior

- `onSpatialDrag` event fields differ between the docs and the typings:
  - The doc shows `event.delta`,
  - the typings expose `translationX`, `translationY`, `translationZ`.
  I wrote the code against the typings; the doc example would not compile.
- It is not clear whether the translation values are deltas-since-start or absolute-since-frame-start. I assumed since-start (cumulative) based on the field name `translationX`, and stored a base offset on `dragStart` to avoid cumulative drift. A single sentence in the docs would remove the guesswork.
- "Drag, move, reposition" is requested by the spec, but there is no documented API for actually *committing* a new world-space position to the element — the only documented mechanism is reading the event and applying my own CSS `transform`. It is unclear whether that CSS transform is interpreted as a world-space translation by the runtime or just a 2D layout transform.
- It is unclear whether spatial events bubble and whether they coexist with normal DOM `onClick`. I left a regular `<button onClick>` on the catalog card to launch the spatial window, but I do not know whether on a real visionOS device that click will fire from a pinch tap or only from a true `onSpatialTap`.

## Asset Loading

- `vite.config.ts` does nothing special for `.glb`. The doc never confirms whether GLBs in `public/` are the recommended layout. I picked `public/models/` so URLs are stable, but a "recommended asset layout" note would help.
- The original IKEA `.glb` filenames contained spaces, parentheses, and non-ASCII characters (`Å`, `Ö`). I had no way to tell whether the SDK URL-decodes these correctly, so I renamed the files to kebab-case product IDs. Documentation on file-name expectations would have saved that step.
- There is no documentation on what happens if the model fails to load: does `Model` fire `onError`, fall back to nothing, or throw? The `.d.ts` exposes an `onError` prop, but the docs page for `<Model>` does not mention it.

## App Deployment

- The doc shows a manifest example with `name`, `start_url`, `display`, and `icons`, but does **not** clearly document the `xr_main_scene` / `main_scene` / scene-related fields it later refers to. I added `xr_main_scene` based on the `XRMainSceneConfig` type in `core-sdk`, but the canonical key name is unverified.
- The doc says "Configure the start scene via the manifest's `main_scene` field or new scenes via `initScene` API" — the typings reference `XRMainSceneConfig` but I could not find a definitive example of how to declare the main scene in `app.webmanifest`. The shape is guessed.
- It is not documented how to run/test a WebSpatial app on a normal developer machine. The doc points to `webspatial-builder run --base=...` and the PICO simulator, but says nothing about what `npm run dev` looks like in a normal browser.
- `vercel.json` already exists in this project; the doc gives no guidance on whether the manifest needs special headers (e.g. `Content-Type: application/manifest+json`) for production deployment.

## Documentation Gaps

- No reference page lists every export of `@webspatial/react-sdk`. Discovery happens by reading `dist/default/index.d.ts`. A typed API index would be valuable.
- The signature of `initScene` in `llms-full.txt` is `initScene('sceneName', { type: 'volume', defaultSize: {...} })`, but the actual TypeScript signature is `initScene(name, callback, options?)` where the callback is `(pre) => SpatialSceneCreationOptions` and the scene type goes in `options.type`. The example in the docs does **not** match the implementation.
- `SpatialSceneType` values are documented as `'window' | 'volume'`. The `core-sdk` confirms this, but the doc also uses the term "Volume Type" which made me briefly search for `'Volumetric'` as a value.
- `worldAlignment` is documented with the value `'user'`, but the SDK's `WorldAlignmentValues` enum is `['adaptive', 'automatic', 'gravityAligned']`. `'user'` is not a valid value. The docs and the implementation disagree.
- The doc calls out a `<Reality>` + `<World>` pattern but does not explain when to prefer it over a bare `<Model>`. For a "show this single GLB" use case, the right choice is unclear.

## Bugs or Unexpected Behavior

- The example `convertCoordinate({ x: 100, y: 100 }, 'local', 'global')` in the docs takes `'local' | 'global'` strings, but the typings show `CoordinateConvertible = Window | SpatializedElementRef<any> | EntityRef | ModelRef` — i.e., the parameters are actual element refs, not strings. Following the doc verbatim would fail at compile time.
- `react/jsx-dev-runtime.d.ts` augments `react`'s `CSSProperties` and the global `CSSStyleDeclaration` with `enable-xr` style fields. This is a powerful side effect of just having the SDK installed; it would be helpful for the docs to call this out so users are not surprised to see new style keys appear globally.

## Suggestions for Framework Improvement

- Publish a Vite + React + TypeScript starter that mirrors the most common stack (the one you would actually meet on Vercel). The Rspack snippet is the only build-tool example today.
- Make `<Model>` degrade gracefully on non-XR browsers — either render an `<img>` from a `poster` prop, or render the `children` fallback. Right now an empty 3D container in a normal browser is indistinguishable from a broken asset path.
- Align the doc examples (`event.delta`, `convertCoordinate('local', 'global')`, `worldAlignment: 'user'`, `initScene(name, options)`) with the actual TypeScript signatures. Examples that fail `tsc` are worse than no examples.
- Add a small "Quick start: open a model in a new spatial window from a click" recipe — that one flow (catalog → spatial window) is what every spatial commerce app wants, and it currently has to be assembled from four separate doc sections.
- Document a minimal `app.webmanifest` for spatial apps — including the `xr_main_scene` / scene-config fields — with each field annotated.
- Provide a CLI flag or doc note for running the dev server in a regular browser with a polyfill, so engineers without a visionOS / PICO simulator can still iterate on layout.
