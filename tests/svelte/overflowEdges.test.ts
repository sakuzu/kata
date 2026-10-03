// overflowEdges marks the edges of a sideways scroller that have content beyond them. jsdom lays
// nothing out: the sizes of the scroller are given here, a ResizeObserver that the test triggers
// reports changes, and the animation frames run when the test says so.
import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Table from '../../src/svelte/components/Table.svelte';
import { overflowEdges } from '../../src/svelte/lib/overflowEdges.js';

let observers: MockObserver[] = [];
class MockObserver {
  targets: Element[] = [];
  constructor(private callback: ResizeObserverCallback) {
    observers.push(this);
  }
  observe(el: Element) {
    this.targets.push(el);
  }
  unobserve() {}
  disconnect() {
    this.targets = [];
  }
  fire() {
    this.callback([], this as unknown as ResizeObserver);
  }
}

let frames: FrameRequestCallback[] = [];
function runFrames() {
  const now = frames;
  frames = [];
  for (const f of now) f(0);
}

/** Gives an element the sizes of a scroller */
function size(
  el: HTMLElement,
  s: { scrollLeft: number; clientWidth: number; scrollWidth: number },
) {
  for (const [key, value] of Object.entries(s))
    Object.defineProperty(el, key, { configurable: true, value });
}

beforeEach(() => {
  observers = [];
  frames = [];
  vi.stubGlobal('ResizeObserver', MockObserver);
  vi.stubGlobal('requestAnimationFrame', (f: FrameRequestCallback) => frames.push(f));
  vi.stubGlobal('cancelAnimationFrame', () => {});
});
afterEach(() => vi.unstubAllGlobals());

describe('overflowEdges', () => {
  it('marks the end while content lies beyond it, the start once scrolled, and writes in a frame', () => {
    const el = document.createElement('div');
    el.append(document.createElement('table'));
    size(el, { scrollLeft: 0, clientWidth: 100, scrollWidth: 300 });
    const cleanup = overflowEdges()(el);
    expect(el.hasAttribute('data-overflow-end')).toBe(false);
    runFrames();
    expect(el.hasAttribute('data-overflow-start')).toBe(false);
    expect(el.hasAttribute('data-overflow-end')).toBe(true);

    size(el, { scrollLeft: 200, clientWidth: 100, scrollWidth: 300 });
    el.dispatchEvent(new Event('scroll'));
    runFrames();
    expect(el.hasAttribute('data-overflow-start')).toBe(true);
    expect(el.hasAttribute('data-overflow-end')).toBe(false);

    size(el, { scrollLeft: 50, clientWidth: 100, scrollWidth: 300 });
    el.dispatchEvent(new Event('scroll'));
    runFrames();
    expect(el.hasAttribute('data-overflow-start')).toBe(true);
    expect(el.hasAttribute('data-overflow-end')).toBe(true);

    if (typeof cleanup === 'function') cleanup();
    expect(el.hasAttribute('data-overflow-start')).toBe(false);
    expect(el.hasAttribute('data-overflow-end')).toBe(false);
  });

  it('reads again when the scroller or its content changes size', () => {
    const el = document.createElement('div');
    const content = document.createElement('table');
    el.append(content);
    size(el, { scrollLeft: 0, clientWidth: 300, scrollWidth: 300 });
    overflowEdges()(el);
    runFrames();
    expect(el.hasAttribute('data-overflow-end')).toBe(false);
    expect(observers[0].targets).toEqual([el, content]);

    size(el, { scrollLeft: 0, clientWidth: 120, scrollWidth: 300 });
    observers[0].fire();
    runFrames();
    expect(el.hasAttribute('data-overflow-end')).toBe(true);
  });

  // The scrollbar is the sign that a region scrolls; the attachment stays exported until the next
  // major version, and no component uses it
  it('is not on the frame of a Table', () => {
    const head = createRawSnippet(() => ({ render: () => '<th>Name</th>' }));
    const children = createRawSnippet(() => ({ render: () => '<tr><td>Report</td></tr>' }));
    const { container } = render(Table, { head, children });
    const wrap = container.querySelector<HTMLElement>('.wrap');
    expect(wrap).not.toBeNull();
    expect(observers.some((o) => o.targets.includes(wrap as HTMLElement))).toBe(false);
  });
});
