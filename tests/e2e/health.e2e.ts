import { expect, test } from '@playwright/test'

test('health check - redirect to calendar', async ({ page }) => {
  await page.goto('/')

  // リダイレクトを待つ
  await page.waitForURL('**/groups/**/weekly-schedule', { timeout: 10000 })

  // カレンダー画面のタイトルを確認（グループ名が含まれる）
  const title = await page.title()
  expect(title).toBeTruthy()
})
