import { fireEvent, render } from '@testing-library/svelte';
import { createRawSnippet, tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CommentComposer from '../../src/svelte/components/CommentComposer.svelte';
import CommentList, { type CommentThread } from '../../src/svelte/components/CommentList.svelte';
import { setMessages } from '../../src/svelte/messages.js';

const threads: CommentThread[] = [
  {
    id: 't1',
    author: { name: 'Sam Taylor', initial: 'ST', color: '#6f86e6' },
    when: '5 minutes ago',
    body: 'Move the title?',
    replies: [
      { id: 'r1', author: { name: 'Kai Morgan', initial: 'KM' }, when: 'now', body: 'Yes.' },
    ],
  },
  {
    id: 't2',
    author: { name: 'Ana Ruiz', initial: 'AR' },
    when: 'Yesterday',
    body: 'Done.',
    resolved: true,
  },
];

describe('CommentList', () => {
  afterEach(() => setMessages({}, { reset: true }));

  it('draws each thread as a comment with its replies under it', () => {
    const { getAllByRole, container } = render(CommentList, { threads });
    expect(getAllByRole('listitem')).toHaveLength(2);
    expect(container.querySelectorAll('[data-role="comment"]')).toHaveLength(3);
    expect(container.textContent).toContain('Yes.');
    expect(getAllByRole('separator')).toHaveLength(1);
  });

  it('opens a thread and resolves or reopens it', async () => {
    const onopen = vi.fn();
    const onresolve = vi.fn();
    const { getAllByRole, getByRole } = render(CommentList, { threads, onopen, onresolve });
    await fireEvent.click(getAllByRole('button', { name: 'Open' })[1]);
    expect(onopen).toHaveBeenCalledWith('t2');
    await fireEvent.click(getByRole('button', { name: 'Resolve' }));
    expect(onresolve).toHaveBeenCalledWith('t1', true);
    await fireEvent.click(getByRole('button', { name: 'Reopen' }));
    expect(onresolve).toHaveBeenLastCalledWith('t2', false);
  });

  it('shows a badge on a resolved thread that cannot be reopened, and an empty state', () => {
    const read = render(CommentList, { threads });
    expect(read.queryByRole('button')).toBeNull();
    expect(read.container.textContent).toContain('Resolved');
    setMessages({ noComments: 'Keine Kommentare.' });
    const empty = render(CommentList, { threads: [] });
    expect(empty.container.textContent).toContain('Keine Kommentare.');
  });
});

describe('CommentList folded', () => {
  it('draws one row for each thread, which calls onopen when pressed', async () => {
    const onopen = vi.fn();
    const { getAllByRole, container } = render(CommentList, { threads, folded: true, onopen });
    const rows = getAllByRole('button');
    expect(rows).toHaveLength(2);
    expect(container.querySelectorAll('[data-role="comment"]')).toHaveLength(0);
    expect(container.textContent).not.toContain('Yes.');
    expect(container.textContent).toContain('Resolved');
    await fireEvent.click(rows[1]);
    expect(onopen).toHaveBeenCalledWith('t2');
    // Without onopen the rows are not pressed
    const read = render(CommentList, { threads, folded: true });
    expect(read.container.querySelector('[role="button"]')).toBeNull();
  });

  it('writes the byline as the name and the time unless the thread has its own', () => {
    const { container } = render(CommentList, {
      threads: [threads[0], { ...threads[1], byline: 'Ana · 3 replies' }],
      folded: true,
    });
    const lines = [...container.querySelectorAll('[data-role="caption"]')].map(
      (el) => el.textContent,
    );
    expect(lines).toEqual(['Sam Taylor · 5 minutes ago', 'Ana · 3 replies']);
  });
});

describe('CommentList actions', () => {
  it('draws the actions of a thread before resolve and open', () => {
    const more = createRawSnippet((t: () => CommentThread) => ({
      render: () => `<button type="button" aria-label="More of ${t().id}">⋯</button>`,
    }));
    const { container } = render(CommentList, {
      threads,
      onopen: () => {},
      onresolve: () => {},
      actions: more as never,
    });
    const first = container.querySelector('[data-role="comment"]') as HTMLElement;
    const names = [...first.querySelectorAll('button')].map((b) => b.getAttribute('aria-label'));
    expect(names).toEqual(['More of t1', 'Resolve', 'Open']);
  });
});

describe('CommentComposer', () => {
  it('posts the trimmed text with Enter and clears it; Shift+Enter does not post', async () => {
    const onpost = vi.fn();
    const { getByRole } = render(CommentComposer, { onpost });
    const box = getByRole('textbox', { name: 'Write a comment' }) as HTMLTextAreaElement;
    const button = getByRole('button', { name: 'Post' });
    expect(button.hasAttribute('disabled') || button.getAttribute('aria-disabled') === 'true').toBe(
      true,
    );
    await fireEvent.keyDown(box, { key: 'Enter' });
    expect(onpost).not.toHaveBeenCalled();
    await fireEvent.input(box, { target: { value: '  Looks good  ' } });
    await fireEvent.keyDown(box, { key: 'Enter', shiftKey: true });
    expect(onpost).not.toHaveBeenCalled();
    await fireEvent.keyDown(box, { key: 'Enter' });
    await tick();
    expect(onpost).toHaveBeenCalledWith('Looks good');
    await tick();
    expect(box.value).toBe('');
  });

  it('keeps the text when the post fails, and posts with the button', async () => {
    const onpost = vi.fn(async () => false);
    const { getByRole } = render(CommentComposer, {
      onpost,
      placeholder: 'Reply',
      submitLabel: 'Send',
    });
    const box = getByRole('textbox', { name: 'Reply' }) as HTMLTextAreaElement;
    await fireEvent.input(box, { target: { value: 'Again' } });
    await fireEvent.click(getByRole('button', { name: 'Send' }));
    await tick();
    await tick();
    expect(onpost).toHaveBeenCalledWith('Again');
    expect(box.value).toBe('Again');
  });

  it('does not post while a character is being composed, and cancels with Escape', async () => {
    const onpost = vi.fn();
    const oncancel = vi.fn();
    const { getByRole } = render(CommentComposer, { onpost, oncancel });
    const box = getByRole('textbox');
    await fireEvent.input(box, { target: { value: 'か' } });
    await fireEvent.keyDown(box, { key: 'Enter', isComposing: true });
    expect(onpost).not.toHaveBeenCalled();
    await fireEvent.keyDown(box, { key: 'Escape' });
    expect(oncancel).toHaveBeenCalledOnce();
  });
});
