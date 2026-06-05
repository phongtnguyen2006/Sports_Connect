import { test, expect } from '@playwright/test';

test('signed-out user is sent to auth flow and sees registration validation', async ({ page }) => {
  await page.goto('/feed');

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'SportsConnect' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

  await page.getByRole('link', { name: 'Register instead' }).click();

  await expect(page).toHaveURL(/\/Registration$/);
  await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();

  await page.getByLabel('Email').fill('new-user@example.com');
  await page.getByLabel('Password').fill('weak');
  await page.getByRole('button', { name: 'Register' }).click();

  await expect(
    page.locator('.registration-page > p', {
      hasText: /Password must be 8-12 characters/i,
    })
  ).toBeVisible();
  await expect(page).toHaveURL(/\/Registration$/);
});
