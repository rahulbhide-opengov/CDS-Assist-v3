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

    // Screenshot the Card containing the Personal Info form (tabs + form content)
    const formCard = page.locator('.MuiCard-root').filter({ has: page.locator('[aria-label="Profile sections"]') }).first();
    await formCard.screenshot({
      path: path.join(outputDir, 'personal-info-form-fields.png'),
    });
    console.log('Saved: personal-info-form-fields.png');
  } catch (err) {
    console.error('Error:', err.message);
    await page.screenshot({ path: path.join(outputDir, 'error.png'), fullPage: true });
    process.exit(1);
  } finally {
    await browser.close();
  }
}
main();
