// The Footer stacks only when its row does not fit. jsdom lays nothing out and has no
// ResizeObserver: the widths are given here, a ResizeObserver that the test triggers reports the
// changes, and the frames run when the test says so.
import { render } from '@testing-library/svelte';
import { createRawSnippet, tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Footer from '../../src/svelte/components/Footer.svelte';

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
async function flushFrames() {
  const run = frames;
  frames = [];
  for (const cb of run) cb(0);
  await tick();
}
async function resize() {
  for (const o of observers) o.fire();
  await flushFrames();
}

const button = (text: string) =>
  createRawSnippet(() => ({ render: () => `<button>${text}</button>` }));

describe('Footer', () => {
  // Every part is 100px wide; the footer's width is set by each test
  let width = 0;
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', MockObserver);
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => frames.push(cb));
    vi.stubGlobal('cancelAnimationFrame', () => {});
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 100,
    } as DOMRect);
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(() => width);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    observers.clear();
    frames = [];
  });

  const props = () => ({
    secondary: button('Save as copy'),
    cancel: button('Cancel'),
    primary: button('Save'),
  });

  it('stays one row while the row fits', async () => {
    width = 400;
    const { container } = render(Footer, props());
    await resize();
    const foot = container.querySelector('[data-role="footer"]') as HTMLElement;
    expect(foot.hasAttribute('data-stacked')).toBe(false);
    expect(foot.classList.contains('stacked')).toBe(false);
  });

  it('stacks when the row does not fit, and goes back to a row when it fits again', async () => {
    width = 250;
    const { container } = render(Footer, props());
    await resize();
    const foot = container.querySelector('[data-role="footer"]') as HTMLElement;
    expect(foot.hasAttribute('data-stacked')).toBe(true);
    expect(foot.classList.contains('stacked')).toBe(true);
    expect(getComputedStyle(foot).flexDirection).toBe('column');

    width = 400;
    await resize();
    expect(foot.hasAttribute('data-stacked')).toBe(false);
  });
});
