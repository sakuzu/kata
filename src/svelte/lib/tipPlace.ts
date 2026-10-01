// Places a tooltip next to its anchor. The description tooltip and the full text of a clipped line
// (clampTip) share this one rule.
//
// The tooltip goes above the anchor, centred, gap-sm away. When it does not fit above it goes below,
// then to the right, then to the left; it never covers the anchor or the pointer. Below, the gap is
// gap-lg, because the pointer's image hangs about one line below its hot spot.
//
// "Fits" means inside the nearest ancestor with data-tip-bounds, or inside the window. The distances
// are read from the tokens at run time, so they follow the text size setting.
import { hostOf } from './host.js';

export type TipSide = 'top' | 'bottom' | 'left' | 'right';

/**
 * Where to insert the tooltip: the host of its anchor (hostOf: the nearest data-kata-root, else the
 * body). Inside an open modal dialog that is in the host it goes into the dialog: a dialog opened
 * with showModal() is drawn in the top layer, above everything in the body whatever its z-index.
 */
export function tipHost(anchorEl?: Element | null): HTMLElement {
  const host = hostOf(anchorEl);
  const dialog = anchorEl?.closest<HTMLElement>('dialog[open]');
  return dialog && host.contains(dialog) ? dialog : host;
}

/**
 * The rectangle a pointer can hit. A borderless icon button is hit in the square of a small button,
 * which is larger than the icon it shows, so its visible rectangle is grown to that square.
 */
export function hitRect(el: Element, role: 'box' | 'icon-button' | 'block'): DOMRect {
  const r = el.getBoundingClientRect();
  if (role !== 'icon-button') return r;
  const h = tokenPx('--kata-height-button-sm', el);
  const top = Math.min(r.top, r.top + r.height / 2 - h / 2);
  const left = Math.min(r.left, r.left + r.width / 2 - h / 2);
  return new DOMRect(left, top, Math.max(r.width, h), Math.max(r.height, h));
}

/** The rectangle of the nearest ancestor with data-tip-bounds, or undefined for the window */
export function tipBounds(anchorEl: Element): DOMRect | undefined {
  return anchorEl.closest('[data-tip-bounds]')?.getBoundingClientRect();
}

/**
 * The length of a token in px, measured with a hidden element, so that calc and rem resolve. The
 * probe goes into the host of the element it measures for, where the tokens are defined.
 */
export function tokenPx(name: string, context?: Element | null): number {
  const probe = document.createElement('div');
  probe.style.cssText = `position:fixed;left:-9999px;top:0;width:0;visibility:hidden;height:var(${name})`;
  hostOf(context).appendChild(probe);
  const h = probe.getBoundingClientRect().height;
  probe.remove();
  return h;
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(v, max));

/**
 * Places a tooltip (an element with position: fixed) outside its anchor and returns the side it
 * chose.
 */
export function placeTip(node: HTMLElement, anchor: DOMRect, bounds?: DOMRect): TipSide {
  const gap = tokenPx('--kata-gap-sm', node);
  const gapDown = tokenPx('--kata-gap-lg', node);
  // Fix the position before measuring; the width is bounded by max-width, so the height does not
  // depend on where it is measured
  node.style.position = 'fixed';
  node.style.left = '0px';
  node.style.top = '0px';
  const t = node.getBoundingClientRect();
  const bx = Math.max(0, bounds?.left ?? 0);
  const by = Math.max(0, bounds?.top ?? 0);
  const vw = Math.min(window.innerWidth, bounds?.right ?? Number.POSITIVE_INFINITY);
  const vh = Math.min(window.innerHeight, bounds?.bottom ?? Number.POSITIVE_INFINITY);

  const cx = anchor.left + anchor.width / 2 - t.width / 2;
  const cy = anchor.top + anchor.height / 2 - t.height / 2;

  const candidates: { side: TipSide; left: number; top: number; fits: boolean }[] = [
    {
      side: 'top',
      left: cx,
      top: anchor.top - t.height - gap,
      fits: anchor.top - t.height - gap >= by + gap,
    },
    {
      side: 'bottom',
      left: cx,
      top: anchor.bottom + gapDown,
      fits: anchor.bottom + gapDown + t.height <= vh - gap,
    },
    {
      side: 'right',
      left: anchor.right + gap,
      top: cy,
      fits: anchor.right + gap + t.width <= vw - gap,
    },
    {
      side: 'left',
      left: anchor.left - t.width - gap,
      top: cy,
      fits: anchor.left - t.width - gap >= bx + gap,
    },
  ];
  // Nothing fits only when the window is narrower than the tooltip: take the side with more room
  const fallback = anchor.top > vh - anchor.bottom ? candidates[0] : candidates[1];
  const pick = candidates.find((c) => c.fits) ?? fallback;

  node.style.left = `${clamp(pick.left, bx + gap, Math.max(bx + gap, vw - gap - t.width))}px`;
  node.style.top = `${clamp(pick.top, by + gap, Math.max(by + gap, vh - gap - t.height))}px`;
  return pick.side;
}
