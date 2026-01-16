import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  server: {
    port: 4200
    // No proxy: Angular app calls backend directly (http://localhost:3000) via CORS in dev.
  },
  build: {
    outDir: 'dist/waste-sort-ai',
    emptyOutDir: true,
  }
});