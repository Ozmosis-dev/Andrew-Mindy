import { test, expect } from '@playwright/test';

test('submit intake form and verify success screen', async ({ page }) => {
  await page.goto('http://localhost:3000/work-with-me');
  
  // Fill text fields
  await page.fill('input#intake-name', 'Test User');
  await page.fill('input#intake-email', 'test@test.com');
  
  // Select service
  await page.click('text=Web Design');

  // Fill text area
  await page.fill('textarea#intake-situation', 'Testing the contact form');

  // Select budget and timeline
  await page.click('text=Under $5k');
  await page.click('text=As soon as possible');

  // Submit form
  await page.click('button[type="submit"]');

  // Wait for success screen
  await page.waitForSelector('text=Got it — I\'ll be in touch.');

  // Take screenshot
  await page.screenshot({ path: 'success_screen.png' });
});
