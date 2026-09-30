import { fireEvent, render } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Tabs from '../../src/svelte/components/Tabs.svelte';

const tabs = [
  { id: 'shapes', label: 'Shapes' },
  { id: 'pages', label: 'Pages' },
  { id: 'assets', label: 'Assets' },
];

describe('Tabs', () => {
  it('marks the current tab and keeps only it in the tab order', () => {
    const { getByRole } = render(Tabs, { tabs, current: 'pages', label: 'Views' });
    const nav = getByRole('navigation', { name: 'Views' });
    const buttons = [...nav.querySelectorAll('button')];
    expect(buttons.map((b) => b.getAttribute('aria-current'))).toEqual([null, 'page', null]);
    expect(buttons.map((b) => b.tabIndex)).toEqual([-1, 0, -1]);
  });

  it('moves the focus with the arrow keys, Home and End, and wraps around', async () => {
    const { getByRole } = render(Tabs, { tabs, current: 'shapes', label: 'Views' });
    const [first, second, third] = ['Shapes', 'Pages', 'Assets'].map((name) =>
      getByRole('button', { name }),
    );
    first.focus();
    await fireEvent.keyDown(first, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(second);
    await fireEvent.keyDown(second, { key: 'End' });
    expect(document.activeElement).toBe(third);
    await fireEvent.keyDown(third, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(first);
    await fireEvent.keyDown(first, { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(third);
    await fireEvent.keyDown(third, { key: 'Home' });
    expect(document.activeElement).toBe(first);
  });

  it('reports the tab that is opened', async () => {
    const onselect = vi.fn();
    const { getByRole } = render(Tabs, { tabs, current: 'shapes', onselect });
    await fireEvent.click(getByRole('button', { name: 'Assets' }));
    expect(onselect).toHaveBeenCalledWith('assets');
  });

  it('draws a tab with href as a link', () => {
    const { getByRole } = render(Tabs, {
      tabs: [
        { id: 'general', label: 'General', href: '/general' },
        { id: 'members', label: 'Members', href: '/members' },
      ],
      current: 'members',
    });
    const link = getByRole('link', { name: 'Members' });
    expect(link.getAttribute('href')).toBe('/members');
    expect(link.getAttribute('aria-current')).toBe('page');
  });

  describe('when the tabs do not fit', () => {
    afterEach(() => vi.restoreAllMocks());

    it('shows the current tab and those that fit, and folds the rest into "More"', () => {
      // Every tab and "More" is 100px wide; the tabs have 320px
      vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
        width: 100,
      } as DOMRect);
      vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(320);
      const four = [...tabs, { id: 'history', label: 'History' }];
      const { getByRole, queryByRole } = render(Tabs, {
        tabs: four,
        current: 'assets',
        label: 'Views',
      });
      expect(getByRole('button', { name: 'Assets' }).getAttribute('aria-current')).toBe('page');
      expect(getByRole('button', { name: 'Shapes' })).toBeTruthy();
      expect(queryByRole('button', { name: 'Pages' })).toBeNull();
      expect(queryByRole('button', { name: 'History' })).toBeNull();
      expect(getByRole('button', { name: 'More' }).getAttribute('aria-haspopup')).toBe('menu');
    });
  });
});
