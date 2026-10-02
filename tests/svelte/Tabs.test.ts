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

    const four = [...tabs, { id: 'history', label: 'History' }];
    /** Every tab and the trigger are 100px wide; the tabs have 320px */
    function narrow() {
      vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
        width: 100,
      } as DOMRect);
      vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(320);
    }

    it('shows the tabs that fit from the start, and folds the rest into "More"', () => {
      narrow();
      const { getByRole, queryByRole } = render(Tabs, {
        tabs: four,
        current: 'pages',
        label: 'Views',
      });
      const nav = getByRole('navigation', { name: 'Views' });
      const shown = [...nav.querySelectorAll('button.tab:not(.more)')].map((b) => b.textContent);
      expect(shown).toEqual(['Shapes', 'Pages']);
      expect(getByRole('button', { name: 'Pages' }).getAttribute('aria-current')).toBe('page');
      expect(queryByRole('button', { name: 'Assets' })).toBeNull();
      expect(queryByRole('button', { name: 'History' })).toBeNull();
      const more = getByRole('button', { name: 'More' });
      expect(more.getAttribute('aria-haspopup')).toBe('menu');
      expect(more.tabIndex).toBe(-1);
      expect(more.classList.contains('on')).toBe(false);
    });

    it('keeps the order when the current tab is folded, and shows it on the trigger', () => {
      narrow();
      const { getByRole, queryByRole } = render(Tabs, {
        tabs: four,
        current: 'history',
        label: 'Views',
      });
      const nav = getByRole('navigation', { name: 'Views' });
      const shown = [...nav.querySelectorAll('button.tab:not(.more)')].map((b) => b.textContent);
      expect(shown).toEqual(['Shapes', 'Pages']);
      expect(queryByRole('button', { name: 'More' })).toBeNull();
      // The trigger has the name and the mark of the current tab, and is in the tab order
      const trigger = getByRole('button', { name: 'History' });
      expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
      expect(trigger.classList.contains('on')).toBe(true);
      expect(trigger.tabIndex).toBe(0);
      expect([...nav.querySelectorAll('button')].filter((b) => b.tabIndex === 0)).toEqual([
        trigger,
      ]);
    });
  });
});
