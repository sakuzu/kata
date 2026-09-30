// A small resolver of CSS custom properties, enough to compute the tokens without a browser.
//
// It reads the flat rules of a style sheet (no nesting), applies the rules whose selector is in a
// given set, substitutes var() and evaluates calc() with 1rem = 1em = 16px. Lengths come out in
// px, ratios as plain numbers, and anything else (colors, font lists) as the declared text.

export type Rules = { selector: string; decls: [name: string, value: string][] }[];

const ROOT_PX = 16;

/** Parses the top-level rules of a style sheet. Comments are dropped. */
export function parseRules(css: string): Rules {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules: Rules = [];
  for (const m of text.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = m[1].trim().replace(/\s+/g, ' ');
    const decls: [string, string][] = [];
    for (const d of m[2].split(';')) {
      const at = d.indexOf(':');
      if (at === -1) continue;
      const name = d.slice(0, at).trim();
      if (name.startsWith('--'))
        decls.push([
          name,
          d
            .slice(at + 1)
            .trim()
            .replace(/\s+/g, ' '),
        ]);
    }
    rules.push({ selector, decls });
  }
  return rules;
}

/** The declared custom properties after applying, in order, the rules whose selector is listed. */
export function declared(rules: Rules, selectors: string[]): Map<string, string> {
  const out = new Map<string, string>();
  for (const rule of rules) {
    const parts = rule.selector.split(',').map((s) => s.trim());
    if (!parts.some((p) => selectors.includes(p))) continue;
    for (const [name, value] of rule.decls) out.set(name, value);
  }
  return out;
}

/** Substitutes every var() in a value, recursively. */
function substitute(value: string, vars: Map<string, string>, seen: Set<string>): string {
  return value.replace(/var\((--[a-z0-9-]+)\)/gi, (_, name: string) => {
    const v = vars.get(name);
    if (v === undefined) throw new Error(`undefined: ${name}`);
    if (seen.has(name)) throw new Error(`cycle: ${name}`);
    return `(${substitute(v, vars, new Set([...seen, name]))})`;
  });
}

/** Resolves a custom property to px or a plain number when it is numeric, or to its text. */
export function resolve(vars: Map<string, string>, name: string): number | string {
  const value = vars.get(name);
  if (value === undefined) throw new Error(`undefined: ${name}`);
  const text = substitute(value, vars, new Set([name]));
  const expression = text
    .replace(/calc/g, '')
    .replace(/(-?\d*\.?\d+)(rem|em|px)\b/g, (_, n: string, unit: string) =>
      String(Number(n) * (unit === 'px' ? 1 : ROOT_PX)),
    );
  if (!/^[\d\s.+\-*/()]+$/.test(expression)) return text.replace(/^\((.*)\)$/, '$1');
  return Function(`return (${expression});`)() as number;
}
