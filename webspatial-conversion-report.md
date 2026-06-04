# Converting an existing Vite + React storefront to WebSpatial — findings

- I converted an existing Vite + React + TypeScript furniture storefront,
  `ikea-furniture.vercel.app`, into a WebSpatial app with the help of AI.
- **Goal:** keep the normal 2D storefront working, then let users open/interact
  with furniture models spatially.
- Multiple AI coding agents attempted the conversion. The focus here is not to
  compare models, but the *commonality* of where attempts struggled.
- The SDK had enough primitives to build something, but the conversion exposed
  several docs, DX, and behavior gaps. Most "it doesn't work" moments turned out
  to be **undocumented behavior** or **a missing paved road**, not missing APIs.

> Accuracy note: this report is rewritten from the actual code and the installed
> SDK (`@webspatial/react-sdk` / `@webspatial/core-sdk` **1.7.0**). Several claims
> from earlier drafts were corrected after reading the shipped `dist` types and
> source. The lower-level, chronological dev log lives in `confusion.md`.

## Existing app / web stack

- React 18 + TypeScript + Vite 5 (`vite@5.4`)
- `react-router-dom` for routing (`createBrowserRouter`)
- `zustand` for state (cart + wishlist)
- Tailwind CSS for styling
- `lucide-react` for icons
- All product data is static (`src/data/products.ts`, `categories.ts`)
- It is a PWA: there is a `manifest.webmanifest` **and a service worker**
  (`public/sw.js`). This detail mattered a lot — see issue 3.

A conventional 2D IKEA-style storefront: home, category, product, cart,
wishlist, search.

## High-level summary

The hardest parts were **not** basic React integration. They were:

1. Vite setup (TS JSX config vs. the actual JSX transform)
2. WebSpatial viewport behavior (the giant square viewport)
3. product-click / scene-opening behavior (and a PWA cache that hid the fix)
4. local model-asset handling in Vite
5. spatial drag/scale/rotate semantics
6. knowing which APIs are *intended* vs *incidental/internal*

AI agents repeatedly had to read the shipped TypeScript definitions or the
compiled SDK source to infer behavior, because the docs were incomplete or
disagreed with the types. Where one agent could not stabilize spatial
interaction and another could, the difference was inference effort — which
suggests the use case is *supported* but the intended pattern is not discoverable
from docs.

## What worked

- Basic React/Vite conversion was possible.
- `<Model>` integrated into the product flow, including **local `.glb`** assets.
- A separate spatial-model route could be created and opened as a `volume` scene.
- Scene creation worked once the correct `initScene` signature was inferred.
- Spatial drag + pinch-scale worked, but only after reverse-engineering the
  event payloads and handling transform persistence manually.
- In-window product navigation works — once the PWA service worker stopped
  serving a stale bundle (issue 3).

## Main issues found

### 1. Vite setup is under-documented

- The docs say to set `jsxImportSource` in the TypeScript config.
- In a typical Vite app, `tsc` only **type-checks**; the actual JSX→JS transform
  is done by `@vitejs/plugin-react` (esbuild/Babel). So setting `jsxImportSource`
  only in `tsconfig` **compiles but does not activate** WebSpatial JSX behavior —
  a silent no-op.
- The working setup required configuring the React plugin too:
  `react({ jsxImportSource: '@webspatial/react-sdk' })`, **and** the tsconfig
  field (so editor/`tsc` types match).
- There is a published `@webspatial/vite-plugin`, but it is **not mentioned in
  the AI-facing docs** at all. Concrete blocker: `@webspatial/vite-plugin@1.0.1`
  declares a peer dependency of **`vite >= 6`**, which conflicts with this app's
  `vite@5.4` (`npm install` errors with `ERESOLVE`). So on an existing Vite 5 app
  you must either upgrade Vite or skip the plugin. We skipped it and used the
  React-plugin `jsxImportSource` route.
- `XR_ENV` (used by the real toolchain/starter templates to switch spatial
  builds) does not appear anywhere in the docs.

**Action items**
- Add an explicit "Existing Vite + React + TS app" setup guide.
- Explain the difference between TS JSX config and the Vite JSX *transform*
  config, and that tsconfig alone is a silent no-op under Vite.
- Document `@webspatial/vite-plugin` and provide a **Vite version compatibility
  matrix** (e.g. plugin 1.0.1 → Vite ≥ 6).
- Provide starter `package.json` scripts, including any `XR_ENV` usage.

### 2. WebSpatial viewport behavior surprised the app

- In a normal browser the storefront looked correct.
- In WebSpatial mode it appeared **extremely zoomed out** — a small centered page
  inside a large white surface.
- Debugging showed WebSpatial gives the page a very large square viewport
  (~`2700 × 2700` CSS px, DPR 2). The responsive layout interpreted that as an
  ultra-wide desktop and capped content at its max width, leaving huge margins.
- This was **not** a missing viewport meta tag or a manifest fetch problem.

What actually fixed it (in order of "intended" → "what worked here"):

- **Intended/build-time:** set the start-scene size in the manifest via
  `xr_main_scene` (and `xr_spatial_scene` for runtime-opened scenes). Important
  details that are undocumented and were only discoverable from the
  `PWAManifest`/`XRSceneSize` types and the SDK source:
  - the key is snake_case **`default_size`**, not `defaultSize`. A camelCase key
    is silently ignored. (Confusingly, the *JS* `initScene` API uses camelCase
    `defaultSize` — the two config surfaces disagree on casing.)
  - `xr_main_scene` is processed at **WebSpatial Builder build time**, so it only
    takes effect after repackaging — not in a plain `vite build` web deploy.
  - window scenes take **physical units (meters)**, e.g. `"2.2m"`; px is not
    honored for the main window scene.
- **What actually fixed it in the deployed web flow:** a runtime CSS adaptation.
  We detect XR, flag `html.xr-mode`, and apply `zoom` to the document root so the
  UI renders at a comfortable apparent size. `zoom: 1.8` was too low; `zoom: 2.2`
  looked right. (Note: the natural-looking selector `.xr-mode html` is wrong —
  `<html>` is the root, nothing contains it — the correct selector is
  `html.xr-mode`.)

So there are two levers (build-time scene size vs. runtime CSS), they can
double-compensate, and neither is documented for this scenario.

**Action items**
- Document the expected viewport dimensions/DPR in WebSpatial mode.
- Explain how existing responsive apps should adapt to large XR viewports, and
  whether the recommendation is to fill the viewport, constrain to a desktop-size
  shell, or use a CSS zoom/scale.
- Document `xr_main_scene` / `xr_spatial_scene`, the `default_size` (snake_case)
  key, meters-vs-px rules, and that `xr_main_scene` is build-time only.
- Provide a recommended "WebSpatial app shell" pattern.

### 3. Product clicks opened a new spatial window — and a PWA cache hid the fix

This one had **two layers**, and conflating them wasted the most time.

**Layer A — the initial implementation choice.** The first version opened a
product with:

```ts
window.open(`/spatial/${product.id}`, sceneName); // named → new spatial scene
```

In WebSpatial, `window.open(url, name)` creates/focuses a **named spatial
scene/window**. That is expected from the code, not a WebSpatial bug — but it was
the wrong default UX. The desired default is in-window product navigation, with a
separate spatial window behind an explicit action.

Why this was *hard to get right*:
- The documented way to "open content" is `window.open(url, sceneName)` /
  `initScene` — the docs steer you toward **multi-scene**. There is no documented
  pattern for "navigate within the current scene," and it is not stated that a
  plain `<a>` / client-side router (history `pushState`) stays in-window while a
  `target`/named `window.open` spawns a scene. We confirmed this only by reading
  the SDK source: `handleATag` opens a new scene **only** when an anchor has a
  `target` other than `_self`; otherwise navigation proceeds normally.
- Wiring ordinary navigation onto a `<Model>` is undocumented. `<Model>` is a
  **portaled** spatialized element, so it's unclear whether to use `onClick`,
  `onSpatialTap`, wrap it in an `<a>`, or call the router's `navigate`. We landed
  on: render the model as the interactive element and call `navigate(to)` from
  both `onClick` and `onSpatialTap` (no nested anchor around the portaled child).

**Layer B — the fix appeared not to work because of the service worker.** Even
after the code navigated in-window, clicking a product *still* opened a new
window in testing. Root cause: the app's service worker (`public/sw.js`) used a
**cache-first** strategy with a **never-bumped cache name**. It cached `/` and
`/index.html` on first load and always returned the cached copy, so after each
redeploy the **old `index.html` → old hashed JS bundle** kept running — i.e. the
old catalog that called `window.open`. The fix only took effect after switching
navigations to **network-first** and bumping the cache version.

This is a generic PWA pitfall, but WebSpatial **requires** a PWA/manifest, so
many WebSpatial apps will ship a service worker and hit exactly this "my fix
deployed but the app didn't change" trap. It made a correct code change look like
a WebSpatial behavior.

**Action items**
- State clearly that `window.open(url, sceneName)` and `target="name"` create/
  reuse a **named spatial scene**, while plain `<a>` / client-side routing stays
  in the current scene.
- Provide three side-by-side examples: same-window product navigation; an in-page
  model viewer; an explicit separate spatial scene.
- Add a PWA/service-worker note for WebSpatial apps: recommend network-first (or
  stale-while-revalidate) for navigations so deploys aren't masked by a
  cache-first service worker. This caveat is currently missing and bites hard.

### 4. `initScene` docs are inconsistent with the shipped types

- Docs show the scene `type` returned **inside the callback's config object**.
- The shipped signature is `initScene(name, callback, options?)`, where scene
  `type` belongs in the **third `options` argument**; `SpatialSceneCreationOptions`
  (the callback's return type) has no `type` field. Copy-pasting the doc example
  is a TypeScript error.

**Action items**
- Verify `initScene` docs against the current SDK and fix the example.
- Type-check docs examples in CI; version docs so old examples don't conflict.

### 5. `<Model>` docs are not complete enough for a real catalog

- We used local `.glb` furniture models. Docs examples lean on `.usdz`, creating
  uncertainty about GLB support per platform. (GLB *bundled and built* fine here;
  on-device rendering per platform remains unverified.)
- The shipped types expose more than the docs list. From `dist`:
  `src`, `poster`, `autoPlay`, `loop`, `loading`, `onLoad`, `onError`, plus the
  ref API `currentSrc`, `ready` (a Promise), and `entityTransform`
  (a writable `DOMMatrixReadOnly`). The docs' attribute list only mentions `src`
  + lifecycle events, so `poster`/`loading`/etc. were found by reading types.
- Fallback behavior outside XR is not clearly specified: `<Model>` falls back to
  the web-standard `<model>` element, which most browsers don't support, so we
  supplied a `poster` and a separate 2D image path.

**Action items**
- Publish a complete `<Model>` prop/ref reference generated from shipped types.
- Add a model-format support matrix (USDZ / GLB / GLTF × visionOS / PICO /
  browser fallback), and state whether WebSpatial converts formats or expects
  app-provided compatible assets.
- Add loading/error/fallback examples for catalogs.

### 6. Local model-asset handling in Vite is unclear

- Filenames contained spaces, punctuation, and non-ASCII characters (`Å`, `Ä`,
  `Ö`). Candidate approaches considered: `public/models/...`,
  `new URL(..., import.meta.url)`, and `import.meta.glob(..., { query: '?url' })`.
- What worked here: the models live in a root `models/` folder and are bundled
  with `import.meta.glob('/models/*.glb', { eager: true, query: '?url', import:
  'default' })`, which yields content-hashed URLs and sidesteps the awkward
  filenames. This required adding `vite/client` types (`src/vite-env.d.ts`) for
  `import.meta.glob` to type-check — unrelated to WebSpatial but a necessary step
  the asset approach forces.

**Action items**
- Add Vite-specific model-asset examples; say whether models belong in `public/`
  or should be bundled by Vite.
- Document filename encoding, MIME type, and CORS expectations.
- Include static-host notes (e.g. Vercel) for `.glb` / `.gltf` / `.usdz`.

### 7. Spatial-interaction semantics are under-documented

Reverse-engineered from the SDK types/source (`@webspatial/react-sdk` 1.7.0):

- `<Model>` accepts `onSpatialTap`, `onSpatialDragStart`, `onSpatialDrag`,
  `onSpatialDragEnd`, `onSpatialRotate(End)`, `onSpatialMagnify(End)`.
- `onSpatialDrag` exposes `translationX/Y/Z`, **cumulative from the start of the
  current gesture** (not per-frame deltas).
- `onSpatialDragEnd` carries **no final translation** (empty detail), so to
  persist a resting position you must cache the last `onSpatialDrag` values.
- `onSpatialMagnify` exposes a scalar `magnification`; `onSpatialRotate` exposes
  a `quaternion`.
- **Units/coordinate space are unspecified** for `<Model>` drag (px vs meters vs
  scene units). We applied translation as px on the 2D plane plus `--xr-back` for
  depth; calibration is a guess.
- We implemented drag (move/reposition) + magnify (scale) and **skipped
  rotation**, because turning a `quaternion` into a CSS transform (`matrix3d`) is
  left entirely to the developer with no helper.

**Action items**
- Document each gesture's payload precisely: units, coordinate space, cumulative
  vs frame-delta, and whether the end event carries final values.
- Provide official "drag and persist", "magnify and persist", "rotate and
  persist" examples.
- Ship helpers: quaternion→matrix, compose-transform, apply-gesture-to-
  `entityTransform`.

### 8. Too many overlapping ways to "move" something

The conversion surfaced several layers with no guidance on which to use:

- CSS `transform`
- spatial CSS custom properties (`--xr-depth`, `--xr-back`)
- the `<Model>` ref's writable `entityTransform` (a `DOMMatrix`)
- OS-level scene movement (grab a `window`/`volume` scene)
- moving an entire `volume` scene vs. dragging the `<Model>` inside it

For "place furniture" we used a `volume` scene (OS-level grab/move) plus the
model's own `onSpatialDrag` → CSS transform/`--xr-back`. Whether that is the
intended combination is unclear, and it's ambiguous whether OS scene-drag and
element drag interact or conflict.

**Action items**
- Add a table mapping each goal (move a 2D card / a spatial panel / a 3D model /
  a whole scene) to the recommended API, plus a "furniture placement" recipe.

### 9. Graceful fallback needs clearer guidance

- Detection options were ambiguous: `typeof HTMLModelElement`, `supports('Model')`,
  or some other capability API. We standardized on the SDK's public probe
  `WebSpatialRuntime.supports('Model')` and recommend it over DOM sniffing.
- It's unclear what `<Model>` renders outside a WebSpatial runtime (poster? empty
  element? nothing?), so we kept an explicit 2D image fallback.

**Action items**
- Recommend the official capability-detection API explicitly.
- Document `<Model>` fallback behavior outside the runtime.
- Provide a normal-browser fallback recipe (product image/poster, disabled
  spatial controls, optional "open in WebSpatial" affordance).

### 10. A canonical spatial-commerce example is missing

Every attempt converged on the same missing reference:
existing catalog → click furniture → view model → drag/scale/rotate spatially →
keep a normal-browser fallback.

**Action item:** ship an official, type-checked example, e.g.
`examples/vite-react-spatial-storefront`, covering: Vite + React + TS setup,
local model assets, product grid, selected-product viewer, same-window
navigation, an explicit separate spatial window, `<Model>` loading/error/
fallback, drag/magnify/rotate with transform persistence, the XR viewport layout
adaptation, **a WebSpatial-safe service-worker strategy**, and static-deploy
notes.

## Bug classification

**Actual app / integration bugs (not WebSpatial runtime bugs)**
- Default product click opened a new spatial window. Cause: AI used named
  `window.open`. Fixed by navigating in-window and gating the spatial window
  behind an explicit action.
- **Service worker served a stale bundle** (cache-first, never-bumped cache),
  which made the navigation fix look ineffective after deploy. Fixed with
  network-first navigations + cache version bump.
- Some early layout choices were AI-generated and not ideal for the target UX.

**WebSpatial docs / DX issues**
- Vite setup ambiguity; missing Vite-plugin guidance + version matrix.
- Unclear large-viewport expectations and adaptation guidance.
- Incomplete `<Model>` reference; missing model-format matrix.
- Unclear local-asset handling in Vite.
- Under-documented spatial-interaction semantics (units, persistence, rotation).
- `initScene` docs/type mismatch; `default_size` vs `defaultSize` casing split.
- Missing canonical spatial-commerce example.

**Possible runtime / product-design question**
- The ~`2700 × 2700` viewport may be intentional, but existing responsive apps
  need clear guidance. If intended, document it; if not, revisit default window
  sizing.

## Recommended priority

**P0** — Vite setup docs; `initScene` docs/types; document
`window.open(url, name)` scene behavior + PWA service-worker caveat; document the
viewport behavior; define spatial gesture units and transform semantics.

**P1** — complete `<Model>` docs; model-format/platform matrix; Vite local-asset
guidance; the official spatial-commerce example.

**P2** — transform/quaternion helpers; static-deploy notes; package/registry
troubleshooting; browser-fallback recipes.

## Final takeaway

The WebSpatial SDK can support an IKEA-style spatial storefront, but the intended
path is not yet obvious enough for humans or AI agents. The biggest gap is not
API surface area — it is a **missing paved road** for:

> existing Vite React app → local 3D assets → product catalog → spatial product
> viewer → drag/scale/rotate → normal-browser fallback.

A single official, type-checked Vite + React spatial-storefront example — plus a
short note that a cache-first service worker will mask your changes — would have
prevented most of the confusion in this conversion.
