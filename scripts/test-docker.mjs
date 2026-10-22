import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { resumeFiles } from './resumes.mjs';
const container = process.env.TEST_CONTAINER ?? 'wael-i18n-review';
const status = path => {
  try { execFileSync('docker', ['exec', container, 'wget', '-S', '-O', '/dev/null', `http://127.0.0.1${path}`], {stdio: ['ignore', 'pipe', 'pipe']}); }
  catch (error) { return error.stderr.toString(); }
};
// wget sends HTTP diagnostics to stderr even on success.
function response(path) {
  const result = execFileSync('docker', ['exec', container, 'sh', '-c', 'wget -S -O /dev/null "$1" 2>&1', 'test', `http://127.0.0.1${path}`], {encoding:'utf8'});
  return result;
}
execFileSync('docker', ['exec', container, 'nginx', '-t']);
const paths = [...readFileSync('dist/sitemap-0.xml', 'utf8').matchAll(/<loc>https:\/\/waelouni.fr([^<]+)<\/loc>/g)].map(match => match[1]);
for (const path of [...paths, '/robots.txt', '/sitemap-index.xml', '/sitemap-0.xml', ...Object.values(resumeFiles).map(file => `/cv/${file.filename}`)]) assert.match(response(path), /HTTP\/1.1 200 OK/, path);
const assets = new Set(['/og-image-en.png', '/og-image-fr.png']);
for (const path of paths) {
  const html = readFileSync(`dist${path}index.html`, 'utf8');
  for (const match of html.matchAll(/(?:href|src|srcset)="(\/[^"#?\s]+)"/g)) assets.add(match[1]);
}
for (const asset of assets) assert.match(response(asset), /HTTP\/1.1 200 OK/, asset);
for (const slug of ['parcours', 'competences', 'projets']) for (const suffix of ['', '/']) {
  const text = response(`/${slug}${suffix}`);
  assert.match(text, /HTTP\/1.1 301 Moved Permanently/);
  assert.match(text, new RegExp(`Location: http://127.0.0.1/fr/${slug}/`));
  assert.equal((text.match(/HTTP\/1.1 301/g) ?? []).length, 1);
  assert.match(text, /HTTP\/1.1 200 OK/);
}
for (const file of Object.values(resumeFiles)) {
  const bytes = readFileSync(`public/${file.source}`);
  const hash = createHash('sha256').update(bytes).digest('hex');
  const dockerHash = execFileSync('docker', ['exec', container, 'sha256sum', `/usr/share/nginx/html/cv/${file.filename}`], {encoding:'utf8'}).split(' ')[0];
  assert.equal(hash, dockerHash);
}
const removed = JSON.parse(readFileSync('tests/removed-content.json', 'utf8'));
for (const path of [...removed.paths, ...removed.assets]) {
  const diagnostics = status(path) ?? '';
  assert.match(diagnostics, /HTTP\/1.1 (404 Not Found|410 Gone)/, path);
  assert.doesNotMatch(diagnostics, /HTTP\/1.1 30[1278]|Location:/, path);
}
const artifactPaths = execFileSync('docker', ['exec', container, 'find', '/usr/share/nginx/html', '-type', 'f'], { encoding: 'utf8' }).toLowerCase();
for (const term of removed.terms) assert.ok(!artifactPaths.includes(term.toLowerCase()), 'Removed assets must not be packaged');
assert.match(status('/definitely-missing-page/') ?? '', /404 Not Found/);
console.log(`PASS: Docker/Nginx serves ${paths.length} bilingual pages, robots, sitemaps, referenced assets and unchanged PDFs; all six legacy URL variants redirect once with HTTP 301; removed content and missing routes return 404.`);
