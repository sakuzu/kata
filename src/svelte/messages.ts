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
  /** The accessible name of a Chip's ✕ */
  removeValue: string;
  /** Pager: the name of the navigation, its arrows and a page's button */
  pagination: string;
  previousPage: string;
  nextPage: string;
  page: (p: { page: number }) => string;
  /** Presence: the name of the group and of the roster, and the button that opens it */
  participants: (p: { count: number }) => string;
  showMore: (p: { count: number }) => string;
  /** Presence: the search of the roster, its empty state, and the words after a name */
  searchByName: string;
  searchParticipants: string;
  noParticipants: string;
  you: string;
  roleEditor: string;
  roleViewer: string;
  /** The column menu of ColHead */
  sortAscending: string;
  sortDescending: string;
  clearSort: string;
  /** The name of the button that goes back a step (Modal on a full screen) */
  back: string;
  /** The cancel button of Confirm */
  cancel: string;
  /** The confirm button of Confirm, when no label is given */
  confirm: string;
  /** The name of the handle of a Sheet */
  sheetHeight: string;
  /** The name of the button that opens a Kebab */
  actions: string;
  /** The actions of a Kebab */
  settings: string;
  share: string;
  linkShare: string;
  duplicate: string;
  move: string;
  ungroup: string;
  delete: string;
  /** The names of the button that opens or closes a row of a Tree */
  expand: string;
  collapse: string;
  /** The name of FilterBar's group of filters */
  filters: string;
  /** The name of the button that removes one filter from a FilterBar */
  removeFilter: (p: { label: string }) => string;
  /** The trigger of the menu that holds the tabs that do not fit */
  more: string;
  /** SearchPanel: the title and the name of the input, and what shows when nothing matches */
  search: string;
  noMatches: string;
  /** VersionsPanel: the title, the empty state and the actions on a version shown */
  versions: string;
  noVersions: string;
  restore: string;
  backToLatest: string;
  /** SelectionSummary: the title, with the number of things selected */
  selected: (p: { count: number }) => string;
  /** ProcessDialog: the action that starts the process, and what shows while it runs */
  run: string;
  running: string;
  /** Shell: the name of the dock's grip */
  dockHeight: string;
  /** Shell: the name of the scrim that closes the panels floating over the stage */
  closePanes: string;
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
  removeValue: 'Remove',
  pagination: 'Pages',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  page: ({ page }) => `Page ${page}`,
  participants: ({ count }) => (count === 1 ? '1 participant' : `${count} participants`),
  showMore: ({ count }) => `Show ${count} more`,
  searchByName: 'Search by name',
  searchParticipants: 'Search the participants',
  noParticipants: 'No one matches.',
  you: '(you)',
  roleEditor: 'Can edit',
  roleViewer: 'Can view',
  sortAscending: 'Sort ascending',
  sortDescending: 'Sort descending',
  clearSort: 'Clear the sort',
  back: 'Back',
  cancel: 'Cancel',
  confirm: 'Confirm',
  sheetHeight: 'Sheet height',
  actions: 'Actions',
  settings: 'Settings',
  share: 'Share',
  linkShare: 'Link sharing',
  duplicate: 'Duplicate',
  move: 'Move',
  ungroup: 'Ungroup',
  delete: 'Delete',
  expand: 'Expand',
  collapse: 'Collapse',
  filters: 'Filters',
  removeFilter: ({ label }) => `Remove ${label}`,
  more: 'More',
  search: 'Search',
  noMatches: 'Nothing matches.',
  versions: 'Versions',
  noVersions: 'No versions yet.',
  restore: 'Restore',
  backToLatest: 'Back to the latest',
  selected: ({ count }) => `${count} selected`,
  run: 'Run',
  running: 'Running',
  dockHeight: 'Dock height',
  closePanes: 'Close the panels',
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
