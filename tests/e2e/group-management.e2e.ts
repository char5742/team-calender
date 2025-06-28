import { expect, test } from '@playwright/test'

// RegExを定数として定義
const ERROR_CLASS_REGEX = /error/

test.describe('GroupManagement', () => {
  test.beforeEach(async ({ page }) => {
    // メインページへ移動
    await page.goto('/')
  })

  test('グループ作成フォームが表示される', async ({ page }) => {
    // グループ作成ボタンをクリック
    await page.locator('button:has-text("新しいグループを作成")').click()

    // フォーム要素の存在確認（作成フォームコンテナ内で検索）
    const createFormContainer = page.locator('#create-form-container')
    await expect(createFormContainer).toBeVisible()
    await expect(createFormContainer.locator('.group-form')).toBeVisible()
    await expect(createFormContainer.locator('input[name="name"]')).toBeVisible()
    await expect(createFormContainer.locator('.members-selection')).toBeVisible()
    await expect(createFormContainer.locator('button[type="submit"]')).toBeVisible()
  })

  test('メンバー未選択でエラーが表示される', async ({ page }) => {
    // グループ作成ボタンをクリック
    await page.locator('button:has-text("新しいグループを作成")').click()

    const createFormContainer = page.locator('#create-form-container')

    // グループ名を入力
    await createFormContainer.locator('input[name="name"]').fill('テストグループ')

    // メンバーを選択せずに送信
    await createFormContainer.locator('button[type="submit"]').click()

    // エラーメッセージを確認
    await expect(
      createFormContainer.locator('text=少なくとも1人のメンバーを選択してください')
    ).toBeVisible()
  })

  test('グループ名の重複チェックが機能する', async ({ page }) => {
    // グループ作成ボタンをクリック
    await page.locator('button:has-text("新しいグループを作成")').click()

    const createFormContainer = page.locator('#create-form-container')

    // 既存のグループ名と同じ名前を入力
    await createFormContainer.locator('input[name="name"]').fill('開発チーム')

    // リアルタイムバリデーションでエラーが表示されることを確認
    await expect(
      createFormContainer.locator('text=このグループ名は既に使用されています')
    ).toBeVisible()
    await expect(createFormContainer.locator('input[name="name"]')).toHaveClass(ERROR_CLASS_REGEX)
  })

  test('グループ作成のイベントが正しく発火する', async ({ page }) => {
    // コンソールログを監視
    const consoleMessages: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'log') {
        consoleMessages.push(msg.text())
      }
    })

    // グループ作成ボタンをクリック
    await page.locator('button:has-text("新しいグループを作成")').click()

    const createFormContainer = page.locator('#create-form-container')

    // グループ名を入力
    await createFormContainer.locator('input[name="name"]').fill('新しいテストグループ')

    // メンバーを選択（最初のメンバーをチェック）
    await createFormContainer.locator('.member-checkbox input[type="checkbox"]').first().check()

    // ネットワークリクエストをインターセプト（ページリロードを防ぐ）
    await page.route('**/*', (route) => {
      if (route.request().resourceType() === 'document') {
        route.abort()
      } else {
        route.continue()
      }
    })

    // フォームを送信
    await createFormContainer.locator('button[type="submit"]').click()

    // イベントが発火したことを確認
    await page.waitForTimeout(1000)
    const eventMessages = consoleMessages.filter(
      (msg) =>
        msg.includes('group-form-submit') ||
        msg.includes('Creating group') ||
        msg.includes('New group created')
    )

    // イベントが発火していることを確認
    const createEvent = eventMessages.find((msg) => msg.includes('Creating group'))
    const createdEvent = eventMessages.find((msg) => msg.includes('New group created'))

    expect(createEvent).toBeTruthy()
    expect(createdEvent).toBeTruthy()

    // Note: Astroはサーバーサイドレンダリングのため、
    // ページリロード時にストアがリセットされる。
    // 実際のアプリケーションではデータの永続化が必要。
  })
})
