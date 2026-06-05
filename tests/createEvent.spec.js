import { test, expect } from '@playwright/test';

function formatDateTimeLocal(date) {
  const pad = (value) => String(value).padStart(2, '0');

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('-') + `T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

test('logged-in user can create an event and see it in the feed', async ({ page }) => {
  const randomId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const eventTitle = `E2E Test Event ${randomId}`;
  const startDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

  await login(page); 
  
  await checkFeedPage(page); 

  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Create Event' })
    .click();

  await checkCreateEventForm(page); 

  await fillCreateEventForm(page, eventTitle, startDate, endDate);

  await checkFeedPage(page); 
  await expect(page.getByRole('heading', { name: eventTitle })).toBeVisible();
});

async function login(page){
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

  expect(loginResponse.ok(), `Login failed: ${loginBody.error ?? loginResponse.status()}`).toBeTruthy();
}

async function checkFeedPage(page) {
  await expect(page).toHaveURL(/\/feed$/);
  await expect(page.getByRole('heading', { name: 'Event Feed' })).toBeVisible();
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(
    page.getByRole('navigation').getByRole('link', { name: 'Create Event' })
  ).toBeVisible();
}

async function checkCreateEventForm(page) {
  await expect(page).toHaveURL(/\/create-event$/);
  await expect(page.getByRole('heading', { name: 'Create Event' })).toBeVisible();  
  await expect(page.getByLabel('Title')).toBeVisible();
  await expect(page.getByLabel('Description')).toBeVisible();
  await expect(page.getByLabel('Start')).toBeVisible();
  await expect(page.getByLabel('Ends')).toBeVisible();
  await expect(page.getByLabel('Location')).toBeVisible();
  await expect(page.getByLabel('Sport')).toBeVisible();
  await expect(page.getByLabel('Max attendees')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Create Event' })).toBeVisible();
}

async function fillCreateEventForm(page, eventTitle, startDate, endDate) {
  await page.getByLabel('Title').fill(eventTitle);
  await page.getByLabel('Description').fill('Created by a Playwright e2e test.');
  await page.getByLabel('Start').fill(formatDateTimeLocal(startDate));
  await page.getByLabel('Ends').fill(formatDateTimeLocal(endDate));
  await page.getByLabel('Location').fill('Playwright Test Gym');
  await page.getByLabel('Sport').fill('Basketball');
  await page.getByLabel('Max attendees').fill('12');

  const createEventResponsePromise = page.waitForResponse(
    (response) =>
      response.url().endsWith('/api/events') &&
      response.request().method() === 'POST'
  );
  await page.getByRole('button', { name: 'Create Event' }).click();
  const createEventResponse = await createEventResponsePromise;
  const createEventBody = await createEventResponse.json().catch(() => ({}));

  expect(
    createEventResponse.ok(),
    `Create event failed: ${createEventBody.error ?? createEventResponse.status()}`
  ).toBeTruthy();
}
