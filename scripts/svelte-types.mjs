// Completes the declaration files that svelte-package writes, so that TypeScript resolves every
// import in them.
//
// - svelte-package declares Button.svelte in Button.svelte.d.ts, which Svelte's tools read. The
//   TypeScript compiler looks for the types of an import of './Button.svelte' in
//   Button.d.svelte.ts instead (the form for files of any extension), so each declaration is
//   also written under that name.
// - A component imports the shared stylesheet for its side effect, and the declarations repeat
//   that import. A declaration carries types only, so the import of a .css file is removed.
//
// Usage: node scripts/svelte-types.mjs (run by npm run package)

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = fileURLToPath(new URL('../dist/svelte', import.meta.url));
const CSS_IMPORT = /^import '[^']+\.css';\n/gm;

/**
 * @param {string} dir
 * @returns {number} the number of component declarations
 */
function complete(dir) {
  let n = 0;
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      n += complete(path);
      continue;
    }
    if (!name.endsWith('.d.ts')) continue;
    const text = readFileSync(path, 'utf8').replace(CSS_IMPORT, '');
    writeFileSync(path, text);
    if (name.endsWith('.svelte.d.ts')) {
      writeFileSync(join(dir, name.replace(/\.svelte\.d\.ts$/, '.d.svelte.ts')), text);
      n += 1;
    }
  }
  return n;
}

console.log(`svelte-types: ${complete(OUT)} component declarations completed`);
