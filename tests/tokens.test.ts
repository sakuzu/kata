import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import fixture from './fixtures/tokens.json' with { type: 'json' };
import { declared, parseRules, resolve } from './resolve.ts';

// The fixture pins the resolved value of every token in three contexts: the default (dark) theme,
// the light theme, and a page whose language is Japanese. Lengths are in px at a root font size
// of 16px, to six significant digits; colors and font lists are the declared text.
const expected = fixture as Record<string, Record<string, number | string>>;

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
const rules = [
  ...parseRules(read('../src/tokens/scale.css')),
  ...parseRules(read('../src/tokens/tokens.css')),
];

const CONTEXTS: Record<string, string[]> = {
  dark: [':root'],
  light: [':root', '[data-color-mode="light"]'],
  cjk: [':root', ':lang(ja)', ':root:lang(ja)'],
};

const round = (v: number | string) => (typeof v === 'number' ? Number(v.toPrecision(6)) : v);

describe.each(Object.entries(CONTEXTS))('tokens (%s)', (context, selectors) => {
  const vars = declared(rules, selectors);
  const pinned = expected[context];

  it('defines exactly the pinned tokens', () => {
    const tokens = [...declared(parseRules(read('../src/tokens/tokens.css')), [':root']).keys()];
    expect(tokens.sort()).toEqual(Object.keys(pinned).sort());
  });

  it.each(Object.entries(pinned))('%s = %s', (name, value) => {
    expect(round(resolve(vars, name))).toBe(value);
  });
});
