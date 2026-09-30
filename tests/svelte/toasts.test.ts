import { fireEvent, render } from '@testing-library/svelte';
import { createRawSnippet, tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Banner from '../../src/svelte/components/Banner.svelte';
import Bulk from '../../src/svelte/components/Bulk.svelte';
import Note from '../../src/svelte/components/Note.svelte';
import ToastHost from '../../src/svelte/components/ToastHost.svelte';
import { setMessages } from '../../src/svelte/messages.js';
import { TOAST_DURATION, toast } from '../../src/svelte/toasts.svelte.js';

const html = (markup: string) => createRawSnippet(() => ({ render: () => markup }));

function clear() {
  for (const t of [...toast.items]) toast.dismiss(t.id);
}

describe('the toast store', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    clear();
    vi.useRealTimers();
  });

  it('holds toasts in order, with their kind', () => {
    toast.show('Saved');
    toast.error('The file could not be read');
    expect(toast.items.map((t) => [t.msg, t.kind])).toEqual([
      ['Saved', 'info'],
      ['The file could not be read', 'error'],
    ]);
  });

  it('removes each toast after its time', () => {
    toast.show('First');
    vi.advanceTimersByTime(TOAST_DURATION / 2);
    toast.show('Second');
    vi.advanceTimersByTime(TOAST_DURATION / 2);
    expect(toast.items.map((t) => t.msg)).toEqual(['Second']);
    vi.advanceTimersByTime(TOAST_DURATION / 2);
    expect(toast.items).toHaveLength(0);
  });

  it('dismisses a toast before its time', () => {
    const id = toast.show('Copied');
    toast.show('Moved');
    toast.dismiss(id);
    expect(toast.items.map((t) => t.msg)).toEqual(['Moved']);
  });
});

describe('ToastHost', () => {
  afterEach(() => {
    clear();
    setMessages({}, { reset: true });
  });

  it('shows nothing while the store is empty', () => {
    const { container } = render(ToastHost, {});
    expect(container.querySelector('[data-role="toast"]')).toBeNull();
  });

  it('shows the newest three, an error as an alert, and closes one', async () => {
    setMessages({ close: 'Schließen' });
    const { container, getAllByRole } = render(ToastHost, {});
    toast.show('One');
    toast.show('Two');
    toast.show('Three');
    toast.error('Four');
    await tick();
    const shown = [...container.querySelectorAll('[data-role="toast"]')];
    expect(shown.map((t) => t.textContent?.trim())).toEqual(['Two', 'Three', 'Four']);
    expect(shown[2].getAttribute('role')).toBe('alert');
    await fireEvent.click(getAllByRole('button', { name: 'Schließen' })[0]);
    await tick();
    expect(toast.items.map((t) => t.msg)).toEqual(['One', 'Three', 'Four']);
  });
});

describe('Banner, Note and Bulk', () => {
  it('announces a Banner as a status, or an alert for an error', () => {
    const info = render(Banner, { tone: 'info', children: html('<span>Synced</span>') });
    expect(info.getByRole('status').textContent).toContain('Synced');
    const error = render(Banner, { tone: 'error', children: html('<span>Failed</span>') });
    expect(error.getByRole('alert').textContent).toContain('Failed');
  });

  it('keeps a Note to one line with clamp', () => {
    const { container } = render(Note, { clamp: true, children: html('<span>A remark</span>') });
    expect(container.querySelector('p.clamp')?.textContent).toBe('A remark');
  });

  it('shows the count and the word of a Bulk bar', () => {
    const { container } = render(Bulk, { count: 4, label: 'selected' });
    expect(container.textContent?.replace(/\s+/g, ' ').trim()).toBe('4 selected');
  });
});
