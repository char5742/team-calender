import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4321',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  testMatch: '**/*.e2e.ts',
  webServer: {
    command: 'bun run dev',
    port: 4321,
    reuseExistingServer: !process.env.CI,
  },
})
