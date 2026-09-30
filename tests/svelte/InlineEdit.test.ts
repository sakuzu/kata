import { fireEvent, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { describe, expect, it, vi } from 'vitest';
import InlineEdit from '../../src/svelte/components/InlineEdit.svelte';

describe('InlineEdit', () => {
  it('offers the action when empty and the text with a pencil when it has a value', () => {
    const empty = render(InlineEdit, { placeholder: 'Add a description', onCommit: () => {} });
    expect(empty.container.querySelector('.add')?.textContent).toContain('Add a description');
    const named = render(InlineEdit, {
      value: 'Plan',
      placeholder: 'Add a name',
      onCommit: () => {},
    });
    expect(named.container.querySelector('.pen')).not.toBeNull();
  });

  it('shows the text alone when not editable, and nothing when empty', () => {
    const read = render(InlineEdit, {
      value: 'Plan',
      editable: false,
      placeholder: 'Name',
      onCommit: () => {},
    });
    expect(read.container.querySelector('button')).toBeNull();
    expect(read.container.textContent).toContain('Plan');
    const none = render(InlineEdit, { editable: false, placeholder: 'Name', onCommit: () => {} });
    expect(none.container.textContent?.trim()).toBe('');
  });

  it('commits a changed value with Enter, trimmed', async () => {
    const onCommit = vi.fn();
    const { getByRole } = render(InlineEdit, { value: 'Plan', placeholder: 'Name', onCommit });
    await fireEvent.click(getByRole('button', { name: 'Name' }));
    await tick();
    const input = getByRole('textbox', { name: 'Name' }) as HTMLInputElement;
    await fireEvent.input(input, { target: { value: '  Final plan ' } });
    await fireEvent.keyDown(input, { key: 'Enter' });
    expect(onCommit).toHaveBeenCalledWith('Final plan');
  });

  it('does not commit an unchanged value or one restored with Escape', async () => {
    const onCommit = vi.fn();
    const { getByRole, container } = render(InlineEdit, {
      value: 'Plan',
      placeholder: 'Name',
      onCommit,
    });
    await fireEvent.click(getByRole('button', { name: 'Name' }));
    await tick();
    await fireEvent.keyDown(getByRole('textbox'), { key: 'Enter' });
    expect(onCommit).not.toHaveBeenCalled();

    await fireEvent.click(getByRole('button', { name: 'Name' }));
    await tick();
    const input = getByRole('textbox') as HTMLInputElement;
    await fireEvent.input(input, { target: { value: 'Other' } });
    await fireEvent.keyDown(input, { key: 'Escape' });
    await fireEvent.blur(input);
    expect(onCommit).not.toHaveBeenCalled();
    expect(container.textContent).toContain('Plan');
  });

  it('adds a line with Enter when multiline, and commits with Ctrl+Enter', async () => {
    const onCommit = vi.fn();
    const { getByRole } = render(InlineEdit, {
      value: 'A',
      multiline: true,
      placeholder: 'Notes',
      onCommit,
    });
    await fireEvent.click(getByRole('button', { name: 'Notes' }));
    await tick();
    const area = getByRole('textbox') as HTMLTextAreaElement;
    await fireEvent.input(area, { target: { value: 'A\nB' } });
    await fireEvent.keyDown(area, { key: 'Enter' });
    expect(onCommit).not.toHaveBeenCalled();
    await fireEvent.keyDown(area, { key: 'Enter', ctrlKey: true });
    expect(onCommit).toHaveBeenCalledWith('A\nB');
  });
});
