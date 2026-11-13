import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { defineConfig } from 'vitest/config';

// Unit tests (ts:TST-1) with v8 coverage and an 80% line and branch threshold for the library (ts:TST-6).
// Coverage output goes to the system temp folder: inside a Dropbox-synced working copy, Dropbox locks
// coverage/.tmp while Vitest removes it, and the run fails with EBUSY although all tests pass.
export default defineConfig({
  test: {
    include: ['src/**/*.spec.ts', 'scripts/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts'],
      reporter: ['text', 'html'],
      reportsDirectory: join(tmpdir(), 'mielk-fn-coverage'),
      thresholds: { lines: 80, branches: 80 },
    },
  },
});
