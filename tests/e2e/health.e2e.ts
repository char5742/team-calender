import { expect, test } from '@playwright/test'

const TITLE_PATTERN = /Team Calendar/

test('health check', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(TITLE_PATTERN)
})
