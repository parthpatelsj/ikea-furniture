import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { isXR } from './lib/spatial';
import './index.css';

// WebSpatial gives the page a very large (~2700×2700) square viewport, which the
// responsive layout would otherwise treat as an ultra-wide desktop and render
// tiny. Flag XR mode on the root element so CSS can scale the UI to a normal
// apparent size. Applied before render to avoid a layout flash.
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
