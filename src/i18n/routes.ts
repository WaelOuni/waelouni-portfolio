export const routes = {
  home: { en: '/', fr: '/fr/' },
  experience: { en: '/experience/', fr: '/fr/parcours/' },
  skills: { en: '/skills/', fr: '/fr/competences/' },
  projects: { en: '/projects/', fr: '/fr/projets/' },
  blog: { en: '/blog/', fr: '/fr/blog/' },
  contact: { en: '/contact/', fr: '/fr/contact/' },
  kafka: { en: '/blog/kafka-spring-boot-production/', fr: '/fr/blog/kafka-spring-boot-production/' },
  datadog: { en: '/blog/monitoring-datadog-kubernetes/', fr: '/fr/blog/monitoring-datadog-kubernetes/' },
  architecture: { en: '/blog/architecture-event-driven-java-kafka/', fr: '/fr/blog/architecture-event-driven-java-kafka/' }
} as const;
export type RouteKey = keyof typeof routes;
export const legacyRoutes: Record<string, string> = {
  '/parcours/': routes.experience.fr,
  '/competences/': routes.skills.fr,
  '/projets/': routes.projects.fr
};
