import { defineConfig, devices } from '@playwright/test';
import { loadEnv } from 'vite';
import path from 'path';

// Determine mode (development, staging, production)
const mode = process.env.VITE_MODE || 'development';

// Load environment variables using Vite's exact logic
// The third argument '' loads all variables, not just those with VITE_ prefix.
const env = loadEnv(mode, path.resolve(__dirname), '');

// Assign to process.env for Playwright access
Object.assign(process.env, env);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  
  use: {
    // Use the Vite-loaded variable, providing a fallback
    baseURL: env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3002',
    trace: 'on-first-retry'
  },
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  
  webServer: {
    command: 'npm start -- --host 0.0.0.0 --port 3002',
    url: env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3002',
    reuseExistingServer: !process.env.CI
  }
});
