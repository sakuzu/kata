// Places a surface that opens from a trigger: the place of a Dropdown (and so of a Popover), the
// list of a Select and a submenu of a MenuList share this one rule.
//
// The surface opens below the trigger, gap-xs away, lined up with one of its edges, or above it
// when there is less room below than its height (or MIN_HEIGHT); with up the two sides change
// places. It stays gap-md inside the window, the margin of a page on a narrow screen. Beside a
// vertical bar it opens on the left of the bar, or on its right when there is no room. A submenu
// opens next to its row, on the right, or on the left when there is no room.
//
// An open surface follows its trigger for as long as it is open (follow): the trigger's rectangle
// is compared every animation frame, and the surface is placed again when it moved; a scroll
// (read in the capture phase, so that a scrolling container counts) and a resize place it again
// too. The distances are read from the tokens at run time, so they follow the text size setting.
import { tokenPx } from './tipPlace.js';

/** Where a surface goes: its top and left edges, and the most it may be tall, in px */
export type Placed = { top: number; left: number; maxHeight: number };

// The least height below which the surface opens on the other side
const MIN_HEIGHT = 120;

/** The distance from the trigger (gap-xs) and the least distance from the window's edge (gap-md) */
function distances(context: Element): { gap: number; edge: number } {
  return { gap: tokenPx('--kata-gap-xs', context), edge: tokenPx('--kata-gap-md', context) };
}

/** The height of the surface's content, measured without its limit; its scroll stays */
function naturalHeight(surface: HTMLElement): number {
  const keep = surface.style.maxHeight;
  const scroll = surface.scrollTop;
  surface.style.maxHeight = '';
  const natural = surface.scrollHeight;
  surface.style.maxHeight = keep;
  surface.scrollTop = scroll;
  return natural;
}

/**
 * Below the trigger (or above it), lined up with its start or its end edge. edge is the rectangle
 * it opens from (a bar's, for a trigger inside a bar), the trigger's by default; width is the width
 * the surface takes, its own by default.
 */
export function placeBelow(
  surface: HTMLElement,
  trigger: DOMRect,
  options: { align: 'start' | 'end'; up?: boolean; edge?: DOMRect; width?: number },
): Placed {
  const { gap, edge: inset } = distances(surface);
  const from = options.edge ?? trigger;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = options.width ?? surface.offsetWidth;
  const natural = naturalHeight(surface);
  const below = vh - from.bottom - gap - inset;
  const above = from.top - gap - inset;
  const up = options.up
    ? !(above < Math.min(natural, MIN_HEIGHT) && below > above)
    : below < Math.min(natural, MIN_HEIGHT) && above > below;
  const maxHeight = Math.max(MIN_HEIGHT, up ? above : below);
  const shown = Math.min(natural, maxHeight);
  const top = up ? from.top - gap - shown : from.bottom + gap;
  let left = options.align === 'end' ? trigger.right - width : trigger.left;
  left = Math.max(inset, Math.min(left, vw - width - inset));
  return { top: Math.round(top), left: Math.round(left), maxHeight: Math.round(maxHeight) };
}

/**
 * Beside a vertical bar: gap-xs from its left edge, or from its right edge when there is no room on
 * the left, lined up with the top of the trigger and kept inside the window
 */
export function placeBeside(surface: HTMLElement, trigger: DOMRect, bar: DOMRect): Placed {
  const { gap, edge: inset } = distances(surface);
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = surface.offsetWidth;
  const maxHeight = Math.max(MIN_HEIGHT, vh - 2 * inset);
  const shown = Math.min(naturalHeight(surface), maxHeight);
  const top = Math.max(inset, Math.min(trigger.top, vh - shown - inset));
  let left = bar.left - gap - width;
  if (left < inset) left = Math.min(bar.right + gap, vw - width - inset);
  return { top: Math.round(top), left: Math.round(left), maxHeight: Math.round(maxHeight) };
}

/**
 * A submenu next to its row: on the right, on the left when there is no room, and inside the window
 * below
 */
export function placeNext(surface: HTMLElement, row: DOMRect): { top: number; left: number } {
  const { edge: inset } = distances(surface);
  const w = surface.offsetWidth;
  const h = surface.offsetHeight;
  let left = row.right;
  if (left + w > window.innerWidth - inset) left = Math.max(inset, row.left - w);
  let top = row.top;
  if (top + h > window.innerHeight - inset) top = Math.max(inset, window.innerHeight - inset - h);
  return { top, left };
}

/**
 * Places the surface again whenever its trigger moves, the page or a container scrolls (not the
 * surface itself, whose content scrolls), or the window is resized. Returns the function that
 * stops following.
 */
export function follow(trigger: Element, surface: Element, place: () => void): () => void {
  let last = trigger.getBoundingClientRect();
  let frame = requestAnimationFrame(function watch() {
    const r = trigger.getBoundingClientRect();
    if (
      r.top !== last.top ||
      r.left !== last.left ||
      r.width !== last.width ||
      r.height !== last.height
    ) {
      last = r;
      place();
    }
    frame = requestAnimationFrame(watch);
  });
  const onScroll = (e: Event) => {
    if (e.target instanceof Node && surface.contains(e.target)) return;
    place();
  };
  window.addEventListener('scroll', onScroll, true);
  window.addEventListener('resize', place);
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('scroll', onScroll, true);
    window.removeEventListener('resize', place);
  };
}
