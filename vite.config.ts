/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      exclude: ['src/**/*.stories.tsx', 'src/**/*.test.tsx', 'src/test', 'src/docs', 'src/patterns'],
      entryRoot: 'src',
      insertTypesEntry: true,
    }),
  ],
  css: {
    modules: { localsConvention: 'camelCaseOnly', generateScopedName: 'dk-[local]-[hash:base64:5]' },
  },
  build: {
    lib: { entry: 'src/index.ts', formats: ['es'], fileName: 'docket-ui' },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      // Components use hooks, so frameworks with Server Components (Next.js) must load them on the client.
      output: { banner: "'use client';" },
    },
    cssCodeSplit: false,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
  },
});
