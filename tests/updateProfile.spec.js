import { test, expect } from '@playwright/test';

test('logged-in user can update profile and see changes on profile page', async ({
  page,
}) => {
  const randomId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const updatedBio = `Playwright bio update ${randomId}`;
  const updatedFirstName = `E2E${randomId.slice(-4)}`;

  await login(page);

  await page.getByRole('navigation').getByRole('link', { name: 'Profile' }).click();
  await expect(page).toHaveURL(/\/profile$/);
  await expect(page.getByRole('link', { name: 'Edit Profile' })).toBeVisible();

  await page.getByRole('link', { name: 'Edit Profile' }).click();
  await expect(page).toHaveURL(/\/profile\/edit-profile$/);
  await expect(page.getByRole('button', { name: 'Save Profile' })).toBeVisible();

  await page.getByPlaceholder('First name').fill(updatedFirstName);
  await page.getByPlaceholder('Enter Bio').fill(updatedBio);

  const saveProfileResponsePromise = page.waitForResponse(
    (response) =>
      response.url().includes('/api/users/complete-profile') &&
      response.request().method() === 'PATCH'
  );

  await page.getByRole('button', { name: 'Save Profile' }).click();

  const saveProfileResponse = await saveProfileResponsePromise;
  const saveProfileBody = await saveProfileResponse.json().catch(() => ({}));

  expect(
    saveProfileResponse.ok(),
    `Profile update failed: ${saveProfileBody.error ?? saveProfileResponse.status()}`
  ).toBeTruthy();

  await expect(page).toHaveURL(/\/profile$/);
  await expect(page.getByText(updatedBio)).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    updatedFirstName
  );
});

async function login(page) {
  await page.goto('/login');

  await page.getByLabel('Email').fill('e2etester@test.com');
  await page.getByLabel('Password').fill('Tester1!');

  const loginResponsePromise = page.waitForResponse(
    (response) =>
      response.url().endsWith('/api/users/login') &&
      response.request().method() === 'POST'
  );

  await page.getByRole('button', { name: 'Login' }).click();

  const loginResponse = await loginResponsePromise;
  const loginBody = await loginResponse.json().catch(() => ({}));

  expect(
    loginResponse.ok(),
    `Login failed: ${loginBody.error ?? loginResponse.status()}`
  ).toBeTruthy();

  await expect(page).toHaveURL(/\/feed$/);
}
