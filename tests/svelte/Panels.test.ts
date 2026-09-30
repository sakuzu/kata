import { fireEvent, render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import SearchPanel, { type SearchGroup } from '../../src/svelte/components/SearchPanel.svelte';
import SelectionSummary from '../../src/svelte/components/SelectionSummary.svelte';
import VersionsPanel from '../../src/svelte/components/VersionsPanel.svelte';
import { setMessages } from '../../src/svelte/messages.js';

// jsdom has no ResizeObserver, which Panel's measured height needs
beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const html = (markup: string) => createRawSnippet(() => ({ render: () => markup }));

const groups: SearchGroup[] = [
  {
    label: 'Shapes',
    items: [
      { id: 's1', label: 'Front entrance', hint: 'Page 1' },
      { id: 's2', label: 'Loading bay', hint: 'Page 2' },
    ],
  },
  { label: 'Notes', items: [{ id: 'n1', label: 'Check the doors' }] },
];

const names = (el: HTMLElement) =>
  [...el.querySelectorAll('[role="button"]')].map((b) => b.textContent?.trim().split('\n')[0]);

describe('SearchPanel', () => {
  afterEach(() => setMessages({}, { reset: true }));

  it('keeps the results that contain the query, in their name or hint, ignoring case', async () => {
    const onquery = vi.fn();
    const { getByRole, queryByText, container } = render(SearchPanel, { groups, onquery });
    expect(names(container)).toHaveLength(3);
    const input = getByRole('searchbox', { name: 'Search' }) as HTMLInputElement;
    await fireEvent.input(input, { target: { value: 'PAGE 2' } });
    expect(onquery).toHaveBeenLastCalledWith('PAGE 2');
    expect(container.textContent).toContain('Loading bay');
    expect(queryByText('Front entrance')).toBeNull();
    // A group left empty is hidden
    expect(queryByText('Notes')).toBeNull();
    await fireEvent.input(input, { target: { value: 'stairs' } });
    expect(container.textContent).toContain('Nothing matches.');
  });

  it('reports the result that is pressed, and picks the first with Enter', async () => {
    const onpick = vi.fn();
    const { getByRole, getByText } = render(SearchPanel, { groups, onpick, query: 'check' });
    await fireEvent.click(getByText('Check the doors'));
    expect(onpick).toHaveBeenCalledWith('n1');
    await fireEvent.keyDown(getByRole('searchbox'), { key: 'Enter' });
    expect(onpick).toHaveBeenLastCalledWith('n1');
  });

  it('clears the query with Escape', async () => {
    const onquery = vi.fn();
    const { getByRole } = render(SearchPanel, { groups, onquery, query: 'bay' });
    const input = getByRole('searchbox') as HTMLInputElement;
    await fireEvent.keyDown(input, { key: 'Escape' });
    expect(onquery).toHaveBeenCalledWith('');
    expect(input.value).toBe('');
  });

  it('leaves the results to the application without filter, and shows the hint', () => {
    const { container, getByText } = render(SearchPanel, {
      groups: [],
      filter: false,
      hint: 'Type to search.',
    });
    expect(getByText('Type to search.')).toBeTruthy();
    const all = render(SearchPanel, { groups, filter: false, query: 'zzz' });
    expect(names(all.container)).toHaveLength(3);
    expect(container.textContent).not.toContain('Nothing matches.');
  });

  it('takes its words from the messages API', () => {
    setMessages({ search: 'Suchen', noMatches: 'Nichts gefunden.' });
    const { getByRole, getByText } = render(SearchPanel, { groups, query: 'zzz' });
    expect(getByRole('heading', { name: 'Suchen' })).toBeTruthy();
    expect(getByText('Nichts gefunden.')).toBeTruthy();
  });
});

describe('VersionsPanel', () => {
  const versions = [
    { id: 'v3', label: 'Autosaved', when: 'Now', by: 'Ada' },
    { id: 'v2', label: 'Before the review', when: 'Today', by: 'Grace' },
    { id: 'v1', label: 'First draft', when: 'Yesterday', by: 'Ada' },
  ];

  it('previews the version that is pressed and marks the current one', async () => {
    const onpreview = vi.fn();
    const { getByText, getByRole } = render(VersionsPanel, { versions, current: 'v3', onpreview });
    expect(getByText('Autosaved').closest('[role="button"]')?.getAttribute('aria-current')).toBe(
      'true',
    );
    await fireEvent.click(getByText('First draft'));
    expect(onpreview).toHaveBeenCalledWith('v1');
    expect(getByText('Today · Grace')).toBeTruthy();
    // The latest is shown: nothing to restore
    expect(() => getByRole('button', { name: 'Restore' })).toThrow();
  });

  it('offers to restore a past version, or to go back to the latest', async () => {
    const onpreview = vi.fn();
    const onrestore = vi.fn();
    const { getByRole } = render(VersionsPanel, {
      versions,
      current: 'v2',
      onpreview,
      onrestore,
    });
    await fireEvent.click(getByRole('button', { name: 'Restore' }));
    expect(onrestore).toHaveBeenCalledWith('v2');
    await fireEvent.click(getByRole('button', { name: 'Back to the latest' }));
    expect(onpreview).toHaveBeenCalledWith('v3');
  });

  it('says when there is no version', () => {
    const { getByText } = render(VersionsPanel, { versions: [] });
    expect(getByText('No versions yet.')).toBeTruthy();
  });
});

describe('SelectionSummary', () => {
  it('titles the panel with the count and shows each kind with its count', () => {
    const { getByRole, getByText } = render(SelectionSummary, {
      count: 5,
      kinds: [
        { label: 'Shapes', count: 3 },
        { label: 'Notes', count: 2 },
      ],
      fields: html('<p>Fill</p>'),
      actions: html('<button>Group</button>'),
    });
    expect(getByRole('heading', { name: '5 selected' })).toBeTruthy();
    expect(getByText('Shapes').closest('[data-role="stat"]')?.textContent).toContain('3');
    expect(getByText('Fill')).toBeTruthy();
    expect(getByRole('button', { name: 'Group' })).toBeTruthy();
  });

  it('closes with the close button', async () => {
    const onclose = vi.fn();
    const { getByRole } = render(SelectionSummary, { count: 2, onclose });
    await fireEvent.click(getByRole('button', { name: 'Close' }));
    expect(onclose).toHaveBeenCalled();
  });
});
