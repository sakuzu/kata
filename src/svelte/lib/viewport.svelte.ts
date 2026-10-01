// The widths of the layout, measured in script. The CSS side measures the size container `app`
// against 24, 48 and 64rem: the Shell's root inside a Shell, else the body (base.css). This
// measures the same thing in the same way, in rem, so that a larger text size makes the same width
// count as narrower: inside a Shell the Shell's element, elsewhere the window.
import { getContext, setContext } from 'svelte';

/** The widths the CSS measures against, in rem: tiny, narrow and mid */
export const WIDTHS = { tiny: 24, narrow: 48, mid: 64 } as const;

function rootFontSize(): number {
  const px = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
  return Number.isFinite(px) && px > 0 ? px : 16;
}

/**
 * The width in px that the layouts measure: the element's, or the window's when there is no
 * element or the element has no box yet (not in the page, or hidden).
 */
function widthOf(el?: Element | null): number {
  const w = el?.getBoundingClientRect().width ?? 0;
  return w > 0 ? w : window.innerWidth;
}

/**
 * Whether the window, or an element when one is given, is narrower than a width in rem. Without a
 * window (on a server) it is not.
 */
export function isNarrowerThan(remLimit: number, el?: Element | null): boolean {
  if (typeof window === 'undefined') return false;
  return widthOf(el) / rootFontSize() < remLimit;
}

// ---- The container of the application ----
// A Shell is the size container `app` of everything inside it. It hands its element down through
// a context, so that a component inside it measures the Shell, as its container queries do.

const APP = Symbol('kata-app');

interface AppContainer {
  readonly el: Element | undefined;
}

/** Called by the Shell: the components inside measure this element instead of the window */
export function setAppContainer(container: AppContainer): void {
  setContext(APP, container);
}

function appContainer(): AppContainer | undefined {
  try {
    return getContext<AppContainer | undefined>(APP);
  } catch {
    // Called outside the initialisation of a component: there is no Shell around it
    return undefined;
  }
}

// One ResizeObserver for every element that is measured, however many flags watch it
let observer: ResizeObserver | undefined;
const watchers = new Map<Element, Set<() => void>>();

function watchSize(el: Element, run: () => void): () => void {
  observer ??= new ResizeObserver((entries) => {
    for (const entry of entries) for (const fn of watchers.get(entry.target) ?? []) fn();
  });
  let set = watchers.get(el);
  if (!set) {
    set = new Set();
    watchers.set(el, set);
    observer.observe(el);
  }
  set.add(run);
  return () => {
    set.delete(run);
    if (set.size > 0) return;
    watchers.delete(el);
    observer?.unobserve(el);
  };
}

/**
 * A reactive flag: whether the window is narrower than a width in rem. Call start() in an $effect
 * and return what it returns. It measures again when the window is resized and when the text size
 * setting (data-font-scale on the root element) changes.
 *
 * Inside a Shell it measures the Shell's element instead, as the container queries do. start(el)
 * measures the element it is given. An element is followed with a ResizeObserver; where there is
 * none, the window is measured.
 */
export function createNarrow(remLimit: number): {
  readonly current: boolean;
  start: (el?: Element | null) => () => void;
} {
  let narrow = $state(false);
  const app = appContainer();
  return {
    get current() {
      return narrow;
    },
    start(el?: Element | null) {
      if (typeof window === 'undefined') return () => {};
      // Read in the effect that calls start(), so that it starts again once the Shell has its element
      const own = el instanceof Element ? el : undefined;
      const target =
        typeof ResizeObserver === 'undefined' ? undefined : (own ?? app?.el ?? undefined);
      const measure = () => {
        narrow = isNarrowerThan(remLimit, target);
      };
      measure();
      const unwatch = target ? watchSize(target, measure) : undefined;
      window.addEventListener('resize', measure);
      const mo = new MutationObserver(measure);
      mo.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-font-scale'],
      });
      return () => {
        unwatch?.();
        window.removeEventListener('resize', measure);
        mo.disconnect();
      };
    },
  };
}
