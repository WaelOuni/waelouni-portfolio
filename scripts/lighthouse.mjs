// Start npm run preview -- --host 127.0.0.1 --port 4322 first.
import { createHash } from 'node:crypto';
import { chromium } from '@playwright/test';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const base = process.env.LIGHTHOUSE_BASE_URL ?? 'http://127.0.0.1:4322';
const directory = mkdtempSync(join(tmpdir(), 'portfolio-lighthouse-'));
const results = [];
for (const lang of ['en', 'fr']) for (const device of ['mobile', 'desktop']) {
  const url = base + (lang === 'en' ? '/' : '/fr/');
  const output = join(directory, `${lang}-${device}.json`);
  const args = ['exec', '--yes', '--package=lighthouse@13.5.0', '--', 'lighthouse', url,
    '--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage',
    '--only-categories=performance,accessibility,best-practices,seo', '--output=json', `--output-path=${output}`, '--quiet'];
  if (device === 'desktop') args.push('--preset=desktop');
  const result = spawnSync('npm', args, { stdio: 'inherit', env: { ...process.env, CHROME_PATH: chromium.executablePath() } });
  if (result.status !== 0) process.exit(result.status ?? 1);
  const report = JSON.parse(readFileSync(output, 'utf8'));
  if (report.runtimeError) throw new Error(JSON.stringify(report.runtimeError));
  const entry = {
    lang, device, url, htmlSha256: createHash('sha256').update(readFileSync(lang === 'en' ? 'dist/index.html' : 'dist/fr/index.html')).digest('hex'), fetchedAt: report.fetchTime, lighthouseVersion: report.lighthouseVersion,
    scores: Object.fromEntries(Object.entries(report.categories).map(([key, value]) => [key, Math.round(value.score * 100)])),
    metrics: Object.fromEntries(['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'total-byte-weight', 'bootup-time'].map(key => [key, report.audits[key].numericValue])),
    savings: Object.fromEntries(['unused-css-rules', 'unused-javascript'].map(key => [key, report.audits[key]?.details?.overallSavingsBytes ?? 0])),
    fieldData: 'No field INP or CrUX measurement; TBT is a laboratory metric, not INP.',
    warnings: report.runWarnings,
    failedAccessibilityAudits: report.categories.accessibility.auditRefs.filter(ref => report.audits[ref.id].score === 0).map(ref => ref.id)
  };
  if (entry.scores.performance < 95 || entry.scores.accessibility < 95 || entry.scores['best-practices'] < 100 || entry.scores.seo < 100) throw new Error(`Lighthouse budget failed: ${JSON.stringify(entry)}`);
  results.push(entry);
  console.log(`${lang} ${device}: ${JSON.stringify(entry.scores)}`);
}
mkdirSync('reports', { recursive: true });
writeFileSync('reports/lighthouse.json', JSON.stringify({ scope: 'Local production preview; homepages only; simulated Lighthouse mobile/desktop settings. These are not production Vercel scores.', results }, null, 2) + '\n');
console.log(`Full reports: ${directory}`);
