import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'test/',
        '*.config.ts',
        '*.config.js',
        'dist/',
        'build/',
        '.cursor/',
        'ops/',
      ],
      // Coverage thresholds disabled during initial development
      // TODO: Enable and gradually increase as test coverage improves
      // thresholds: {
      //   lines: 5,
      //   functions: 5,
      //   branches: 10,
      //   statements: 5,
      // },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
});

