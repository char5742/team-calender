import { expect, test } from '@playwright/test'

// RegExを定数として定義
const ERROR_CLASS_REGEX = /error/

// テスト用のグローバル変数の型定義
declare global {
  interface Window {
    lastGroupFormSubmit?: { name: string; memberIds: string[] }
    eventFired?: boolean
    formSubmitDetail?: { name: string; memberIds: string[] } | null
    __E2E_TEST_MODE__?: boolean
    __E2E_MOCK_DATA__?: {
      groups: Array<{ id: string; name: string; memberIds: string[] }>
      teamMembers: Array<{ id: string; name: string; email: string }>
    }
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

  test.skip('グループが正常に作成される', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // コンソールエラーをキャプチャ
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    // 初期のグループリストアイテム数を取得
    const initialGroupCount = await page.locator('#group-list-container .group-item').count()
    console.log(`Initial group count: ${initialGroupCount}`)

    // グループ作成ボタンをクリック
    await page.click('#create-group-btn')
    const createFormContainer = page.locator('#create-form-container')
    await expect(createFormContainer).toBeVisible()

    // グループ名を入力（一意性を保証するため）
    const groupName = `テストグループ_${Date.now()}`
    await createFormContainer.locator('input[name="name"]').fill(groupName)

    // メンバーを選択（最初のメンバーをチェック）
    const firstCheckbox = createFormContainer
      .locator('.member-checkbox input[type="checkbox"]')
      .first()
    await firstCheckbox.check()
    await expect(firstCheckbox).toBeChecked()

    // 送信ボタンが有効になっているか確認
    const submitButton = createFormContainer.locator('button[type="submit"]')
    await expect(submitButton).toBeEnabled()

    // ナビゲーションを待つか、エラーメッセージを確認
    let navigationOccurred = false
    try {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle', timeout: 3000 }),
        submitButton.click(),
      ])
      navigationOccurred = true
    } catch (e) {
      // ナビゲーションが発生しなかった
      console.log('Navigation did not occur')
    }

    if (navigationOccurred) {
      // グループが作成されたことを確認
      await page.waitForSelector('#group-list-container .group-item', {
        state: 'visible',
        timeout: 5000,
      })

      // 新しいグループ数を確認
      const newGroupCount = await page.locator('#group-list-container .group-item').count()
      console.log(`New group count: ${newGroupCount}`)

      // 作成したグループが表示されていることを確認
      const newGroupElement = page.locator('#group-list-container .group-item').filter({
        hasText: groupName,
      })

      if ((await newGroupElement.count()) > 0) {
        await expect(newGroupElement).toBeVisible()
      } else {
        // グループがリストに見つからない
        console.log(`Created group "${groupName}" not found in list`)
        expect(newGroupCount).toBe(initialGroupCount + 1)
      }
    } else {
      // エラーメッセージを確認
      const errorMessage = await createFormContainer.locator('.error-message:visible').textContent()
      console.log(`Error message: ${errorMessage}`)
      console.log(`Console errors: ${consoleErrors.join(', ')}`)

      // エラーがある場合はテスト失敗
      expect(errorMessage).toBeNull()
    }
  })
})
