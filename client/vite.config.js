import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Proxy /api requests to the Express backend during development
export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages deployment (repo name). Assets load correctly
  // under https://SolenSarkar.github.io/React-ToDo-List/
  base: '/React-ToDo-List/',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});

