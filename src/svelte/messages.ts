// The strings that components show on their own (the names of built-in actions, accessible names,
// the labels of settings). kata ships English defaults. An application replaces any of them with
// setMessages(), once at startup and again when its language changes. Components read them through
// getMessages(), which is reactive: setMessages() updates the components already on screen.
import { createSubscriber } from 'svelte/reactivity';

export interface Messages {
  /** The name of the button that closes a board (ColorPicker) */
  close: string;
  /** The title of ColorPicker and the name of its grid of colors */
  color: string;
  /** The names of ColorPicker's default colors */
  colorRed: string;
  colorOrange: string;
  colorGold: string;
  colorGreen: string;
  colorBlue: string;
  colorPurple: string;
  colorBlack: string;
  colorBrown: string;
  colorWhite: string;
  /** The names of ColorPicker's parts */
  colorCode: string;
  eyedropper: string;
  hue: string;
  saturation: string;
  lightness: string;
  saturationValue: string;
  /** What a screen reader says for the saturation and value plane */
  saturationValueText: (p: { s: number; v: number }) => string;
  /** The text size settings (fontScaleLabel) */
  fontScaleDefault: string;
  fontScaleLarge: string;
  fontScaleLarger: string;
  fontScaleLargest: string;
  fontScaleMax: string;
  /** The names of the button that opens or closes a row of a Tree */
  expand: string;
  collapse: string;
}

const english: Messages = {
  close: 'Close',
  color: 'Color',
  colorRed: 'Red',
  colorOrange: 'Orange',
  colorGold: 'Gold',
  colorGreen: 'Green',
  colorBlue: 'Blue',
  colorPurple: 'Purple',
  colorBlack: 'Black',
  colorBrown: 'Brown',
  colorWhite: 'White',
  colorCode: 'Color code',
  eyedropper: 'Eyedropper',
  hue: 'Hue',
  saturation: 'Saturation',
  lightness: 'Lightness',
  saturationValue: 'Saturation and value',
  saturationValueText: ({ s, v }) => `Saturation ${s}%, value ${v}%`,
  fontScaleDefault: 'Default',
  fontScaleLarge: 'Large',
  fontScaleLarger: 'Larger',
  fontScaleLargest: 'Largest',
  fontScaleMax: 'Maximum',
  expand: 'Expand',
  collapse: 'Collapse',
};

/** The English defaults */
export const defaultMessages: Readonly<Messages> = Object.freeze({ ...english });

let current: Messages = { ...english };
const listeners = new Set<() => void>();
const subscribe = createSubscriber((update) => {
  listeners.add(update);
  return () => listeners.delete(update);
});

/**
 * Replaces some or all of the strings. The keys that are not given keep their current value; with
 * `{ reset: true }` they return to the English defaults first.
 */
export function setMessages(partial: Partial<Messages>, options: { reset?: boolean } = {}): void {
  current = { ...(options.reset ? defaultMessages : current), ...partial };
  for (const notify of listeners) notify();
}

/** The strings in effect. Read inside a component or an effect, it tracks later changes. */
export function getMessages(): Readonly<Messages> {
  subscribe();
  return current;
}
