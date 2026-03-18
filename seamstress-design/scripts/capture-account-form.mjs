#!/usr/bin/env node
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, '../form-comparison-screenshots');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  try {
    await page.goto('http://localhost:5173/public-portal/account', {
      waitUntil: 'networkidle',
      timeout: 20000,
    });
    await page.waitForTimeout(1000);

    // Profile tab is default; capture viewport (form fields in top half)
    await page.screenshot({
      path: path.join(outputDir, '02-public-portal-account-form-fields.png'),
    });
    console.log('Saved: 02-public-portal-account-form-fields.png');
  } catch (err) {
    console.error('Error:', err.message);
    await page.screenshot({ path: path.join(outputDir, 'account-error.png'), fullPage: true });
    process.exit(1);
  } finally {
    await browser.close();
  }
}
main();
