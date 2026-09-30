import { fireEvent, render } from '@testing-library/svelte';
import { createRawSnippet, tick } from 'svelte';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import Shell, { type ShellLayout } from '../../src/svelte/components/Shell.svelte';
import ShortcutsModal from '../../src/svelte/components/ShortcutsModal.svelte';
import { formatShortcut, matchesShortcut } from '../../src/svelte/lib/shortcuts.js';

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

  it('puts the side regions beside, floating or in sheets by the width', async () => {
    const onlayout = vi.fn<(l: ShellLayout) => void>();
    const { container } = render(Shell, { ...regions, rightOpen: true, onlayout });
    await tick();
    expect(onlayout).toHaveBeenLastCalledWith({
      width: 'wide',
      leftMode: 'beside',
      rightMode: 'beside',
    });
    expect(container.querySelector('.side.left')).not.toBeNull();

    // 60rem: between the narrow and the medium width
    await resize(960);
    expect(onlayout).toHaveBeenLastCalledWith({
      width: 'mid',
      leftMode: 'floating',
      rightMode: 'floating',
    });
    expect(container.querySelectorAll('[data-role="floating"]')).toHaveLength(2);
    expect(container.querySelector('.scrim')).not.toBeNull();
    expect(container.querySelector('.side')).toBeNull();

    // 30rem: below the narrow width
    await resize(480);
    expect(onlayout).toHaveBeenLastCalledWith({
      width: 'narrow',
      leftMode: 'sheet',
      rightMode: 'sheet',
    });
    expect(container.querySelector('[data-sheet="left"]')).not.toBeNull();
    expect(container.querySelector('[data-sheet="right"]')).not.toBeNull();
    expect(container.querySelector('[data-role="floating"]')).toBeNull();
  });

  it('closes the floating panes when the scrim is pressed', async () => {
    await resize(960);
    const { container, getByRole } = render(Shell, { ...regions, rightOpen: true });
    await tick();
    await fireEvent.click(getByRole('button', { name: 'Close the panels' }));
    await tick();
    expect(container.querySelector('[data-role="floating"]')).toBeNull();
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

  it('closes the pane opened last with Escape, then passes Escape to the application', async () => {
    await resize(960);
    const onescape = vi.fn();
    const { container, rerender } = render(Shell, { ...regions, leftOpen: true, onescape });
    await tick();
    await rerender({ rightOpen: true });
    await tick();
    press('Escape');
    await tick();
    expect(region(container, 'right')).toBeNull();
    expect(region(container, 'left')).not.toBeNull();
    press('Escape');
    await tick();
    expect(region(container, 'left')).toBeNull();
    expect(onescape).not.toHaveBeenCalled();
    press('Escape');
    expect(onescape).toHaveBeenCalledOnce();
  });

  it('leaves the panels beside the stage open on Escape', async () => {
    const onescape = vi.fn();
    const { container } = render(Shell, { ...regions, onescape });
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
    const titles = [...container.querySelectorAll('[data-role="section"] h2')].map(
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
