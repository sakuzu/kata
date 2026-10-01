import { fireEvent, render } from '@testing-library/svelte';
import { createRawSnippet, tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Drawbar, {
  type DrawbarToggle,
  type DrawbarTool,
} from '../../src/svelte/components/Drawbar.svelte';
import { fitBar } from '../../src/svelte/lib/fitBar.js';

const tools: DrawbarTool[] = [
  { id: 'select', label: 'Select', icon: 'point', kbd: 'V', group: 'pick' },
  { id: 'point', label: 'Point', icon: 'point', kbd: 'P', group: 'draw' },
  { id: 'line', label: 'Line', icon: 'polyline', kbd: 'L', group: 'draw' },
  { id: 'arrow', label: 'Arrow', icon: 'arrow', group: 'draw' },
  { id: 'shape', label: 'Shape', icon: 'polygon', group: 'draw' },
  { id: 'note', label: 'Note', icon: 'sticky-note', group: 'text' },
];

function toggle(id: string, on: boolean, onchange = vi.fn()): DrawbarToggle {
  return { id, label: id === 'snap' ? 'Snap' : 'Grid', icon: 'plus', on, onchange };
}

describe('fitBar', () => {
  const m = { button: 10, itemGap: 1, groupGap: 5, chrome: 4, available: 100 };

  it('returns null when every item fits', () => {
    // 3 groups of 2: 3 × (10 + 1 + 10) + 2 × 5 + 4 = 77
    expect(fitBar([0, 0, 1, 1, 2, 2], -1, m)).toBeNull();
  });

  it('keeps the given item, then the others from the start, with room for "More"', () => {
    const groups = [0, 1, 1, 1, 1, 1, 1, 2, 2];
    const shown = fitBar(groups, 6, { ...m, available: 60 });
    // 0 | 1 1 | More: 4 + 10 + 5 + 21 + 5 + 10 = 55; one more tool of group 1 would be 66
    expect(shown).toEqual([0, 1, 6]);
  });
});

describe('Drawbar', () => {
  afterEach(() => vi.restoreAllMocks());

  it('shows the switches after the tools, pressed when on, and reports the state asked for', async () => {
    const onchange = vi.fn();
    const { getByRole } = render(Drawbar, {
      label: 'Tools',
      tools,
      toggles: [toggle('snap', true, onchange), toggle('grid', false)],
      current: 'line',
    });
    const bar = getByRole('toolbar', { name: 'Tools' });
    const names = [...bar.querySelectorAll('button')].map((b) => b.getAttribute('aria-label'));
    expect(names).toEqual(['Select', 'Point', 'Line', 'Arrow', 'Shape', 'Note', 'Snap', 'Grid']);
    const snap = getByRole('button', { name: 'Snap' });
    expect(snap.getAttribute('aria-pressed')).toBe('true');
    expect(getByRole('button', { name: 'Grid' }).getAttribute('aria-pressed')).toBe('false');
    await fireEvent.click(snap);
    expect(onchange).toHaveBeenCalledWith(false);
  });

  it('opens the popover of a switch instead of reporting a state', async () => {
    const onchange = vi.fn();
    const popover = createRawSnippet(() => ({ render: () => '<p>Snap to vertices</p>' }));
    const { getByRole, queryByText, findByText } = render(Drawbar, {
      tools,
      toggles: [{ ...toggle('snap', true, onchange), popover }],
    });
    const snap = getByRole('button', { name: 'Snap' });
    expect(snap.getAttribute('aria-haspopup')).toBe('true');
    expect(snap.getAttribute('aria-expanded')).toBe('false');
    expect(snap.getAttribute('aria-pressed')).toBe('true');
    expect(queryByText('Snap to vertices')).toBeNull();
    await fireEvent.click(snap);
    await tick();
    expect(await findByText('Snap to vertices')).toBeTruthy();
    expect(snap.getAttribute('aria-expanded')).toBe('true');
    expect(onchange).not.toHaveBeenCalled();
  });

  it('marks the current tool and reports the tool that is pressed', async () => {
    const onselect = vi.fn();
    const { getByRole } = render(Drawbar, { tools, current: 'line', onselect });
    expect(getByRole('button', { name: 'Line' }).getAttribute('aria-pressed')).toBe('true');
    expect(getByRole('button', { name: 'Line' }).getAttribute('aria-keyshortcuts')).toBe('L');
    await fireEvent.click(getByRole('button', { name: 'Arrow' }));
    expect(onselect).toHaveBeenCalledWith('arrow');
  });

  describe('when the bar does not fit', () => {
    it('folds what does not fit into "More", keeping the current tool', async () => {
      // Every button is 40px wide and the container 200px: four buttons and "More" fit
      vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
        width: 40,
      } as DOMRect);
      vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(200);
      const onselect = vi.fn();
      const grid = vi.fn();
      const { getByRole, queryByRole, findByRole } = render(Drawbar, {
        label: 'Tools',
        tools,
        toggles: [toggle('snap', true), toggle('grid', false, grid)],
        current: 'note',
        onselect,
      });
      await tick();
      expect(getByRole('button', { name: 'Note' }).getAttribute('aria-pressed')).toBe('true');
      expect(getByRole('button', { name: 'Select' })).toBeTruthy();
      expect(queryByRole('button', { name: 'Shape' })).toBeNull();
      expect(queryByRole('button', { name: 'Grid' })).toBeNull();
      const more = getByRole('button', { name: 'More' });
      expect(more.getAttribute('aria-haspopup')).toBe('menu');

      await fireEvent.click(more);
      await findByRole('menu');
      await fireEvent.click(getByRole('menuitem', { name: 'Shape' }));
      expect(onselect).toHaveBeenCalledWith('shape');

      await fireEvent.click(getByRole('button', { name: 'More' }));
      await findByRole('menu');
      await fireEvent.click(getByRole('menuitem', { name: 'Grid' }));
      expect(grid).toHaveBeenCalledWith(true);
    });
  });
});
