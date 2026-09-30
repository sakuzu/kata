// The widths of the layout, measured in script. The CSS side measures the size container `app`
// (the body) against 24, 48 and 64rem; this measures the window the same way, in rem, so that a
// larger text size makes the same window count as narrower.

/** The widths the CSS measures against, in rem: tiny, narrow and mid */
export const WIDTHS = { tiny: 24, narrow: 48, mid: 64 } as const;

function rootFontSize(): number {
  const px = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
  return Number.isFinite(px) && px > 0 ? px : 16;
}

/** Whether the window is narrower than a width in rem. Without a window (on a server) it is not. */
export function isNarrowerThan(remLimit: number): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth / rootFontSize() < remLimit;
}

/**
 * A reactive flag: whether the window is narrower than a width in rem. Call start() in an $effect
 * and return what it returns. It measures again when the window is resized and when the text size
 * setting (data-font-scale on the root element) changes.
 */
export function createNarrow(remLimit: number): {
  readonly current: boolean;
  start: () => () => void;
} {
  let narrow = $state(false);
  return {
    get current() {
      return narrow;
    },
    start() {
      if (typeof window === 'undefined') return () => {};
      const measure = () => {
        narrow = isNarrowerThan(remLimit);
      };
      measure();
      window.addEventListener('resize', measure);
      const mo = new MutationObserver(measure);
      mo.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-font-scale'],
      });
      return () => {
        window.removeEventListener('resize', measure);
        mo.disconnect();
      };
    },
  };
}
