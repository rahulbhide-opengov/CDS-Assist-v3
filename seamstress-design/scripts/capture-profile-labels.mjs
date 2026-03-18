#!/usr/bin/env node
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, '../profile-screenshots');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  try {
    await page.goto('http://localhost:5173/permitting/profile', {
      waitUntil: 'networkidle',
      timeout: 15000,
    });
    await page.waitForTimeout(800);

    const formCard = page.locator('.MuiCard-root').filter({ has: page.locator('[aria-label="Profile sections"]') }).first();

    // Screenshot 1: Default state
    await formCard.screenshot({
      path: path.join(outputDir, 'personal-info-labels-check.png'),
    });
    console.log('Saved: personal-info-labels-check.png');

    // Screenshot 2: With Email field focused (to check blurple focus border)
    await page.getByLabel('Email Address').click().catch(() => page.locator('input[type="email"]').first().click());
    await page.waitForTimeout(300);
    await formCard.screenshot({
      path: path.join(outputDir, 'personal-info-email-focus.png'),
    });
    console.log('Saved: personal-info-email-focus.png');
  } catch (err) {
    console.error('Error:', err.message);
    await page.screenshot({ path: path.join(outputDir, 'error.png'), fullPage: true });
    process.exit(1);
  } finally {
    await browser.close();
  }
}
main();
