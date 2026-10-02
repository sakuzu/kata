// StepBar stays on one line and changes its form when it does not fit. jsdom lays nothing out: the
// width the bar needs in each form is given here, a ResizeObserver that the test triggers reports
// its changes, and a frame runs at once.
import { render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import StepBar from '../../src/svelte/components/StepBar.svelte';

const steps = ['Choose the source', 'Set the range', 'Fetch', 'Review'];

// The width of the bar, and the width its content needs in one row and stacked
let width = 0;
const NEED = { row: 400, stack: 250 };
let observers: { cb: ResizeObserverCallback }[] = [];

beforeEach(() => {
  observers = [];
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(public cb: ResizeObserverCallback) {
        observers.push(this);
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  vi.stubGlobal('requestAnimationFrame', (f: FrameRequestCallback) => {
    f(0);
    return 1;
  });
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function (
    this: HTMLElement,
  ) {
    return this.matches('ol') ? width : 0;
  });
  vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockImplementation(function (
    this: HTMLElement,
  ) {
    if (!this.matches('ol')) return 0;
    // The numbers wrap, so they never overflow
    if (this.hasAttribute('data-numbers')) return width;
    return Math.max(width, this.hasAttribute('data-stack') ? NEED.stack : NEED.row);
  });
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

/** Gives the bar a width and reports it until the form settles, as the steps change size */
async function resize(w: number) {
  width = w;
  for (let i = 0; i < 3; i += 1) {
    for (const o of observers) o.cb([], o as unknown as ResizeObserver);
    await tick();
  }
}

const formOf = (ol: HTMLElement) =>
  ol.hasAttribute('data-numbers') ? 'numbers' : ol.hasAttribute('data-stack') ? 'stack' : 'row';

describe('StepBar', () => {
  it('stays in one row while it fits', async () => {
    const { container } = render(StepBar, { steps, current: 2 });
    const ol = container.querySelector('ol') as HTMLElement;
    await resize(500);
    expect(formOf(ol)).toBe('row');
    expect(container.querySelector('.caption')).toBeNull();
  });

  it('stacks the names, then shows only the numbers, and comes back as it widens', async () => {
    const { container } = render(StepBar, { steps, current: 2 });
    const ol = container.querySelector('ol') as HTMLElement;
    await resize(300);
    expect(formOf(ol)).toBe('stack');
    await resize(200);
    expect(formOf(ol)).toBe('numbers');
    // The current step's name is written under the bar; the names stay for screen readers
    expect(container.querySelector('.caption')?.textContent).toBe('Set the range');
    expect(container.querySelectorAll('.step .name')).toHaveLength(4);
    await resize(260);
    expect(formOf(ol)).toBe('stack');
    expect(container.querySelector('.caption')).toBeNull();
    await resize(420);
    expect(formOf(ol)).toBe('row');
  });

  it('marks the current step', () => {
    const { container } = render(StepBar, { steps, current: 3 });
    const now = container.querySelector('[aria-current="step"]');
    expect(now?.querySelector('.name')?.textContent).toBe('Fetch');
  });
});
