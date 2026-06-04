# WebSpatial SDK Integration Confusion Log

## Setup / Installation

- The official docs say to install `@webspatial/react-sdk` and `@webspatial/core-sdk`, but the container's npm/proxy configuration returned `403 Forbidden` for both scoped packages. I added the dependencies and TypeScript JSX runtime configuration manually, but could not refresh `package-lock.json` in this environment.
- Some indexed WebSpatial docs still mention `@google/model-viewer` and `three` as peer dependencies, while the latest `llms-full.txt` setup section only lists the React and Core SDK packages. I followed the latest `llms-full.txt` reference.

## Model Component Usage

- The latest docs document `src`, `onLoad`, `onError`, `currentSrc`, `ready`, and `entityTransform` for `<Model>`, but the examples embedded in `llms-full.txt` appear stripped/minified, so exact JSX examples for `enable-xr` and sizing were difficult to copy directly.
- It is unclear whether `<Model>` accepts standard React DOM props like `className`, `style`, and ARIA props directly in all SDK versions, so the implementation assumes it behaves like the standard model element with WebSpatial enhancements.

## Spatial Interaction Behavior

- Spatial drag docs expose `translationX`, `translationY`, and `translationZ`, but they do not show a complete React state pattern for persisting a model's new position after drag end.
- Spatial rotate exposes a quaternion payload, but the docs do not describe a recommended way to compose that quaternion with CSS `rotateX/rotateY/rotateZ` transforms for a `<Model>` container. The implementation uses a conservative approximation.
- Magnify events provide a relative `magnification` value, but the docs do not specify whether each event is relative to the start of the gesture or the previous event frame.

## Asset Loading

- The docs specify a model `src` URL but do not explain the recommended Vite pattern for GLB files outside `public/`. I used `new URL(..., import.meta.url).href` so Vite can bundle the existing `models/` assets.
- Model filenames include spaces, accented characters, and punctuation. Vite should encode these paths, but runtime behavior in the WebSpatial App Shell could not be verified here.

## App Deployment

- The manifest docs use snake_case keys under `xr_main_scene`, while the runtime `initScene` JavaScript API uses camelCase. This difference is easy to miss.
- The docs explain PWA requirements, but the existing app only has an SVG favicon and no 1024×1024 maskable icon. I did not create new image assets because the task requested minimal code changes and existing styling/assets preservation.

## Documentation Gaps

- There is no obvious product-catalog example showing multiple `<Model>` instances in a grid and then opening a selected model in a dedicated spatial scene.
- The docs do not clearly state whether `window.open(url, sceneName)?.focus()` is the preferred way to focus an already-open Spatial Scene.
- TypeScript prop names for spatial events and `enable-xr` are documented conceptually, but without a complete `.tsx` example showing expected event object types.

## Bugs or Unexpected Behavior

- npm could not install the SDK packages in this environment due to `403 Forbidden` from the registry/proxy tunnel.
- Because packages could not be installed, local build/typecheck validation is limited by missing runtime modules.

## Suggestions for Framework Improvement

- Provide a Vite + React + TypeScript example that includes `jsxImportSource`, a manifest with `xr_main_scene`, a `<Model>` sourced from a local GLB file, and spatial drag/rotate/magnify handlers.
- Publish a small catalog/gallery sample demonstrating how to open or focus a selected model in a named Spatial Scene.
- Add explicit TypeScript definitions for spatial event payloads in the docs, including examples of converting drag/rotation payloads into CSS transforms or `entityTransform` updates.
