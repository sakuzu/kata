import { fireEvent, render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it, vi } from 'vitest';
import ColHead from '../../src/svelte/components/ColHead.svelte';

const text = (t: string) => createRawSnippet(() => ({ render: () => `<span>${t}</span>` }));

describe('ColHead', () => {
  it('is plain text without onsort', () => {
    const { queryByRole, container } = render(ColHead, { children: text('Name') });
    expect(queryByRole('button')).toBeNull();
    expect(container.textContent).toContain('Name');
  });

  it('asks for the first direction when the column is not the sort key', async () => {
    const onsort = vi.fn();
    const a = render(ColHead, { onsort, children: text('Name') });
    await fireEvent.click(a.getByRole('button', { name: 'Name' }));
    expect(onsort).toHaveBeenLastCalledWith('asc');
    const b = render(ColHead, { onsort, first: 'desc', children: text('Updated') });
    await fireEvent.click(b.getByRole('button', { name: 'Updated' }));
    expect(onsort).toHaveBeenLastCalledWith('desc');
  });

  it('turns the direction of the sort key around, and shows it', async () => {
    const onsort = vi.fn();
    const asc = render(ColHead, { dir: 'asc', onsort, children: text('Name') });
    expect(asc.container.querySelector('.mark.asc')).not.toBeNull();
    await fireEvent.click(asc.getByRole('button', { name: 'Name' }));
    expect(onsort).toHaveBeenLastCalledWith('desc');
    const desc = render(ColHead, { dir: 'desc', onsort, children: text('Size') });
    expect(desc.container.querySelector('.mark:not(.asc)')).not.toBeNull();
    await fireEvent.click(desc.getByRole('button', { name: 'Size' }));
    expect(onsort).toHaveBeenLastCalledWith('asc');
  });

  it('sorts merged columns by their ids, and leaves a name that cannot be sorted alone', async () => {
    const onsortKey = vi.fn();
    const { getAllByRole, container } = render(ColHead, {
      sorts: [
        { id: 'name', label: 'Name', dir: 'asc' },
        { id: 'updated', label: 'Updated', first: 'desc' },
        { id: 'kind', label: 'Kind', sortable: false },
      ],
      onsortKey,
    });
    const buttons = getAllByRole('button');
    expect(buttons).toHaveLength(2);
    await fireEvent.click(buttons[0]);
    expect(onsortKey).toHaveBeenLastCalledWith('name', 'desc');
    await fireEvent.click(buttons[1]);
    expect(onsortKey).toHaveBeenLastCalledWith('updated', 'desc');
    expect(container.textContent).toContain('Kind');
  });
});

describe('ColHead column menu', () => {
  it('sorts from the menu and clears the sort of the key', async () => {
    const onsort = vi.fn();
    const { getByRole, findByRole } = render(ColHead, {
      dir: 'asc',
      onsort,
      children: text('Name'),
    });
    await fireEvent.click(getByRole('button', { name: 'Actions' }));
    await fireEvent.click(await findByRole('menuitem', { name: 'Sort descending' }));
    expect(onsort).toHaveBeenLastCalledWith('desc');
    await fireEvent.click(getByRole('button', { name: 'Actions' }));
    await fireEvent.click(await findByRole('menuitem', { name: 'Clear the sort' }));
    expect(onsort).toHaveBeenLastCalledWith(null);
  });

  it('has no menu for a column that cannot be sorted and has no items', () => {
    const { queryByRole } = render(ColHead, { children: text('Kind') });
    expect(queryByRole('button', { name: 'Actions' })).toBeNull();
  });
});
