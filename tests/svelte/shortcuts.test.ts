import { render } from '@testing-library/svelte';
import { createRawSnippet, tick } from 'svelte';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import Shell from '../../src/svelte/components/Shell.svelte';
import ShortcutsModal from '../../src/svelte/components/ShortcutsModal.svelte';
import { formatShortcut, matchesShortcut, type Shortcut } from '../../src/svelte/lib/shortcuts.js';

// jsdom has no ResizeObserver, which the shell's measured heights need
beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const stage = createRawSnippet(() => ({ render: () => '<div>Drawing</div>' }));
const key = (init: KeyboardEventInit) => new KeyboardEvent('keydown', init);
/** Presses a key on the document; false when a shortcut took it */
const press = (init: KeyboardEventInit) =>
  document.body.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init }),
  );
const keysOf = (el: HTMLElement) => [...el.querySelectorAll('kbd')].map((k) => k.textContent);

describe('Shortcut', () => {
  it('runs with one of its aliases too, which the list does not show', async () => {
    const remove = vi.fn();
    const redo = vi.fn();
    const { unmount } = render(Shell, {
      stage,
      shortcuts: [
        { key: 'delete', label: 'Delete', run: remove, aliases: ['backspace'] },
        { key: 'shift+mod+z', label: 'Redo', run: redo, aliases: ['mod+y'] },
      ],
    });
    await tick();
    expect(press({ key: 'Backspace' })).toBe(false);
    expect(press({ key: 'Delete' })).toBe(false);
    expect(remove).toHaveBeenCalledTimes(2);
    expect(press({ key: 'y', ctrlKey: true })).toBe(false);
    expect(redo).toHaveBeenCalledOnce();
    unmount();

    // The same shortcuts as the shell's, of which only the key is listed
    const shortcuts: Shortcut[] = [
      { key: 'delete', label: 'Delete', run: remove, aliases: ['backspace'] },
    ];
    const { container } = render(ShortcutsModal, { inline: true, mac: false, shortcuts });
    expect(keysOf(container)).toEqual(['Del']);
  });

  it('runs a hidden shortcut but does not list it', async () => {
    const pan = vi.fn();
    const { unmount } = render(Shell, {
      stage,
      shortcuts: [{ key: 'space', label: 'Pan', run: pan, hidden: true }],
    });
    await tick();
    press({ key: ' ' });
    expect(pan).toHaveBeenCalledOnce();
    unmount();

    const { container } = render(ShortcutsModal, {
      inline: true,
      mac: true,
      shortcuts: [
        { key: 'space', label: 'Pan', hidden: true },
        { key: 'v', label: 'Select' },
      ],
    });
    expect(container.textContent).not.toContain('Pan');
    expect(keysOf(container)).toEqual(['V']);
  });

  it('lists the keys of display instead of key, joined with " / "', () => {
    const { container } = render(ShortcutsModal, {
      inline: true,
      mac: true,
      shortcuts: [
        { key: 'delete', label: 'Delete', display: ['delete', 'backspace'] },
        { key: 'plus', label: 'Zoom', display: ['plus', 'minus'] },
      ],
    });
    expect(keysOf(container)).toEqual(['⌦ / ⌫', '+ / -']);
  });

  it('matches any of 0 to 9 with digit, and writes it as 0–9', async () => {
    expect(matchesShortcut('digit', key({ key: '0' }), false)).toBe(true);
    expect(matchesShortcut('digit', key({ key: '7' }), false)).toBe(true);
    expect(matchesShortcut('digit', key({ key: 'a' }), false)).toBe(false);
    expect(matchesShortcut('digit', key({ key: '7', ctrlKey: true }), false)).toBe(false);
    expect(
      matchesShortcut('alt+digit', key({ key: '¡', code: 'Digit1', altKey: true }), true),
    ).toBe(true);
    expect(formatShortcut('digit', false)).toBe('0–9');
    expect(formatShortcut('alt+digit', true)).toBe('⌥0–9');
    expect(formatShortcut('alt+digit', false)).toBe('Alt+0–9');

    const run = vi.fn();
    render(Shell, { stage, shortcuts: [{ key: 'digit', label: 'Layer', run }] });
    await tick();
    press({ key: '3' });
    expect(run).toHaveBeenCalledOnce();
    expect((run.mock.calls[0][0] as KeyboardEvent).key).toBe('3');
  });

  it('matches a symbol by its physical key when the character is another one', () => {
    // Alt on a Mac turns the key into another character
    expect(
      matchesShortcut('alt+[', key({ key: '“', code: 'BracketLeft', altKey: true }), true),
    ).toBe(true);
    expect(
      matchesShortcut('alt+]', key({ key: '‘', code: 'BracketRight', altKey: true }), true),
    ).toBe(true);
    expect(matchesShortcut('alt+?', key({ key: '÷', code: 'Slash', altKey: true }), true)).toBe(
      true,
    );
    expect(matchesShortcut('alt+/', key({ key: '÷', code: 'Slash', altKey: true }), true)).toBe(
      true,
    );
    expect(matchesShortcut('alt+.', key({ key: '≥', code: 'Period', altKey: true }), true)).toBe(
      true,
    );
    expect(matchesShortcut('alt+,', key({ key: '≤', code: 'Comma', altKey: true }), true)).toBe(
      true,
    );
    expect(matchesShortcut('alt+;', key({ key: '…', code: 'Semicolon', altKey: true }), true)).toBe(
      true,
    );
    expect(matchesShortcut("alt+'", key({ key: 'æ', code: 'Quote', altKey: true }), true)).toBe(
      true,
    );
    expect(
      matchesShortcut('alt+`', key({ key: 'Dead', code: 'Backquote', altKey: true }), true),
    ).toBe(true);
    expect(
      matchesShortcut('alt+\\', key({ key: '«', code: 'Backslash', altKey: true }), true),
    ).toBe(true);
    expect(matchesShortcut('alt+-', key({ key: '–', code: 'Minus', altKey: true }), true)).toBe(
      true,
    );
    expect(matchesShortcut('alt+=', key({ key: '≠', code: 'Equal', altKey: true }), true)).toBe(
      true,
    );
    expect(matchesShortcut('alt+plus', key({ key: '≠', code: 'Equal', altKey: true }), true)).toBe(
      true,
    );
    expect(matchesShortcut('alt+minus', key({ key: '–', code: 'Minus', altKey: true }), true)).toBe(
      true,
    );
    // Not another physical key
    expect(
      matchesShortcut('alt+[', key({ key: '‘', code: 'BracketRight', altKey: true }), true),
    ).toBe(false);
  });

  it('matches a modifier pressed alone, and writes it without a +', () => {
    expect(formatShortcut('alt', true)).toBe('⌥');
    expect(formatShortcut('shift', true)).toBe('⇧');
    expect(formatShortcut('mod', true)).toBe('⌘');
    expect(formatShortcut('alt', false)).toBe('Alt');
    expect(formatShortcut('shift', false)).toBe('Shift');
    expect(formatShortcut('mod', false)).toBe('Ctrl');

    expect(matchesShortcut('alt', key({ key: 'Alt', altKey: true }), false)).toBe(true);
    expect(matchesShortcut('shift', key({ key: 'Shift', shiftKey: true }), true)).toBe(true);
    expect(matchesShortcut('mod', key({ key: 'Meta', metaKey: true }), true)).toBe(true);
    expect(matchesShortcut('mod', key({ key: 'Control', ctrlKey: true }), false)).toBe(true);
    // Not the key of another modifier, not with another modifier held, not another key
    expect(matchesShortcut('mod', key({ key: 'Control', ctrlKey: true }), true)).toBe(false);
    expect(matchesShortcut('alt', key({ key: 'Alt', altKey: true, shiftKey: true }), false)).toBe(
      false,
    );
    expect(matchesShortcut('alt', key({ key: 'a', altKey: true }), false)).toBe(false);
  });
});
