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

// A menu opened from the hover-only actions of a TreeRow covers the next row. The pointer leaves
// the row on its way into the menu (through the next row), and the item is still pressed: the
// Dropdown tells the row it is open (kata-menu-toggle), and the row keeps its actions shown.
test('tree-row: a menu item is pressed after the pointer leaves the row', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/tree-row/', { waitUntil: 'networkidle' });
  const tree = page.getByRole('tree', { name: 'Menus' });
  const row = tree.locator('[data-id="First"]');
  await row.hover();
  await row.getByRole('button', { name: 'Actions', exact: true }).click();
  await expect(row).toHaveAttribute('data-open', '');
  const item = page.getByRole('menuitem', { name: 'Rename' });
  await expect(item).toBeVisible();
  const next = await tree.locator('[data-id="Second"]').boundingBox();
  const box = await item.boundingBox();
  if (!next || !box) throw new Error('the next row or the item has no box');
  // Through the next row, outside the menu, then onto the item
  await page.mouse.move(next.x + 4, next.y + next.height / 2, { steps: 4 });
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 4 });
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page.getByText('Chose rename First')).toBeVisible();
  await expect(row).not.toHaveAttribute('data-open', '');
});

// A Sheet at half holding a panel taller than half the frame (an InspectorFrame in a wrapper as tall
// as its place, as an application puts it there): the sheet stops at half, the panel's content
// takes the height left between its head and its foot and scrolls there, and the foot stays in the
// frame.
test('sheet: at half, a pane taller than half scrolls its content above the foot', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.goto('/sheet/', { waitUntil: 'networkidle' });
  const sheet = page.getByRole('complementary', { name: 'Inspector' });
  await expect(sheet).toHaveAttribute('data-stage', 'half');
  const frame = sheet.locator('xpath=..');
  await frame.scrollIntoViewIfNeeded();
  const scroll = sheet.locator('section[data-role="panel"] > .scroll');
  const { scrollHeight, clientHeight } = await scroll.evaluate((el) => ({
    scrollHeight: el.scrollHeight,
    clientHeight: el.clientHeight,
  }));
  expect(clientHeight, 'the content has a height').toBeGreaterThan(0);
  expect(scrollHeight, 'the content scrolls').toBeGreaterThan(clientHeight);
  const box = await frame.boundingBox();
  const foot = await sheet.locator('[data-role="footer"]').boundingBox();
  if (!box || !foot) throw new Error('the frame or the foot has no box');
  expect(foot.y + foot.height, 'the foot ends in the frame').toBeLessThanOrEqual(
    box.y + box.height + 0.5,
  );
  // Nothing covers the foot's button: it is not clipped by the sheet
  const hit = await sheet.getByRole('button', { name: 'Delete' }).evaluate((el) => {
    const r = el.getBoundingClientRect();
    return el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
  });
  expect(hit, 'the foot is shown').toBe(true);
});
