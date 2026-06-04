# WebSpatial SDK Integration Confusion Log

Notes captured while integrating `@webspatial/react-sdk` (v1.7.0) into this
Vite + React + TypeScript storefront. Reference docs: `https://webspatial.dev/llms-full.txt`.

## Setup / Installation

- **The docs say "just set `jsxImportSource` in `tsconfig.json`" — but for a Vite
  project that alone does nothing.** `tsc` only type-checks here (`build` is
  `tsc -b && vite build`, with `noEmit`). The actual JSX→JS transform is done by
  `@vitejs/plugin-react` (esbuild/Babel), which does **not** read
  `tsconfig`'s `jsxImportSource`. I had to pass it explicitly:
  `react({ jsxImportSource: '@webspatial/react-sdk' })`. The docs never mention
  this, so following them verbatim yields a silently inert integration.
- **There is a published `@webspatial/vite-plugin` (v1.0.1) that
  `llms-full.txt` never references.** That strongly implies the recommended Vite
  setup is undocumented / out of date in the LLM docs.
- **`@webspatial/vite-plugin@1.0.1` has a peer dependency `vite@>=6.0.0`**, which
  conflicts with this project's `vite@^5.4.10`. Adopting the plugin would force a
  Vite major upgrade. No version/peer-dependency matrix is documented, so I chose
  the documented `jsxImportSource` route (via the React plugin) and skipped the
  Vite plugin.
- **`XR_ENV` / `XR_ENV=avp` is absent from the docs.** The real
  `@webspatial/starter` templates and toolchain switch spatial builds with this
  env var, but `llms-full.txt` doesn't document it or the corresponding
  `package.json` scripts.

## Model Component Usage

- **Format ambiguity (USDZ vs glb).** Every docs example uses `.usdz`
  (`vehicle.usdz`, `model.usdz`). This project ships `.glb` assets. The
  underlying WebKit `<model>` element historically prefers USDZ on visionOS, and
  the docs never state which formats `<Model src>` accepts per platform. The glb
  files may need conversion to render on visionOS — unverified.
- **`enable-xr` is a non-standard attribute with three different spellings**
  (`enable-xr` attribute, `__enableXr__` className, `enableXr` inline style). It
  is unclear which is canonical, and a normal React/TS setup would reject the
  unknown attribute — it only type-checks because the SDK's JSX runtime augments
  the types. Easy to forget, and forgetting it silently downgrades `<Model>` to a
  flat web `<model>` with no spatial behavior.
- **Sizing via `--xr-depth` is unusual.** You size the 3D model by sizing the 2D
  plane (`height`) plus a CSS *custom property* `--xr-depth` (a px string). It
  must be a custom property, not a normal style key, which is non-obvious and
  TypeScript-hostile (needs an `as CSSProperties` cast).
- **`poster` is in the shipped types but undocumented.** The docs' Model
  attribute list only mentions `src` + lifecycle events + a JS API, yet the types
  expose `poster`, `autoPlay`, `loop`, `loading`. I used `poster` for a 2D
  fallback image; its actual behavior on each platform is unverified.

## Spatial Interaction Behavior

- **Drag translation units are unspecified.** `onSpatialDrag` exposes
  `translationX/Y/Z`, but the docs never say whether these are px (2D plane units)
  or meters (3D space units). The 2D plane uses px while 3D entities use meters,
  so this matters a lot. I applied them as px on a guess; calibration is
  uncertain.
- **`onSpatialDragEnd` carries no final translation** (its detail is empty), so
  to commit a new resting position you must cache the last `onSpatialDrag` value
  yourself. Not documented.
- **Two overlapping ways to move a model, no guidance.** A model ref exposes a
  writable `entityTransform` (`DOMMatrixReadOnly`), *and* you can move the plane
  with CSS `transform` + `--xr-back`. The docs don't say which to use for
  "reposition the object," so the natural-drag implementation is guesswork.
- **Rotation gives a raw `quaternion`** with no helper to apply it to a
  DOM/CSS element. Converting quaternion → CSS `matrix3d` is left entirely to the
  developer, so I skipped rotation and shipped drag (move) + magnify (scale)
  only.
- **OS-level vs element-level dragging is unreconciled.** A `volume` Spatial
  Scene can be grabbed and moved by the OS, and a `<Model>` also emits its own
  `onSpatialDrag`. The docs describe these separately and never clarify whether
  both move the object simultaneously or conflict.

## Asset Loading

- **Local `models/` assets aren't covered.** The 3D files live in a root
  `models/` folder (not `public/`). Docs assume a served path like
  `/modelasset/vehicle.usdz`. I bundled them with Vite
  `import.meta.glob('/models/*.glb', { eager, query: '?url' })`; WebSpatial
  provides no guidance on bundling local model assets through a build tool.
- **File names contain spaces, parentheses and non-ASCII chars** (`Å`, `Ä`,
  `Ö`). It's unclear whether a raw `src` URL with these survives the WebView; I
  relied on Vite's hashed asset URLs to sidestep the issue.
- **No load-state example.** `onLoad` / `onError` / the `ready` promise exist,
  but there's no documented pattern for handling large models or load failures in
  a list/catalog context.

## App Deployment

- **"Run as a WebSpatial app by default" has no concrete build switch.** Per the
  docs, a Web App only *becomes* a WebSpatial App at runtime, inside a WebSpatial
  Runtime (a packaged visionOS build via `webspatial-builder`, or PICO OS 6).
  There is no code/build flag — the determination is environmental — which makes
  the requirement ambiguous relative to how the framework actually works.
- **Packaging can't be validated on Linux/CI.** `webspatial-builder` needs a
  platform runtime (`@webspatial/platform-visionos`) **and** Xcode + visionOS
  components. I added an `npm run spatial` script documenting the workflow but
  couldn't exercise it here.
- **Manifest field coverage is unclear.** The docs say "skip the PWA step if you
  already have a manifest," but don't enumerate which fields WebSpatial actually
  reads (start-scene / scene options apparently live under undocumented
  `manifest-options`).

## Documentation Gaps

- The Vite plugin, `XR_ENV`, and the real `package.json` scripts from the
  official starter templates are entirely missing from `llms-full.txt`.
- **`initScene` docs contradict the shipped types.** The docs example returns
  `type: 'volume'` *inside* the callback's returned config, but
  `SpatialSceneCreationOptions` has no `type` field — the real signature takes
  scene `type` in a **third** `options` argument:
  `initScene(name, cfg => ({...}), { type: 'volume' })`. Copying the doc example
  is a TypeScript error.
- The Model attribute list is incomplete versus the shipped types (`poster`,
  `autoPlay`, `loop`, `loading` are undocumented).
- There's no end-to-end example of the common "tap a thumbnail → open a focused,
  draggable model in its own scene" flow, which is exactly what this task needed.

## Bugs or Unexpected Behavior

- **Silent no-op footgun:** configuring `jsxImportSource` only in `tsconfig`
  (as the docs instruct) compiles and renders fine but leaves all spatial markers
  inert under Vite, because Vite doesn't transform via `tsc`. Nothing warns you.
- **`import.meta.glob` typing failed** until `vite/client` types were added
  (`src/vite-env.d.ts`). Not WebSpatial's fault, but needed for the asset
  approach the framework implicitly pushes you toward.
- **Two byte-identical PAX `.glb` files collapsed into a single hashed asset** in
  the production build (Vite content de-dup). Harmless, but surprising.

## Suggestions for Framework Improvement

- Document an official `@webspatial/vite-plugin` setup path (with a Vite
  version / peer-dependency matrix), `XR_ENV`, and recommended scripts directly
  in `llms-full.txt`.
- Explicitly state supported model formats (USDZ vs glb) per platform and any
  required conversion.
- Specify the unit and coordinate space of spatial drag / rotate / magnify
  events, and show a `useMetrics`-based repositioning example.
- Provide a first-class "set model position/transform" API (or clearly pick
  `entityTransform` vs CSS transform) and ship quaternion → CSS matrix helpers
  for rotation.
- Fix the `initScene` docs example to match the typed signature.
- Recommend `supports('Model')` (capability API) for graceful 2D fallback
  instead of relying on `typeof HTMLModelElement`.
