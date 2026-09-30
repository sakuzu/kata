// The audit (npm run audit): Playwright opens every built example and measures it (audit/). The
// examples are built first by the npm script; Playwright serves them with Vite's preview server,
// which it starts and stops itself.
import { defineConfig } from '@playwright/test';

const PORT = 4173;

export default defineConfig({
  testDir: 'audit',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    browserName: 'chromium',
  },
  webServer: {
    command: `vite preview --config examples/vite.config.mjs --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}/stack/`,
    reuseExistingServer: false,
  },
});
