import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  // WebSpatial integration: route JSX through the WebSpatial SDK runtime so
  // spatialized elements (e.g. <Model>) are upgraded when running inside a
  // WebSpatial Runtime, and fall back to standard DOM elements elsewhere.
  plugins: [react({ jsxImportSource: '@webspatial/react-sdk' })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
