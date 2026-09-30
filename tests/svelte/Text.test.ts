import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import Text from '../../src/svelte/components/Text.svelte';

const words = createRawSnippet(() => ({ render: () => '<span>Words</span>' }));

describe('Text', () => {
  it.each([
    ['h1', 'H1', 'h1'],
    ['title', 'H1', 'title'],
    ['h2', 'H2', 'h2'],
    ['body', 'P', 'p'],
    ['prose', 'P', 'p'],
    ['caption', 'SPAN', 'caption'],
    ['label', 'SPAN', 'label'],
  ] as const)('renders the role %s as %s', (role, tag, dataRole) => {
    const { container } = render(Text, { role, children: words });
    const el = container.querySelector('.kata-text');
    expect(el?.tagName).toBe(tag);
    expect(el?.getAttribute('data-role')).toBe(dataRole);
  });

  it('takes another element with as, and href only on a link', () => {
    const { container } = render(Text, { as: 'a', href: '/files/1', children: words });
    expect(container.querySelector('a.kata-text')?.getAttribute('href')).toBe('/files/1');
    const label = render(Text, { as: 'label', for: 'name', href: '/x', children: words });
    const el = label.container.querySelector('label.kata-text');
    expect(el?.getAttribute('for')).toBe('name');
    expect(el?.hasAttribute('href')).toBe(false);
  });
});
