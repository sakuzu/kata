import { fireEvent, render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it, vi } from 'vitest';
import Gtile from '../../src/svelte/components/Gtile.svelte';

const text = (t: string) => createRawSnippet(() => ({ render: () => `<span>${t}</span>` }));

describe('Gtile', () => {
  it('is pressed as a whole, by the element that covers it', async () => {
    const onclick = vi.fn();
    const { getByRole } = render(Gtile, { onclick, label: 'Plan', children: text('Plan') });
    await fireEvent.click(getByRole('button', { name: 'Plan' }));
    expect(onclick).toHaveBeenCalledOnce();
  });

  it('is a link with href, and keeps its actions outside the pressed element', () => {
    const actions = createRawSnippet(() => ({ render: () => '<button>More</button>' }));
    const { container } = render(Gtile, {
      href: '/d/1',
      label: 'Plan',
      actions,
      children: text('Plan'),
    });
    const press = container.querySelector('a.press');
    expect(press?.getAttribute('href')).toBe('/d/1');
    expect(press?.querySelector('button')).toBeNull();
    expect(container.querySelector('.actions button')?.textContent).toBe('More');
  });
});
