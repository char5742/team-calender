import { expect, test } from '@playwright/test'

test('health check', async ({ page }) => {
  await page.goto('about:blank')
  await expect(page).toHaveTitle('')
})
