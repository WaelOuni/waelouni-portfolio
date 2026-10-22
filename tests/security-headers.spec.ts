import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const vercelHeaders = JSON.parse(readFileSync('vercel.json', 'utf8')).headers.find((rule: { source: string }) => rule.source === '/(.*)').headers;

test('CSP keeps JSON-LD, language navigation, mobile menu and external links usable', async ({ page }) => {
  const cspErrors: string[] = [];
  await page.setViewportSize({ width: 390, height: 844 });
  const policyHeaders = Object.fromEntries(vercelHeaders.map((header: { key: string; value: string }) => [header.key.toLowerCase(), header.value]));
  await page.route('**/*', async route => {
    if (route.request().resourceType() !== 'document') return route.continue();
    const response = await route.fetch();
    await route.fulfill({ response, headers: { ...response.headers(), ...policyHeaders } });
  });
  page.on('console', message => {
    if (message.type() === 'error' && /content security policy|refused to/i.test(message.text())) cspErrors.push(message.text());
  });

  for (const [path, lang] of [['/', 'en'], ['/fr/', 'fr']] as const) {
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(3);
    const languageLink = page.locator(`a[hreflang="${lang === 'en' ? 'fr' : 'en'}"]`).first();
    await expect(languageLink).toHaveAttribute('href', lang === 'en' ? '/fr/' : '/');
    await page.locator('.mobile-menu summary').click();
    await expect(page.locator('.mobile-menu')).toHaveAttribute('open', '');
  }

  await page.goto('/projects/');
  await expect(page.locator('a[href="https://github.com/WaelOuni/stockpilot-ai"]')).toBeVisible();
  await page.goto('/contact/');
  await expect(page.locator('a[href="https://www.linkedin.com/in/wael-ouni-fullstack-developer/"]')).toBeVisible();
  expect(cspErrors).toEqual([]);
});
