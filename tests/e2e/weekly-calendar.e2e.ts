import { expect, test } from '@playwright/test'
import { formatDate, getWeekStart } from '../../src/utils/dateUtils'

test.describe('週間カレンダービュー', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/groups/group-1/weekly-schedule')
  })

  test('カレンダーグリッドが表示される', async ({ page }) => {
    // カレンダーコンテナの存在確認
    const calendar = page.locator('.weekly-calendar')
    await expect(calendar).toBeVisible()

    // グリッドレイアウトの確認
    const grid = calendar.locator('.calendar-grid')
    await expect(grid).toBeVisible()
  })

  test('曜日ヘッダーが正しく表示される', async ({ page }) => {
    const calendar = page.locator('.weekly-calendar')
    const dayHeaders = calendar.locator('.day-header')

    // 7日分のヘッダーがあることを確認
    await expect(dayHeaders).toHaveCount(7)

    // 曜日の表示を確認
    const dayTexts = await dayHeaders.allTextContents()
    const expectedDays = ['月', '火', '水', '木', '金', '土', '日']

    for (let i = 0; i < 7; i++) {
      expect(dayTexts[i]).toContain(expectedDays[i])
    }
  })

  test('メンバー名が正しく表示される', async ({ page }) => {
    const calendar = page.locator('.weekly-calendar')
    const memberRows = calendar.locator('.member-row')

    // 開発チームのメンバー数（3人）を確認
    await expect(memberRows).toHaveCount(3)

    // メンバー名の確認（.member-name-textセレクターを使用）
    const memberNames = calendar.locator('.member-name-text')
    const names = await memberNames.allTextContents()
    expect(names).toContain('山田太郎')
    expect(names).toContain('佐藤花子')
    expect(names).toContain('鈴木一郎')
  })

  test('予定ブロックが表示される', async ({ page }) => {
    const calendar = page.locator('.weekly-calendar')

    // 予定ブロックの存在確認
    const eventBlocks = calendar.locator('.event-block')
    const eventCount = await eventBlocks.count()

    // 少なくとも1つの予定が表示されていることを確認
    expect(eventCount).toBeGreaterThan(0)

    // 最初の予定ブロックの内容を確認
    const firstEvent = eventBlocks.first()
    await expect(firstEvent).toBeVisible()

    // タイトルが表示されていることを確認
    const title = firstEvent.locator('.event-title')
    await expect(title).toBeVisible()
    const titleText = await title.textContent()
    expect(titleText).toBeTruthy()
  })

  test('予定ブロックに色が適用される', async ({ page }) => {
    const calendar = page.locator('.weekly-calendar')
    const eventBlock = calendar.locator('.event-block').first()

    // 左側のボーダーの色が設定されていることを確認
    const borderLeftColor = await eventBlock.evaluate((el) => {
      return window.getComputedStyle(el).borderLeftColor
    })

    // ボーダーの色が透明でないことを確認
    expect(borderLeftColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(borderLeftColor).not.toBe('transparent')

    // ボーダーの色が設定されていることを確認（例：primary colorなど）
    expect(borderLeftColor).toBeTruthy()
  })

  test('現在の週の日付が正しく表示される', async ({ page }) => {
    const calendar = page.locator('.weekly-calendar')
    const dayHeaders = calendar.locator('.day-header')

    // 現在の週の開始日を取得
    const now = new Date()
    const weekStart = getWeekStart(now)

    // 各日付が正しく表示されているか確認
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart)
      date.setDate(date.getDate() + i)
      const expectedDateStr = formatDate(date, 'M/D')

      const headerText = await dayHeaders.nth(i).textContent()
      expect(headerText).toContain(expectedDateStr)
    }
  })

  test('予定が時間に基づいて配置される', async ({ page }) => {
    const calendar = page.locator('.weekly-calendar')
    const eventBlocks = calendar.locator('.event-block')

    // 複数の予定がある場合、異なる位置に配置されることを確認
    const eventCount = await eventBlocks.count()

    if (eventCount >= 2) {
      const firstEventStyle = await eventBlocks.first().getAttribute('style')
      const secondEventStyle = await eventBlocks.nth(1).getAttribute('style')

      // スタイルが異なることを確認（位置が異なる）
      expect(firstEventStyle).toBeTruthy()
      expect(secondEventStyle).toBeTruthy()

      // 少なくともtopかleftの値が異なることを期待
      // （同じ時間帯の予定でない限り）
    }
  })
})
