// Shows the full text of a line clipped with an ellipsis, on hover and on keyboard focus. Nothing
// shows when the line is not clipped. Put it on the element that clips:
//
//   <span class="name" use:clampTip>{title}</span>
//
// It shares the look and the placement of the description tooltip (tipPlace), with two
// differences: it shows at once, since it is the rest of the text rather than an explanation, and
// it wraps, since the text can be long. The tooltip is aria-hidden: the full text is already in
// the document, where assistive technology reads it.
import type { Action } from 'svelte/action';
import { placeTip, tipBounds, tipHost } from './tipPlace.js';

const LOOK = [
  'background: var(--kata-color-text)',
  'color: var(--kata-color-ground)',
  'padding: var(--kata-gap-2xs) var(--kata-gap-sm)',
  'font-size: var(--kata-text-size-caption)',
  'line-height: var(--kata-height-badge)',
  'min-height: var(--kata-height-button-sm)',
  'display: inline-flex',
  'align-items: center',
];

// The widest line; the gap to the edge of the window is the same as in the placement
const MAX_WIDTH = 'min(var(--kata-width-panel), calc(100vw - 2 * var(--kata-gap-sm)))';

function clipped(node: HTMLElement): boolean {
  return node.scrollWidth > node.clientWidth;
}

function makeTip(node: HTMLElement): HTMLSpanElement | null {
  const text = node.textContent?.trim();
  if (!text) return null;
  const tip = document.createElement('span');
  tip.setAttribute('aria-hidden', 'true');
  tip.style.cssText = [
    ...LOOK,
    'position: fixed',
    'z-index: var(--kata-z-menu)',
    `max-width: ${MAX_WIDTH}`,
    'white-space: normal',
    'overflow-wrap: anywhere',
    'pointer-events: none',
  ].join(';');
  tip.textContent = text;
  tipHost(node).appendChild(tip);
  placeTip(tip, node.getBoundingClientRect(), tipBounds(node));
  return tip;
}

export const clampTip: Action<HTMLElement> = (node) => {
  let tip: HTMLSpanElement | null = null;

  function hide() {
    tip?.remove();
    tip = null;
  }

  function onEnter() {
    if (tip || !clipped(node)) return;
    tip = makeTip(node);
  }

  function onFocusIn(e: FocusEvent) {
    // Keyboard focus only, so that the tooltip does not stay after a click
    if (!(e.target as HTMLElement | null)?.matches?.(':focus-visible')) return;
    onEnter();
  }

  node.addEventListener('pointerenter', onEnter);
  node.addEventListener('pointerleave', hide);
  node.addEventListener('focusin', onFocusIn);
  node.addEventListener('focusout', hide);
  // A press or a scroll moves things; hide at once
  node.addEventListener('pointerdown', hide);
  document.addEventListener('scroll', hide, true);
  return {
    destroy() {
      hide();
      node.removeEventListener('pointerenter', onEnter);
      node.removeEventListener('pointerleave', hide);
      node.removeEventListener('focusin', onFocusIn);
      node.removeEventListener('focusout', hide);
      node.removeEventListener('pointerdown', hide);
      document.removeEventListener('scroll', hide, true);
    },
  };
};
