import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  build: {
    outDir: 'dist/waste-sort-ai/browser', // Matches the path in server.js
    emptyOutDir: true,
  }
});