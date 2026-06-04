import { createRequire } from 'node:module';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const require = createRequire(import.meta.url);

const hasWebSpatialSdk = (() => {
  try {
    require.resolve('@webspatial/react-sdk');
    return true;
  } catch {
    return false;
  }
})();

const webSpatialAliases = hasWebSpatialSdk
  ? []
  : [
      {
        find: '@webspatial/react-sdk/jsx-runtime',
        replacement: path.resolve(
          __dirname,
          './src/types/webspatial-jsx-runtime-shim.ts',
        ),
      },
      {
        find: '@webspatial/react-sdk/jsx-dev-runtime',
        replacement: path.resolve(
          __dirname,
          './src/types/webspatial-jsx-dev-runtime-shim.ts',
        ),
      },
      {
        find: '@webspatial/react-sdk',
        replacement: path.resolve(__dirname, './src/types/webspatial-sdk-shim.ts'),
      },
    ];

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') },
      ...webSpatialAliases,
    ],
  },
  server: {
    port: 5173,
    host: true,
  },
});
