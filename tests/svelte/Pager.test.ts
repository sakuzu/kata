import { fireEvent, render, within } from '@testing-library/svelte';
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

  it('takes its names from the messages', () => {
    setMessages({ pagination: 'ページ', page: ({ page }) => `${page} ページ` });
    const { getByRole } = render(Pager, { page: 1, pages: 2, onchange: () => {} });
    expect(getByRole('navigation').getAttribute('aria-label')).toBe('ページ');
    expect(getByRole('button', { name: '2 ページ' })).toBeTruthy();
  });
});
