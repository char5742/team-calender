import { expect, test } from '@playwright/test'

// 共通のスタイル設定
const disableAnimationsStyle = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
  }
`

test.describe('VRT - Desktop (1280x720)', () => {
  test.beforeEach(async ({ page }) => {
    // ビューポートサイズを設定
    await page.setViewportSize({ width: 1280, height: 720 })
  })

  test('トップページ', async ({ page }) => {
    await page.goto('/')
    // アニメーションを無効化
    await page.addStyleTag({ content: disableAnimationsStyle })

    // リダイレクト後のカレンダーが表示されるまで待つ
    await page.locator('.weekly-calendar').waitFor({ state: 'visible', timeout: 5000 })

    // スクリーンショットを撮影
    await expect(page).toHaveScreenshot('index-desktop')
  })

  test('週間スケジュールページ - 開発チーム', async ({ page }) => {
    await page.goto('/groups/group-1/weekly-schedule')
    await page.addStyleTag({ content: disableAnimationsStyle })

    // カレンダーが表示されるまで待つ
    await page.locator('.weekly-calendar').waitFor({ state: 'visible', timeout: 5000 })

    // イベントが表示されるまで待つ（存在する場合）
    await page
      .locator('.event-block')
      .first()
      .waitFor({ state: 'visible', timeout: 2000 })
      .catch(() => {
        // 要素が見つからない場合は無視
      })

    // スクリーンショットを撮影
    await expect(page).toHaveScreenshot('weekly-schedule-group1-desktop')
  })

  test('週間スケジュールページ - 営業チーム', async ({ page }) => {
    await page.goto('/groups/group-2/weekly-schedule')
    await page.addStyleTag({ content: disableAnimationsStyle })

    // カレンダーが表示されるまで待つ
    await page.locator('.weekly-calendar').waitFor({ state: 'visible', timeout: 5000 })

    // イベントが表示されるまで待つ（存在する場合）
    await page
      .locator('.event-block')
      .first()
      .waitFor({ state: 'visible', timeout: 2000 })
      .catch(() => {
        // 要素が見つからない場合は無視
      })

    // スクリーンショットを撮影
    await expect(page).toHaveScreenshot('weekly-schedule-group2-desktop')
  })

  test('週間スケジュールページ - 空のグループ', async ({ page }) => {
    await page.goto('/groups/invalid-group-id/weekly-schedule')
    await page.addStyleTag({ content: disableAnimationsStyle })

    // ページが読み込まれるまで少し待つ
    await page.waitForLoadState('domcontentloaded')

    // スクリーンショットを撮影
    await expect(page).toHaveScreenshot('weekly-schedule-invalid-desktop')
  })
})

// ダークモードのテスト
test.describe('VRT - ダークモード', () => {
  test('トップページ - ダークモード', async ({ page }) => {
    // ダークモードを有効化
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')
    await page.addStyleTag({ content: disableAnimationsStyle })

    await page.locator('.weekly-calendar').waitFor({ state: 'visible', timeout: 5000 })

    await expect(page).toHaveScreenshot('index-dark')
  })
})
