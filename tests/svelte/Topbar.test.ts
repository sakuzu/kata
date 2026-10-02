// The Topbar compacts its end in two steps when its row does not fit. jsdom lays nothing out and
// has no ResizeObserver: the widths are given here, a ResizeObserver that the test triggers
// reports the changes, and the frames run when the test says so.
import { render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import TopbarHarness from './TopbarHarness.svelte';

const observers = new Set<MockObserver>();
class MockObserver {
  targets = new Set<Element>();
  constructor(private callback: ResizeObserverCallback) {
    observers.add(this);
  }
  observe(el: Element) {
    this.targets.add(el);
  }
  unobserve(el: Element) {
    this.targets.delete(el);
  }
  disconnect() {
    this.targets.clear();
    observers.delete(this);
  }
  fire() {
    const entries = [...this.targets].map((target) => ({ target }));
    if (entries.length > 0)
      this.callback(entries as unknown as ResizeObserverEntry[], this as unknown as ResizeObserver);
  }
}

let frames: FrameRequestCallback[] = [];
/** Runs the frames, and the frames they ask for, until none is left */
async function settle() {
  for (let i = 0; i < 20; i++) {
    await tick();
    await Promise.resolve();
    if (frames.length === 0) return;
    const run = frames;
    frames = [];
    for (const cb of run) cb(0);
  }
}
async function resize() {
  for (const o of observers) o.fire();
  await settle();
}

// The widths, in px: the brand, and the end by what its two groups show
const WIDTHS: Record<string, number> = { faces: 80, count: 30, buttons: 80, kebab: 30 };
function widthOf(el: Element): number {
  if (el.matches('.brand')) return 100;
  if (el.matches('.end'))
    return [...el.querySelectorAll('[data-testid]')].reduce(
      (sum, t) => sum + (WIDTHS[t.textContent ?? ''] ?? 0),
      0,
    );
  return 0;
}

describe('Topbar', () => {
  // The width of the bar, set by each test
  let width = 0;
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', MockObserver);
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => frames.push(cb));
    vi.stubGlobal('cancelAnimationFrame', () => {});
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: Element,
    ) {
      return { width: widthOf(this) } as DOMRect;
    });
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(() => width);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    observers.clear();
    frames = [];
  });

  const shows = (container: HTMLElement) => [
    container.querySelector('[data-testid="presence"]')?.textContent,
    container.querySelector('[data-testid="end"]')?.textContent,
  ];

  it('keeps the presence and the actions while the row fits', async () => {
    // 100 + 80 + 80 = 260
    width = 300;
    const { container } = render(TopbarHarness);
    await resize();
    expect(shows(container)).toEqual(['faces', 'buttons']);
  });

  it('passes compact to the presence first, and stops there when that fits', async () => {
    // 260 does not fit; 100 + 30 + 80 = 210 does
    width = 220;
    const { container } = render(TopbarHarness);
    await resize();
    expect(shows(container)).toEqual(['count', 'buttons']);
  });

  it('then to the actions, and goes back when the width allows the row again', async () => {
    // 210 does not fit; 100 + 30 + 30 = 160 does
    width = 180;
    const { container } = render(TopbarHarness);
    await resize();
    expect(shows(container)).toEqual(['count', 'kebab']);
    // The brand stays
    expect(container.querySelector('.brand')?.textContent).toBe('Sketchbook');

    width = 300;
    await resize();
    expect(shows(container)).toEqual(['faces', 'buttons']);
  });
});
