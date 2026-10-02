// The static half of the audit: rules that can be read from the sources of the Svelte components
// (src/svelte). The measured half runs in a browser (audit/). docs/checks.md describes both.
//
//   values       spacing, type and colour properties take a token (through the Sass functions or
//                var(--kata-…)) or a plain keyword, never a raw length or colour
//   weight       font-weight is 400 or 600
//   focus        outline-offset is 2px (outside) or -2px (inside)
//   scales       padding takes pad(), gap takes gap(); a line marked kata-allow-gap-padding or
//                kata-allow-pad-gap is the one place where the other scale is meant
//   trim         only the components that hold text in a control, at an edge or in a column trim
//                text (text-box, or the trim mixins)
//   negative     no negative distance (margin, inset, top, right, bottom, left)
//   has          a component never looks at its content with :has(); only :has(+ …), the next
//                sibling, is allowed
//   media        no @media for widths; the widths are the container queries of the mixins
//   margin       the root element of a component has no outer margin (layouts and Prose aside)
//   tokens       every custom property a component reads is defined by the foundation or by a
//                component
//   coverage     every component is exported, has an example and a page in docs/components or
//                docs/workbench
//
// Usage: node scripts/lint-components.mjs

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(ROOT, 'src/svelte');

/** @param {string} dir @returns {string[]} */
function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const FN = '(pad|gap|fs|lh|ls|h|off|color|bw|z|dim|inset)\\(';
const SIMPLE =
  /^\s*(0|auto|100%|50%|inherit|initial|unset|none|normal|transparent|currentColor|tabular-nums)\s*$/i;
const TOKEN = new RegExp(`var\\(--kata-|${FN}|#\\{`);
const VALUE_PROPS = new Set([
  'padding',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'padding-block',
  'padding-inline',
  'padding-block-start',
  'padding-block-end',
  'padding-inline-start',
  'padding-inline-end',
  'margin',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'margin-block',
  'margin-inline',
  'margin-block-start',
  'margin-block-end',
  'margin-inline-start',
  'margin-inline-end',
  'gap',
  'row-gap',
  'column-gap',
  'font-size',
  'line-height',
  'letter-spacing',
  'color',
  'background-color',
  'border-color',
  'border-radius',
  'box-shadow',
  'outline-color',
]);
const SHORTHANDS = new Set([
  'background',
  'border',
  'border-top',
  'border-right',
  'border-bottom',
  'border-left',
  'border-block',
  'border-inline',
  'outline',
]);
const COLORISH =
  /#[0-9a-f]{3,8}\b|\brgba?\(|\bhsla?\(|\b(white|black|red|blue|gray|grey)(?![\w-])/i;
// The components that hold text inside a control, at an edge or in a column, and may trim it
const TRIM_OK = new Set([
  'Text',
  'Kbd',
  'SectionHeader',
  'InspectorSection',
  'Section',
  'Button',
  'Checkbox',
  'Counter',
  'InlineEdit',
  'LinkAction',
  'NumberInput',
  'Radio',
  'Segmented',
  'Select',
  'Slider',
  'TextInput',
  'Toggle',
  'Badge',
  'Chip',
  'Tag',
  'Pair',
  'ReadValue',
  'StepBar',
  'ColHead',
  'ListItem',
  'Pager',
  'Table',
  'Tcard',
  'Avatar',
  'Modal',
  'MenuItem',
  'MenuHead',
  'Tooltip',
  'Bulk',
  'Note',
  'Crumbs',
  'Disclosure',
  'Tabs',
  'Toolbar',
  'Topbar',
  'TreeRow',
  'Stat',
]);
// The components whose root may have an outer margin: the layouts, the icon and Prose
const MARGIN_OK = new Set(['Stack', 'Row', 'Grid', 'Icon', 'Prose']);

/** @type {string[]} */
const problems = [];
/** @param {string} file @param {number} line @param {string} text */
const report = (file, line, text) =>
  problems.push(`${relative(ROOT, file)}${line ? `:${line}` : ''}: ${text}`);

/**
 * The style of a component, with the line number where it starts
 * @param {string} file
 * @param {string} source
 */
function styleOf(file, source) {
  if (file.endsWith('.scss') || file.endsWith('.css')) return { css: source, offset: 0 };
  const m = source.match(/<style[^>]*>([\s\S]*?)<\/style>/);
  if (!m || m.index === undefined) return { css: '', offset: 0 };
  const start = m.index + m[0].indexOf('>') + 1;
  return { css: m[1], offset: source.slice(0, start).split('\n').length - 1 };
}

const files = walk(SRC).filter((f) => /\.(svelte|scss|css|ts)$/.test(f));
const components = files.filter((f) => f.includes('/components/') && f.endsWith('.svelte'));

// ---- Rules on each component's style ----
for (const file of components) {
  const name = basename(file, '.svelte');
  const source = readFileSync(file, 'utf8');
  const { css, offset } = styleOf(file, source);
  const lines = css.split('\n');
  lines.forEach((raw, i) => {
    const line = i + 1 + offset;
    const text = raw.replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, '');
    const decl = text.match(/^\s*([a-z-]+)\s*:\s*(.+?);?\s*$/);
    if (decl) {
      const [, prop, value] = decl;
      if (VALUE_PROPS.has(prop) && !TOKEN.test(value) && !SIMPLE.test(value))
        report(file, line, `${prop}: ${value} is not a token`);
      if (SHORTHANDS.has(prop) && COLORISH.test(value))
        report(file, line, `${prop}: ${value} names a colour; use color()`);
      if (prop === 'font-weight' && !/^(400|600|inherit)$/.test(value.trim()))
        report(file, line, `font-weight: ${value} (400 or 600)`);
      if (prop === 'outline-offset' && !/^-?2px$/.test(value.trim()))
        report(file, line, `outline-offset: ${value} (2px or -2px)`);
      if (/^padding/.test(prop) && /\bgap\(/.test(value) && !raw.includes('kata-allow-gap-padding'))
        report(file, line, `${prop} takes pad(), not gap()`);
      if (
        /^(row-|column-)?gap$/.test(prop) &&
        /\bpad\(/.test(value) &&
        !raw.includes('kata-allow-pad-gap')
      )
        report(file, line, `${prop} takes gap(), not pad()`);
      if (
        /^(margin|inset|top|right|bottom|left)/.test(prop) &&
        /(^|\s)-(?!-)|\*\s*-1\b/.test(value)
      )
        report(file, line, `${prop}: ${value} is a negative distance`);
      if (prop === 'text-box' && value.trim() !== 'none' && !TRIM_OK.has(name))
        report(file, line, 'this component does not trim text');
    }
    if (/@include\s+trim(-start|-end)?\b/.test(text) && !TRIM_OK.has(name))
      report(file, line, 'this component does not trim text');
    if (/:has\((?!\s*\+)/.test(text))
      report(file, line, ':has() looks at the content; only :has(+ …)');
    if (/@media\b(?!\s*\((prefers-reduced-motion|prefers-contrast)|\s*print)/.test(text))
      report(file, line, '@media for a width; use the narrow, mid or tiny mixin');
  });

  // The root element's rule has no outer margin
  const markup = source
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  const rootClass = markup.match(/<[a-zA-Z][\w:-]*\b[^>]*\bclass="([a-zA-Z][\w-]*)/)?.[1];
  if (rootClass && !MARGIN_OK.has(name)) {
    for (const m of css.matchAll(new RegExp(`\\n\\s*\\.${rootClass}\\s*\\{([^}]*)\\}`, 'g'))) {
      for (const d of m[1].split('\n')) {
        if (/^\s*margin[\w-]*\s*:/.test(d) && !/:\s*(0|auto)\s*;/.test(d))
          report(file, 0, `.${rootClass} has an outer margin: ${d.trim()}`);
      }
    }
  }
}

// ---- Every custom property read is defined ----
const defined = new Set();
for (const file of [
  join(ROOT, 'src/tokens/scale.css'),
  join(ROOT, 'src/tokens/tokens.css'),
  ...files,
]) {
  const source = readFileSync(file, 'utf8');
  for (const m of source.matchAll(/(--kata-[\w-]+)\s*:/g)) defined.add(m[1]);
  for (const m of source.matchAll(/style:(--kata-[\w-]+)/g)) defined.add(m[1]);
}
// Properties that a page or a container sets for the components to read, with a fallback
const HOOKS = new Set(['--kata-box', '--kata-glyph-font', '--kata-topbar-brand-tracking']);
/** @type {[RegExp, string][]} */
const FUNCTIONS = [
  [/\bpad\(([\w-]+)\)/g, '--kata-pad-'],
  [/\bgap\(([\w-]+)\)/g, '--kata-gap-'],
  [/\bfs\(([\w-]+)\)/g, '--kata-text-size-'],
  [/\blh\(([\w-]+)\)/g, '--kata-text-leading-'],
  [/\bls\(([\w-]+)\)/g, '--kata-text-tracking-'],
  [/\boff\(([\w-]+)\)/g, '--kata-text-offset-'],
  [/\bh\(([\w-]+)\)/g, '--kata-height-'],
  [/\bcolor\(([\w-]+)\)/g, '--kata-color-'],
  [/\bz\(([\w-]+)\)/g, '--kata-z-'],
];
for (const file of files) {
  const source = readFileSync(file, 'utf8');
  source.split('\n').forEach((line, i) => {
    if (/--(ds|lk)-/.test(line)) report(file, i + 1, 'a custom property outside kata');
    const used = new Set();
    for (const m of line.matchAll(/var\(\s*(--kata-[\w-]+)/g)) used.add(m[1]);
    if (!file.endsWith('.ts') && !file.endsWith('_kata.scss'))
      for (const [re, prefix] of FUNCTIONS)
        for (const m of line.matchAll(re)) used.add(prefix + m[1]);
    for (const name of used)
      if (!defined.has(name) && !HOOKS.has(name) && !name.endsWith('-'))
        report(file, i + 1, `${name} is not defined`);
  });
}

// ---- Every component is exported, has an example and a page ----
const index = readFileSync(join(SRC, 'index.ts'), 'utf8');
/** @param {string} s */
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
for (const file of components) {
  const name = basename(file, '.svelte');
  if (!index.includes(`as ${name} }`)) report(file, 0, 'not exported from src/svelte/index.ts');
  if (!statSync(join(ROOT, 'examples', kebab(name), 'index.html'), { throwIfNoEntry: false }))
    report(file, 0, `no example (examples/${kebab(name)}/)`);
  // A component has its page among the components or, for a part of a drawing application, in
  // the Workbench chapter
  const page = ['docs/components', 'docs/workbench']
    .map((dir) => join(ROOT, dir, `${kebab(name)}.md`))
    .find((path) => statSync(path, { throwIfNoEntry: false }));
  if (!page) report(file, 0, `no page (docs/components/ or docs/workbench/${kebab(name)}.md)`);
  else if (!readFileSync(page, 'utf8').includes(`examples/${kebab(name)}/`))
    report(page, 0, `does not embed its example (examples/${kebab(name)}/)`);
}

if (problems.length > 0) {
  for (const p of problems) console.error(`  ${p}`);
  console.error(`lint-components: ${problems.length} problem(s)`);
  process.exit(1);
}
console.log(`lint-components: ok (${components.length} components)`);
