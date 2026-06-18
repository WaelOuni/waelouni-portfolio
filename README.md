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

## À personnaliser

- Remplacer `public/cv-wael-ouni.pdf` par le CV final.
- Remplacer les liens LinkedIn et GitHub dans `src/components/ContactCard.astro`.
- Adapter l'URL `site` dans `astro.config.mjs` si le domaine change.
