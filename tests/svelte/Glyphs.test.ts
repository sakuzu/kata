import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import Glyphs from '../../src/svelte/components/Glyphs.svelte';

describe('Glyphs', () => {
  it('marks the selected cell and reports a press', async () => {
    const onselect = vi.fn();
    const { getAllByRole } = render(Glyphs, {
      items: ['★', '●', '★'],
      value: '●',
      onselect,
      label: (_g: string, i: number) => `Symbol ${i + 1}`,
    });
    const cells = getAllByRole('button');
    expect(cells.map((c) => c.getAttribute('aria-pressed'))).toEqual(['false', 'true', 'false']);
    expect(cells[2].getAttribute('aria-label')).toBe('Symbol 3');
    await fireEvent.click(cells[2]);
    expect(onselect).toHaveBeenCalledWith('★', 2);
  });

  it('lets the caller decide what is selected, so repeated characters stay apart', () => {
    const { getAllByRole } = render(Glyphs, {
      items: ['★', '★'],
      onselect: () => {},
      selected: (_g: string, i: number) => i === 1,
    });
    expect(getAllByRole('button').map((c) => c.getAttribute('aria-pressed'))).toEqual([
      'false',
      'true',
    ]);
  });
});
