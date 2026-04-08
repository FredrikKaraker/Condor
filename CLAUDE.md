# Condor Gilligan Invitational

Golf tournament website built with Astro + Tailwind CSS, hosted on GitHub Pages.

## Quick Start

```bash
nvm use 22        # Node 22+ required
npm install
npm run dev       # Local dev server
npm run build     # Build to dist/
```

## Deployment

- Hosted on **GitHub Pages** via GitHub Actions (`.github/workflows/deploy.yml`)
- Auto-deploys on push to `main`
- Custom domain: `condorgilligan.se` (CNAME in `public/`)

## Project Structure

```
src/
├── components/        # Reusable components (SwedenMap, WeatherIcon)
├── data/              # JSON data files — edit these to update content
│   ├── tournaments.json   # All tournament + player data (single source of truth)
│   └── rules.json         # Tournament rules (in English)
├── layouts/
│   └── Layout.astro       # Shared layout (nav, footer, global styles)
├── pages/
│   ├── index.astro        # Landing page
│   ├── participants.astro # Player list with results
│   ├── history.astro      # Tournament history with map
│   ├── rules.astro        # Rules page
│   └── history/[slug].astro  # Dynamic tournament detail pages
├── styles/
│   └── global.css         # Tailwind imports + custom color theme
public/
├── avatars/           # Player avatars (sm/ = 96px, lg/ = 256px)
├── logo.png           # Tournament logo
├── sweden-map.svg     # Map of Sweden (CC0, from MapSVG)
└── favicon.svg
```

## Data Management

### tournaments.json

This is the single source of truth for all tournament and player data. Both the history and participants pages read from it.

**Adding a new tournament:** Add an entry to the `tournaments` array with slug, year, title, type (`summer`/`winter`), dates, location, courses, results, weather, notes, and recap. Then add a `true`/`false` to every player's `events` array.

**Adding a new player:** Add an entry to the `players` array with name, hcp, and an `events` array matching the length of the tournaments array.

### rules.json

Tournament rules in English (translated from Swedish originals). Structured by sections with rules and subsections. Supports basic markdown (**bold**, *italic*) in text.

### Avatars

Import process: place source images in a folder, then resize:
```bash
sips -z 96 96 source.png --out public/avatars/sm/name.png
sips -z 256 256 source.png --out public/avatars/lg/name.png
```
Avatar filenames are mapped in each page's frontmatter via the `avatars` record.

## Design

- **Colors:** Gold (#C5A55A) accents on dark green (#0a1a0f) backgrounds
- **Fonts:** Playfair Display (serif headings), Inter (body) — loaded from Google Fonts
- **Winter editions** use sky-blue (#38bdf8) instead of gold for dots/badges

## Internal Links

All internal links must use `${base}/path/` to work on GitHub Pages with the `/Condor` base path. Use `import.meta.env.BASE_URL` in frontmatter.
