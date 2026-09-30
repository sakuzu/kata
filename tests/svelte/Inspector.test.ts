import { fireEvent, render } from '@testing-library/svelte';
import { createRawSnippet, tick } from 'svelte';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import InspectorFrame from '../../src/svelte/components/InspectorFrame.svelte';
import InspectorRow from '../../src/svelte/components/InspectorRow.svelte';
import InspectorSection from '../../src/svelte/components/InspectorSection.svelte';
import { setMessages } from '../../src/svelte/messages.js';

// jsdom has no ResizeObserver, which Panel and Tabs use
beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const html = (markup: string) => createRawSnippet(() => ({ render: () => markup }));

const tabs = [
  { id: 'style', label: 'Style' },
  { id: 'attributes', label: 'Attributes' },
];

describe('InspectorFrame', () => {
  afterEach(() => setMessages({}, { reset: true }));

  async function editName(getByRole: (role: string, o?: object) => HTMLElement, text: string) {
    await fireEvent.click(getByRole('button', { name: 'Name' }));
    await tick();
    const input = getByRole('textbox', { name: 'Name' }) as HTMLInputElement;
    await fireEvent.input(input, { target: { value: text } });
    return input;
  }

  it('commits the name with Enter, trimmed', async () => {
    const ontitle = vi.fn();
    const { getByRole } = render(InspectorFrame, {
      title: 'Plan',
      ontitle,
      children: html('<p>Content</p>'),
    });
    const input = await editName(getByRole, '  Final plan ');
    await fireEvent.keyDown(input, { key: 'Enter' });
    expect(ontitle).toHaveBeenCalledWith('Final plan');
  });

  it('restores the name with Escape, and after a name the application did not take', async () => {
    const ontitle = vi.fn();
    const { getByRole, container } = render(InspectorFrame, {
      title: 'Plan',
      ontitle,
      children: html('<p>Content</p>'),
    });
    let input = await editName(getByRole, 'Other');
    await fireEvent.keyDown(input, { key: 'Escape' });
    expect(ontitle).not.toHaveBeenCalled();
    expect(container.querySelector('h2, .ie')?.textContent).toContain('Plan');
    // title stays 'Plan': the committed name goes back to it
    input = await editName(getByRole, '');
    await fireEvent.keyDown(input, { key: 'Enter' });
    expect(ontitle).toHaveBeenCalledWith('');
    await tick();
    expect(getByRole('button', { name: 'Name' }).textContent).toContain('Plan');
  });

  it('shows the name as a title when it cannot be changed', () => {
    const { getByRole, queryByRole } = render(InspectorFrame, {
      title: 'Page 2',
      titleEditable: false,
      ontitle: () => {},
      subtitle: 'Page',
      children: html('<p>Content</p>'),
    });
    expect(getByRole('heading', { level: 2 }).textContent).toBe('Page 2');
    expect(queryByRole('button', { name: 'Add a name' })).toBeNull();
    expect(getByRole('region', { name: 'Page 2' }).textContent).toContain('Page');
  });

  it('switches the tab and reports it', async () => {
    const onselect = vi.fn();
    const { getByRole } = render(InspectorFrame, {
      title: 'Plan',
      tabs,
      onselect,
      children: html('<p>Content</p>'),
    });
    expect(getByRole('button', { name: 'Style' }).getAttribute('aria-current')).toBe('page');
    await fireEvent.click(getByRole('button', { name: 'Attributes' }));
    expect(onselect).toHaveBeenCalledWith('attributes');
    expect(getByRole('button', { name: 'Attributes' }).getAttribute('aria-current')).toBe('page');
  });

  it('closes with the close button, and takes its words from the messages API', async () => {
    setMessages({ addName: 'Namen hinzufügen', close: 'Schließen' });
    const onclose = vi.fn();
    const { getByRole } = render(InspectorFrame, {
      title: '',
      ontitle: () => {},
      onclose,
      children: html('<p>Content</p>'),
    });
    expect(getByRole('button', { name: 'Namen hinzufügen' }).textContent).toContain(
      'Namen hinzufügen',
    );
    await fireEvent.click(getByRole('button', { name: 'Schließen' }));
    expect(onclose).toHaveBeenCalled();
  });
});

describe('InspectorSection', () => {
  it('shows the title and the rows, and folds with the chevron', async () => {
    const ontoggle = vi.fn();
    const { getByRole, getByText, queryByText } = render(InspectorSection, {
      title: 'Stroke',
      collapsible: true,
      ontoggle,
      children: html('<p>Width</p>'),
    });
    expect(getByText('Stroke')).toBeTruthy();
    expect(getByText('Width')).toBeTruthy();
    const chevron = getByRole('button', { name: 'Collapse' });
    expect(chevron.getAttribute('aria-expanded')).toBe('true');
    await fireEvent.click(chevron);
    expect(ontoggle).toHaveBeenCalledWith(false);
    expect(queryByText('Width')).toBeNull();
    await fireEvent.click(getByRole('button', { name: 'Expand' }));
    expect(getByText('Width')).toBeTruthy();
  });

  it('has no chevron unless it is collapsible, and draws the actions of end', () => {
    const { queryByRole, getByRole } = render(InspectorSection, {
      title: 'Fill',
      end: html('<button type="button">Reset</button>'),
      children: html('<p>Colour</p>'),
    });
    expect(queryByRole('button', { name: 'Collapse' })).toBeNull();
    expect(getByRole('button', { name: 'Reset' })).toBeTruthy();
  });
});

describe('InspectorRow', () => {
  it('names the control with for, and shows the hint under the value', () => {
    const { getByRole, getByText } = render(InspectorRow, {
      label: 'Width',
      for: 'row-width',
      hint: 'On the screen.',
      children: html('<input id="row-width" />'),
    });
    expect(getByRole('textbox', { name: 'Width' }).id).toBe('row-width');
    expect(getByText('On the screen.')).toBeTruthy();
  });

  it('keeps the value at the end with align="end"', () => {
    const { container } = render(InspectorRow, {
      label: 'Visible',
      align: 'end',
      small: true,
      children: html('<input type="checkbox" role="switch" aria-label="Visible" />'),
    });
    expect(container.querySelector('.end [role="switch"]')).toBeTruthy();
    expect(container.querySelector('.inspector-row.small')).toBeTruthy();
  });
});
