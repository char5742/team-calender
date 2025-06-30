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

test.describe('ダークモード - 全画面スクリーンショット', () => {
  test.beforeEach(async ({ page }) => {
    // ビューポートサイズを設定
    await page.setViewportSize({ width: 1280, height: 720 })
    // ダークモードを有効化
    await page.emulateMedia({ colorScheme: 'dark' })
  })

  test('トップページ - ダークモード', async ({ page }) => {
    await page.goto('/')
    await page.addStyleTag({ content: disableAnimationsStyle })

    // グループリストまたは空状態が表示されるまで待つ
    await page.locator('.groups-container').waitFor({ state: 'visible', timeout: 5000 })

    // スクリーンショットを撮影
    await expect(page).toHaveScreenshot('index-dark-mode.png')
  })

  test('グループ作成ページ - ダークモード', async ({ page }) => {
    await page.goto('/groups/new')
    await page.addStyleTag({ content: disableAnimationsStyle })

    // フォームが表示されるまで待つ
    await page.locator('form').waitFor({ state: 'visible', timeout: 5000 })

    // スクリーンショットを撮影
    await expect(page).toHaveScreenshot('group-new-dark-mode.png')
  })

  test('グループ作成ページ - メンバー選択UI展開 - ダークモード', async ({ page }) => {
    await page.goto('/groups/new')
    await page.addStyleTag({ content: disableAnimationsStyle })

    // メンバー選択エリアが表示されるまで待つ
    await page.locator('.member-selection').waitFor({ state: 'visible', timeout: 5000 })

    // チェックボックスを選択
    await page.check('input[type="checkbox"][value="member-1"]')
    await page.check('input[type="checkbox"][value="member-2"]')

    // スクリーンショットを撮影
    await expect(page).toHaveScreenshot('group-new-with-selection-dark-mode.png')
  })

  test('グループ作成ページ - バリデーションエラー - ダークモード', async ({ page }) => {
    await page.goto('/groups/new')
    await page.addStyleTag({ content: disableAnimationsStyle })

    // フォームが表示されるまで待つ
    await page.locator('form').waitFor({ state: 'visible', timeout: 5000 })

    // 送信ボタンをクリック
    await page.locator('button[type="submit"]').click()

    // エラーメッセージが表示されるのを待つ（短時間）
    await page.waitForTimeout(200)

    // スクリーンショットを撮影
    await expect(page).toHaveScreenshot('group-new-validation-error-dark-mode.png')
  })

  test('週間スケジュールページ - 開発チーム - ダークモード', async ({ page }) => {
    await page.goto('/groups/group-1/weekly-schedule')
    await page.addStyleTag({ content: disableAnimationsStyle })

    // カレンダーが表示されるまで待つ
    await page.locator('.weekly-calendar').waitFor({ state: 'visible', timeout: 5000 })

    // イベントが表示されるまで待つ（存在する場合）
    await page
      .locator('.event-block')
      .first()
      .waitFor({ state: 'visible', timeout: 2000 })
      .catch(() => {})

    // スクリーンショットを撮影
    await expect(page).toHaveScreenshot('weekly-schedule-group1-dark-mode.png')
  })

  test('週間スケジュールページ - 営業チーム - ダークモード', async ({ page }) => {
    await page.goto('/groups/group-2/weekly-schedule')
    await page.addStyleTag({ content: disableAnimationsStyle })

    // カレンダーが表示されるまで待つ
    await page.locator('.weekly-calendar').waitFor({ state: 'visible', timeout: 5000 })

    // イベントが表示されるまで待つ（存在する場合）
    await page
      .locator('.event-block')
      .first()
      .waitFor({ state: 'visible', timeout: 2000 })
      .catch(() => {})

    // スクリーンショットを撮影
    await expect(page).toHaveScreenshot('weekly-schedule-group2-dark-mode.png')
  })

  test('週間スケジュールページ - 空のグループ - ダークモード', async ({ page }) => {
    await page.goto('/groups/invalid-group-id/weekly-schedule')
    await page.addStyleTag({ content: disableAnimationsStyle })

    // ページが読み込まれるまで少し待つ
    await page.waitForLoadState('domcontentloaded')

    // スクリーンショットを撮影
    await expect(page).toHaveScreenshot('weekly-schedule-invalid-dark-mode.png')
  })

  test('トップページ - グループ削除モーダル - ダークモード', async ({ page }) => {
    await page.goto('/')
    await page.addStyleTag({ content: disableAnimationsStyle })

    // グループリストが表示されるまで待つ
    await page.locator('.groups-container').waitFor({ state: 'visible', timeout: 5000 })

    // 削除ボタンを探す
    const deleteButton = page.locator('button[data-action="delete"]').first()

    // 削除ボタンが存在する場合のみモーダルテストを実行
    if ((await deleteButton.count()) > 0) {
      await deleteButton.click()

      // モーダルが表示されるまで待つ
      await page.locator('.modal-overlay.open').waitFor({ state: 'visible', timeout: 2000 })

      // スクリーンショットを撮影
      await expect(page).toHaveScreenshot('index-delete-modal-dark-mode.png')
    } else {
      // グループがない場合は空の状態をスクリーンショット
      await expect(page).toHaveScreenshot('index-empty-dark-mode.png')
    }
  })
})

// モバイル表示でのダークモードテスト
test.describe('ダークモード - モバイル画面', () => {
  test.beforeEach(async ({ page }) => {
    // モバイルビューポートサイズを設定
    await page.setViewportSize({ width: 375, height: 667 })
    // ダークモードを有効化
    await page.emulateMedia({ colorScheme: 'dark' })
  })

  test('トップページ - モバイル - ダークモード', async ({ page }) => {
    await page.goto('/')
    await page.addStyleTag({ content: disableAnimationsStyle })

    await page.locator('.groups-container').waitFor({ state: 'visible', timeout: 5000 })

    await expect(page).toHaveScreenshot('index-mobile-dark-mode.png')
  })

  test('グループ作成ページ - モバイル - ダークモード', async ({ page }) => {
    await page.goto('/groups/new')
    await page.addStyleTag({ content: disableAnimationsStyle })

    await page.locator('form').waitFor({ state: 'visible', timeout: 5000 })

    await expect(page).toHaveScreenshot('group-new-mobile-dark-mode.png')
  })

  test('週間スケジュールページ - モバイル - ダークモード', async ({ page }) => {
    await page.goto('/groups/group-1/weekly-schedule')
    await page.addStyleTag({ content: disableAnimationsStyle })

    await page.locator('.weekly-calendar').waitFor({ state: 'visible', timeout: 5000 })

    await expect(page).toHaveScreenshot('weekly-schedule-mobile-dark-mode.png')
  })
})