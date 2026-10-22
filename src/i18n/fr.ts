// Source-language phrases serve as stable keys, as in a gettext catalog.
import { en } from './en';
export const fr: Record<string, string> = {
  ...Object.fromEntries(Object.keys(en).map(key => [key, key])),
  'Frontend': 'Fullstack',
  'Backend': 'Ingénierie backend',
  'Data': 'Données',
  'Testing': 'Tests',
  'Soft skills': 'Compétences relationnelles',
  'Event-driven': 'Architecture événementielle',
  'Event-driven architecture': 'Architecture événementielle',
  'Consumer groups': 'Groupes de consommateurs',
  'Batch processing': 'Traitements batch',
  'REST APIs': 'API REST',
  'Logs': 'Journaux',
  'Metrics': 'Métriques',
  'Dashboards': 'Tableaux de bord',
  'Production monitoring': 'Supervision de production',
  'Monitoring': 'Supervision',
  'API First': 'Conception orientée API',
  'Lille, France • Remote / hybride': 'Lille, France • Télétravail / hybride'
};
