import { expect, test } from '@playwright/test'

// RegExを定数として定義
const ERROR_CLASS_REGEX = /error/

test.describe('GroupManagement', () => {
  test.beforeEach(async ({ page }) => {
    // メインページへ移動
    await page.goto('/')
  })

  test.skip('グループ作成フォームが表示される', async ({ page }) => {
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

  test.skip('メンバー未選択でエラーが表示される', async ({ page }) => {
    await page.goto('/')
    await page.click('#create-group-btn')

    const createFormContainer = page.locator('#create-form-container')

    // グループ名を入力
    await createFormContainer.locator('input[name="name"]').fill('テストグループ')

    // メンバーを選択せずに送信
    await createFormContainer.locator('button[type="submit"]').click()

    // エラーメッセージを確認
    await expect(createFormContainer.locator('.error-message')).toBeVisible()
    await expect(createFormContainer.locator('.error-message')).toContainText(
      '少なくとも1人のメンバーを選択してください',
    )
  })

  test.skip('グループ名の重複チェックが機能する', async ({ page }) => {
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

  test.skip('グループ作成のイベントが正しく発火する', async ({ page }) => {
    await page.goto('/')
    await page.click('#create-group-btn')

    const createFormContainer = page.locator('#create-form-container')

    // イベントリスナーを設定
    await page.evaluate(() => {
      ;(window as Window & { lastCreatedGroup?: string }).lastCreatedGroup = undefined
      window.addEventListener('group-form-submit', (event: Event) => {
        const customEvent = event as CustomEvent
        ;(window as Window & { lastCreatedGroup?: string }).lastCreatedGroup =
          customEvent.detail.name
      })
    })

    // グループ名を入力
    await createFormContainer.locator('input[name="name"]').fill('新しいテストグループ')

    // メンバーを選択（最初のメンバーをチェック）
    await createFormContainer.locator('.member-checkbox input[type="checkbox"]').first().check()

    // フォームを送信
    await createFormContainer.locator('button[type="submit"]').click()

    // イベントが発火したことを確認
    await page.waitForTimeout(500)
    const createdGroupName = await page.evaluate(
      () => (window as Window & { lastCreatedGroup?: string }).lastCreatedGroup,
    )
    expect(createdGroupName).toBe('新しいテストグループ')
  })
})
