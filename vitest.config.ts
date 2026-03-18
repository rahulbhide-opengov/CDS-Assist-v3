import { defineConfig } from 'vitest/config';
// For React/JSX: npm i -D @vitejs/plugin-react, then add: import react from '@vitejs/plugin-react'; plugins: [react()]
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.stories.*',
        '**/*.d.ts',
      ],
    },
    include: ['src/**/*.test.{ts,tsx}', 'shared/**/*.test.{ts,tsx}'],
    globals: true,
  },
});
