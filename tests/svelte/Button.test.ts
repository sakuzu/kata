import { fireEvent, render } from '@testing-library/svelte';
import { createRawSnippet, tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Button from '../../src/svelte/components/Button.svelte';

const html = (markup: string) => createRawSnippet(() => ({ render: () => markup }));
const tipOf = () => document.body.querySelector<HTMLElement>(':scope > .tip');
const text = (t: string) => createRawSnippet(() => ({ render: () => `<span>${t}</span>` }));

describe('Button', () => {
  it('is a button of type button that reports a press', async () => {
    const onclick = vi.fn();
    const { getByRole } = render(Button, { onclick, children: text('Save') });
    const el = getByRole('button');
    expect(el.getAttribute('type')).toBe('button');
    expect(el.getAttribute('data-h')).toBe('button');
    await fireEvent.click(el);
    expect(onclick).toHaveBeenCalledOnce();
  });

  it('cannot be pressed while busy or disabled', () => {
    const busy = render(Button, { busy: true, children: text('Save') });
    expect((busy.getByRole('button') as HTMLButtonElement).disabled).toBe(true);
    const off = render(Button, { disabled: true, children: text('Save') });
    expect((off.getAllByRole('button')[1] as HTMLButtonElement).disabled).toBe(true);
  });

  it('renders a link with href, and adds rel for another tab', () => {
    const { container } = render(Button, {
      props: { href: '/help', target: '_blank', children: text('Help') },
    });
    const a = container.querySelector('a');
    expect(a?.getAttribute('href')).toBe('/help');
    expect(a?.getAttribute('rel')).toBe('noopener');
  });

  it('declares the icon button height and shows a count rounded to 99+', () => {
    const { container, getByRole } = render(Button, {
      icon: true,
      badge: 120,
      'aria-label': 'Notifications',
      children: text('!'),
    });
    expect(getByRole('button').getAttribute('data-h')).toBe('icon-button');
    expect(getByRole('button').getAttribute('aria-label')).toBe('Notifications');
    expect(container.querySelector('.unread')?.textContent).toBe('99+');
  });

  it('shows no count at zero', () => {
    const { container } = render(Button, { icon: true, badge: 0, children: text('!') });
    expect(container.querySelector('.unread')).toBeNull();
  });
});

describe('Button with a tooltip', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('shows the aria-label of an icon button and its shortcut', async () => {
    const { container } = render(Button, {
      icon: true,
      'aria-label': 'Undo',
      shortcut: '⌘Z',
      children: html('<span>↶</span>'),
    });
    const seat = container.querySelector('.seat') as HTMLElement;
    expect(seat.querySelector('button')?.getAttribute('aria-label')).toBe('Undo');
    await fireEvent.pointerEnter(seat);
    vi.advanceTimersByTime(400);
    await tick();
    expect(tipOf()?.textContent).toContain('Undo');
    expect(tipOf()?.textContent).toContain('⌘Z');
  });

  it('has no tooltip on a text button unless tip is given, and none with tip={false}', () => {
    const plain = render(Button, { children: html('<span>Save</span>') });
    expect(plain.container.querySelector('.seat')).toBeNull();
    const tipped = render(Button, { tip: 'Save a copy', children: html('<span>Save</span>') });
    expect(tipped.container.querySelector('.seat')).not.toBeNull();
    const off = render(Button, {
      icon: true,
      tip: false,
      'aria-label': 'Close',
      children: html('<span>×</span>'),
    });
    expect(off.container.querySelector('.seat')).toBeNull();
  });
});
