// Builds the examples: small, independent pages that the documentation site embeds in iframes.
// Each directory with an index.html is one example. `npm run site:build` writes them into the
// examples/ directory of the built site; `npm run examples:dev` serves them on their own.
//
// An example imports kata by its package name, which resolves to the sources here, so an
// example reads the same as code that uses the published package.

import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const OUT = fileURLToPath(new URL('../site/.vitepress/dist/examples', import.meta.url));

/** @type {Record<string, string>} */
const input = {};
for (const name of readdirSync(HERE)) {
  const page = join(HERE, name, 'index.html');
  if (statSync(join(HERE, name)).isDirectory() && statSync(page, { throwIfNoEntry: false })) {
    input[name] = page;
  }
}

export default defineConfig({
  root: HERE,
  base: './',
  resolve: {
    alias: [
      {
        find: /^@sakuzu\/kata$/,
        replacement: fileURLToPath(new URL('../src/kata.css', import.meta.url)),
      },
    ],
  },
  build: {
    outDir: OUT,
    emptyOutDir: true,
    rollupOptions: { input },
  },
});
