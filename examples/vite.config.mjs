// Builds the examples: small, independent pages that the documentation site embeds in iframes.
// Each directory with an index.html is one example. `npm run site:build` writes them into the
// examples/ directory of the built site; `npm run examples:dev` serves them on their own, and
// `npm run audit` measures the built pages.
//
// An example imports kata by its package names, which resolve to the sources here, so an example
// reads the same as code that uses the published package.

import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const OUT = fileURLToPath(new URL('../site/.vitepress/dist/examples', import.meta.url));

/** The names of the examples: the directories that hold an index.html */
export const EXAMPLES = readdirSync(HERE)
  .filter((name) => statSync(join(HERE, name)).isDirectory())
  .filter((name) => statSync(join(HERE, name, 'index.html'), { throwIfNoEntry: false }))
  .sort();

/** @type {Record<string, string>} */
const input = {};
for (const name of EXAMPLES) input[name] = join(HERE, name, 'index.html');

export default defineConfig({
  root: HERE,
  base: './',
  plugins: [svelte({ configFile: fileURLToPath(new URL('../svelte.config.js', import.meta.url)) })],
  resolve: {
    alias: [
      {
        find: /^@sakuzu\/kata$/,
        replacement: fileURLToPath(new URL('../src/kata.css', import.meta.url)),
      },
      {
        find: /^@sakuzu\/kata\/svelte$/,
        replacement: fileURLToPath(new URL('../src/svelte/index.ts', import.meta.url)),
      },
    ],
  },
  build: {
    outDir: OUT,
    emptyOutDir: true,
    rollupOptions: { input },
  },
  preview: { port: 4173, strictPort: true },
});
