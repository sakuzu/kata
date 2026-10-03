// Tests that run in WebKit (the audit itself runs in Chromium). The browser is set for this file
// only.
import { expect, test } from '@playwright/test';

test.use({ browserName: 'webkit' });

// Loaded at 390, a surface open from the start was placed before the stylesheets arrived and
// stayed there, over its trigger. An open surface follows its trigger, so it ends below the
// trigger, gap-xs away, with the start edges lined up, and gap-md or more inside the window.
for (const [name, trigger] of [
  ['dropdown', 'Sort'],
  ['popover', 'Snapping'],
]) {
  test(`${name}: open from the start, the surface sits under its trigger`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 1000 });
    await page.goto(`/${name}/`, { waitUntil: 'networkidle' });
    const button = page.getByRole('button', { name: trigger, exact: true });
    const surface = page.locator('[popover]:popover-open');
    await expect(surface).toHaveCount(1);
    const tokens = await page.evaluate(() => {
      const px = (v: string) => {
        const probe = document.createElement('div');
        probe.style.cssText = `position:absolute;visibility:hidden;width:0;height:${v}`;
        document.body.appendChild(probe);
        const h = probe.getBoundingClientRect().height;
        probe.remove();
        return h;
      };
      return { gap: px('var(--kata-gap-xs)'), edge: px('var(--kata-gap-md)') };
    });
    await expect(async () => {
      const b = await button.boundingBox();
      const s = await surface.boundingBox();
      if (!b || !s) throw new Error('the trigger or the surface has no box');
      expect(
        Math.abs(s.y - (b.y + b.height + tokens.gap)),
        'gap-xs below the trigger',
      ).toBeLessThan(1);
      expect(Math.abs(s.x - b.x), 'the start edges line up').toBeLessThan(1);
      expect(s.x, 'gap-md inside the window').toBeGreaterThanOrEqual(tokens.edge - 0.5);
    }).toPass({ timeout: 3000 });
  });
}
