import type { Locale } from '../i18n/config';
export type Project = {
  id: string;
  experienceId: string;
  client: string;
  stack: string[];
  content: Record<Locale, { title: string; context: string; challenge: string; delivered: string }>;
};
// These summaries only reorganize contributions recorded in experiences.ts and the supplied CVs.
export const projects: Project[] = [
  {
    id: 'logistics', experienceId: 'adeo-supply-chain', client: 'ADEO',
    stack: ['Java 17', 'Spring Boot', 'Apache Kafka', 'GCP', 'Kubernetes', 'Datadog'],
    content: {
      en: { title: 'Event-driven logistics integration', context: 'Supply chain applications exchanging order and logistics data across business systems.', challenge: 'Integrate logistics flows through backend services and batch processing while supporting day-to-day production operations.', delivered: 'Developed Java / Spring Boot batch processes and business APIs, contributed to Kubernetes deployment on GCP, improved CI/CD pipelines and implemented Datadog monitoring.' },
      fr: { title: 'Intégration de flux logistiques événementiels', context: 'Applications supply chain échangeant des données de commande et de logistique entre systèmes métier.', challenge: 'Intégrer les flux logistiques via des services backend et des traitements batch, en accompagnant leur exploitation en production.', delivered: 'Développement de batchs Java / Spring Boot et d’API métier, contribution aux déploiements Kubernetes sur GCP, amélioration des pipelines CI/CD et mise en place du monitoring Datadog.' }
    }
  },
  {
    id: 'data-integration', experienceId: 'adeo-supply-chain', client: 'ADEO',
    stack: ['Apache Kafka', 'Kafka Connect', 'MongoDB', 'Oracle', 'Datadog'],
    content: {
      en: { title: 'Connecting operational data with Kafka', context: 'Business applications using data held in MongoDB and Oracle.', challenge: 'Synchronize data between these stores and downstream applications through event-driven integration.', delivered: 'Implemented Kafka connectors for MongoDB and Oracle. Production work also included logs, metrics and incident diagnosis to support reliable integration.' },
      fr: { title: 'Relier les données opérationnelles avec Kafka', context: 'Applications métier exploitant des données stockées dans MongoDB et Oracle.', challenge: 'Synchroniser les données entre ces bases et les applications consommatrices par une intégration événementielle.', delivered: 'Mise en place de connecteurs Kafka pour MongoDB et Oracle. Le travail en production inclut également les journaux, les métriques et le diagnostic d’incidents pour fiabiliser les intégrations.' }
    }
  },
  {
    id: 'modernization', experienceId: 'ag2r-modernization', client: 'AG2R La Mondiale',
    stack: ['Java 8/11', 'Spring Boot', 'Angular 12', 'SQL', 'Kibana'],
    content: {
      en: { title: 'Modernizing a business application', context: 'A legacy GWT application supporting insurance and pension business workflows.', challenge: 'Move to Angular and Spring Boot while working closely with business teams and handling acceptance feedback.', delivered: 'Developed business simulators and new interfaces, built a user and access-management console, and resolved defects through acceptance testing.' },
      fr: { title: 'Moderniser une application métier', context: 'Une application GWT historique au service de parcours d’assurance et de retraite.', challenge: 'Passer à Angular et Spring Boot en collaboration avec les équipes métier et en intégrant les retours de recette.', delivered: 'Développement de simulateurs métier et de nouvelles interfaces, réalisation d’une console de gestion des utilisateurs et habilitations, et correction des anomalies en recette.' }
    }
  },
  {
    id: 'partner-portal', experienceId: 'enki-portal', client: 'Leroy Merlin · ENKI',
    stack: ['Java 11', 'Spring Boot', 'Angular 7', 'Keycloak', 'Drupal', 'Docker'],
    content: {
      en: { title: 'A partner portal with controlled access', context: 'The Works With ENKI portal combining business interfaces, authentication and content integration.', challenge: 'Connect the frontend and backend with role-based access and an external CMS.', delivered: 'Developed Angular / Spring Boot features, integrated Keycloak authentication and roles, connected Drupal through REST APIs and containerized the application environment.' },
      fr: { title: 'Un portail partenaires avec gestion des accès', context: 'Le portail Works With ENKI associant interfaces métier, authentification et intégration de contenu.', challenge: 'Relier le frontend et le backend avec une gestion des rôles et un CMS externe.', delivered: 'Développement Angular / Spring Boot, intégration de l’authentification et des rôles Keycloak, connexion à Drupal par API REST et dockerisation de l’environnement applicatif.' }
    }
  }
];
