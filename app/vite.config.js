import { defineConfig } from 'vite';

export default defineConfig({
  server: { port: 4200 },
  build: { outDir: 'dist/waste-sort-ai', emptyOutDir: true }
});