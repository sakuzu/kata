import { fireEvent, render } from '@testing-library/svelte';
import { createRawSnippet, tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Popover from '../../src/svelte/components/Popover.svelte';
import Tooltip from '../../src/svelte/components/Tooltip.svelte';

const html = (markup: string) => createRawSnippet(() => ({ render: () => markup }));
const tipOf = () => document.body.querySelector<HTMLElement>(':scope > .tip');

describe('Tooltip', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('shows on hover after a wait, outside its container, and hides on leaving', async () => {
    const { container } = render(Tooltip, {
      text: 'Undo',
      shortcut: '⌘Z',
      role: 'box',
      children: html('<button aria-label="Undo">↶</button>'),
    });
    const seat = container.querySelector('.seat') as HTMLElement;
    await fireEvent.pointerEnter(seat);
    await tick();
    expect(tipOf()).toBeNull();
    vi.advanceTimersByTime(400);
    await tick();
    const tip = tipOf();
    expect(tip?.textContent).toContain('Undo');
    expect(tip?.textContent).toContain('⌘Z');
    expect(tip?.getAttribute('aria-hidden')).toBe('true');
    expect(seat.contains(tip)).toBe(false);
    await fireEvent.pointerLeave(seat);
    await tick();
    expect(tipOf()).toBeNull();
  });

  it('does not show when the pointer only passes by', async () => {
    const { container } = render(Tooltip, { text: 'Share', children: html('<button>S</button>') });
    const seat = container.querySelector('.seat') as HTMLElement;
    await fireEvent.pointerEnter(seat);
    vi.advanceTimersByTime(200);
    await fireEvent.pointerLeave(seat);
    vi.advanceTimersByTime(400);
    await tick();
    expect(tipOf()).toBeNull();
  });

  it('hides at once on a press', async () => {
    const { container } = render(Tooltip, { text: 'Share', children: html('<button>S</button>') });
    const seat = container.querySelector('.seat') as HTMLElement;
    await fireEvent.pointerEnter(seat);
    vi.advanceTimersByTime(400);
    await tick();
    expect(tipOf()).not.toBeNull();
    await fireEvent.pointerDown(seat);
    await tick();
    expect(tipOf()).toBeNull();
  });

  it('shows nothing without a word', async () => {
    const { container } = render(Tooltip, { text: '  ', children: html('<button>S</button>') });
    await fireEvent.pointerEnter(container.querySelector('.seat') as HTMLElement);
    vi.advanceTimersByTime(400);
    await tick();
    expect(tipOf()).toBeNull();
  });

  it('is always shown beside its control when inline', () => {
    const { container } = render(Tooltip, {
      text: 'Share',
      inline: true,
      children: html('<button>S</button>'),
    });
    expect(container.querySelector('.tip')?.textContent).toBe('Share');
  });
});

describe('Popover', () => {
  it('opens its Bubble from the trigger and closes with Escape', async () => {
    const anchor = createRawSnippet((toggle: () => () => void) => ({
      render: () => '<button>Snapping</button>',
      setup: (el: Element) => {
        el.addEventListener('click', () => toggle()());
      },
    }));
    // anchor is also an option of render, so the props go under props
    const { getByRole, container } = render(Popover, {
      props: { anchor, children: html('<p>Vertices</p>') },
    });
    await fireEvent.click(getByRole('button', { name: 'Snapping' }));
    await tick();
    expect(container.querySelector('[data-role="popover"]')?.textContent).toContain('Vertices');
    await fireEvent.keyDown(window, { key: 'Escape' });
    await tick();
    expect(container.querySelector('[data-role="popover"]')).toBeNull();
  });
});
