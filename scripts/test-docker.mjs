import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { readFileSync as readConfig } from 'node:fs';
import { resumeFiles } from './resumes.mjs';
const container = process.env.TEST_CONTAINER ?? 'wael-i18n-review';
const status = path => {
  try { execFileSync('docker', ['exec', container, 'wget', '-S', '-O', '/dev/null', `http://127.0.0.1${path}`], {stdio: ['ignore', 'pipe', 'pipe']}); }
  catch (error) { return error.stderr.toString(); }
};
// wget sends HTTP diagnostics to stderr even on success.
function response(path) {
  const result = execFileSync('docker', ['exec', container, 'sh', '-c', 'printf "GET %s HTTP/1.1\\r\\nHost: 127.0.0.1\\r\\nConnection: close\\r\\n\\r\\n" "$1" | nc 127.0.0.1 80', 'test', path], {encoding:'utf8'});
  return result;
}
function assertSecurityHeaders(path) {
  const headers = response(path);
  assert.match(headers, /Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; upgrade-insecure-requests/i, `${path}: CSP`);
  assert.match(headers, /X-Content-Type-Options: nosniff/i, `${path}: nosniff`);
  assert.match(headers, /X-Frame-Options: DENY/i, `${path}: frame protection`);
  assert.match(headers, /Referrer-Policy: strict-origin-when-cross-origin/i, `${path}: referrer policy`);
  assert.match(headers, /Permissions-Policy: camera=\(\), microphone=\(\), geolocation=\(\)/i, `${path}: permissions policy`);
  assert.doesNotMatch(headers, /unsafe-inline|unsafe-eval/i, `${path}: permissive CSP exception`);
  for (const name of ['Content-Security-Policy', 'X-Content-Type-Options', 'X-Frame-Options', 'Referrer-Policy', 'Permissions-Policy']) {
    assert.equal((headers.match(new RegExp(`${name}:`, 'ig')) ?? []).length, 1, `${path}: ${name} must be emitted once`);
  }
}
const expectedSecurityHeaders = {
  'Content-Security-Policy': "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; upgrade-insecure-requests",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};
const vercelConfig = JSON.parse(readConfig('vercel.json', 'utf8'));
const vercelHeaders = vercelConfig.headers.find(rule => rule.source === '/(.*)').headers;
for (const [key, value] of Object.entries(expectedSecurityHeaders)) {
  assert.equal(vercelHeaders.find(header => header.key === key)?.value, value, `Vercel ${key}`);
  assert.match(readConfig('nginx/security-headers.conf', 'utf8'), new RegExp(`^add_header ${key} "${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}" always;$`, 'm'), `Nginx ${key}`);
}
assert.ok(!vercelHeaders.some(header => header.key.toLowerCase() === 'strict-transport-security'), 'Keep platform HSTS; do not duplicate it in Vercel config');
execFileSync('docker', ['exec', container, 'nginx', '-t']);
const paths = [...readFileSync('dist/sitemap-0.xml', 'utf8').matchAll(/<loc>https:\/\/waelouni.fr([^<]+)<\/loc>/g)].map(match => match[1]);
for (const path of [...paths, '/robots.txt', '/sitemap-index.xml', '/sitemap-0.xml', ...Object.values(resumeFiles).map(file => `/cv/${file.filename}`)]) {
  assert.match(response(path), /HTTP\/1.1 200 OK/, path);
  assertSecurityHeaders(path);
}
const assets = new Set(['/og-image-en.png', '/og-image-fr.png']);
for (const path of paths) {
  const html = readFileSync(`dist${path}index.html`, 'utf8');
  for (const match of html.matchAll(/(?:href|src|srcset)="(\/[^"#?\s]+)"/g)) assets.add(match[1]);
}
for (const asset of assets) {
  assert.match(response(asset), /HTTP\/1.1 200 OK/, asset);
  assertSecurityHeaders(asset);
}
for (const slug of ['parcours', 'competences', 'projets']) for (const suffix of ['', '/']) {
  const text = response(`/${slug}${suffix}`);
  assertSecurityHeaders(`/${slug}${suffix}`);
  assert.match(text, /HTTP\/1.1 301 Moved Permanently/);
  assert.match(text, new RegExp(`Location: http://127.0.0.1/fr/${slug}/`));
  assert.equal((text.match(/HTTP\/1.1 301/g) ?? []).length, 1);
  assert.match(response(`/fr/${slug}/`), /HTTP\/1.1 200 OK/);
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
  assertSecurityHeaders(path);
  assert.doesNotMatch(diagnostics, /HTTP\/1.1 30[1278]|Location:/, path);
}
const artifactPaths = execFileSync('docker', ['exec', container, 'find', '/usr/share/nginx/html', '-type', 'f'], { encoding: 'utf8' }).toLowerCase();
for (const term of removed.terms) assert.ok(!artifactPaths.includes(term.toLowerCase()), 'Removed assets must not be packaged');
assert.match(status('/definitely-missing-page/') ?? '', /404 Not Found/);
console.log(`PASS: Vercel and Nginx security policies match; Docker/Nginx serves ${paths.length} bilingual pages, robots, sitemaps, referenced assets and unchanged PDFs with security headers; all six legacy URL variants redirect once with HTTP 301; removed content and missing routes return 404.`);
