import { existsSync } from 'node:fs';
// Original files remain untouched. The build copies their bytes to these public aliases.
import { resumeFiles } from "../../scripts/resumes.mjs";
export const resumes = Object.fromEntries(Object.entries(resumeFiles).map(([lang, file]) => [lang, existsSync(new URL(`../../public/${file.source}`, import.meta.url)) ? `/cv/${file.filename}` : undefined])) as Record<'en' | 'fr', string | undefined>;
