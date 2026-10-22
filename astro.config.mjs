import accessibleCode from "./src/lib/accessible-code.mjs";
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

import { defaultLocale, locales, site } from "./src/i18n/config.ts";
import { routes, legacyRoutes } from "./src/i18n/routes.ts";
import { prepareResumes } from "./scripts/resumes.mjs";
prepareResumes();

export default defineConfig({
  site,
  trailingSlash: "always",
  i18n: { defaultLocale, locales: [...locales], routing: { prefixDefaultLocale: false } },
  redirects: Object.fromEntries(Object.entries(legacyRoutes).map(([source, destination]) => [source, { status: 301, destination }])),
  integrations: [
    mdx(),
    sitemap({
      filter: page => !Object.keys(legacyRoutes).some(path => new URL(page).pathname === path),
      serialize(item) {
        const pair = Object.values(routes).find(pair => Object.values(pair).some(path => new URL(item.url).pathname === path));
        if (pair) item.links = [
          { lang: "en", url: new URL(pair.en, site).href },
          { lang: "fr", url: new URL(pair.fr, site).href },
          { lang: "x-default", url: new URL(pair.en, site).href }
        ];
        return item;
      }
    }),
    tailwind({
      applyBaseStyles: false
    })
  ],
  output: "static",
  markdown: {
    rehypePlugins: [accessibleCode],
    shikiConfig: {
      theme: "github-light"
    }
  }
});
