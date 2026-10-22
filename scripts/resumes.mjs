import { existsSync, mkdirSync, copyFileSync, rmSync } from 'node:fs';
export const resumeFiles = {
  en: { source: 'Wael_Ouni_CV_Java_Angular_English.pdf', filename: 'wael-ouni-resume-en.pdf' },
  fr: { source: 'Wael_Ouni_CV_Fullstack_Java_Angular_FR.pdf', filename: 'wael-ouni-cv-fr.pdf' }
};
export function prepareResumes() {
  const directory = new URL('../public/cv/', import.meta.url);
  mkdirSync(directory, { recursive: true });
  for (const file of Object.values(resumeFiles)) {
    const source = new URL(`../public/${file.source}`, import.meta.url);
    const target = new URL(file.filename, directory);
    if (existsSync(source)) copyFileSync(source, target);
    else rmSync(target, { force: true });
  }
}
