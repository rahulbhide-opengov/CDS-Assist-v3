#!/usr/bin/env node
/**
 * Captures focused screenshots of form fields for comparison:
 * 1. Permitting profile - Personal Info tab
 * 2. Public portal account - Profile tab
 */
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, '../form-comparison-screenshots');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  try {
    // 1. Permitting profile - Personal Info tab form
    await page.goto('http://localhost:5173/permitting/profile', {
      waitUntil: 'networkidle',
      timeout: 15000,
    });
    await page.waitForTimeout(800);

    // Screenshot the Card containing the tabs and form (right side content)
    const profileFormCard = page.locator('.MuiCard-root').filter({ has: page.locator('[aria-label="Profile sections"]') }).first();
    await profileFormCard.screenshot({
      path: path.join(outputDir, '01-permitting-profile-form-fields.png'),
    });
    console.log('Saved: 01-permitting-profile-form-fields.png');

    // 2. Public portal account - Profile tab form
    await page.goto('http://localhost:5173/public-portal/account', {
      waitUntil: 'networkidle',
      timeout: 15000,
    });
    await page.waitForTimeout(800);

    // Profile tab is index 0 (default), find the Profile tab content
    const accountFormCard = page.locator('[role="tabpanel"]').first();
    await accountFormCard.screenshot({
      path: path.join(outputDir, '02-public-portal-account-form-fields.png'),
    });
    console.log('Saved: 02-public-portal-account-form-fields.png');

    console.log('\nScreenshots saved to:', outputDir);
  } catch (err) {
    console.error('Error:', err.message);
    try {
      await page.screenshot({
        path: path.join(outputDir, 'error-state.png'),
        fullPage: true,
      });
      console.log('Error state screenshot saved');
    } catch (e) {}
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
