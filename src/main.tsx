import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { isXR } from './lib/spatial';
import './index.css';

// Runtime fallback for the oversized XR start window: flag XR mode on the root
// element so CSS can scale the storefront to a normal apparent size. (The
// build-time `xr_main_scene` manifest size is the primary fix, but only takes
// effect after a WebSpatial Builder rebuild.) Applied before render to avoid a
// layout flash.
if (isXR()) {
  document.documentElement.classList.add('xr-mode');
}

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element not found');

createRoot(rootEl).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('Service worker registration failed:', error);
    });
  });
}
