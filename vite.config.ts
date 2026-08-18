import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5280,
    // fail loudly rather than silently hopping to the next free port — the
    // whole point of setting this is to stay clear of another app
    strictPort: true,
  },
  preview: {
    port: 5281,
    strictPort: true,
  },
});
