#!/usr/bin/env node
/**
 * Verifies CDS TextField theme (labels above input) applies globally.
 * Captures: themes page, patterns page, public-portal account page.
 */
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, '../textfield-global-check');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  try {
    // 1. Themes page - Text Inputs section
    await page.goto('http://localhost:5173/seamstress/themes', {
      waitUntil: 'networkidle',
      timeout: 15000,
    });
    await page.waitForTimeout(1000);

    // Scroll to Text Inputs section (h4 with "Text Inputs")
    await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h4, h3, h2'));
      const textInputs = headings.find(h => h.textContent?.trim() === 'Text Inputs');
      if (textInputs) {
        textInputs.scrollIntoView({ block: 'center', behavior: 'instant' });
      } else {
        window.scrollBy(0, 1200);
      }
    });
    await page.waitForTimeout(600);

    await page.screenshot({
      path: path.join(outputDir, '01-themes-text-inputs.png'),
      fullPage: false,
    });
    console.log('Saved: 01-themes-text-inputs.png');

    // 2. Component patterns page - has form with TextFields
    await page.goto('http://localhost:5173/docs/component-patterns', {
      waitUntil: 'networkidle',
      timeout: 15000,
    });
    await page.waitForTimeout(1000);

    // Scroll to form section (Create New Request form)
    await page.evaluate(() => {
      const createRequest = Array.from(document.querySelectorAll('*')).find(
        n => n.textContent?.includes('Create New Request')
      );
      if (createRequest) createRequest.scrollIntoView({ block: 'center', behavior: 'instant' });
      else window.scrollBy(0, 800);
    });
    await page.waitForTimeout(600);

    await page.screenshot({
      path: path.join(outputDir, '02-patterns-form.png'),
      fullPage: false,
    });
    console.log('Saved: 02-patterns-form.png');

    // 3. Public portal account - profile form
    await page.goto('http://localhost:5173/public-portal/account', {
      waitUntil: 'networkidle',
      timeout: 15000,
    });
    await page.waitForTimeout(1000);

    // Find Profile tab content
    const profileSection = page.locator('[role="tabpanel"]').first();
    await profileSection.scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(300);

    await page.screenshot({
      path: path.join(outputDir, '03-public-portal-account.png'),
      fullPage: false,
    });
    console.log('Saved: 03-public-portal-account.png');

    console.log('\nAll screenshots saved to:', outputDir);
  } catch (err) {
    console.error('Error:', err.message);
    await page.screenshot({ path: path.join(outputDir, 'error.png'), fullPage: true });
    process.exit(1);
  } finally {
    await browser.close();
  }
}
main();
