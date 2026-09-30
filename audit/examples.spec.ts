// Opens every example that shows a component and measures it under each condition: three widths
// (1440, 768 and 390px), the default and the largest text size, the dark and the light theme, and
// an English and a Japanese root (the language moves the edges of controls to the CJK ink). The
// page loads once; the conditions are switched in place. The rules are in measure.js.
import { readdirSync, statSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const EXAMPLES = new URL('../examples/', import.meta.url);
// The scale example draws the values of the scale themselves and is not measured
const SKIP = new Set(['scale']);
const names = readdirSync(EXAMPLES)
  .filter((name) => statSync(new URL(`${name}/index.html`, EXAMPLES), { throwIfNoEntry: false }))
  .filter((name) => !SKIP.has(name))
  .sort();

const WIDTHS = [1440, 768, 390];
const SCALES = ['', 'max'];
const MODES = ['dark', 'light'];
const LANGS = ['en', 'ja'];

type Finding = { kind: string; el: string; [key: string]: unknown };

for (const name of names) {
  test(name, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(String(e).split('\n')[0]));
    await page.setViewportSize({ width: WIDTHS[0], height: 1000 });
    await page.goto(`/${name}/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    // Switch without transitions, so that no colour is measured halfway
    await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; }' });
    await page.addScriptTag({ path: new URL('./measure.js', import.meta.url).pathname });

    // One line per finding, with the conditions under which it occurs
    const report = new Map<string, string[]>();
    for (const lang of LANGS) {
      for (const mode of MODES) {
        for (const width of WIDTHS) {
          for (const scale of SCALES) {
            await page.setViewportSize({ width, height: 1000 });
            await page.evaluate(
              ([l, m, s]) => {
                const root = document.documentElement;
                root.lang = l;
                if (m === 'light') root.setAttribute('data-color-mode', 'light');
                else root.removeAttribute('data-color-mode');
                if (s) root.setAttribute('data-font-scale', s);
                else root.removeAttribute('data-font-scale');
              },
              [lang, mode, scale],
            );
            // Let the container queries and the root size settle
            await page.evaluate(
              () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))),
            );
            const { roots, findings } = await page.evaluate(() =>
              (
                window as unknown as {
                  kataAudit: () => { roots: number; findings: Finding[] };
                }
              ).kataAudit(),
            );
            expect(roots, 'the page has a [data-audit] root').toBeGreaterThan(0);
            for (const e of errors.splice(0)) findings.push({ kind: 'page-error', el: e });
            const where = `${width}${scale ? ' max' : ''} ${mode} ${lang}`;
            for (const f of findings) {
              const key = JSON.stringify(f);
              report.set(key, [...(report.get(key) ?? []), where]);
            }
          }
        }
      }
    }
    const lines = [...report].map(([f, where]) => `${f}  (${where.length}×: ${where[0]} …)`);
    expect(lines, lines.slice(0, 30).join('\n')).toEqual([]);
  });
}
