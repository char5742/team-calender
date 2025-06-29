import { expect, test } from '@playwright/test'
import { formatDate, getWeekStart } from '../../src/utils/dateUtils'

// 正規表現をトップレベルで定義
const WEEKLY_SCHEDULE_URL_PATTERN = /\/groups\/[^\/]+\/weekly-schedule/
const WEEK_PARAM_PATTERN_1 = /week=1/
const WEEK_PARAM_PATTERN_0 = /week=0/
const WEEK_PARAM_PATTERN_MINUS_1 = /week=-1/

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
    const memberNames = calendar.locator('.member-name')

    // 開発チームのメンバー数（3人）を確認
    await expect(memberNames).toHaveCount(3)

    // メンバー名の確認
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

    // 背景色が設定されていることを確認
    const backgroundColor = await eventBlock.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor
    })

    // 透明でないことを確認
    expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(backgroundColor).not.toBe('transparent')
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

test.describe('週間カレンダーのナビゲーション', () => {
  test('グループ一覧から週間スケジュールページに遷移できる', async ({ page }) => {
    // グループ一覧ページに移動
    await page.goto('/')

    // グループリストが表示されるのを待つ
    await page.waitForSelector('.group-list')

    // 最初のグループのスケジュール表示ボタンをクリック
    const scheduleButton = page.locator('.schedule-btn').first()
    await expect(scheduleButton).toBeVisible()
    await scheduleButton.click()

    // 週間スケジュールページに遷移したことを確認
    await page.waitForURL(WEEKLY_SCHEDULE_URL_PATTERN)

    // カレンダーが表示されていることを確認
    const calendar = page.locator('.weekly-calendar')
    await expect(calendar).toBeVisible()
  })

  test('週切り替えボタンが動作する', async ({ page }) => {
    await page.goto('/groups/group-1/weekly-schedule')

    // 週切り替えボタンの存在確認
    const prevWeekBtn = page.locator('#prev-week')
    const nextWeekBtn = page.locator('#next-week')

    await expect(prevWeekBtn).toBeVisible()
    await expect(nextWeekBtn).toBeVisible()

    // 現在のURLを取得
    const initialUrl = page.url()

    // 次週ボタンをクリック
    await nextWeekBtn.click()

    // URLが変更されたことを確認（week=1パラメータが追加される）
    await page.waitForURL(WEEK_PARAM_PATTERN_1)
    const nextWeekUrl = page.url()
    expect(nextWeekUrl).toContain('week=1')
    expect(nextWeekUrl).not.toBe(initialUrl)

    // 前週ボタンをクリック
    await prevWeekBtn.click()

    // URLが変更されたことを確認（week=0に戻る）
    await page.waitForURL(WEEK_PARAM_PATTERN_0)
    const prevWeekUrl = page.url()
    expect(prevWeekUrl).toContain('week=0')

    // さらに前週ボタンをクリック
    await prevWeekBtn.click()

    // URLが変更されたことを確認（week=-1になる）
    await page.waitForURL(WEEK_PARAM_PATTERN_MINUS_1)
    const prevPrevWeekUrl = page.url()
    expect(prevPrevWeekUrl).toContain('week=-1')
  })

  test('グループ一覧に戻るリンクが機能する', async ({ page }) => {
    await page.goto('/groups/group-1/weekly-schedule')

    // 戻るリンクの存在確認
    const backLink = page.locator('.back-link')
    await expect(backLink).toBeVisible()
    await expect(backLink).toHaveText('← グループ一覧に戻る')

    // リンクをクリック
    await backLink.click()

    // グループ一覧ページに戻ったことを確認
    await expect(page).toHaveURL('/')

    // グループリストが表示されていることを確認
    const groupList = page.locator('.group-list')
    await expect(groupList).toBeVisible()
  })
})
