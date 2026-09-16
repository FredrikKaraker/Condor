import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { readdir, readFile, stat, unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const TEXT_ASSETS = new Set(['.html', '.js', '.mjs', '.css', '.json', '.xml']);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(full) : [full];
    }),
  );
  return files.flat();
}

/**
 * The gallery imports its source photos so `astro:assets` can optimize them.
 * Astro emits those originals into `dist/_astro/` as well, even though every
 * `<img>` points at a generated WebP instead — roughly 50 MB of files nothing
 * ever requests. Delete any emitted asset that no built page references.
 */
function pruneUnreferencedAssets() {
  return {
    name: 'prune-unreferenced-assets',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const distDir = fileURLToPath(dir);
        const assetsDir = path.join(distDir, '_astro');

        let assets;
        try {
          assets = await readdir(assetsDir);
        } catch {
          return;
        }

        const files = await walk(distDir);
        const haystack = (
          await Promise.all(
            files
              .filter((file) => TEXT_ASSETS.has(path.extname(file)))
              .map((file) => readFile(file, 'utf8')),
          )
        ).join('\n');

        let removed = 0;
        let bytes = 0;
        for (const asset of assets) {
          if (haystack.includes(asset)) continue;
          const full = path.join(assetsDir, asset);
          const { size } = await stat(full);
          await unlink(full);
          removed += 1;
          bytes += size;
        }

        if (removed > 0) {
          logger.info(`Pruned ${removed} unreferenced asset(s), ${(bytes / 1048576).toFixed(1)} MB`);
        }
      },
    },
  };
}

export default defineConfig({
  site: 'https://condorgilligan.se',
  integrations: [pruneUnreferencedAssets()],
  vite: {
    plugins: [tailwindcss()],
  },
});
