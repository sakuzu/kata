import { render } from '@testing-library/svelte';
import { createRawSnippet, tick } from 'svelte';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import Shell, { type ShellLayout } from '../../src/svelte/components/Shell.svelte';
import ShortcutsModal from '../../src/svelte/components/ShortcutsModal.svelte';
import { formatShortcut, matchesShortcut } from '../../src/svelte/lib/shortcuts.js';
import ShellStageHarness from './ShellStageHarness.svelte';

const html = (markup: string) => createRawSnippet(() => ({ render: () => markup }));
const regions = {
  top: html('<header>Bar</header>'),
  left: html('<section>Contents</section>'),
  right: html('<section>Details</section>'),
  stage: html('<div>Drawing</div>'),
};

// jsdom has no showModal() or close(); these do what a browser does with the open attribute. It
// has no ResizeObserver either, which the measured heights need.
beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  const proto = HTMLDialogElement.prototype as HTMLDialogElement & Record<string, unknown>;
  proto.showModal ??= function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
  proto.close ??= function (this: HTMLDialogElement) {
    if (!this.hasAttribute('open')) return;
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
});

/** Resizes the window (in px, at a root of 16px) and lets the shell measure again */
async function resize(width: number) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
  window.dispatchEvent(new Event('resize'));
  await tick();
  await tick();
}

/** Presses a key; false when the shell took it (the default was prevented) */
const press = (key: string, init: KeyboardEventInit = {}, target: EventTarget = document.body) =>
  target.dispatchEvent(
    new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init }),
  );

const region = (el: HTMLElement, name: string) => el.querySelector(`[data-region="${name}"]`);

describe('Shell', () => {
  afterEach(() => resize(1024));

  it('draws the regions it is given and leaves out the others', async () => {
    const { container } = render(Shell, { ...regions, right: undefined });
    await tick();
    expect(container.querySelector('.top')?.textContent).toBe('Bar');
    expect(region(container, 'left')?.textContent).toBe('Contents');
    expect(container.querySelector('.surface')?.textContent).toBe('Drawing');
    expect(region(container, 'right')).toBeNull();
    expect(region(container, 'bottom')).toBeNull();
    expect(region(container, 'dock')).toBeNull();
  });

  it('draws the dock under the stage, with a grip along its top', async () => {
    const { getByRole } = render(Shell, { stage: regions.stage, dock: html('<div>Output</div>') });
    await tick();
    const grip = getByRole('slider', { name: 'Dock height' });
    expect(grip.closest('[data-region="dock"]')?.textContent?.trim()).toBe('Output');
  });

  it('opens and closes the side regions with leftOpen and rightOpen', async () => {
    const { container, rerender } = render(Shell, { ...regions, leftOpen: false });
    await tick();
    expect(region(container, 'left')).toBeNull();
    expect(region(container, 'right')).toBeNull();
    await rerender({ leftOpen: true, rightOpen: true });
    await tick();
    expect(region(container, 'left')).not.toBeNull();
    expect(region(container, 'right')).not.toBeNull();
  });

  it('floats the side regions over the stage from 48rem and puts them in sheets below', async () => {
    const onlayout = vi.fn<(l: ShellLayout) => void>();
    const { container } = render(Shell, { ...regions, rightOpen: true, onlayout });
    await tick();
    expect(onlayout).toHaveBeenLastCalledWith(
      expect.objectContaining({
        width: 'wide',
        leftMode: 'floating',
        rightMode: 'floating',
      }),
    );
    // Both panes float at once, left first, and nothing covers the rest of the stage
    const panes = [...container.querySelectorAll('[data-role="floating"] > [data-region]')];
    expect(panes.map((p) => p.getAttribute('data-region'))).toEqual(['left', 'right']);
    expect(container.querySelector('.side')).toBeNull();
    expect(container.querySelector('.scrim, button[aria-label="Close the panels"]')).toBeNull();

    // 60rem: between the narrow and the medium width
    await resize(960);
    expect(onlayout).toHaveBeenLastCalledWith(
      expect.objectContaining({
        width: 'mid',
        leftMode: 'floating',
        rightMode: 'floating',
      }),
    );
    expect(container.querySelectorAll('[data-role="floating"]')).toHaveLength(2);
    expect(container.querySelector('.scrim')).toBeNull();

    // 30rem: below the narrow width, one sheet at a time: the one opened last stays
    await resize(480);
    expect(onlayout).toHaveBeenLastCalledWith(
      expect.objectContaining({
        width: 'narrow',
        leftMode: 'sheet',
        rightMode: 'sheet',
      }),
    );
    expect(container.querySelector('[data-sheet="left"]')).toBeNull();
    expect(container.querySelector('[data-sheet="right"]')).not.toBeNull();
    expect(container.querySelector('[data-role="floating"]')).toBeNull();
  });

  it('stands the side regions beside the stage from 64rem with side="beside"', async () => {
    const onlayout = vi.fn<(l: ShellLayout) => void>();
    const { container } = render(Shell, { ...regions, side: 'beside', rightOpen: true, onlayout });
    await tick();
    expect(onlayout).toHaveBeenLastCalledWith(
      expect.objectContaining({
        width: 'wide',
        leftMode: 'beside',
        rightMode: 'beside',
      }),
    );
    expect(container.querySelector('.side.left')).not.toBeNull();
    expect(container.querySelector('.side.right')).not.toBeNull();
    expect(container.querySelector('[data-role="floating"]')).toBeNull();

    // From 48 to 64rem they float, without a scrim
    await resize(960);
    expect(onlayout).toHaveBeenLastCalledWith(
      expect.objectContaining({
        width: 'mid',
        leftMode: 'floating',
        rightMode: 'floating',
      }),
    );
    expect(container.querySelectorAll('[data-role="floating"]')).toHaveLength(2);
    expect(container.querySelector('.side')).toBeNull();
    expect(container.querySelector('.scrim')).toBeNull();

    await resize(480);
    expect(onlayout).toHaveBeenLastCalledWith(
      expect.objectContaining({
        width: 'narrow',
        leftMode: 'sheet',
        rightMode: 'sheet',
      }),
    );
  });

  it('takes the narrow form at any width with narrow, and never with narrow false', async () => {
    const onlayout = vi.fn<(l: ShellLayout) => void>();
    const { container, unmount } = render(Shell, { ...regions, narrow: true, onlayout });
    await tick();
    expect(onlayout).toHaveBeenLastCalledWith(
      expect.objectContaining({
        width: 'narrow',
        leftMode: 'sheet',
        rightMode: 'sheet',
      }),
    );
    expect(container.querySelector('[data-sheet="left"]')).not.toBeNull();
    expect(container.querySelector('[data-role="floating"]')).toBeNull();
    unmount();

    await resize(480);
    const second = render(Shell, { ...regions, narrow: false, onlayout });
    await tick();
    expect(onlayout).toHaveBeenLastCalledWith(
      expect.objectContaining({
        width: 'mid',
        leftMode: 'floating',
        rightMode: 'floating',
      }),
    );
    expect(second.container.querySelector('[data-sheet]')).toBeNull();
    expect(region(second.container, 'left')?.closest('[data-role="floating"]')).not.toBeNull();
  });

  it('keeps a left sheet that does not close at its lowest height while leftOpen is false', async () => {
    const { container, rerender } = render(Shell, {
      ...regions,
      narrow: true,
      leftOpen: false,
      leftSheet: { stages: ['peek', 'full'], closable: false },
    });
    await tick();
    const sheet = container.querySelector('[data-sheet="left"]');
    expect(sheet?.getAttribute('data-stage')).toBe('peek');
    // Below the lowest height it does not close
    sheet
      ?.querySelector('button')
      ?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
      );
    await tick();
    expect(container.querySelector('[data-sheet="left"]')?.getAttribute('data-stage')).toBe('peek');
    // Opened, it shows its stage; closed again, it rests at the lowest height
    await rerender({ leftOpen: true, leftStage: 'full' });
    await tick();
    expect(container.querySelector('[data-sheet="left"]')?.getAttribute('data-stage')).toBe('full');
    await rerender({ leftOpen: false });
    await tick();
    expect(container.querySelector('[data-sheet="left"]')?.getAttribute('data-stage')).toBe('peek');
    // Raised from its lowest height, it opens again
    container.querySelector<HTMLElement>('[data-sheet="left"] button')?.click();
    await tick();
    expect(container.querySelector('[data-sheet="left"]')?.getAttribute('data-stage')).toBe('full');
  });

  it('reads and writes the height of the left sheet with leftStage', async () => {
    const onstage = vi.fn();
    const { container, rerender } = render(ShellStageHarness, {
      ...regions,
      narrow: true,
      height: 'peek',
      onstage,
    });
    await tick();
    const sheet = () => container.querySelector('[data-sheet="left"]');
    expect(sheet()?.getAttribute('data-stage')).toBe('peek');
    // A press on the handle steps up, and the binding reads the new height
    sheet()?.querySelector('button')?.click();
    await tick();
    expect(sheet()?.getAttribute('data-stage')).toBe('half');
    expect(onstage).toHaveBeenLastCalledWith('half');
    await rerender({ height: 'full' });
    await tick();
    expect(sheet()?.getAttribute('data-stage')).toBe('full');
  });

  it('opens a closed side again with its reopen control, from 48rem only', async () => {
    const leftReopen = { icon: 'plus' as const, label: 'Show the contents' };
    const { container, getByRole, queryByRole } = render(Shell, {
      ...regions,
      leftOpen: false,
      leftReopen,
    });
    await tick();
    const control = getByRole('button', { name: 'Show the contents' });
    expect(control.closest('[data-role="floating"]')).not.toBeNull();
    control.click();
    await tick();
    expect(region(container, 'left')).not.toBeNull();
    expect(queryByRole('button', { name: 'Show the contents' })).toBeNull();

    // The narrow form has none
    const narrow = render(Shell, { ...regions, narrow: true, leftOpen: false, leftReopen });
    await tick();
    expect(narrow.queryByRole('button', { name: 'Show the contents' })).toBeNull();
  });

  it('folds the toolbar into a Fab with bottomFab, and shows it in one column while pressed', async () => {
    const bottom = createRawSnippet((args: () => { column: boolean }) => ({
      render: () => `<div>${args().column ? 'Column' : 'Row'}</div>`,
    }));
    const bottomFab = { label: 'Tools', closeLabel: 'Hide the tools' };
    const { container, getByRole } = render(Shell, {
      stage: regions.stage,
      bottom,
      bottomFab,
      narrow: true,
    });
    await tick();
    expect(region(container, 'bottom')).toBeNull();
    const fab = getByRole('button', { name: 'Tools' });
    expect(fab.getAttribute('data-role')).toBe('fab');
    fab.click();
    await tick();
    expect(region(container, 'bottom')?.textContent).toBe('Column');
    getByRole('button', { name: 'Hide the tools' }).click();
    await tick();
    expect(region(container, 'bottom')).toBeNull();

    // From 48rem the toolbar stays over the stage, without a Fab
    const wide = render(Shell, { stage: regions.stage, bottom, bottomFab });
    await tick();
    expect(region(wide.container, 'bottom')?.textContent).toBe('Row');
    expect(wide.container.querySelector('[data-role="fab"]')).toBeNull();
  });

  it('puts the dock in a sheet with dockSheet on a narrow screen, and reports its closing', async () => {
    const ondockclose = vi.fn();
    const dock = html('<div>Output</div>');
    const { container, queryByRole } = render(Shell, {
      stage: regions.stage,
      dock,
      dockSheet: { label: 'Output' },
      ondockclose,
      narrow: true,
    });
    await tick();
    const sheet = container.querySelector('[data-sheet="dock"]');
    expect(sheet?.textContent?.trim()).toBe('Output');
    expect(sheet?.getAttribute('aria-label')).toBe('Output');
    expect(sheet?.getAttribute('data-stage')).toBe('half');
    expect(container.querySelector('.dock')).toBeNull();
    expect(queryByRole('slider', { name: 'Dock height' })).toBeNull();
    // Below its lowest height it closes, and the application hears of it
    sheet
      ?.querySelector('button')
      ?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
      );
    expect(ondockclose).toHaveBeenCalledOnce();

    // From 48rem the dock is under the stage
    const wide = render(Shell, { stage: regions.stage, dock, dockSheet: { label: 'Output' } });
    await tick();
    expect(wide.container.querySelector('[data-sheet="dock"]')).toBeNull();
    expect(wide.container.querySelector('.dock')?.textContent?.trim()).toBe('Output');
  });

  it('puts the dock in a sheet on a narrow screen without dockSheet, named by the messages', async () => {
    const { container } = render(Shell, {
      stage: regions.stage,
      dock: html('<div>Output</div>'),
      narrow: true,
    });
    await tick();
    const sheet = container.querySelector('[data-sheet="dock"]');
    expect(sheet?.textContent?.trim()).toBe('Output');
    expect(sheet?.getAttribute('aria-label')).toBe('Dock');
    expect(sheet?.getAttribute('data-stage')).toBe('half');
    expect(container.querySelector('.dock')).toBeNull();
  });

  describe('on a narrow screen, one sheet at a time', () => {
    it('closes the other side when a side sheet opens', async () => {
      const { container, rerender } = render(Shell, { ...regions, narrow: true });
      await tick();
      expect(container.querySelector('[data-sheet="left"]')).not.toBeNull();
      await rerender({ rightOpen: true });
      await tick();
      expect(container.querySelector('[data-sheet="right"]')).not.toBeNull();
      expect(container.querySelector('[data-sheet="left"]')).toBeNull();
      await rerender({ leftOpen: true });
      await tick();
      expect(container.querySelector('[data-sheet="left"]')).not.toBeNull();
      expect(container.querySelector('[data-sheet="right"]')).toBeNull();
    });

    it('keeps the right one when both are open at mount', async () => {
      const { container } = render(Shell, { ...regions, narrow: true, rightOpen: true });
      await tick();
      expect(container.querySelector('[data-sheet="left"]')).toBeNull();
      expect(container.querySelector('[data-sheet="right"]')).not.toBeNull();
    });

    it('closes the side sheets when the dock comes, and the dock when a side opens', async () => {
      const ondockclose = vi.fn();
      const dock = html('<div>Output</div>');
      const { container, rerender } = render(Shell, { ...regions, narrow: true, ondockclose });
      await tick();
      expect(container.querySelector('[data-sheet="left"]')).not.toBeNull();
      await rerender({ dock });
      await tick();
      expect(container.querySelector('[data-sheet="dock"]')).not.toBeNull();
      expect(container.querySelector('[data-sheet="left"]')).toBeNull();
      expect(ondockclose).not.toHaveBeenCalled();
      await rerender({ rightOpen: true });
      await tick();
      expect(container.querySelector('[data-sheet="right"]')).not.toBeNull();
      expect(ondockclose).toHaveBeenCalledOnce();
    });

    it('keeps the dock given at mount, closing the side that is open', async () => {
      const ondockclose = vi.fn();
      const { container } = render(Shell, {
        ...regions,
        narrow: true,
        dock: html('<div>Output</div>'),
        ondockclose,
      });
      await tick();
      expect(container.querySelector('[data-sheet="dock"]')).not.toBeNull();
      expect(container.querySelector('[data-sheet="left"]')).toBeNull();
      expect(ondockclose).not.toHaveBeenCalled();
    });

    it('does not close a sheet that rests at its lowest height, and hides it under the dock', async () => {
      const { container, rerender } = render(Shell, {
        ...regions,
        narrow: true,
        leftOpen: false,
        leftSheet: { closable: false },
      });
      await tick();
      const left = () => container.querySelector('[data-sheet="left"]');
      expect(left()?.getAttribute('data-stage')).toBe('peek');
      await rerender({ rightOpen: true });
      await tick();
      expect(container.querySelector('[data-sheet="right"]')).not.toBeNull();
      expect(left()?.getAttribute('data-stage')).toBe('peek');
      await rerender({ dock: html('<div>Output</div>') });
      await tick();
      expect(container.querySelector('[data-sheet="dock"]')).not.toBeNull();
      expect(container.querySelector('[data-sheet="right"]')).toBeNull();
      // While the dock's sheet is open the resting sheet is not shown; it comes back after
      expect(left()).toBeNull();
      await rerender({ dock: undefined });
      await tick();
      expect(container.querySelector('[data-sheet="dock"]')).toBeNull();
      expect(left()?.getAttribute('data-stage')).toBe('peek');
    });
  });

  it('floats the bar over the stage with topFloating on a narrow screen', async () => {
    const { container } = render(Shell, { ...regions, narrow: true, topFloating: true });
    await tick();
    const top = region(container, 'top');
    expect(top?.textContent).toBe('Bar');
    // In a Floating gap-md from the top and the sides of the stage, which fills the shell
    const floating = top?.closest<HTMLElement>('[data-role="floating"]');
    expect(floating?.parentElement?.parentElement).toBe(region(container, 'stage'));
    expect(floating?.style.top).toBe('var(--kata-gap-md)');
    expect(floating?.style.left).toBe('var(--kata-gap-md)');
    expect(floating?.style.right).toBe('var(--kata-gap-md)');
    expect(container.querySelector('.shell > .top')).toBeNull();

    // From 48rem the bar keeps its place above the stage
    const wide = render(Shell, { ...regions, topFloating: true });
    await tick();
    expect(region(wide.container, 'top')?.closest('[data-region="stage"]')).toBeNull();
  });

  it('opens and closes each floating pane on its own', async () => {
    const { container, rerender } = render(Shell, { ...regions, leftOpen: false });
    await tick();
    await rerender({ rightOpen: true });
    await tick();
    expect(region(container, 'right')).not.toBeNull();
    expect(region(container, 'left')).toBeNull();
    await rerender({ leftOpen: true });
    await tick();
    expect(container.querySelectorAll('[data-role="floating"]')).toHaveLength(2);
    await rerender({ rightOpen: false });
    await tick();
    expect(region(container, 'right')).toBeNull();
    expect(region(container, 'left')).not.toBeNull();
  });

  it('runs the shortcut that matches, skipping those that decline or do not apply', async () => {
    const undo = vi.fn();
    const declined = vi.fn(() => false);
    const off = vi.fn();
    const { getByRole } = render(Shell, {
      stage: regions.stage,
      shortcuts: [
        { key: 'mod+z', label: 'Off', run: off, when: () => false },
        { key: 'mod+z', label: 'Declines', run: declined },
        { key: 'mod+z', label: 'Undo', run: undo },
      ],
    });
    await tick();
    expect(press('z', { ctrlKey: true })).toBe(false);
    expect(off).not.toHaveBeenCalled();
    expect(declined).toHaveBeenCalledOnce();
    expect(undo).toHaveBeenCalledOnce();
    // Without the modifier, or typed into a field, nothing runs
    press('z');
    const input = document.createElement('input');
    document.body.append(input);
    press('z', { ctrlKey: true }, input);
    input.remove();
    expect(undo).toHaveBeenCalledOnce();
    // The help key opens the list of shortcuts
    press('?', { shiftKey: true });
    await tick();
    const dialog = getByRole('dialog', { name: 'Keyboard shortcuts' });
    expect(dialog.hasAttribute('open')).toBe(true);
    expect(dialog.textContent).toContain('Undo');
    expect(dialog.textContent).toContain('Ctrl+Z');
  });

  it('closes the sheet opened last with Escape, then passes Escape to the application', async () => {
    await resize(480);
    const onescape = vi.fn();
    const { container, rerender } = render(Shell, {
      ...regions,
      leftOpen: false,
      leftSheet: { closable: false },
      onescape,
    });
    await tick();
    await rerender({ rightOpen: true });
    await tick();
    press('Escape');
    await tick();
    expect(region(container, 'right')).toBeNull();
    // The left sheet rests at its lowest height, and Escape passes it by
    expect(container.querySelector('[data-sheet="left"]')?.getAttribute('data-stage')).toBe('peek');
    expect(onescape).not.toHaveBeenCalled();
    press('Escape');
    expect(onescape).toHaveBeenCalledOnce();
  });

  it('leaves the floating panes open on Escape and passes it to the application', async () => {
    for (const width of [1024, 960]) {
      await resize(width);
      const onescape = vi.fn();
      const { container, unmount } = render(Shell, { ...regions, rightOpen: true, onescape });
      await tick();
      expect(press('Escape')).toBe(false);
      await tick();
      expect(region(container, 'left')).not.toBeNull();
      expect(region(container, 'right')).not.toBeNull();
      expect(onescape).toHaveBeenCalledOnce();
      unmount();
    }
  });

  it('leaves the panels beside the stage open on Escape', async () => {
    const onescape = vi.fn();
    const { container } = render(Shell, { ...regions, side: 'beside', onescape });
    await tick();
    press('Escape');
    await tick();
    expect(region(container, 'left')).not.toBeNull();
    expect(onescape).toHaveBeenCalledOnce();
  });
});

describe('ShortcutsModal', () => {
  it('lists the shortcuts without a group first, then one section for each group', () => {
    const { container } = render(ShortcutsModal, {
      inline: true,
      mac: true,
      shortcuts: [
        { key: '?', label: 'Help' },
        { key: 'v', label: 'Select', group: 'Tools' },
        { key: 'shift+mod+z', label: 'Redo', group: 'Edit' },
        { key: 'l', label: 'Line', group: 'Tools' },
      ],
    });
    const titles = [...container.querySelectorAll('[data-role="section-head"] > span')].map(
      (h) => h.textContent,
    );
    expect(titles).toEqual(['Tools', 'Edit']);
    const keys = [...container.querySelectorAll('kbd')].map((k) => k.textContent);
    expect(keys).toEqual(['?', 'V', 'L', '⇧⌘Z']);
  });
});

describe('formatShortcut', () => {
  it('writes the key as the platform does', () => {
    expect(formatShortcut('shift+mod+z', true)).toBe('⇧⌘Z');
    expect(formatShortcut('shift+mod+z', false)).toBe('Ctrl+Shift+Z');
    expect(formatShortcut('alt+ctrl+backspace', true)).toBe('⌃⌥⌫');
    expect(formatShortcut('escape', false)).toBe('Esc');
    expect(formatShortcut('mod+plus', false)).toBe('Ctrl++');
  });

  it('matches mod to ⌘ on a Mac and to Ctrl elsewhere', () => {
    const e = (init: KeyboardEventInit) => new KeyboardEvent('keydown', init);
    expect(matchesShortcut('mod+s', e({ key: 's', metaKey: true }), true)).toBe(true);
    expect(matchesShortcut('mod+s', e({ key: 's', ctrlKey: true }), true)).toBe(false);
    expect(matchesShortcut('mod+s', e({ key: 's', ctrlKey: true }), false)).toBe(true);
    expect(matchesShortcut('?', e({ key: '?', shiftKey: true }), false)).toBe(true);
    expect(matchesShortcut('shift+e', e({ key: 'E', shiftKey: true }), false)).toBe(true);
    expect(matchesShortcut('e', e({ key: 'E', shiftKey: true }), false)).toBe(false);
  });
});
