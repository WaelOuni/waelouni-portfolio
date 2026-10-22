import { test, expect } from '@playwright/test';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';

const removed = JSON.parse(readFileSync(new URL('./removed-content.json', import.meta.url), 'utf8')) as { terms: string[]; paths: string[]; assets: string[] };

async function filesUnder(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const lists = await Promise.all(entries.map(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(path) : Promise.resolve([path]);
  }));
  return lists.flat();
}

function expectClean(value: string, context: string) {
  for (const term of removed.terms) {
    expect(value.toLowerCase(), context).not.toContain(term.toLowerCase());
  }
}

test('removed pages and documents return genuine errors without redirects', async ({ page, request }) => {
  for (const path of [...removed.paths, ...removed.assets]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect([404, 410], path).toContain(response.status());
    expect(response.headers().location, path).toBeUndefined();
    if (removed.paths.includes(path)) {
      const navigation = await page.goto(path);
      expect([404, 410], path).toContain(navigation?.status());
      expect(new URL(page.url()).pathname).toBe(path);
    }
  }
});

test('production sources, build, links and sitemaps contain no removed content', async ({ request }) => {
  const files = [
    ...await filesUnder('dist'),
    ...await filesUnder('src'),
    ...await filesUnder('public'),
    'README.md', 'astro.config.mjs', 'vercel.json', 'nginx.conf', 'Dockerfile'
  ];
  for (const path of files) {
    expectClean(path, `Forbidden artifact path: ${path}`);
    if (/\.(?:astro|mdx?|ts|m?js|c?js|html|xml|txt|css|json|svg|conf)$/.test(path) || path === 'Dockerfile') {
      expectClean(await readFile(path, 'utf8'), `Forbidden reference in ${path}`);
    }
  }
  for (const path of ['/sitemap-index.xml', '/sitemap-0.xml', '/robots.txt']) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expectClean(await response.text(), path);
  }
});
