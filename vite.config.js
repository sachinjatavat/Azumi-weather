import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  root: './',
  server: {
    port: 3000,
    host: true,
    allowedHosts: true,
    open: false
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
