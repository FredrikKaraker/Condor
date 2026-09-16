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
├── components/        # Reusable components (SwedenMap, WeatherIcon, PhotoGallery)
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
├── photos/            # Tournament photos, one folder per tournament slug
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

### Tournament photos

Photos live in `src/photos/<tournament-slug>/` — the folder name must match the
tournament's `slug` in `tournaments.json`. Drop files in and the gallery appears at
the bottom of that tournament's page; a tournament with no folder renders no gallery.

**Display order is filename order**, so files carry a `001-`, `002-` … prefix putting
them in chronological order. To move a photo, just renumber it — and to slot one
between `030-` and `031-`, name it `030a-` (digits sort before letters). Order is
derived once at import from EXIF `DateTimeOriginal`, which is the capture time; don't
use the file's creation date, since a Lightroom export or a `cp` rewrites it. The
quickest way to regenerate it is `brew install exiftool`, then from inside the folder:

```bash
exiftool -d '%Y%m%d_%H%M%S' '-FileName<${DateTimeOriginal}-%f.%e' .
```

That gives timestamp-prefixed names in chronological order; renumber them `001-`… if
you want the shorter form. Photos with no EXIF (screenshots, anything shared through
a messaging app) have no capture time and sort last — place those by hand.

Downscale before committing — the originals are 20+ MB each and stay in git history
forever. 2000px on the long edge at quality 80 is plenty for both the thumbnails and
the lightbox:

```bash
mkdir -p src/photos/2027-somewhere
for f in ~/Photos/2027/*.jpg; do
  sips -Z 2000 -s format jpeg -s formatOptions 80 "$f" \
    --out "src/photos/2027-somewhere/$(basename "$f" | tr 'A-Z' 'a-z')"
done
```

Only run that on the big camera originals. Re-encoding a file that's already around
2000px inflates it — a 400 KB phone photo came back out at 1.2 MB — so copy those in
untouched.

Astro (`astro:assets` + `sharp`) generates the WebP variants at build time, so no
manual thumbnail step is needed. Astro also copies the untouched originals into
`dist/_astro/` even though nothing references them — the `prune-unreferenced-assets`
integration in `astro.config.mjs` deletes those after the build.

## Design

- **Colors:** Gold (#C5A55A) accents on dark green (#0a1a0f) backgrounds
- **Fonts:** Playfair Display (serif headings), Inter (body) — loaded from Google Fonts
- **Winter editions** use sky-blue (#38bdf8) instead of gold for dots/badges

## Internal Links

All internal links must use `${base}/path/` to work on GitHub Pages with the `/Condor` base path. Use `import.meta.env.BASE_URL` in frontmatter.
