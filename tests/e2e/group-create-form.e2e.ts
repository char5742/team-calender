import { expect, test } from '@playwright/test'

// RegExを定数として定義
const ERROR_CLASS_REGEX = /error/
const URL_END_REGEX = /\/$|index\.html$/

test.describe('GroupCreateForm', () => {
  test.beforeEach(async ({ page }) => {
    // 固定URLでアクセス
    await page.goto('/groups/new')
  })

  test('グループ作成フォームが表示される', async ({ page }) => {
    // フォーム要素の存在を確認
    await expect(page.locator('form')).toBeVisible()
    await expect(page.locator('input#group-name')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
    await expect(page.locator('text=新しいグループを作成')).toBeVisible()
  })

  test('メンバーが表示される', async ({ page }) => {
    // モックデータのメンバーが表示されることを確認
    await expect(page.locator('.member-checkbox')).toHaveCount(6)
    await expect(page.locator('text=山田太郎')).toBeVisible()
    await expect(page.locator('text=yamada@example.com')).toBeVisible()
  })

  test('バリデーションが機能する', async ({ page }) => {
    // メンバーを1人選択（ボタンを有効化）
    await page.locator('input[value="member-1"]').check()

    // グループ名を入力せずに送信
    await page.locator('button[type="submit"]').click()

    // バリデーションメッセージを確認
    await expect(page.locator('.error-message')).toBeVisible()
    await expect(page.locator('.error-message')).toContainText('グループ名を入力してください')
  })

  test('メンバー未選択でエラーが表示される', async ({ page }) => {
    // グループ名を入力
    await page.fill('#group-name', 'テストグループ')

    // メンバーを選択せずに送信
    await page.locator('button[type="submit"]').click()

    // エラーメッセージを確認
    await expect(page.locator('.error-message')).toBeVisible()
    await expect(page.locator('.error-message')).toContainText(
      '少なくとも1人のメンバーを選択してください',
    )
  })

  test('グループ名の重複チェックが機能する', async ({ page }) => {
    // 既存のグループ名を入力
    await page.fill('#group-name', '開発チーム')

    // リアルタイムバリデーションでエラーが表示されることを確認
    await expect(page.locator('.error-message')).toBeVisible()
    await expect(page.locator('.error-message')).toContainText(
      'このグループ名は既に使用されています',
    )
    await expect(page.locator('#group-name')).toHaveClass(ERROR_CLASS_REGEX)

    // メンバーを選択してもグループが作成されないことを確認
    await page.check('input[type="checkbox"][value="member-1"]')
    await page.click('button[type="submit"]')

    // エラーが続いていることを確認
    await expect(page.locator('.error-message')).toBeVisible()
  })

  test('グループが正常に作成される', async ({ page }) => {
    // コンソールメッセージを記録
    const consoleMessages: string[] = []
    page.on('console', (msg) => {
      const text = msg.text()
      if (text.includes('グループが作成されました')) {
        consoleMessages.push(text)
      }
    })

    // グループ名を入力
    await page.fill('#group-name', '新しいテストグループ')

    // メンバーを選択
    await page.locator('input[value="member-1"]').check()
    await page.locator('input[value="member-3"]').check()

    // フォームを送信
    await page.locator('button[type="submit"]').click()

    // グループ作成成功のメッセージを確認
    await page.waitForTimeout(500)
    const successMessage = consoleMessages.find((msg) => msg.includes('グループが作成されました'))
    expect(successMessage).toBeTruthy()
  })

  test('キャンセルボタンが機能する', async ({ page }) => {
    // グループ名を入力
    await page.fill('#group-name', 'キャンセルテスト')

    // キャンセルボタンをクリック
    await page.click('button:has-text("キャンセル")')

    // ホームページへ遷移することを確認
    await page.waitForURL('**/', { timeout: 10000 })
    expect(page.url()).toMatch(URL_END_REGEX)
  })
})
