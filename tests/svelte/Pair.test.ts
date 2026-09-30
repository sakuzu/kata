import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import Kv from '../../src/svelte/components/Kv.svelte';
import Pair from '../../src/svelte/components/Pair.svelte';

const text = (t: string) => createRawSnippet(() => ({ render: () => `<span>${t}</span>` }));

describe('Pair', () => {
  it('declares the height of a button when the value is a control', () => {
    const { container } = render(Pair, { label: 'Width', children: text('control') });
    expect(container.querySelector('[data-role="pair"]')?.getAttribute('data-h')).toBe('button');
  });

  it('declares no height when read, on several lines or with a note', () => {
    for (const props of [{ read: true }, { top: true }, { note: 'In pixels' }]) {
      const { container } = render(Pair, { label: 'Width', children: text('4'), ...props });
      expect(container.querySelector('[data-role="pair"]')?.hasAttribute('data-h')).toBe(false);
    }
  });

  it('labels its control with for, and links its name with href', () => {
    const a = render(Pair, { label: 'Width', for: 'w', children: text('x') });
    expect(a.container.querySelector('label')?.getAttribute('for')).toBe('w');
    const b = render(Pair, { label: 'Part 2', href: '#part-2', read: true, children: text('x') });
    expect(b.container.querySelector('a')?.getAttribute('href')).toBe('#part-2');
  });
});

describe('Kv', () => {
  it('renders one read pair per item', () => {
    const { container } = render(Kv, {
      items: [
        { k: 'Length', v: '13.1 km' },
        { k: 'ID', v: 'ab12', mono: true },
      ],
    });
    const pairs = container.querySelectorAll('[data-role="pair"]');
    expect(pairs).toHaveLength(2);
    expect(pairs[1].querySelector('.v')?.textContent).toBe('ab12');
    expect(pairs[1].querySelector('.v')?.classList.contains('mono')).toBe(true);
  });
});
