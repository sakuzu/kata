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
// The edge check is not counted yet; KATA_EDGE=1 runs it
const EDGE = process.env.KATA_EDGE === '1';

type Finding = { kind: string; el: string; [key: string]: unknown };

for (const name of names) {
  test(name, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(String(e).split('\n')[0]));
    await page.setViewportSize({ width: WIDTHS[0], height: 1000 });
    await page.goto(`/${name}/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    // Switch without transitions, so that no colour is measured halfway. The page's own scrollbar
    // (the system's) takes no width on any system, so that the widths are the widths of the content
    await page.addStyleTag({
      content:
        '*, *::before, *::after { transition: none !important; } html { scrollbar-width: none; }',
    });
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
            const { roots, findings } = await page.evaluate(
              (edge) =>
                (
                  window as unknown as {
                    kataAudit: (
                      selector: string,
                      options: { edge: boolean },
                    ) => { roots: number; findings: Finding[] };
                  }
                ).kataAudit('[data-audit]', { edge }),
              EDGE,
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

// On a narrow screen, a side sheet that does not close rests at its lowest height while its region
// is not open; while the dock's sheet is open it is not shown (it would cover the dock's bottom),
// and it comes back when the dock closes.
test('shell: a resting sheet is not shown while the dock sheet is open', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.goto('/shell/', { waitUntil: 'networkidle' });
  const example = page
    .getByText("A sheet that does not close and the dock's sheet", { exact: false })
    .locator('xpath=..');
  const dock = example.locator('aside[data-sheet="dock"]');
  const rest = example.locator('aside[data-sheet="left"]');
  await example.scrollIntoViewIfNeeded();
  await expect(dock).toBeVisible();
  await expect(rest).toHaveCount(0);
  // ArrowDown on the handle at the dock's lowest height closes it
  await dock.getByRole('button', { name: 'Sheet height' }).press('ArrowDown');
  await expect(dock).toHaveCount(0);
  await expect(rest).toBeVisible();
  await expect(rest).toHaveAttribute('data-stage', 'peek');
  // The dock coming again hides the resting sheet
  await example.getByRole('button', { name: 'Show the output' }).click();
  await expect(dock).toBeVisible();
  await expect(rest).toHaveCount(0);
});

// A scrollbar never squeezes a control. In a frame too low for it, the toolbar's column above the
// Fab scrolls, shows its scrollbar beside the tools at the track's thickness (size-sm), and grows
// by it: the tools keep their width, so the column does not scroll sideways.
test('shell: the column above the Fab scrolls and grows by its scrollbar', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.goto('/shell/', { waitUntil: 'networkidle' });
  const example = page.getByText('bottomFab in a low frame', { exact: false }).locator('xpath=..');
  await example.scrollIntoViewIfNeeded();
  await example.getByRole('button', { name: 'Tools', exact: true }).click();
  const column = example.locator('[data-region="bottom"] > [aria-orientation="vertical"]');
  await expect(column).toBeVisible();
  const m = await column.evaluate((el) => {
    const cs = getComputedStyle(el);
    const probe = document.createElement('div');
    probe.style.cssText =
      'position:absolute;visibility:hidden;width:0;height:var(--kata-size-sm-rem)';
    document.body.appendChild(probe);
    const track = probe.getBoundingClientRect().height;
    probe.remove();
    const r = el.getBoundingClientRect();
    const tool = el.querySelector('button')?.getBoundingClientRect();
    const borders = Number.parseFloat(cs.borderLeftWidth) + Number.parseFloat(cs.borderRightWidth);
    return {
      track,
      bar: r.width - borders - el.clientWidth,
      // The room the tools need: a tool, the padding at both sides, the lines and the scrollbar
      need: (tool?.width ?? 0) + 2 * Number.parseFloat(cs.paddingLeft) + borders,
      width: r.width,
      scrollsY: el.scrollHeight > el.clientHeight,
      scrollsX: el.scrollWidth > el.clientWidth,
    };
  });
  expect(m.scrollsY, 'the column scrolls').toBe(true);
  expect(Math.abs(m.bar - m.track), 'a scrollbar of the track').toBeLessThan(1.5);
  expect(m.scrollsX, 'the tools are not squeezed').toBe(false);
  expect(m.width, 'the column grows by its scrollbar').toBeGreaterThan(m.need + m.track - 1.5);
});
