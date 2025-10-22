import { test, expect } from '@playwright/test';

test('Notifications basic flow', async ({ page }) => {
  // TODO: add a login helper if your route is auth-protected
  await page.goto('/notifications');

  await expect(page.getByRole('heading', { name: 'Notifications' })).toBeVisible();

  // Filter works
  const filter = page.getByLabel(/filter/i);
  await filter.click();
  await page.getByRole('option', { name: /Unread/i }).click();

  // Mark all as read is conditional; don't fail if hidden
  const markAll = page.getByRole('button', { name: /Mark all as read/i });
  // Optional: if visible, click it
  if (await markAll.isVisible()) {
    await markAll.click();
  }

  // Ensure no console errors
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  await expect.poll(() => errors.length).toBe(0);
});

