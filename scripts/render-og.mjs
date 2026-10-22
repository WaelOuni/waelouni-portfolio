// Render the existing vector design into social-network compatible PNGs.
// Run after changing either SVG: node scripts/render-og.mjs
import { chromium } from '@playwright/test';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  for (const lang of ['en', 'fr']) {
    await page.goto(pathToFileURL(resolve(`public/og-image${lang === 'en' ? '-en' : ''}.svg`)).href);
    await page.screenshot({ path: `public/og-image-${lang}.png`, omitBackground: false });
  }
} finally { await browser.close(); }
