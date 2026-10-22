import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { routes, legacyRoutes } from '../src/i18n/routes';
import { en } from '../src/i18n/en';
import { resumeFiles } from '../scripts/resumes.mjs';
const origin = 'https://waelouni.fr';
for (const [key, pair] of Object.entries(routes)) {
  test(`${key}: localized content, SEO and reciprocal switching`, async ({ page, request }) => {
    for (const lang of ['en', 'fr'] as const) {
      const response = await page.goto(pair[lang]);
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', origin + pair[lang]);
      for (const alternate of ['en', 'fr', 'x-default'] as const) {
        await expect(page.locator(`link[hreflang="${alternate}"]`)).toHaveAttribute('href', origin + pair[alternate === 'fr' ? 'fr' : 'en']);
      }
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S.{40}/);
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', lang === 'en' ? 'en_GB' : 'fr_FR');
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', origin + pair[lang]);
      const image = await page.locator('meta[property="og:image"]').getAttribute('content');
      expect(image).toBe(`${origin}/og-image-${lang}.png`);
      expect((await request.get(`/og-image-${lang}.png`)).status()).toBe(200);
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
      await expect(page.locator('header')).toContainText(lang === 'en' ? 'Skills' : 'Compétences');
      await expect(page.locator('footer')).toContainText(lang === 'en' ? 'SEO-optimized static Astro portfolio.' : 'Portfolio statique Astro optimisé SEO.');
      const structured = await page.locator('script[type="application/ld+json"]').allTextContents();
      const document = structured.map(text => JSON.parse(text)).find(item => ['WebPage', 'TechArticle'].includes(item['@type']));
      expect(document.inLanguage).toBe(lang);
      expect(document.url).toBe(origin + pair[lang]);
      if (lang === 'en') {
        const content = (await page.locator('main').innerText()).replace(/\s+/g, ' ');
        // French source phrases must not leak into English output.
        for (const [source, translated] of Object.entries(en)) {
          if (source !== translated && source.length > 32) expect(content).not.toContain(source);
        }
      }
      const other = lang === 'en' ? 'fr' : 'en';
      await page.getByRole('link', { name: other === 'en' ? 'EN — English' : 'FR — Français', exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${pair[other]}$`));
      await expect(page.locator('html')).toHaveAttribute('lang', other);
    }
  });
}

test('default English ignores browser language; keyboard and native controls work without JS', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, locale: 'fr-FR', viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#contenu$/);
  await page.goto('/projects/');
  for (let step = 0; step < 15; step++) {
    if (await page.getByRole('link', {name: 'FR — Français', exact: true}).evaluate(el => el === document.activeElement)) break;
    await page.keyboard.press('Tab');
  }
  await expect(page.getByRole('link', {name: 'FR — Français', exact: true})).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/fr\/projets\/$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test('every internal link and asset resolves; navigation remains within its locale', async ({ page, request }) => {
  const checked = new Set<string>();
  for (const pair of Object.values(routes)) {
    for (const lang of ['en', 'fr'] as const) {
      await page.goto(pair[lang]);
      const navigation = await page.locator('header nav a[href]').evaluateAll(links => links.map(a => a.getAttribute('href')!));
      for (const href of navigation.filter(href => !['/', '/fr/'].includes(href))) {
        if (Object.values(pair).includes(href as never)) continue; // alternate language
        expect(href.startsWith('/fr/')).toBe(lang === 'fr');
      }
      const hrefs = await page.locator('[href], img[src], source[srcset], script[src]').evaluateAll(elements => elements.map(el => el.getAttribute('href') ?? el.getAttribute('src') ?? el.getAttribute('srcset')!).filter(href => href.startsWith('/')));
      for (const href of hrefs) {
        if (checked.has(href)) continue;
        checked.add(href);
        const response = await request.get(href);
        expect(response.status(), href).toBe(200);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
});

test('both PDFs are real, unchanged and downloadable from both locales', async ({ page, request }) => {
  for (const lang of ['en', 'fr'] as const) {
    await page.goto(routes.home[lang]);
    const primary = page.locator('main').getByRole('link', {name: lang === 'en' ? 'Download Resume' : 'Télécharger mon CV', exact: true});
    await expect(primary).toHaveAttribute('href', `/cv/${resumeFiles[lang].filename}`);
    const downloadPromise = page.waitForEvent('download');
    await primary.click();
    expect((await downloadPromise).suggestedFilename()).toBe(resumeFiles[lang].filename);
    await page.locator('main details summary').click();
    for (const locale of ['en', 'fr'] as const) {
      await expect(page.locator(`main details a[hreflang="${locale}"]`)).toBeVisible();
      const response = await request.get(`/cv/${resumeFiles[locale].filename}`);
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/pdf');
      const bytes = await response.body();
      expect(bytes.subarray(0, 5).toString()).toBe('%PDF-');
      const hash = (buffer: Buffer) => createHash('sha256').update(buffer).digest('hex');
      expect(hash(bytes)).toBe(hash(await readFile(`public/${resumeFiles[locale].source}`)));
    }
  }
});

test('sitemap and robots expose exactly the bilingual canonical pages', async ({ request }) => {
  const index = await request.get('/sitemap-index.xml');
  expect(index.status()).toBe(200);
  expect(await index.text()).toContain('https://waelouni.fr/sitemap-0.xml');
  const sitemap = await request.get('/sitemap-0.xml');
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect([...xml.matchAll(/<loc>/g)].length).toBe(18);
  for (const pair of Object.values(routes)) for (const path of Object.values(pair)) expect(xml).toContain(`<loc>${origin}${path}</loc>`);
  for (const path of Object.keys(legacyRoutes)) expect(xml).not.toContain(`<loc>${origin}${path}</loc>`);
  expect([...xml.matchAll(/hreflang="x-default"/g)].length).toBe(18);
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain('Allow: /');
  expect(await robots.text()).toContain('Sitemap: https://waelouni.fr/sitemap-index.xml');
});

test('permanent legacy redirects are configured consistently with static fallback', async ({ request }) => {
  const vercel = JSON.parse(await readFile('vercel.json', 'utf8'));
  const nginx = await readFile('nginx.conf', 'utf8');
  for (const [source, destination] of Object.entries(legacyRoutes)) {
    expect(vercel.redirects).toContainEqual({ source: source.slice(0, -1), destination, statusCode: 301 });
    expect(nginx).toContain(`return 301 ${destination};`);
    const response = await request.get(source, { maxRedirects: 0 });
    if (process.env.TEST_HTTP_REDIRECTS) {
      expect(response.status()).toBe(301);
      expect(response.headers().location).toMatch(new RegExp(`${destination}$`));
    } else {
      // A static Astro preview uses HTML redirects; Vercel/Nginx use HTTP 301.
      expect(await response.text()).toContain(`url=${destination}`);
    }
    expect((await request.get(destination)).status()).toBe(200);
  }
});

test('all pages satisfy automated WCAG 2.2 AA checks', async ({ page }) => {
  test.setTimeout(120_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const { default: AxeBuilder } = await import('@axe-core/playwright');
  for (const pair of Object.values(routes)) for (const path of Object.values(pair)) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    expect(results.violations, `${path}: ${JSON.stringify(results.violations.map(v => ({id: v.id, nodes: v.nodes.map(n => n.target)})))}`).toEqual([]);
  }
});
