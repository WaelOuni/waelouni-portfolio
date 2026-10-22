import { test, expect } from '@playwright/test';
import { routes } from '../src/i18n/routes';
import { portfolioCopy } from '../src/i18n/portfolio';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

for (const width of [320, 375, 390, 768, 1024, 1440, 1920]) {
  test(`all pages reflow at ${width}px, with complete text and headings`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width, height: 900 });
    for (const pair of Object.values(routes)) for (const path of Object.values(pair)) {
      await page.goto(path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), path).toBe(true);
      const headings = await page.locator('main h1, main h2, main h3').evaluateAll(nodes => nodes.map(el => ({
        level: Number(el.tagName.slice(1)), width: el.clientWidth, scroll: el.scrollWidth,
      })));
      for (let i = 0; i < headings.length; i++) {
        expect(headings[i].scroll, path).toBeLessThanOrEqual(headings[i].width + 1);
        if (i) expect(headings[i].level, `${path}: skipped heading`).toBeLessThanOrEqual(headings[i - 1].level + 1);
      }
    }
  });
}

test('mobile menu works with keyboard and no JavaScript, including French long labels', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 800 } });
  const page = await context.newPage();
  for (const lang of ['en', 'fr'] as const) {
    await page.goto(routes.home[lang]);
    const menu = page.locator('.mobile-menu');
    const summary = menu.locator('summary');
    await expect(summary).toBeVisible();
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(menu).toHaveAttribute('open', '');
    const links = menu.getByRole('link');
    await expect(links).toHaveCount(6);
    for (const link of await links.all()) {
      await expect(link).toBeVisible();
      const box = await link.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(box!.x + box!.width).toBeLessThanOrEqual(320);
    }
    await page.keyboard.press('Tab');
    await expect(links.first()).toBeFocused();
    const outline = await links.first().evaluate(el => getComputedStyle(el).outlineWidth);
    expect(parseFloat(outline)).toBeGreaterThanOrEqual(2);
    await links.last().focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(routes.contact[lang] + '$'));
    await page.locator('.mobile-menu summary').focus();
    await page.keyboard.press('Space');
    await expect(page.locator('.mobile-menu')).toHaveAttribute('open', '');
    await page.keyboard.press('Space');
    await expect(page.locator('.mobile-menu')).not.toHaveAttribute('open', '');
  }
  await context.close();
});

test('contact-first positioning, honest personal project and unchanged resumes', async ({ page, request }) => {
  const baseline = JSON.parse(await readFile('reports/premium-baseline.json', 'utf8'));
  for (const [filename, hash] of Object.entries(baseline.pdfHashes)) {
    expect(createHash('sha256').update(await readFile(`public/${filename}`)).digest('hex')).toBe(hash);
  }
  for (const lang of ['en', 'fr'] as const) {
    const c = portfolioCopy(lang);
    await page.goto(routes.home[lang]);
    await expect(page.locator('h1')).toHaveText(c('role'));
    await expect(page.locator('main a.button-primary').first()).toHaveAttribute('href', routes.contact[lang]);
    await page.locator('main a.button-primary').first().click();
    await expect(page.locator('h1')).toHaveText(c('contactTitle'));
    await expect(page.locator('main a[href^="mailto:"]').first()).toHaveAttribute('href', 'mailto:waelounie@gmail.com');
    expect(await page.locator('main').innerText()).not.toMatch(/available immediately|disponible immédiatement|available for|disponible pour/i);
    await page.goto(routes.projects[lang]);
    const project = page.locator('#stockpilot');
    await expect(project).toContainText(c('stockStatus'));
    await expect(project).toContainText(c('stockLimits'));
    await expect(project.getByRole('link', { name: new RegExp(c('source')) })).toHaveAttribute('href', 'https://github.com/WaelOuni/stockpilot-ai');
    expect((await request.get(routes.projects[lang])).status()).toBe(200);
    expect(await page.locator('script:not([type="application/ld+json"])').count()).toBe(0);
  }
});

test('article contents, evidence anchors, code keyboard access and honest dates', async ({ page }) => {
  for (const [key, pair] of Object.entries(routes)) for (const lang of ['en','fr'] as const) {
    await page.goto(pair[lang]);
    const fragments = await page.locator('main a[href*="#"]').evaluateAll(nodes => nodes.map(n => (n as HTMLAnchorElement).href));
    for (const href of new Set(fragments)) {
      const target = new URL(href);
      if (target.origin !== new URL(page.url()).origin) continue;
      const response = await page.request.get(target.pathname);
      expect(response.status()).toBe(200);
      expect(await response.text()).toContain(`id="${decodeURIComponent(target.hash.slice(1))}"`);
    }
    if (!['kafka', 'datadog', 'architecture'].includes(key)) continue;
    const c = portfolioCopy(lang);
    const toc = page.getByRole('navigation', { name: c('contents') });
    await expect(toc).toBeVisible();
    const first = toc.getByRole('link').first();
    await first.click();
    expect(new URL(page.url()).hash).not.toBe('');
    const date = page.locator('time');
    await expect(date).toHaveAttribute('datetime', '2026-10-22');
    const structured = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(x => JSON.parse(x)).find(x => x['@type'] === 'TechArticle');
    expect(structured.dateModified).toBe('2026-10-22');
    expect(structured.datePublished).toBeUndefined();
    const code = page.locator('pre');
    expect(await code.count()).toBeGreaterThan(0);
    for (const block of await code.all()) {
      await expect(block).toHaveAttribute('tabindex', '0');
      await expect(block).toHaveAttribute('aria-label', lang === 'en' ? 'Code example' : 'Exemple de code');
      await block.focus();
      await expect(block).toBeFocused();
    }
  }
});

test('expanded mobile navigation and resume choices pass automated accessibility checks', async ({ page }) => {
  const { default: AxeBuilder } = await import('@axe-core/playwright');
  await page.setViewportSize({ width: 320, height: 800 });
  for (const lang of ['en', 'fr'] as const) {
    await page.goto(routes.home[lang]);
    await page.locator('.mobile-menu summary').click();
    let audit = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
    expect(audit.violations).toEqual([]);
    await page.locator('.mobile-menu summary').click();
    await page.locator('main .resume-controls summary').click();
    for (const link of await page.locator('main .resume-options a').all()) {
      const box = await link.boundingBox();
      expect(box!.x + box!.width).toBeLessThanOrEqual(320);
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
    audit = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
    expect(audit.violations).toEqual([]);
  }
});
