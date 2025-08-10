import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    exclude: ['node_modules/**', '.next/**', 'e2e/**', 'playwright.config.ts'],
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
    deps: {
      optimizer: {
        web: {
          include: ['react', 'react-dom'],
        },
      },
    },
  },
});
