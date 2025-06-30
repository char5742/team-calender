import { defineConfig } from '@playwright/test'

// ポート番号を環境変数から取得（デフォルト: 4321）
const DEFAULT_PORT = 4321
const envPort = Number(process.env.PORT)
const PORT = Number.isFinite(envPort) ? envPort : DEFAULT_PORT

export default defineConfig({
  testDir: './tests/e2e',
  reporter: 'list',
  // 並列実行の最適化
  workers: process.env.CI ? 2 : '50%', // ローカルではCPUの50%を使用
  fullyParallel: true, // 完全並列実行を有効化
  retries: 0, // リトライを無効化して時間短縮
  timeout: 30000, // テストのタイムアウトを30秒に設定
  use: {
    baseURL: `http://localhost:${PORT}`,
    // VRT用の設定
    screenshot: {
      mode: 'only-on-failure',
      fullPage: false, // フルページスクリーンショットを無効化して高速化
    },
    // アクションのタイムアウトを短縮
    actionTimeout: 5000,
    navigationTimeout: 10000,
    // トレースを無効化して高速化
    trace: 'off',
    video: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        // ヘッドレスモードで高速化
        headless: true,
        // GPUを無効化して安定性向上
        launchOptions: {
          args: ['--disable-gpu', '--no-sandbox'],
        },
      },
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
  // VRT用の設定
  expect: {
    // スクリーンショット比較のしきい値（0-1、0は完全一致）
    toHaveScreenshot: {
      maxDiffPixels: 15000, // 動的コンテンツ（カレンダーイベント等）による差分を許容
      threshold: 0.2,
      animations: 'disabled',
    },
  },
  // スクリーンショットとビデオの保存先
  outputDir: 'test-results/',
  snapshotDir: 'tests/e2e/__screenshots__',
  snapshotPathTemplate:
    '{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}-{projectName}-{platform}{ext}',
})
