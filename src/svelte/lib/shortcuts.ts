// Keyboard shortcuts: how a key is written, shown and matched. A key is written without regard to
// the platform: modifiers joined with +, then one key, for example "mod+z", "shift+mod+z", "alt+l"
// or "?". mod is ⌘ on a Mac and Ctrl elsewhere. The key is one character or a name: escape, enter,
// tab, space, backspace, delete, plus, minus, the arrows (up, down, left, right), home, end,
// pageup, pagedown and f1 to f12. digit is any of 0 to 9. A modifier alone ("alt", "shift", "mod")
// is the press of that key by itself.

/** One shortcut of a Shell: the key, its name in the list, and what it does */
export interface Shortcut {
  /** The key, written with mod for ⌘ or Ctrl: "mod+z", "shift+e", "?" */
  key: string;
  /** What the shortcut does, as the list of shortcuts shows it */
  label: string;
  /**
   * Runs the shortcut. Returning false says that it did not act, so the key goes on to the next
   * shortcut with the same key, and to the browser.
   */
  run: (e: KeyboardEvent) => unknown;
  /** Whether the shortcut acts now; without it, always */
  when?: () => boolean;
  /** The group it is listed under; shortcuts without a group come first */
  group?: string;
  /** More keys that run it, written as key is; they are not listed (backspace for delete) */
  aliases?: string[];
  /** Runs, but is not listed */
  hidden?: boolean;
  /** The keys the list shows instead of key, each written as key is, joined with " / " */
  display?: string[];
}

interface Combo {
  mod: boolean;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  key: string;
}

const NAMES: Record<string, string> = {
  escape: 'Esc',
  enter: 'Enter',
  tab: 'Tab',
  space: 'Space',
  backspace: 'Backspace',
  delete: 'Del',
  plus: '+',
  minus: '-',
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
  home: 'Home',
  end: 'End',
  pageup: 'PgUp',
  pagedown: 'PgDn',
  digit: '0–9',
};
const MAC_NAMES: Record<string, string> = { backspace: '⌫', delete: '⌦', enter: '↩' };

// The names of e.key for the named keys
const KEY_OF: Record<string, string[]> = {
  escape: ['Escape'],
  enter: ['Enter'],
  tab: ['Tab'],
  space: [' ', 'Spacebar'],
  backspace: ['Backspace'],
  delete: ['Delete'],
  plus: ['+', '='],
  minus: ['-', '_'],
  up: ['ArrowUp'],
  down: ['ArrowDown'],
  left: ['ArrowLeft'],
  right: ['ArrowRight'],
  home: ['Home'],
  end: ['End'],
  pageup: ['PageUp'],
  pagedown: ['PageDown'],
};

function parse(spec: string): Combo {
  const combo: Combo = { mod: false, ctrl: false, shift: false, alt: false, key: '' };
  // A trailing + is the key itself ("mod++"); the other parts are modifiers
  const parts = spec.endsWith('++') ? [...spec.slice(0, -2).split('+'), '+'] : spec.split('+');
  for (const raw of parts) {
    const part = raw.trim().toLowerCase();
    if (part === 'mod' || part === 'cmd' || part === 'meta') combo.mod = true;
    else if (part === 'ctrl' || part === 'control') combo.ctrl = true;
    else if (part === 'shift') combo.shift = true;
    else if (part === 'alt' || part === 'option') combo.alt = true;
    else if (part) combo.key = part;
  }
  return combo;
}

/** Whether the platform is a Mac (or another Apple system), where mod is ⌘ */
export function isMacPlatform(): boolean {
  if (typeof navigator === 'undefined') return false;
  const data = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData;
  return /mac|iphone|ipad|ipod/i.test(data?.platform ?? navigator.platform ?? '');
}

function keyText(key: string, mac: boolean): string {
  if (mac && MAC_NAMES[key]) return MAC_NAMES[key];
  if (NAMES[key]) return NAMES[key];
  if (/^f\d{1,2}$/.test(key)) return key.toUpperCase();
  return key.length === 1 ? key.toUpperCase() : key;
}

/**
 * The key as the platform writes it: symbols on a Mac (⌃⌥⇧⌘ in that order, then the key), words
 * elsewhere (Ctrl+Alt+Shift+Z). A modifier alone is its symbol or its word ("⌥", "Alt").
 *
 *   formatShortcut('shift+mod+z')   // "⇧⌘Z" on a Mac, "Ctrl+Shift+Z" elsewhere
 */
export function formatShortcut(key: string, mac: boolean = isMacPlatform()): string {
  const c = parse(key);
  const k = keyText(c.key, mac);
  if (mac) {
    return `${c.ctrl ? '⌃' : ''}${c.alt ? '⌥' : ''}${c.shift ? '⇧' : ''}${c.mod ? '⌘' : ''}${k}`;
  }
  const mods: string[] = [];
  if (c.mod || c.ctrl) mods.push('Ctrl');
  if (c.alt) mods.push('Alt');
  if (c.shift) mods.push('Shift');
  return (c.key ? [...mods, k] : mods).join('+');
}

/** A character that needs Shift on some keyboards and not on others: Shift is not compared */
const symbol = (key: string) => key.length === 1 && !/[a-z0-9]/.test(key);

function sameKey(key: string, e: KeyboardEvent): boolean {
  if (key === 'digit') return /^[0-9]$/.test(e.key) || /^Digit[0-9]$/.test(e.code);
  const named = KEY_OF[key];
  if (named) return named.includes(e.key);
  if (/^f\d{1,2}$/.test(key)) return e.key.toLowerCase() === key;
  if (key.length !== 1) return false;
  if (e.key.toLowerCase() === key) return true;
  // Alt on a Mac turns a letter into another character: the physical key still counts
  if (key >= 'a' && key <= 'z') return e.code === `Key${key.toUpperCase()}`;
  if (key >= '0' && key <= '9') return e.code === `Digit${key}`;
  return false;
}

/** Whether a key event is the given shortcut */
export function matchesShortcut(
  key: string,
  e: KeyboardEvent,
  mac: boolean = isMacPlatform(),
): boolean {
  const c = parse(key);
  if (!c.key) return modifierAlone(c, e, mac);
  if (e.metaKey !== (mac ? c.mod : false)) return false;
  if (e.ctrlKey !== (mac ? c.ctrl : c.mod || c.ctrl)) return false;
  if (e.altKey !== c.alt) return false;
  const named = c.key === 'plus' || c.key === 'minus';
  if (!symbol(c.key) && !named && e.shiftKey !== c.shift) return false;
  return sameKey(c.key, e);
}

/** The key of a modifier pressed by itself: the event of that key, with no other modifier held */
function modifierAlone(c: Combo, e: KeyboardEvent, mac: boolean): boolean {
  const meta = mac && c.mod;
  const ctrl = mac ? c.ctrl : c.mod || c.ctrl;
  const wanted = [meta, ctrl, c.alt, c.shift].filter(Boolean).length;
  if (wanted !== 1) return false;
  if (e.metaKey !== meta || e.ctrlKey !== ctrl || e.altKey !== c.alt || e.shiftKey !== c.shift)
    return false;
  if (meta) return e.key === 'Meta';
  if (ctrl) return e.key === 'Control';
  if (c.alt) return e.key === 'Alt';
  return e.key === 'Shift';
}

/** Whether a key event is one of the keys of a shortcut: its key or one of its aliases */
export function matchesAnyShortcut(
  s: Pick<Shortcut, 'key' | 'aliases'>,
  e: KeyboardEvent,
  mac: boolean = isMacPlatform(),
): boolean {
  return [s.key, ...(s.aliases ?? [])].some((key) => matchesShortcut(key, e, mac));
}

/** The keys of a shortcut as the list shows them: display, or key, joined with " / " */
export function shortcutText(
  s: Pick<Shortcut, 'key' | 'display'>,
  mac: boolean = isMacPlatform(),
): string {
  return (s.display ?? [s.key]).map((key) => formatShortcut(key, mac)).join(' / ');
}

/** Whether the element takes typed text, so that keys belong to it */
export function isEditable(el: EventTarget | Element | null): boolean {
  if (!(el instanceof Element)) return false;
  if (el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) return true;
  if (el instanceof HTMLInputElement) {
    return !['checkbox', 'radio', 'button', 'submit', 'reset', 'range', 'color', 'file'].includes(
      el.type.toLowerCase(),
    );
  }
  return el instanceof HTMLElement && el.isContentEditable;
}

/** The help key: ?, or the Help key of the keyboard, or F1 */
export function isHelpKey(e: KeyboardEvent): boolean {
  if (e.metaKey || e.ctrlKey || e.altKey) return false;
  return e.key === '?' || e.key === 'Help' || e.key === 'F1';
}
