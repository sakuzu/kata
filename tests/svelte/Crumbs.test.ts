import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Crumbs from '../../src/svelte/components/Crumbs.svelte';

const items = [
  { label: 'Team', href: '/team' },
  { label: 'Drafts', href: '/drafts' },
];

describe('Crumbs', () => {
  it('keeps the last place a link without aria-current when current is false', () => {
    const { getByRole, container } = render(Crumbs, { items, label: 'Location', current: false });
    const last = getByRole('link', { name: 'Drafts' });
    expect(last.getAttribute('href')).toBe('/drafts');
    expect(container.querySelector('[aria-current]')).toBeNull();

    // By default the last place is the current one, and not a link
    const other = render(Crumbs, { items, label: 'Trail' });
    expect(other.container.querySelector('a[href="/drafts"]')).toBeNull();
    expect(other.container.querySelector('[aria-current="page"]')?.textContent).toBe('Drafts');
  });
});
