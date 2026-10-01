// The Shell measures its own element, not the window, and the components inside it measure the
// shell too. jsdom lays nothing out and has no ResizeObserver: the width of the shell's element is
// given here, and a ResizeObserver that the test triggers reports its changes.
import { render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ShellLayout } from '../../src/svelte/components/Shell.svelte';
import Shell from '../../src/svelte/components/Shell.svelte';
import { isNarrowerThan } from '../../src/svelte/lib/viewport.svelte.js';
import ShellHarness from './ShellHarness.svelte';

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
  /** Reports a change of size of the elements it observes among those given */
  fire(changed: Element[]) {
    const entries = changed
      .filter((el) => this.targets.has(el))
      .map((target) => ({ target, contentRect: target.getBoundingClientRect() }));
    if (entries.length > 0)
      this.callback(entries as unknown as ResizeObserverEntry[], this as unknown as ResizeObserver);
  }
}

// The width of every shell's element, in px; other elements have no box
let shellWidth = 0;
const original = Element.prototype.getBoundingClientRect;

beforeAll(() => {
  globalThis.ResizeObserver = MockObserver as unknown as typeof ResizeObserver;
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    return this.matches('[data-role="shell"]')
      ? new DOMRect(0, 0, shellWidth, 600)
      : original.call(this);
  });
});
afterAll(() => {
  vi.restoreAllMocks();
});

function setWindow(width: number) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
}

/** Gives the shell a width (in px, at a root of 16px) and reports it to the observers */
async function resizeShell(width: number) {
  shellWidth = width;
  const shells = [...document.querySelectorAll('[data-role="shell"]')];
  for (const o of observers) o.fire(shells);
  await tick();
  await tick();
}

describe('Shell measures its element', () => {
  beforeEach(() => setWindow(1440));
  afterEach(() => {
    shellWidth = 0;
    setWindow(1024);
  });

  it('places the side regions by the width of the shell, not of the window', async () => {
    shellWidth = 1200;
    const onlayout = vi.fn<(l: ShellLayout) => void>();
    const { container } = render(ShellHarness, { onlayout });
    await tick();
    expect(onlayout).toHaveBeenLastCalledWith({
      width: 'wide',
      leftMode: 'beside',
      rightMode: 'beside',
    });

    // The window stays at 1440px; the shell narrows to 60rem, then 30rem
    await resizeShell(960);
    expect(onlayout).toHaveBeenLastCalledWith({
      width: 'mid',
      leftMode: 'floating',
      rightMode: 'floating',
    });
    expect(container.querySelector('[data-role="shell"]')?.getAttribute('data-width')).toBe('mid');
    await resizeShell(480);
    expect(onlayout).toHaveBeenLastCalledWith({
      width: 'narrow',
      leftMode: 'sheet',
      rightMode: 'sheet',
    });

    // A resize of the window alone changes nothing
    setWindow(2000);
    window.dispatchEvent(new Event('resize'));
    await tick();
    expect(onlayout).toHaveBeenLastCalledWith({
      width: 'narrow',
      leftMode: 'sheet',
      rightMode: 'sheet',
    });
  });

  it('measures the window while its element has no box yet', async () => {
    shellWidth = 0;
    setWindow(960);
    const onlayout = vi.fn<(l: ShellLayout) => void>();
    render(ShellHarness, { onlayout });
    await tick();
    expect(onlayout).toHaveBeenLastCalledWith({
      width: 'mid',
      leftMode: 'floating',
      rightMode: 'floating',
    });
  });

  it('measures the window where there is no ResizeObserver', async () => {
    const keep = globalThis.ResizeObserver;
    // @ts-expect-error: a browser without ResizeObserver
    delete globalThis.ResizeObserver;
    try {
      shellWidth = 480;
      setWindow(1440);
      const onlayout = vi.fn<(l: ShellLayout) => void>();
      render(Shell, { onlayout });
      await tick();
      expect(onlayout).toHaveBeenLastCalledWith({
        width: 'wide',
        leftMode: 'beside',
        rightMode: 'beside',
      });
    } finally {
      globalThis.ResizeObserver = keep;
    }
  });

  it('is the width that the components inside it measure', async () => {
    shellWidth = 1200;
    const { container } = render(ShellHarness, {});
    await tick();
    const pair = () => container.querySelector('[data-role="pair"]');
    expect(pair()?.getAttribute('data-h')).toBe('button');
    // Below 24rem the name goes above the value, and the pair declares no height
    await resizeShell(300);
    expect(pair()?.getAttribute('data-h')).toBeNull();
    await resizeShell(1200);
    expect(pair()?.getAttribute('data-h')).toBe('button');
  });

  it('is the size container app of what is inside it', async () => {
    const { container } = render(Shell, {});
    await tick();
    expect(container.querySelector('[data-role="shell"]')).not.toBeNull();
    expect(isNarrowerThan(48, container.querySelector('[data-role="shell"]'))).toBe(false);
    shellWidth = 600;
    expect(isNarrowerThan(48, container.querySelector('[data-role="shell"]'))).toBe(true);
    // Without an element it is the window
    expect(isNarrowerThan(48)).toBe(false);
  });
});

describe('Shell overlay', () => {
  it('marks the root as an overlay only when asked', async () => {
    shellWidth = 1200;
    const a = render(ShellHarness, {});
    await tick();
    expect(a.container.querySelector('[data-role="shell"]')?.classList.contains('overlay')).toBe(
      false,
    );
    a.unmount();
    const b = render(ShellHarness, { overlay: true });
    await tick();
    const shell = b.container.querySelector('[data-role="shell"]');
    expect(shell?.classList.contains('overlay')).toBe(true);
    // The regions are still drawn
    expect(shell?.querySelector('[data-region="left"]')?.textContent).toContain('Hill');
    expect(shell?.querySelector('.surface')?.textContent).toBe('Drawing');
  });
});
