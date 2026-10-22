import { en } from './en';
import { fr } from './fr';
import type { Locale } from './config';
import { routes, legacyRoutes, type RouteKey } from './routes';
export function language(url: URL): Locale {
  return /^\/fr(?:\/|$)/.test(url.pathname) ? 'fr' : 'en';
}
export const translator = (lang: Locale) => (text: string): string => lang === 'fr' ? (fr[text] ?? text) : (en[text] ?? text);
export function routeKey(path: string): RouteKey | undefined {
  const normalized = path === '/' ? '/' : `${path.replace(/\/$/, '')}/`;
  return (Object.keys(routes) as RouteKey[]).find(key => Object.values(routes[key]).some(value => value === normalized));
}
export function localizePath(path: string, lang: Locale): string {
  const key = routeKey(legacyRoutes[path] ?? path);
  return key ? routes[key][lang] : path;
}
export function localizeData<T>(data: T, lang: Locale): T {
  const t = translator(lang);
  const visit = (value: unknown): unknown => typeof value === 'string' ? t(value) : Array.isArray(value) ? value.map(visit) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, visit(item)])) : value;
  return visit(data) as T;
}
