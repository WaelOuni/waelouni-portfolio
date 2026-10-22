# Wael Ouni — portfolio EN/FR

Portfolio professionnel statique de Wael Ouni, ingénieur backend Java senior et consultant freelance à Lille. Le parcours fullstack reste visible dans les expériences ; le positionnement principal est Java, Spring Boot, Kafka et la fiabilité en production.

## Développement

```bash
npm ci
npx playwright install chromium
npm run dev
```

```bash
npm run check
npm run build
npm run preview
npm test
npm run test:missing-resumes
```

`npm run build` inclut le typecheck. Le site utilise Astro 5.18.2, TypeScript, Tailwind CSS 3, MDX et les Content Collections. Il génère uniquement des fichiers statiques. Les fontes sont système ; aucun framework frontend, police distante, bibliothèque i18n ou JavaScript applicatif n’est livré au navigateur.

## Architecture et contenu

- `src/pages/` : points d’entrée EN/FR ; `src/views/` : vues communes.
- `src/i18n/routes.ts` : les neuf paires d’URL, utilisées par le sélecteur et le sitemap.
- `src/i18n/portfolio.ts` : contenu éditorial avec clés stables et présence obligatoire des deux langues vérifiée par TypeScript.
- `src/i18n/en.ts` et `fr.ts` : traduction des données professionnelles historiques, avec les phrases françaises comme clés. Les anciennes chaînes devenues inutiles ont été retirées.
- `src/data/` : parcours et études de cas. Les synthèses reprennent les données du dépôt et les CV fournis ; aucun résultat chiffré, titre officiel de lead ou disponibilité immédiate n’est ajouté.
- `src/content/blog/{en,fr}/` : trois articles dans chaque langue. `BlogArticle.astro` fournit le titre, le sommaire natif, une estimation de lecture à 200 mots/minute et la date de révision réelle. Aucune date de publication inconnue n’est inventée.
- `src/lib/accessible-code.mjs` : rend les blocs de code défilants accessibles au clavier lors du build.

L’accueil présente les expertises principales, deux expériences sélectionnées, StockPilot AI, l’approche de travail, les articles et un appel au contact. Les six missions restent intégralement disponibles sur la page Parcours. Les noms internes d’applications ont été retirés des synthèses publiques. Les fonctions, périodes et technologies existantes sont préservées ; les tests, revues de code et diagnostics de production ajoutés à la synthèse ADEO sont documentés dans les CV réels.

Les projets professionnels restent des synthèses de contributions, sans code client ni diagramme propriétaire. Les liens vers les expériences donnent le contexte ; ils ne prétendent pas documenter publiquement l’intégralité d’une architecture client.

### StockPilot AI : provenance et périmètre

Dépôt public vérifié : [WaelOuni/stockpilot-ai](https://github.com/WaelOuni/stockpilot-ai), commit consulté `e5a066364c6abe4e88b5b1bb9a98ac0640063d81`.

Le README, la documentation d’architecture et du frontend, les cas d’usage catalogue/confirmation et les tests transactionnels ont été consultés. La présentation distingue le catalogue MongoDB, le RAG documentaire pgvector/Ollama, la confirmation explicite et idempotente des commandes, les interfaces Vue 3 et les limites du prototype local. Le code et les tests ont été inspectés ; la suite StockPilot n’a pas été exécutée pendant cette revue du portfolio.

Aucune démo hébergée publique n’a été vérifiée : aucun bouton de démo n’est proposé. Aucun screenshot de produit, utilisateur, revenu ou résultat commercial n’est inventé. Le dépôt est qualifié de « code public », pas de logiciel sous licence open source : aucune licence n’a été identifiée. Le diagramme HTML est une synthèse de son architecture documentée.

## Design system

`src/styles/global.css` définit le canvas, les couleurs, l’accent, les largeurs, le rayon et le rythme vertical : `--canvas`, `--ink`, `--muted`, `--accent`, `--line`, `--container`, `--radius`, `--space-section`. Les utilitaires Tailwind conservés utilisent une palette cohérente dans `tailwind.config.mjs`.

Typographie système, titres fluides avec `clamp()`, contenu de lecture limité à 72 caractères environ, liens identifiables et boutons d’au moins 44 px de haut. La navigation mobile et les choix de CV utilisent `details/summary` ; le sélecteur EN/FR utilise des liens ordinaires. Le contenu reste disponible sans JavaScript. Le défilement doux respecte `prefers-reduced-motion` ; les animations d’apparition ont été supprimées.

Les contrôles automatisés portent sur 320, 375, 390, 768, 1024, 1440 et 1920 px dans les deux langues. Ils ne remplacent pas une validation humaine avec lecteurs d’écran et différents navigateurs réels.

## URL et SEO international

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

L’anglais est servi à la racine, sans détection du navigateur ou de la localisation. Astro utilise son i18n natif avec `defaultLocale: en` et `prefixDefaultLocale: false`. Le sélecteur conserve la page courante.

Chaque page possède son `html lang`, son canonical, ses alternates réciproques `en`, `fr`, `x-default`, ses métadonnées Open Graph/Twitter et son JSON-LD localisé Person, WebSite et WebPage/TechArticle. Les articles révisés indiquent `dateModified`, sans fabriquer `datePublished`. Les visuels sociaux PNG sont générés depuis les SVG avec `node scripts/render-og.mjs` et conservent leurs URL.

Le sitemap contient **18 pages : 9 EN et 9 FR**. Les anciennes routes `/parcours/`, `/competences/` et `/projets/`, avec et sans slash, répondent **301** vers les pages françaises dans `vercel.json` et `nginx.conf`. Le preview Astro utilise la redirection HTML statique ; les tests HTTP permanents s’exécutent dans Nginx. Les anciennes URL `/`, `/blog/`, `/contact/` et des articles servent désormais l’anglais et restent indexables.

Les routes et documents retirés restent absents. La résolution statique Vercel et le `try_files $uri $uri/ =404` Nginx donnent une véritable 404, sans renvoi vers l’accueil. `tests/removed-content.json` conserve uniquement les identifiants nécessaires aux tests négatifs ; la fixture n’est pas publiée. Aucun ancien contenu n’est restauré.

`robots.txt`, le domaine, les DNS et Google Search Console sont inchangés. Après un déploiement autorisé, vérifier dans Search Console les canonical choisies et les nouvelles URL, et consulter les rapports d’indexation ; le sitemap existant conserve son URL. Aucun résultat de classement ou délai d’indexation n’est promis.

## CV

| Langue | Source réelle conservée | URL publique |
| --- | --- | --- |
| EN | `public/Wael_Ouni_CV_Java_Angular_English.pdf` | `/cv/wael-ouni-resume-en.pdf` |
| FR | `public/Wael_Ouni_CV_Fullstack_Java_Angular_FR.pdf` | `/cv/wael-ouni-cv-fr.pdf` |

`scripts/resumes.mjs` prépare des alias strictement identiques avant le build, ignorés par Git. Le bouton principal suit la langue de la page ; le menu permet de choisir les deux versions. Si une source manque, aucun lien vers ce document n’est rendu. L’ancien `public/cv-wael-ouni.pdf` est aussi conservé. Les trois PDF sont inchangés, avec contrôle SHA-256 contre la baseline.

L’adresse email, le lien GitHub et le lien LinkedIn existants sont conservés. GitHub répond 200 ; LinkedIn bloque le contrôle automatisé avec HTTP 999, donc l’accès effectif au profil doit être vérifié dans un navigateur connecté.

## Validation et preuves

L’audit a précédé les modifications. [Baseline détaillée](reports/premium-baseline.json) : niveaux critique/haut/moyen/faible, douze dimensions de qualité, build sans erreur, 34 tests réussis, 18 pages et quatre audits Lighthouse relancés. Le commit de production `eb71bd1` et le commit de travail `38adbe1` avaient le même arbre de fichiers. Les réponses publiques de quatre routes ont été contrôlées ; cela ne constitue pas une mesure Lighthouse de production.

[Résultats de la refonte](reports/premium-validation.json) et [mesures Lighthouse](reports/lighthouse.json) :

- Build/typecheck : zéro erreur, avertissement ou suggestion.
- 56 tests Playwright réussis sur Chromium desktop/mobile : navigation, clavier, menus ouverts, traductions, SEO, sommaires, liens avec ancres, téléchargements et empreintes, routes retirées et sept largeurs.
- Axe : règles automatisables WCAG 2.2 AA sur les 18 pages et les menus ouverts.
- Scénarios isolés de CV absents : réussis, sans modifier les PDF sources.
- Docker/Nginx : 18 pages, fichiers statiques, PDF, six redirections 301 en un seul saut et véritables 404 validés.
- Quatre audits Lighthouse 13.5.0 des accueils EN/FR, mobile/desktop : **100/100 dans les quatre catégories**, CLS 0, LCP de 0,28 à 1,06 s, TBT de 0 à 12 ms.

Mesures locales en laboratoire : elles ne sont pas des scores Vercel ni des données terrain. Aucun INP terrain n’est disponible ; le TBT ne le remplace pas. Les accueils transférent environ 29,5 ko lors de ces audits. Aucune économie CSS/JS n’a été signalée par les audits concernés, ce qui ne signifie pas qu’aucune règle CSS n’est inutilisée. Les rapports complets temporaires sont hors Git ; le résumé contient l’empreinte HTML du build mesuré.

À 390 px, l’accueil passe de 13 380 à 6 373 px en anglais et de 13 876 à 6 523 px en français. La réduction concerne le contenu répété ; les six expériences restent consultables sur leur page. Aucun gain de conversion n’est prétendu sans données d’usage.

Pour reproduire Lighthouse, lancer le preview sur 4322 puis le script dans un autre terminal :

```bash
npm run preview -- --host 127.0.0.1 --port 4322
node scripts/lighthouse.mjs
```

Le script échoue si Performance/Accessibilité < 95 ou Bonnes pratiques/SEO < 100. Il ne doit pas être lancé en parallèle d’un rebuild.

### Docker et CI

```bash
docker build -t wael-portfolio:premium-review .
docker run -d --rm --name wael-i18n-review wael-portfolio:premium-review
npm run test:docker
docker stop wael-i18n-review
```

Le Dockerfile conserve Node 22 pour le build et Nginx pour servir les artefacts. Le contrôle des permissions garantit que Nginx peut lire les fichiers publics. `docker compose up --build` expose le site sur le port 8080.

`.github/workflows/quality.yml` valide le build, Playwright, les CV absents et Docker sur les PR et les pushes des branches listées. Les actions sont épinglées par commit, le jeton est limité en lecture, et les rapports d’échec sont conservés sept jours. Il n’existe aucune étape de publication ou déploiement. La configuration locale d’un workflow ne prouve pas son exécution distante.

### Alertes de dépendances et limites de livraison

L’audit complémentaire du 22 octobre 2026 (`npm audit --omit=dev`) signale **28 paquets affectés** : 1 critique, 17 élevés, 8 modérés et 2 faibles. [Inventaire et correctifs proposés](reports/dependency-audit.json). L’arbre contient les outils de build ; il ne s’agit pas de 28 vulnérabilités exploitables démontrées dans le site statique.

L’alerte critique Astro concerne le traitement d’un AVIF malveillant par Sharp ([avis officiel](https://github.com/advisories/GHSA-26w7-cxv4-gfx2)). Le portfolio ne reçoit pas d’images utilisateur et ne déploie pas de serveur d’optimisation. Cette observation limite l’exposition connue ; elle ne remplace pas la qualification de chaque alerte de la chaîne de build.

Astro 5.18.2 est la dernière version 5.x publiée consultée. Les correctifs des avis Astro nécessitent une version majeure plus récente et une migration de l’intégration Tailwind. Aucun `npm audit fix --force` ni remplacement majeur silencieux n’a été effectué. La qualification et la mise à jour de cet outillage restent nécessaires avant validation de production.

### État Git et production

Branche de travail conservée : `feature/bilingual-en-fr-portfolio`. La PR #1 a été fusionnée par ailleurs le 22 octobre 2026 à 13:22 UTC ; GitHub enregistre ensuite un déploiement Production du commit `eb71bd1` de `dev`. Le présent travail n’a effectué aucune fusion ni commande de déploiement.

Cette PR fermée ne peut pas recevoir la refonte comme nouvelle révision à fusionner. La suite de la revue nécessite soit une nouvelle PR autorisée, soit l’examen des modifications locales. Le réglage actuel Vercel Production → Branch Tracking n’est pas accessible dans cette session ; `dev` est attesté par les déploiements, pas par la lecture de ce réglage. Le garde-fou `git.deploymentEnabled` reste désactivé pour la branche de travail existante.

Verdict de livraison : **NOT READY** tant que les alertes de dépendances n’ont pas été traitées/qualifiées et que le réglage Vercel n’a pas été confirmé. Après autorisation de déploiement, exécuter `TEST_BASE_URL=https://… TEST_HTTP_REDIRECTS=1 npm test` et vérifier les PDF ainsi que les statuts des anciennes URL sur l’hébergement réel.

## Pistes éditoriales futures — non publiées

- Tester les fenêtres d’échec d’un consommateur Kafka : commit en base, acquittement et reprise.
- Lire un incident à travers logs, traces et métriques sans augmenter inutilement leur cardinalité.
- Délimiter les responsabilités d’un assistant IA : recherche documentaire, intention et confirmation métier.

Ces propositions ne sont pas des articles ajoutés au site et n’impliquent aucune expérience client supplémentaire.
