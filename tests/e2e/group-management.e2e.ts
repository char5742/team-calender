import { expect, test } from '@playwright/test'

// RegExを定数として定義
const ERROR_CLASS_REGEX = /error/

// テスト用のグローバル変数の型定義
declare global {
  interface Window {
    lastGroupFormSubmit?: { name: string; memberIds: string[] }
  }
}

test.describe('GroupManagement', () => {
  test.beforeEach(async ({ page }) => {
    // メインページへ移動
    await page.goto('/')
  })

  test('グループ作成フォームが表示される', async ({ page }) => {
    await page.goto('/')

    await page.click('#create-group-btn')

    // フォーム要素の存在確認（作成フォームコンテナ内で検索）
    const createFormContainer = page.locator('#create-form-container')
    await expect(createFormContainer).toBeVisible()
    await expect(createFormContainer.locator('.group-form')).toBeVisible()
    await expect(createFormContainer.locator('input[name="name"]')).toBeVisible()
    await expect(createFormContainer.locator('.members-selection')).toBeVisible()
    await expect(createFormContainer.locator('button[type="submit"]')).toBeVisible()
  })

  test('メンバー未選択でエラーが表示される', async ({ page }) => {
    await page.goto('/')
    await page.click('#create-group-btn')

    const createFormContainer = page.locator('#create-form-container')

    // グループ名を入力
    await createFormContainer.locator('input[name="name"]').fill('テストグループ')

    // メンバーを選択せずに送信
    await createFormContainer.locator('button[type="submit"]').click()

    // エラーメッセージを確認 - メンバー選択エラーのみを特定
    const membersError = createFormContainer.locator('.error-message').filter({
      hasText: '少なくとも1人のメンバーを選択してください',
    })
    await expect(membersError).toBeVisible()
  })

  test('グループ名の重複チェックが機能する', async ({ page }) => {
    await page.goto('/')
    const createFormContainer = page.locator('#create-form-container')
    const createButton = page.locator('#create-group-btn')

    // フォームを開く
    await createButton.click()
    await expect(createFormContainer).toBeVisible()

    // 既存のグループ名を入力
    await createFormContainer.locator('input[name="name"]').fill('開発チーム')

    // リアルタイムバリデーションでエラーが表示されることを確認
    await expect(
      createFormContainer.locator('text=このグループ名は既に使用されています'),
    ).toBeVisible()
    await expect(createFormContainer.locator('input[name="name"]')).toHaveClass(ERROR_CLASS_REGEX)
  })

  test('グループ作成のイベントが正しく発火する', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.click('#create-group-btn')
    const createFormContainer = page.locator('#create-form-container')

    // グループ名を入力
    await createFormContainer.locator('input[name="name"]').fill('新しいテストグループ')

    // メンバーを選択（最初のメンバーをチェック）
    await createFormContainer.locator('.member-checkbox input[type="checkbox"]').first().check()

    // イベントリスナーを設定
    await page.evaluateHandle(() => {
      window.addEventListener('group-form-submit', (event: Event) => {
        const customEvent = event as CustomEvent<{ name: string; memberIds: string[] }>
        window.lastGroupFormSubmit = customEvent.detail
      })
    })

    // フォームを送信して、イベントを待機
    const submitPromise = page.waitForFunction(() => window.lastGroupFormSubmit !== undefined, {
      timeout: 5000,
    })

    await createFormContainer.locator('button[type="submit"]').click()

    await submitPromise

    const submitResult = await page.evaluate(() => window.lastGroupFormSubmit?.name)
    expect(submitResult).toBe('新しいテストグループ')
  })
})
