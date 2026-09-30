// Fails when geography vocabulary appears in the text of kata.
//
// kata serves every kind of drawing application, so none of its layers may speak of what a
// particular application draws. This script looks for the listed words (whole words, in any
// case) in the sources, the documents, the site, the examples, the README and the changelog.
//
// A line that must contain one of the words is listed in scripts/check-terms.allow.json:
// `[{ "file": "<path from the repository root>", "pattern": "<regular expression>",
// "reason": "<why>" }]`. The pattern is matched against the line.
//
// Usage: node scripts/check-terms.mjs

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

export const WORDS = [
  'lon',
  'lat',
  'lng',
  'longitude',
  'latitude',
  'meters?',
  'bbox',
  'geojson',
  'maplibre',
  'terrain',
  'basemap',
  'dataset',
  'mercator',
  'tiles?',
];
const TERM = new RegExp(`\\b(${WORDS.join('|')})\\b`, 'gi');

const SCAN = ['README.md', 'CHANGELOG.md', 'src', 'docs', 'site', 'examples'];
const SKIP_DIRS = new Set(['node_modules', 'dist', 'cache']);
const EXT = /\.(md|mjs|js|ts|mts|css|html|json|svelte|vue)$/;

/** @typedef {{ file: string, pattern: string, reason: string }} Allowed */

/** @type {Allowed[]} */
const allowed = JSON.parse(readFileSync(join(ROOT, 'scripts/check-terms.allow.json'), 'utf8'));
const allow = allowed.map((a) => ({ file: a.file, regex: new RegExp(a.pattern) }));

/**
 * @param {string} path
 * @returns {Generator<string>}
 */
function* walk(path) {
  if (statSync(path).isDirectory()) {
    for (const name of readdirSync(path)) {
      if (!SKIP_DIRS.has(name)) yield* walk(join(path, name));
    }
  } else if (EXT.test(path)) {
    yield path;
  }
}

/** @type {string[]} */
const hits = [];
for (const entry of SCAN) {
  const abs = join(ROOT, entry);
  if (!statSync(abs, { throwIfNoEntry: false })) continue;
  for (const file of walk(abs)) {
    const rel = relative(ROOT, file);
    readFileSync(file, 'utf8')
      .split('\n')
      .forEach((line, i) => {
        const found = [...line.matchAll(TERM)].map((m) => m[0]);
        if (found.length === 0) return;
        if (allow.some((a) => a.file === rel && a.regex.test(line))) return;
        hits.push(`${rel}:${i + 1}: ${line.trim().slice(0, 120)}  [${found.join(', ')}]`);
      });
  }
}

if (hits.length > 0) {
  console.error('check-terms: geography vocabulary:');
  for (const h of hits) console.error(`  ${h}`);
  console.error(`check-terms: ${hits.length} hit(s)`);
  process.exit(1);
}
console.log('check-terms: ok');
