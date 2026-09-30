// The text size setting. The base CSS reads data-font-scale on the root element: no attribute is
// 100%, then large, larger, largest and max are 125, 150, 175 and 200%. Every length follows through
// rem and em.
//
// setFontScale() sets the attribute and remembers the choice in localStorage under
// FONT_SCALE_STORAGE_KEY. To apply it before the first paint, a page can read the same key in a
// small inline script in its <head>.
import { getMessages } from '../messages.js';

export const FONT_SCALES = ['default', 'large', 'larger', 'largest', 'max'] as const;

export type FontScale = (typeof FONT_SCALES)[number];

/** The localStorage key that holds the chosen step */
export const FONT_SCALE_STORAGE_KEY = 'kata-font-scale';

/** The name of a step, from the messages (fontScaleDefault … fontScaleMax) */
export function fontScaleLabel(s: FontScale): string {
  const m = getMessages();
  switch (s) {
    case 'large':
      return m.fontScaleLarge;
    case 'larger':
      return m.fontScaleLarger;
    case 'largest':
      return m.fontScaleLargest;
    case 'max':
      return m.fontScaleMax;
    default:
      return m.fontScaleDefault;
  }
}

/** The step in effect, read from <html data-font-scale> */
export function readFontScale(): FontScale {
  const v = document.documentElement.getAttribute('data-font-scale');
  return FONT_SCALES.includes(v as FontScale) ? (v as FontScale) : 'default';
}

function store(action: (storage: Storage) => void): void {
  try {
    action(localStorage);
  } catch {
    // Storage can be unavailable (a private window, blocked site data); the setting still applies
  }
}

/** Applies a step and remembers it. The default step removes the attribute. */
export function setFontScale(s: FontScale): void {
  const el = document.documentElement;
  if (s === 'default') {
    el.removeAttribute('data-font-scale');
    store((ls) => ls.removeItem(FONT_SCALE_STORAGE_KEY));
  } else {
    el.setAttribute('data-font-scale', s);
    store((ls) => ls.setItem(FONT_SCALE_STORAGE_KEY, s));
  }
}
