import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import Pin from '../../src/svelte/components/Pin.svelte';
import Spinner from '../../src/svelte/components/Spinner.svelte';
import State from '../../src/svelte/components/State.svelte';

const text = (t: string) => createRawSnippet(() => ({ render: () => `<span>${t}</span>` }));

describe('State', () => {
  it('shows the sentence and the note', () => {
    const { container } = render(State, { text: 'Nothing is here yet.', note: 'Drop a file.' });
    expect(container.querySelector('p')?.textContent).toBe('Nothing is here yet.');
    expect(container.querySelector('.note')?.textContent).toBe('Drop a file.');
  });

  it('shows a failure in red and loading as a spinner', () => {
    const failed = render(State, { text: 'It failed.', tone: 'error' });
    expect(failed.container.querySelector('p.error')).not.toBeNull();
    const loading = render(State, { text: 'Loading', loading: true });
    expect(loading.container.querySelector('p')).toBeNull();
    expect(loading.getByRole('status').textContent).toBe('Loading');
  });
});

describe('Spinner', () => {
  it('shows three dots, and the label when it has one', () => {
    const { container } = render(Spinner, {});
    expect(container.querySelectorAll('.dots i')).toHaveLength(3);
    expect(container.querySelector('.t')).toBeNull();
  });
});

describe('Pin', () => {
  it('is a button with a name when it has onclick, and shows the selection', () => {
    const { getByRole } = render(Pin, {
      label: 'A comment',
      onclick: () => {},
      active: true,
      children: text('SA'),
    });
    expect(getByRole('button', { name: 'A comment' }).getAttribute('aria-pressed')).toBe('true');
  });

  it('is only read without onclick, and shows the count of the others', () => {
    const { queryByRole, container } = render(Pin, { more: '+2', children: text('SA') });
    expect(queryByRole('button')).toBeNull();
    expect(container.querySelector('.more')?.textContent).toBe('+2');
  });
});
