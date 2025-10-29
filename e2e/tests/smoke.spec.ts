import { test, expect } from '@playwright/test';

test('homepage has dashboard', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Dashboard')).toBeVisible();
});
