// Builds the CSS files of the package into dist/ by inlining the imports of the source files.
//
//   dist/kata.css    the scale, the tokens and the base (the entry @sakuzu/kata)
//   dist/scale.css   the scale alone
//   dist/tokens.css  the scale and the tokens (the tokens are written with the scale)
//   dist/base.css    the base alone (it needs the tokens)
//
// Usage: node scripts/build.mjs

import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const { version } = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

/**
 * Reads a CSS file and replaces each `@import "<relative path>";` line with that file's content.
 * @param {string} file
 * @returns {string}
 */
function inline(file) {
  return readFileSync(file, 'utf8').replace(/^@import "([^"]+)";$/gm, (_, path) =>
    inline(join(dirname(file), path)).trimEnd(),
  );
}

const banner = `/*! @sakuzu/kata ${version} | Apache-2.0 | Copyright 2026 Kasika, Inc. */\n`;

/** @type {Record<string, string>} */
const outputs = {
  'kata.css': inline(join(ROOT, 'src/kata.css')),
  'scale.css': inline(join(ROOT, 'src/tokens/scale.css')),
  'tokens.css': `${inline(join(ROOT, 'src/tokens/scale.css'))}\n${inline(join(ROOT, 'src/tokens/tokens.css'))}`,
  'base.css': inline(join(ROOT, 'src/base/base.css')),
};

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST);
for (const [name, css] of Object.entries(outputs)) {
  writeFileSync(join(DIST, name), banner + css);
}
console.log(`build: ${Object.keys(outputs).join(', ')} → dist/`);
