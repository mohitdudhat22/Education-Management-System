import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', 
    setupFiles: ['dotenv/config'],
    transformMode: {
      web: [/.[jt]sx?$/],
    },
  },
});
