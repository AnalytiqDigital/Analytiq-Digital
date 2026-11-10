import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
  test: { environment: 'node', include: ['tests/blog-*.test.ts', 'tests/currency.test.ts', 'tests/portal-*.test.ts'] },
});
