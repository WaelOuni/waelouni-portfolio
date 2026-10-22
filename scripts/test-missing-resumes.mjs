import { mkdtemp, cp, symlink, mkdir, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
const root = await mkdtemp(join(tmpdir(), 'portfolio-missing-cv-'));
try {
  for (const file of ['src', 'scripts', 'astro.config.mjs', 'tsconfig.json', 'tailwind.config.mjs', 'package.json']) await cp(file, join(root, file), { recursive: true });
  await symlink(resolve('node_modules'), join(root, 'node_modules'), 'dir');
  await mkdir(join(root, 'public'));
  for (const file of await readdir('public', { withFileTypes: true })) {
    if (file.isFile() && !file.name.endsWith('.pdf')) await cp(join('public', file.name), join(root, 'public', file.name));
  }
  const build = () => {
    const result = spawnSync(process.execPath, [resolve('node_modules/astro/astro.js'), 'build', '--root', root], { cwd: root, encoding: 'utf8', env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' } });
    assert.equal(result.status, 0, result.stdout + result.stderr);
  };
  build();
  for (const path of ['index.html', 'fr/index.html']) {
    const html = await readFile(join(root, 'dist', path), 'utf8');
    assert.doesNotMatch(html, /href="[^"]*\.pdf"/);
    assert.doesNotMatch(html, /<summary[^>]*>(Resume languages|Langues du CV)/);
  }
  // A single available language must remain downloadable from either locale.
  await cp('public/Wael_Ouni_CV_Fullstack_Java_Angular_FR.pdf', join(root, 'public/Wael_Ouni_CV_Fullstack_Java_Angular_FR.pdf'));
  build();
  for (const path of ['index.html', 'fr/index.html']) {
    const html = await readFile(join(root, 'dist', path), 'utf8');
    assert.match(html, /href="\/cv\/wael-ouni-cv-fr.pdf"/);
    assert.doesNotMatch(html, /href="\/cv\/wael-ouni-resume-en.pdf"/);
  }
  console.log('PASS: missing PDFs produce no broken links; a single available CV remains accessible from both locales. Original PDFs were untouched.');
} finally { await rm(root, { recursive: true, force: true }); }
