// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // Use jsdom for DOM-related testing
    globals: true, // Enables Jest-like global variables like 'describe' and 'test'
    setupFiles: './vitest.setup.js', // Optional: A setup file to initialize things before each test
    css: true, // Enable CSS support if you are testing components with styles
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // Set up path aliasing for imports
    },
  },
});
