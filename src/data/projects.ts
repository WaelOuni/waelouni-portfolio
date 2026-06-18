export type Project = {
  title: string;
  description: string;
  stack: string[];
  highlights: string[];
};

export const projects: Project[] = [
  {
    title: "Flux logistiques event-driven ADEO",
    description:
      "Conception et développement de batchs critiques pour intégrer des flux logistiques entre Kafka, GCP, SFTP et systèmes métiers.",
    stack: ["Java 17", "Spring Boot", "Kafka", "GCP", "Kubernetes", "GitHub Actions"],
    highlights: ["Batchs critiques", "Flux logistiques", "Microservices", "Event-driven", "Résilience"]
  },
  {
    title: "Connecteurs Kafka MongoDB / Oracle",
    description:
      "Mise en place de connecteurs Kafka pour synchroniser les données entre MongoDB, Oracle et les applications métier.",
    stack: ["Kafka", "Kafka Connect", "MongoDB", "Oracle", "Java", "Datadog"],
    highlights: ["Synchronisation de données", "Fort volume", "Monitoring", "Fiabilité", "Optimisation Kafka"]
  },
  {
    title: "Modernisation GWT vers Angular / Spring Boot",
    description:
      "Modernisation d'une application legacy vers une architecture Angular et Spring Boot, avec simulateurs métier et console d'habilitations.",
    stack: ["Java 8/11", "Spring Boot", "Angular 12", "SQL", "Kibana"],
    highlights: ["Refonte front-end", "Interfaces métier", "Gestion utilisateurs", "Support recette", "Amélioration continue"]
  },
  {
    title: "Portail Works With ENKI",
    description:
      "Conception et développement d'un portail web Angular / Spring Boot avec authentification, rôles, intégration CMS et environnement dockerisé.",
    stack: ["Java 11", "Spring Boot", "Angular 7", "Docker", "Keycloak", "Drupal", "Consul"],
    highlights: ["Authentification", "Gestion des rôles", "API REST", "Dockerisation", "Configuration applicative"]
  }
];
