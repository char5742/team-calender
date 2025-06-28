import { expect, test } from '@playwright/test'

test('health check', async ({ page }) => {
  await page.goto('/health')
  await expect(page).toHaveTitle('Health Check') // Replace 'Health Check' with the actual expected title of the /health page
})
