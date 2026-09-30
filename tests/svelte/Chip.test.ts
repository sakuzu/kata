import { fireEvent, render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Chip from '../../src/svelte/components/Chip.svelte';
import { setMessages } from '../../src/svelte/messages.js';

const text = (t: string) => createRawSnippet(() => ({ render: () => `<span>${t}</span>` }));

describe('Chip', () => {
  afterEach(() => setMessages({}, { reset: true }));

  it('shows no ✕ without onremove, and nothing to press', () => {
    const { queryAllByRole } = render(Chip, { children: text('Public') });
    expect(queryAllByRole('button')).toHaveLength(0);
  });

  it('removes the value with the ✕, named by the message', async () => {
    const onremove = vi.fn();
    const { getByRole } = render(Chip, { onremove, children: text('Public') });
    const x = getByRole('button', { name: 'Remove' });
    await fireEvent.click(x);
    expect(onremove).toHaveBeenCalledOnce();
  });

  it('takes the name of the ✕ from removeLabel or from the messages', () => {
    setMessages({ removeValue: '外す' });
    const a = render(Chip, { onremove: () => {}, children: text('A') });
    expect(a.getByRole('button').getAttribute('aria-label')).toBe('外す');
    const b = render(Chip, { onremove: () => {}, removeLabel: 'Drop A', children: text('A') });
    expect(b.getByRole('button', { name: 'Drop A' })).toBeTruthy();
  });

  it('makes the text pressable with onclick', async () => {
    const onclick = vi.fn();
    const { getByRole } = render(Chip, { onclick, children: text('Status is public') });
    await fireEvent.click(getByRole('button'));
    expect(onclick).toHaveBeenCalledOnce();
  });
});
