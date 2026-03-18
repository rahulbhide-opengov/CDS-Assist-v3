#!/usr/bin/env node
/**
 * Captures screenshots of the User Profile page at /permitting/profile
 * Run: node scripts/capture-profile-screenshots.mjs
 */
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, '../profile-screenshots');

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
    // Navigate to profile page
    await page.goto('http://localhost:5173/permitting/profile', {
      waitUntil: 'networkidle',
      timeout: 15000,
    });

    // Wait for content to load
    await page.waitForSelector('[data-testid], .MuiTabs-root, h1, [role="tabpanel"]', { timeout: 5000 }).catch(() => {});

    // Small delay for any animations
    await page.waitForTimeout(500);

    // 1. Full page screenshot (Personal Info tab - default)
    await page.screenshot({
      path: path.join(outputDir, '01-profile-full-page.png'),
      fullPage: true,
    });
    console.log('Saved: 01-profile-full-page.png');

    // 2. Click Security tab
    await page.click('button[role="tab"]:has-text("Security")');
    await page.waitForTimeout(300);

    await page.screenshot({
      path: path.join(outputDir, '02-profile-security-tab.png'),
      fullPage: true,
    });
    console.log('Saved: 02-profile-security-tab.png');

    // 3. Click Notifications tab
    await page.click('button[role="tab"]:has-text("Notifications")');
    await page.waitForTimeout(300);

    await page.screenshot({
      path: path.join(outputDir, '03-profile-notifications-tab.png'),
      fullPage: true,
    });
    console.log('Saved: 03-profile-notifications-tab.png');

    console.log('\nAll screenshots saved to:', outputDir);
  } catch (err) {
    console.error('Error:', err.message);
    // Take a screenshot of whatever we have on error
    try {
      await page.screenshot({
        path: path.join(outputDir || __dirname, 'error-state.png'),
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
