// Writes the numeric scale (src/tokens/scale.css) from the generator in src/scale/scale.mjs.
//
// Usage:
//   node scripts/scale.mjs           write the file
//   node scripts/scale.mjs --check   exit with 1 when the file differs from what would be written

import { readFileSync, writeFileSync } from 'node:fs';
import { relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { computeScale, renderCss } from '../src/scale/scale.mjs';

export const OUTPUT = fileURLToPath(new URL('../src/tokens/scale.css', import.meta.url));

const css = renderCss();
const where = relative(process.cwd(), OUTPUT);

if (process.argv.includes('--check')) {
  let current = '';
  try {
    current = readFileSync(OUTPUT, 'utf8');
  } catch {}
  if (current !== css) {
    console.error(`scale: ${where} is out of date; run npm run scale`);
    process.exit(1);
  }
  console.log(`scale: ${where} is up to date`);
} else {
  writeFileSync(OUTPUT, css);
  console.log(`scale: ${computeScale().length} variables → ${where}`);
}
