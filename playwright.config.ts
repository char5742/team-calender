import { defineConfig } from '@playwright/test'

// ポート番号を環境変数から取得（デフォルト: 4321）
const DEFAULT_PORT = 4321
const envPort = Number(process.env.PORT)
const PORT = Number.isFinite(envPort) ? envPort : DEFAULT_PORT

export default defineConfig({
  testDir: './tests/e2e',
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  testMatch: '**/*.e2e.ts',
  webServer: {
    command: `bun run dev --port ${PORT}`,
    port: PORT,
    reuseExistingServer: true,
    // サーバー起動のタイムアウト（ミリ秒）
    timeout: 120 * 1000,
  },
})
