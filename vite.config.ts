import { defineConfig } from 'vite';

export default defineConfig({
  base: '/escape-room/',
  test: {
    environment: 'jsdom',
  },
});
