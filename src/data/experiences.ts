export type Experience = {
  role: string;
  client?: string;
  period: string;
  context: string;
  stack: string[];
  achievements: string[];
};

export const experiences: Experience[] = [
  {
    role: "Développeur Fullstack Java Senior",
    client: "ADEO",
    period: "Avril 2023 - aujourd'hui",
    context:
      "Conception et évolution de systèmes Supply Chain critiques dans une architecture microservices orientée événements avec Kafka, GCP et Kubernetes.",
    stack: [
      "Java 17",
      "Spring Boot",
      "Kafka",
      "GCP",
      "Kubernetes",
      "MongoDB",
      "Oracle",
      "Vault",
      "GitHub Actions",
      "Datadog",
      "Vue.js"
    ],
    achievements: [
      "Conception et développement de batchs critiques pour l'intégration de flux logistiques",
      "Mise en place de connecteurs Kafka MongoDB et Oracle pour la synchronisation de données",
      "Développement d'API REST métiers pour la gestion des commandes Kalypso",
      "Migration technique vers Kubernetes sur GCP et modernisation Spring Boot",
      "Optimisation des pipelines CI/CD GitHub Actions",
      "Monitoring Datadog, logs, métriques et amélioration de la fiabilité en production"
    ]
  },
  {
    role: "Développeur Java / Angular",
    client: "AG2R La Mondiale",
    period: "Mai 2022 - Mars 2023",
    context:
      "Modernisation d'une application legacy GWT vers une architecture Angular et Spring Boot, avec forte collaboration métier.",
    stack: ["Java 8/11", "Spring Boot", "Angular 12", "Git", "SQL", "Kibana"],
    achievements: [
      "Développement de simulateurs métiers Java / Angular",
      "Refonte front-end et conception de nouvelles interfaces utilisateurs",
      "Mise en place d'une console de gestion des utilisateurs et habilitations",
      "Correction d'anomalies et amélioration continue suite aux retours recette",
      "Support technique et collaboration avec les équipes métier"
    ]
  },
  {
    role: "Développeur Java / Angular",
    client: "ADEO",
    period: "Janvier 2021 - Avril 2022",
    context:
      "Développement d'un produit de gestion client et paiement pour les enseignes du groupe ADEO.",
    stack: ["Java 11", "Spring", "Angular 11", "Kafka", "GCP", "GKE", "Vault", "GitLab CI", "Datadog", "k9s"],
    achievements: [
      "Développement de services backend pour la gestion des transactions",
      "Participation au développement du paiement en ligne WPU",
      "Migration du référentiel client vers une architecture MDM",
      "Intégration de Kafka pour le traitement asynchrone des flux",
      "Développement d'interfaces Angular",
      "Run applicatif, gestion des incidents et dashboards Datadog / k9s"
    ]
  },
  {
    role: "Analyste développeur Java",
    client: "AXA France",
    period: "Juillet 2019 - Octobre 2020",
    context:
      "Missions Java autour de la fiabilisation de données, de l'intégration WebMethods et de la refonte d'applications backend santé.",
    stack: ["Java 8/11", "Spring", "Spring Batch", "REST", "SOAP", "Jenkins", "Azure DevOps", "Kibana", "AppInsights", "SQL Server"],
    achievements: [
      "Définition de stack technique et mise en place d'architecture",
      "Développement d'un module de fiabilisation de données avec Spring Batch",
      "Développement et maintenance de services d'intégration REST / SOAP",
      "Implémentation de règles métiers WebMethods",
      "Refonte d'applications backend Java et exposition d'API REST",
      "Mise à jour de pipelines CI/CD et supervision applicative"
    ]
  },
  {
    role: "Ingénieur d'étude et développement Java / Angular",
    client: "Leroy Merlin - ENKI",
    period: "Août 2018 - Juin 2019",
    context:
      "Conception et développement du portail web Works With ENKI Portal avec Spring Boot, Angular et intégration CMS.",
    stack: ["Java 11", "Spring Boot", "Angular 7", "Docker", "GitLab CI", "Maven", "Keycloak", "Drupal", "Consul"],
    achievements: [
      "Conception et développement d'un portail web Angular / Spring Boot",
      "Mise en place de l'authentification et de la gestion des rôles avec Keycloak",
      "Intégration d'un CMS Drupal via API REST",
      "Dockerisation de l'environnement applicatif",
      "Gestion de configuration via Consul"
    ]
  },
  {
    role: "Développeur Java / Angular",
    client: "Decathlon",
    period: "Avril 2018 - Août 2018",
    context:
      "Développement de l'application MyQualityGate POC pour générer des rapports à partir d'un fournisseur de données multidimensionnelle Kylin.",
    stack: ["Angular 6", "Spring Boot", "Jenkins", "Docker", "Rancher", "Nexus", "Maven", "Kylin", "PostgreSQL", "Git"],
    achievements: [
      "Développement d'un dashboard de reporting Angular / Spring Boot",
      "Mise en place de pipelines CI/CD Jenkins Pipeline as Code",
      "Développement d'API REST",
      "Industrialisation avec Docker, Rancher, Nexus et Maven"
    ]
  }
];
