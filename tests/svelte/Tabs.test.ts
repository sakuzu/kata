import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
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
});
