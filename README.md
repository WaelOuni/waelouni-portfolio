# Portfolio Wael Ouni

Site web personnel statique pour Wael Ouni, développeur fullstack Java senior spécialisé en Java, Spring Boot, Kafka, microservices, GCP, Kubernetes, Docker, Angular, Vue.js, CI/CD et observabilité.

## Stack

- Astro
- TypeScript
- Tailwind CSS
- MDX
- Sitemap Astro
- Docker multi-stage
- Nginx Alpine

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Docker

```bash
docker compose up --build
```

Accès local :

```text
http://localhost:8080
```

## Déploiement

### Vercel

1. Importer le dépôt.
2. Framework : Astro.
3. Commande build : `npm run build`.
4. Dossier de sortie : `dist`.

### Netlify

1. Importer le dépôt.
2. Build command : `npm run build`.
3. Publish directory : `dist`.

### VPS Docker

1. Copier le projet sur le serveur.
2. Lancer `docker compose up --build -d`.
3. Placer un reverse proxy HTTPS devant le service si nécessaire.

## SEO

Le site inclut :

- Titles et meta descriptions uniques
- Canonical automatique
- Open Graph
- Twitter card
- JSON-LD Person
- JSON-LD WebSite
- Sitemap via `@astrojs/sitemap`
- `robots.txt`
- Structure H1/H2 propre

## Internationalisation EN et FR

L’anglais est servi à la racine et le français sous `/fr/`, sans détection du navigateur ni redirection géographique. Astro 5.18.2 utilise son routage i18n natif avec `defaultLocale: en` et `prefixDefaultLocale: false`.

`src/i18n/config.ts` centralise les langues et le domaine ; `routes.ts` définit les correspondances de pages. Les dictionnaires `en.ts` et `fr.ts` utilisent les phrases françaises existantes comme clés, selon une convention proche de gettext. Les vues dans `src/views/` sont partagées entre les points d’entrée EN/FR. Les composants restent communs. Aucun JavaScript client n’est ajouté pour changer de langue ou télécharger les CV.

Les six articles MDX sont dans la collection Astro `blog`, avec `lang` et `translationKey` validés par schéma. Chaque paire partage une clé, mais possède un contenu intégralement traduit. Les titres et descriptions des listes proviennent de cette collection.

### Correspondance des URL

| Anglais | Français |
| --- | --- |
| `/` | `/fr/` |
| `/experience/` | `/fr/parcours/` |
| `/skills/` | `/fr/competences/` |
| `/projects/` | `/fr/projets/` |
| `/blog/` | `/fr/blog/` |
| `/contact/` | `/fr/contact/` |
| `/blog/kafka-spring-boot-production/` | `/fr/blog/kafka-spring-boot-production/` |
| `/blog/monitoring-datadog-kubernetes/` | `/fr/blog/monitoring-datadog-kubernetes/` |
| `/blog/architecture-event-driven-java-kafka/` | `/fr/blog/architecture-event-driven-java-kafka/` |

Les anciens chemins `/parcours/`, `/competences/` et `/projets/`, avec ou sans slash final, sont redirigés vers leur version française avec HTTP 301 dans `vercel.json` et `nginx.conf`. Astro fournit également des redirections HTML pour les serveurs statiques et `npm run preview`. Les anciennes URL `/`, `/blog/`, `/contact/` et les trois articles restent des URL publiques et servent désormais l’anglais ; une URL ne peut pas simultanément servir l’anglais et rediriger son ancienne version française.

### Traductions et SEO

Navigation, introduction, expériences, dates, compétences, projets, contact, appels à l’action, pied de page, libellés accessibles, textes alternatifs, trois articles complets, métadonnées et données structurées sont localisés. Les informations professionnelles existantes sont conservées. Les noms de clients et technologies ne sont pas traduits.

Chaque page a un `html lang`, une canonical propre sur `https://waelouni.fr`, trois alternates réciproques `en`, `fr`, `x-default`, des métadonnées Open Graph/Twitter et des données structurées localisées Person, WebSite et WebPage/TechArticle. Les images Open Graph PNG sont localisées et rendues depuis le design SVG existant avec `node scripts/render-og.mjs` ; les SVG sources sont conservés.

Le sitemap contient les 18 pages bilingues et leurs équivalences, ainsi que la page particulière `/jamila/`, sans les anciennes URL redirigées. `robots.txt` est conservé. Aucune modification DNS ou Google Search Console n’est nécessaire ni effectuée.

### Préservation de la page particulière Jamila

La revue du site réellement publié a identifié `/jamila/` et `/cv-jamila-ouni.pdf`, absents de la branche distante `dev` et de son historique. La page a été préservée depuis son HTML public du 22 octobre 2026, avec ses textes, sa présentation, ses données structurées et sa canonical existante `https://jamila.waelouni.fr/`. Son PDF public a été conservé à l’identique. Les assets CSS compilés sont remplacés par le CSS local généré depuis les mêmes classes.

Ce portfolio distinct reste en français ; il n’a pas d’équivalent anglais et aucun hreflang fictif n’est ajouté. Le sous-domaine de sa canonical existante n’était pas joignable pendant la revue : cette configuration préexistante n’a pas été modifiée. Les sources de cette version publiée devront être réconciliées avec le dépôt si elles existent ailleurs.

`tests/production-inventory.json` conserve l’inventaire des dix URL du sitemap actuellement en ligne et l’empreinte du CV Jamila. Un test vérifie que toutes ces URL restent accessibles après la migration, avec les 301 prévues et la préservation du portfolio distinct.

### CV réels et disponibilité

| Langue | Fichier source conservé dans `public/` | URL publique |
| --- | --- | --- |
| EN | `Wael_Ouni_CV_Java_Angular_English.pdf` | `/cv/wael-ouni-resume-en.pdf` |
| FR | `Wael_Ouni_CV_Fullstack_Java_Angular_FR.pdf` | `/cv/wael-ouni-cv-fr.pdf` |

Le bouton principal télécharge la langue courante ; le menu natif permet de choisir explicitement les deux versions. `scripts/resumes.mjs` prépare des copies strictement identiques avant le développement, la vérification et le build. Les alias PDF générés sont ignorés par Git. Les fichiers originaux et l’ancien `cv-wael-ouni.pdf` restent inchangés.

Si une source manque, son alias obsolète est supprimé et aucun lien vers cette version n’est affiché. Si seule l’autre langue existe, elle reste accessible dans le menu. Si les deux manquent, les contrôles sont masqués. Aucun CV n’est généré ou traduit automatiquement. Les CV récents détaillent davantage le parcours que le portfolio ; aucune de leurs informations supplémentaires n’a été ajoutée aux expériences affichées.

### Validation reproductible

```bash
npm ci
npx playwright install chromium
npm run check
npm run build
npm test
npm run test:missing-resumes
```

Playwright vérifie les 18 pages sur Chromium desktop et mobile : langue par défaut malgré un navigateur français, navigation sans JavaScript, clavier, conservation de la page, contenus, SEO, liens internes, assets, téléchargements, empreintes PDF, robots et sitemap. Axe contrôle les règles automatisables WCAG 2.2 AA ; cela ne remplace pas un audit humain complet. Le test des PDF absents réalise deux builds dans un répertoire temporaire sans modifier les sources originales.

```bash
docker build -t wael-portfolio:i18n-review .
docker run -d --rm --name wael-i18n-review wael-portfolio:i18n-review
npm run test:docker
docker stop wael-i18n-review
```

Le test Docker valide les 200 des pages, PDF, robots et sitemaps, les six variantes de redirections HTTP 301 sans boucle, les empreintes PDF, les assets référencés par les pages et une véritable 404 pour les URL inconnues. Il s’exécute dans le conteneur et ne nécessite pas d’exposer de port.

### Résultats locaux du 22 octobre 2026

- `npm run build` : réussi ; typecheck sans erreur, avertissement ou suggestion.
- `npm test` : 32 tests réussis, répartis entre desktop et mobile, avec contrôles WCAG automatisés sur les 18 pages.
- `npm run test:missing-resumes` : réussi pour les builds isolés sans CV puis avec uniquement le CV français.
- Build Docker et `npm run test:docker` : réussis, y compris les 301, les 200 et l’intégrité des deux PDF.
- `git diff --check` : réussi.

| Lighthouse 13.5.0 | Performance | Accessibilité | Bonnes pratiques | SEO |
| --- | --- | --- | --- | --- |
| Accueil EN mobile | 100 | 100 | 100 | 100 |
| Accueil EN desktop | 100 | 100 | 100 | 100 |
| Accueil FR mobile | 100 | 100 | 100 | 100 |
| Accueil FR desktop | 100 | 100 | 100 | 100 |

Ces mesures concernent les accueils sur le preview de production local, avec simulation Lighthouse ; elles ne représentent pas des mesures en production Vercel ni toutes les pages. Le CLS mesuré est de 0 pour les quatre parcours. Les résultats et métriques sont enregistrés dans `reports/lighthouse.json`. La revue finale a confirmé ces scores dans les quatre rapports Lighthouse JSON complets d’origine, sans erreur d’exécution ; ces mesures précèdent la restauration de la page particulière Jamila. Pour reproduire : lancer `npm run preview -- --host 127.0.0.1 --port 4322`, puis `node scripts/lighthouse.mjs` dans un autre terminal. Les rapports JSON complets sont écrits dans un répertoire temporaire dont le chemin est affiché par le script.

### Déploiement et revue

Branche de travail : `feature/bilingual-en-fr-portfolio`, créée depuis `dev`. La référence distante par défaut est `origin/dev`. La branche de production effective de Vercel doit être confirmée dans les paramètres du projet : elle n’est pas décrite dans le dépôt. GitHub confirme que `dev` est sa seule branche distante et que les trois déploiements historiques Vercel « Production » correspondent à ses commits ; cela justifie `dev` comme cible de PR, mais ne prouve pas le réglage actuel Production → Branch Tracking. Le site publié diffère du contenu GitHub, notamment pour Jamila. Tant que ce réglage et cette divergence ne sont pas confirmés, la PR reste en brouillon et le verdict est NOT READY. Les deux nouveaux CV sont des ajouts utilisateur inclus dans la PR, sans modification de leurs contenus.

Vercel utilise le build statique Astro et les redirections explicites HTTP 301. `trailingSlash: true` normalise les pages avec slash, sans ajouter de slash aux PDF. Les règles sont conformes à la [documentation Vercel](https://vercel.com/docs/project-configuration/vercel-json). Aucun adaptateur SSR n’est nécessaire. Le Dockerfile conserve son build multi-stage Node/Nginx et rend les artefacts publics lisibles par Nginx indépendamment du masque de permissions de la machine hôte.

La branche `feature/bilingual-en-fr-portfolio` désactive ses déploiements Git automatiques via `git.deploymentEnabled` dans `vercel.json`, afin de permettre la publication de la PR sans preview volontaire. Ce blocage est limité à cette branche. Aucune fusion ou commande de déploiement ne doit être effectuée pendant la revue. Après validation d’un déploiement, exécuter les tests sur son URL avec `TEST_BASE_URL=https://… TEST_HTTP_REDIRECTS=1 npm test`, puis contrôler les deux PDF et les six anciennes URL sur Vercel. La disponibilité réelle sur Vercel n’est pas attestée par les tests locaux.

### Proposition de Pull Request

Titre : `Add complete English/French localization with English as default`

Le portfolio français disposait d’une seule langue. Cette modification sert l’anglais à la racine et conserve la version française sous `/fr/`, avec navigation entre pages équivalentes, trois articles intégralement traduits et accès aux deux CV réels sans modifier leurs contenus.

L’implémentation conserve Astro statique et les composants visuels existants, ajoute les canonical/hreflang et métadonnées localisées, un sitemap bilingue et des redirections permanentes Vercel/Nginx pour les anciens chemins français. La validation couvre build/typecheck, parcours navigateur desktop/mobile, règles WCAG automatisées, liens internes, intégrité PDF, documents absents et exécution Docker/Nginx. La vérification sur un déploiement Vercel reste à effectuer après autorisation.
