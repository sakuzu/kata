import { fireEvent, render, within } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Pager from '../../src/svelte/components/Pager.svelte';
import { setMessages } from '../../src/svelte/messages.js';

/** The numbers and gaps the pager shows, in order */
function shown(container: HTMLElement): string[] {
  return [...container.querySelectorAll('nav button .t, nav .gap .t')].map(
    (e) => e.textContent ?? '',
  );
}

describe('Pager', () => {
  afterEach(() => setMessages({}, { reset: true }));

  it('shows nothing for a single page', () => {
    const { container } = render(Pager, { page: 1, pages: 1, onchange: () => {} });
    expect(container.querySelector('nav')).toBeNull();
  });

  it('keeps the first, the last and the neighbours of the current page', () => {
    const { container } = render(Pager, { page: 5, pages: 12, onchange: () => {} });
    expect(shown(container)).toEqual(['1', '…', '4', '5', '6', '…', '12']);
  });

  it('puts no gap where no page is skipped', () => {
    const { container } = render(Pager, { page: 2, pages: 4, onchange: () => {} });
    expect(shown(container)).toEqual(['1', '2', '3', '4']);
  });

  it('marks the current page and asks for the page that is pressed', async () => {
    const onchange = vi.fn();
    const { getByRole } = render(Pager, { page: 2, pages: 9, onchange });
    expect(getByRole('button', { name: 'Page 2' }).getAttribute('aria-current')).toBe('page');
    await fireEvent.click(getByRole('button', { name: 'Page 3' }));
    expect(onchange).toHaveBeenLastCalledWith(3);
    await fireEvent.click(getByRole('button', { name: 'Previous page' }));
    expect(onchange).toHaveBeenLastCalledWith(1);
    await fireEvent.click(getByRole('button', { name: 'Next page' }));
    expect(onchange).toHaveBeenLastCalledWith(3);
  });

  it('cannot go before the first or after the last page', () => {
    const first = render(Pager, { page: 1, pages: 3, onchange: () => {} });
    expect(
      (first.getByRole('button', { name: 'Previous page' }) as HTMLButtonElement).disabled,
    ).toBe(true);
    const last = render(Pager, { page: 3, pages: 3, onchange: () => {} });
    const next = within(last.container).getByRole('button', { name: 'Next page' });
    expect((next as HTMLButtonElement).disabled).toBe(true);
  });

  describe('in a narrow width', () => {
    // jsdom lays nothing out: the square's token (--kata-height-icon-button, read with a probe)
    // is 30px (the gap reads as 0), the pager is as wide as `width`, a ResizeObserver that the
    // test triggers reports its changes, and a frame runs at once
    let width = 0;
    let observers: { cb: ResizeObserverCallback }[] = [];
    const setup = () => {
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
      const original = Element.prototype.getBoundingClientRect;
      vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (
        this: Element,
      ) {
        return this instanceof HTMLElement && this.style.height === 'var(--kata-height-icon-button)'
          ? new DOMRect(0, 0, 0, 30)
          : original.call(this);
      });
      vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function (
        this: HTMLElement,
      ) {
        return this.matches('nav') ? width : 0;
      });
    };
    const resize = async (w: number) => {
      width = w;
      for (const o of observers) o.cb([], o as unknown as ResizeObserver);
      await tick();
    };
    afterEach(() => {
      vi.restoreAllMocks();
      vi.unstubAllGlobals();
    });

    it('drops the neighbours of the current page, then scrolls, and comes back', async () => {
      setup();
      // The full form is 9 squares (270px), the compact one 7 (210px)
      width = 300;
      const { container } = render(Pager, { page: 5, pages: 12, onchange: () => {} });
      await tick();
      const nav = container.querySelector('nav') as HTMLElement;
      expect(shown(container)).toEqual(['1', '…', '4', '5', '6', '…', '12']);
      await resize(250);
      expect(shown(container)).toEqual(['1', '…', '5', '…', '12']);
      expect(nav.hasAttribute('data-scroll')).toBe(false);
      await resize(200);
      expect(shown(container)).toEqual(['1', '…', '5', '…', '12']);
      expect(nav.hasAttribute('data-scroll')).toBe(true);
      await resize(280);
      expect(shown(container)).toEqual(['1', '…', '4', '5', '6', '…', '12']);
      expect(nav.hasAttribute('data-scroll')).toBe(false);
    });

    it('shows a page once in the compact form, next to the first or the last', async () => {
      setup();
      width = 150;
      const first = render(Pager, { page: 1, pages: 12, onchange: () => {} });
      await tick();
      expect(shown(first.container)).toEqual(['1', '…', '12']);
      first.unmount();
      const second = render(Pager, { page: 2, pages: 12, onchange: () => {} });
      await tick();
      expect(shown(second.container)).toEqual(['1', '2', '…', '12']);
      second.unmount();
      const last = render(Pager, { page: 11, pages: 12, onchange: () => {} });
      await tick();
      expect(shown(last.container)).toEqual(['1', '…', '11', '12']);
    });
  });

  it('takes its names from the messages', () => {
    setMessages({ pagination: 'ページ', page: ({ page }) => `${page} ページ` });
    const { getByRole } = render(Pager, { page: 1, pages: 2, onchange: () => {} });
    expect(getByRole('navigation').getAttribute('aria-label')).toBe('ページ');
    expect(getByRole('button', { name: '2 ページ' })).toBeTruthy();
  });
});
