// The strings that components show on their own (the names of built-in actions, accessible names,
// the labels of settings). kata ships English defaults. An application replaces any of them with
// setMessages(), once at startup and again when its language changes. Components read them through
// getMessages(), which is reactive: setMessages() updates the components already on screen.
import { createSubscriber } from 'svelte/reactivity';

export interface Messages {
  /** The text size settings (fontScaleLabel) */
  fontScaleDefault: string;
  fontScaleLarge: string;
  fontScaleLarger: string;
  fontScaleLargest: string;
  fontScaleMax: string;
}

const english: Messages = {
  fontScaleDefault: 'Default',
  fontScaleLarge: 'Large',
  fontScaleLarger: 'Larger',
  fontScaleLargest: 'Largest',
  fontScaleMax: 'Maximum',
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
