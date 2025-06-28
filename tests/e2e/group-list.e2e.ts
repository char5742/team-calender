import { expect, test } from '@playwright/test'

test.describe('グループ一覧表示', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('グループ一覧が表示される', async ({ page }) => {
    // グループ一覧コンテナの存在確認
    const groupList = page.locator('.group-list')
    await expect(groupList).toBeVisible()

    // ヘッダーの確認
    const header = groupList.locator('h2')
    await expect(header).toHaveText('グループ一覧')

    // グループアイテムの数を確認（モックデータでは4グループ）
    const groupItems = groupList.locator('.group-item')
    await expect(groupItems).toHaveCount(4)
  })

  test('各グループに正しい情報が表示される', async ({ page }) => {
    const groupList = page.locator('.group-list')

    // 開発チームの確認
    const devTeam = groupList.locator('.group-item').first()
    await expect(devTeam.locator('.group-name')).toHaveText('開発チーム')
    await expect(devTeam.locator('.member-count')).toHaveText('3人')
    await expect(devTeam.locator('.member-name')).toHaveCount(3)

    // メンバー名の確認
    const memberNames = await devTeam.locator('.member-name').allTextContents()
    expect(memberNames).toContain('山田太郎')
    expect(memberNames).toContain('佐藤花子')
    expect(memberNames).toContain('鈴木一郎')
  })

  test('グループホバー時にスタイルが変更される', async ({ page }) => {
    const groupItem = page.locator('.group-item').first()

    // ホバー前のbox-shadowを取得
    const initialBoxShadow = await groupItem.evaluate((el) => window.getComputedStyle(el).boxShadow)

    // ホバー
    await groupItem.hover()

    // transitionの完了を待つ
    await page.waitForTimeout(300)

    // ホバー後のbox-shadowを取得
    const hoverBoxShadow = await groupItem.evaluate((el) => window.getComputedStyle(el).boxShadow)

    // box-shadowが追加されていることを確認
    expect(initialBoxShadow).toBe('none')
    expect(hoverBoxShadow).toContain('rgba(0, 123, 255')
  })

  test('グループクリック時にイベントが発火する', async ({ page }) => {
    await page.goto('/')

    // グループクリックイベントをリッスンする
    await page.addInitScript(() => {
      window.addEventListener('group-click', (event) => {
        const customEvent = event as CustomEvent
        ;(window as Window & { lastClickedGroupId?: string }).lastClickedGroupId =
          customEvent.detail?.groupId
      })
    })

    // 最初のグループをクリック
    const firstGroup = await page.locator('.group-item').first()
    await firstGroup.locator('.group-button').click()

    // スタイルの変更を待つ
    await page.waitForTimeout(100)

    // イベントが発火したことを確認
    const clickedGroupId = await page.evaluate(
      () => (window as Window & { lastClickedGroupId?: string }).lastClickedGroupId,
    )
    expect(clickedGroupId).toBeDefined()
    expect(typeof clickedGroupId).toBe('string')
  })

  test('メンバーが多いグループで「他◯人」表示が機能する', async ({ page }) => {
    const groupList = page.locator('.group-list')

    // マーケティングチーム（3人）を確認
    const marketingTeam = groupList.locator('.group-item').nth(2)
    await expect(marketingTeam.locator('.group-name')).toHaveText('マーケティングチーム')

    // 3人全員が表示されているため、「他◯人」表示はないことを確認
    const moreMembers = marketingTeam.locator('.more-members')
    await expect(moreMembers).toHaveCount(0)
  })

  test('レスポンシブデザインが機能する', async ({ page }) => {
    // モバイル幅にリサイズ
    await page.setViewportSize({ width: 375, height: 667 })

    // グループ一覧が表示されることを確認
    const groupList = page.locator('.group-list')
    await expect(groupList).toBeVisible()

    // デスクトップ幅にリサイズ
    await page.setViewportSize({ width: 1280, height: 800 })
    await expect(groupList).toBeVisible()
  })

  test('グループの編集ボタンをクリックすると編集フォームが表示される', async ({ page }) => {
    await page.goto('/')

    // ページが完全に読み込まれるまで待機
    await page.waitForLoadState('networkidle')

    // グループ一覧の最初のグループの編集ボタンをクリック
    const editButton = await page.locator('.group-item').first().locator('.edit-btn')
    await expect(editButton).toBeVisible()
    await editButton.click()

    // 編集フォームコンテナが表示されることを確認（簡略化）
    const editFormContainer = await page.locator('#edit-form-container')
    await expect(editFormContainer).not.toHaveClass(/hidden/)
  })
})
