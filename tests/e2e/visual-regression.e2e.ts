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
    await expect(page).toHaveScreenshot('index-desktop.png')
  })

  // biome-ignore lint/suspicious/noSkippedTests: intentionally disabled obsolete scenario
  test.skip('グループ作成ページ (管理機能削除のため無効化)', async ({ page }) => {
    await page.goto('/groups/new')
    await page.addStyleTag({ content: disableAnimationsStyle })

    // フォームが表示されるまで待つ
    await page.locator('form').waitFor({ state: 'visible', timeout: 5000 })

    // スクリーンショットを撮影
    await expect(page).toHaveScreenshot('group-new-desktop.png')
  })

  // biome-ignore lint/suspicious/noSkippedTests: obsolete
  test.skip('グループ作成ページ - メンバー選択UI展開 (無効化)', async ({ page }) => {
    await page.goto('/groups/new')
    await page.addStyleTag({ content: disableAnimationsStyle })

    // メンバー選択エリアが表示されるまで待つ
    await page.locator('.member-selection').waitFor({ state: 'visible', timeout: 5000 })

    // チェックボックスを選択
    await page.check('input[type="checkbox"][value="member-1"]')
    await page.check('input[type="checkbox"][value="member-2"]')

    // スクリーンショットを撮影
    await expect(page).toHaveScreenshot('group-new-with-selection-desktop.png')
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
    await expect(page).toHaveScreenshot('weekly-schedule-group1-desktop.png')
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
    await expect(page).toHaveScreenshot('weekly-schedule-group2-desktop.png')
  })

  test('週間スケジュールページ - 空のグループ', async ({ page }) => {
    await page.goto('/groups/invalid-group-id/weekly-schedule')
    await page.addStyleTag({ content: disableAnimationsStyle })

    // ページが読み込まれるまで少し待つ
    await page.waitForLoadState('domcontentloaded')

    // スクリーンショットを撮影
    await expect(page).toHaveScreenshot('weekly-schedule-invalid-desktop.png')
  })

  // biome-ignore lint/suspicious/noSkippedTests: obsolete
  test.skip('トップページ - グループ削除モーダル (無効化)', async ({ page }) => {
    await page.goto('/')
    await page.addStyleTag({ content: disableAnimationsStyle })

    // リダイレクト後のカレンダーが表示されるまで待つ
    await page.locator('.weekly-calendar').waitFor({ state: 'visible', timeout: 5000 })

    // 削除ボタンを探す
    const deleteButton = page.locator('button[data-action="delete"]').first()

    // 削除ボタンが存在する場合のみモーダルテストを実行
    if ((await deleteButton.count()) > 0) {
      await deleteButton.click()

      // モーダルが表示されるまで待つ
      await page.locator('.modal-overlay.open').waitFor({ state: 'visible', timeout: 2000 })

      // スクリーンショットを撮影
      await expect(page).toHaveScreenshot('index-delete-modal-desktop.png')
    } else {
      // グループがない場合は空の状態をスクリーンショット
      await expect(page).toHaveScreenshot('index-empty-desktop.png')
    }
  })

  // biome-ignore lint/suspicious/noSkippedTests: obsolete
  test.skip('グループ作成ページ - バリデーションエラー (無効化)', async ({ page }) => {
    await page.goto('/groups/new')
    await page.addStyleTag({ content: disableAnimationsStyle })

    // フォームが表示されるまで待つ
    await page.locator('form').waitFor({ state: 'visible', timeout: 5000 })

    // 送信ボタンをクリック
    await page.locator('button[type="submit"]').click()

    // エラーメッセージが表示されるのを待つ（短時間）
    await page.waitForTimeout(200)

    // スクリーンショットを撮影
    await expect(page).toHaveScreenshot('group-new-validation-error-desktop.png')
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

    await expect(page).toHaveScreenshot('index-dark.png')
  })
})
