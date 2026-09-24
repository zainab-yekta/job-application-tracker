import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GitHub Pages serves the site from /job-application-tracker/
  base: '/job-application-tracker/',
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
});
