# Méthode 90 — L'allemand en 90 leçons et en 90 jours

Application interactive d'apprentissage de l'allemand basée sur la *Méthode 90* d'Alphonse Jenny (textes juxtalinéaires, synthèse vocale allemande, cartes mémoire, fiches de grammaire et arène d'exercices gamifiée).

Construit avec **Astro**, **Vite**, **TypeScript** et **Tailwind CSS v4**.

## Structure du projet

```text
├── astro.config.mjs          # Configuration Astro + plugin Vite Tailwind CSS v4
├── public/
│   └── favicon.svg
└── src/
    ├── data/                 # Contenu pédagogique séparé du code UI
    │   ├── lessons/          # Un fichier JSON par leçon authentique (01.json … 90.json)
    │   ├── types.ts          # Types TypeScript (Lesson, Exercise, VocabItem, etc.)
    │   ├── syllabus.ts       # Ordre officiel et métadonnées des 97 leçons (90 + 7 bis)
    │   ├── gamification.ts   # Badges et rangs XP
    │   ├── fallback.ts       # Générateur cohérent pour les leçons non encore saisies
    │   └── index.ts          # Chargement automatique via import.meta.glob (Vite)
    ├── components/           # Composants Astro modulaires (Header, Sidebar, Tabs, Modals…)
    ├── layouts/              # Layout HTML principal
    ├── pages/                # Page principale (index.astro)
    ├── scripts/              # Logique client TypeScript (state, audio, arena, app)
    └── styles/               # Feuille globale Tailwind v4 & animations
```

## Démarrage

```bash
npm install
npm run dev
```

## Scripts disponibles

| Commande | Description |
| :--- | :--- |
| `npm run dev` | Lance le serveur de développement Astro / Vite |
| `npm run build` | Génère le site statique optimisé dans `dist/` |
| `npm run preview` | Prévisualise le build de production |
| `npm run check` | Vérifie les types TypeScript et Astro (`astro check`) |

## Ajouter une nouvelle leçon authentique

Il suffit d'ajouter un fichier JSON dans `src/data/lessons/` (par exemple `02.json` en respectant l'interface `Lesson` de `src/data/types.ts`). Vite le charge automatiquement via `import.meta.glob`.
