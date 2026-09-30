import { fireEvent, render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it, vi } from 'vitest';
import Disclosure from '../../src/svelte/components/Disclosure.svelte';

const children = createRawSnippet(() => ({ render: () => '<p>The content</p>' }));

describe('Disclosure', () => {
  it('is closed by default and shows the value in its head', () => {
    const { getByRole, queryByText } = render(Disclosure, {
      title: 'Grid',
      value: 'On',
      children,
    });
    const head = getByRole('button', { name: /Grid/ });
    expect(head.getAttribute('aria-expanded')).toBe('false');
    expect(head.textContent).toContain('On');
    expect(queryByText('The content')).toBeNull();
  });

  it('opens and closes when its head is pressed, and reports the state', async () => {
    const ontoggle = vi.fn();
    const { getByRole, getByText, queryByText } = render(Disclosure, {
      title: 'Grid',
      ontoggle,
      children,
    });
    const head = getByRole('button', { name: /Grid/ });
    await fireEvent.click(head);
    expect(head.getAttribute('aria-expanded')).toBe('true');
    const body = getByText('The content').closest('[id]');
    expect(head.getAttribute('aria-controls')).toBe(body?.id);
    await fireEvent.click(head);
    expect(queryByText('The content')).toBeNull();
    expect(ontoggle.mock.calls).toEqual([[true], [false]]);
  });

  it('starts open with open', () => {
    const { getByText } = render(Disclosure, { title: 'Grid', open: true, children });
    expect(getByText('The content')).toBeTruthy();
  });
});
