import { expect, test } from '@playwright/test'

test('health check - top page shows group management', async ({ page }) => {
  await page.goto('/')

  // ページの読み込みを待つ
  await page.waitForLoadState('networkidle')

  // リダイレクト後の週間カレンダーが表示されることを確認
  await expect(page.locator('.weekly-calendar')).toBeVisible({ timeout: 10000 })
  expect(page.url()).toContain('/groups/')

  // タイトルはリダイレクト先のグループ名になる
})
