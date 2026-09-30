// @sakuzu/kata/svelte: the components of kata for Svelte 5. They need the foundation's tokens and
// base CSS, which the application imports once (`import '@sakuzu/kata'`). Each component imports
// the rules they share (styles/components.css) itself.

export {
  type IconComponent,
  type IconName,
  type IconSource,
  iconComponent,
  icons,
} from './icons.js';
export { clampTip } from './lib/clampTip.js';
export {
  FONT_SCALE_STORAGE_KEY,
  FONT_SCALES,
  type FontScale,
  fontScaleLabel,
  readFontScale,
  setFontScale,
} from './lib/fontScale.js';
export { createNarrow, isNarrowerThan, WIDTHS } from './lib/viewport.svelte.js';
export { defaultMessages, getMessages, type Messages, setMessages } from './messages.js';
