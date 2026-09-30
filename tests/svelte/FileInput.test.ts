import { fireEvent, render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it, vi } from 'vitest';
import Field from '../../src/svelte/components/Field.svelte';
import FileInput from '../../src/svelte/components/FileInput.svelte';

describe('FileInput', () => {
  it('renders one hidden input and reports the chosen files as an array', async () => {
    const onpick = vi.fn();
    const { container } = render(FileInput, { accept: '.png', multiple: true, onpick });
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input.hidden).toBe(true);
    expect(input.accept).toBe('.png');
    expect(input.multiple).toBe(true);
    const file = new File(['x'], 'a.png', { type: 'image/png' });
    Object.defineProperty(input, 'files', { value: [file], configurable: true });
    await fireEvent.change(input);
    expect(onpick).toHaveBeenCalledWith([file]);
  });

  it('opens the chooser from pick()', () => {
    const { component, container } = render(FileInput, {});
    const input = container.querySelector('input') as HTMLInputElement;
    const click = vi.spyOn(input, 'click');
    (component as unknown as { pick: () => void }).pick();
    expect(click).toHaveBeenCalledOnce();
  });
});

describe('Field', () => {
  const control = createRawSnippet(() => ({ render: () => '<input id="name" />' }));

  it('names the control and shows the error in place of the note', () => {
    const { container, getByText } = render(Field, {
      label: 'Name',
      for: 'name',
      note: 'Shown to everyone',
      error: 'A name is needed',
      children: control,
    });
    expect(container.querySelector('label')?.getAttribute('for')).toBe('name');
    expect(getByText('A name is needed').id).toBe('name-note');
    expect(container.textContent).not.toContain('Shown to everyone');
  });
});
