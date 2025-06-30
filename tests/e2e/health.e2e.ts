import { expect, test } from '@playwright/test'

test('health check - top page shows group management', async ({ page }) => {
  await page.goto('/')

  // ページの読み込みを待つ
  await page.waitForLoadState('networkidle')

  // GroupManagementコンポーネントが表示されることを確認
  await expect(page.locator('.groups-container')).toBeVisible({ timeout: 10000 })

  // ページタイトルを確認
  const title = await page.title()
  expect(title).toContain('チームカレンダー')
})
