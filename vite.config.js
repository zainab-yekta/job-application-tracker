import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GitHub Pages serves the site from /job-application-tracker/
  base: '/job-application-tracker/',
  plugins: [react()],
  build: {
    // ExcelJS is about 900 kB on its own; it only loads when a user exports
    chunkSizeWarningLimit: 1000,
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: false,
  },
  server: {
    port: 3000,
    open: true,
  },
});
