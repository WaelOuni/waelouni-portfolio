export type SkillCategory = {
  title: string;
  description: string;
  items: string[];
};

export const skillCategories: SkillCategory[] = [
  {
    title: "Backend",
    description: "Conception d'API, batchs critiques et microservices robustes en Java.",
    items: [
      "Java / JEE",
      "Spring Boot",
      "Spring Reactive",
      "Hibernate",
      "REST APIs",
      "SOAP",
      "Batch processing",
      "Spring Batch",
      "Microservices"
    ]
  },
  {
    title: "Event-driven",
    description: "Architectures distribuées et intégration de flux à fort volume.",
    items: [
      "Apache Kafka",
      "Kafka Streams",
      "Kafka Connect",
      "Confluent Cloud",
      "Consumer groups",
      "Event-driven architecture",
      "Synchronisation de données"
    ]
  },
  {
    title: "Data",
    description: "Bases relationnelles, NoSQL, requêtage et systèmes à fort volume de données.",
    items: ["Oracle", "PostgreSQL", "MySQL", "MongoDB", "MongoDB Atlas", "SQL", "PL/SQL", "Elasticsearch"]
  },
  {
    title: "Cloud / DevOps",
    description: "Industrialisation, conteneurisation et déploiements reproductibles.",
    items: ["GCP", "GKE", "Cloud Storage", "Azure", "Docker", "Kubernetes", "OpenShift", "GitHub Actions", "GitLab CI", "Jenkins", "Azure DevOps"]
  },
  {
    title: "Observabilité",
    description: "Suivi de production, diagnostic incident et amélioration continue.",
    items: ["Datadog", "Kibana", "AppInsights", "Logs", "Metrics", "Dashboards", "Production monitoring", "k9s", "Lens"]
  },
  {
    title: "Testing",
    description: "Qualité logicielle, non-régression et confiance avant mise en production.",
    items: ["JUnit", "Selenium", "Cucumber", "Gherkin", "Jest", "Tests fonctionnels", "Revues de code"]
  },
  {
    title: "Frontend",
    description: "Interfaces web maintenables pour produits internes, dashboards et consoles métier.",
    items: ["Angular", "Vue.js", "TypeScript", "JavaScript", "HTML/CSS", "UX simple"]
  },
  {
    title: "Sécurité & API",
    description: "Sécurisation d'API, authentification et documentation contractuelle.",
    items: ["OAuth2/OIDC", "Keycloak", "JWT", "HashiCorp Vault", "Swagger", "API First", "Postman"]
  },
  {
    title: "Soft skills",
    description: "Travail agile, collaboration transverse et adaptation aux contextes métier.",
    items: [
      "Agile Scrum",
      "Kanban",
      "Communication",
      "Collaboration transverse",
      "Support technique",
      "Accompagnement développeurs",
      "Échanges métier",
      "Capacité d'adaptation"
    ]
  }
];
