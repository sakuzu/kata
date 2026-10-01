import { fireEvent, render } from '@testing-library/svelte';
import { createRawSnippet, tick } from 'svelte';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import AttributeList from '../../src/svelte/components/AttributeList.svelte';
import FieldList, { type FieldSpec } from '../../src/svelte/components/FieldList.svelte';
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

  it('shows the value in the head, also when it does not fold and while it is closed', async () => {
    const plain = render(InspectorSection, {
      title: 'Opacity',
      value: '80%',
      children: html('<p>Fill</p>'),
    });
    expect(plain.container.querySelector('[data-role="section-head"]')?.textContent).toContain(
      '80%',
    );
    plain.unmount();
    const { container, getByRole } = render(InspectorSection, {
      title: 'Shadow',
      value: '2 px',
      collapsible: true,
      children: html('<p>Blur</p>'),
    });
    await fireEvent.click(getByRole('button', { name: 'Collapse' }));
    expect(container.textContent).not.toContain('Blur');
    expect(container.querySelector('[data-role="section-head"]')?.textContent).toContain('2 px');
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

describe('FieldList', () => {
  const fields: FieldSpec[] = [
    { key: 'label', kind: 'text', label: 'Label', value: 'Gate' },
    { key: 'width', kind: 'number', label: 'Width', value: 2, unit: 'px' },
    {
      key: 'dash',
      kind: 'select',
      label: 'Style',
      value: 'solid',
      options: [
        { value: 'solid', label: 'Solid' },
        { value: 'dashed', label: 'Dashed' },
      ],
    },
    { key: 'fill', kind: 'color', label: 'Fill', value: '#E5484D' },
    { key: 'shadow', kind: 'toggle', label: 'Shadow', value: false },
    { key: 'opacity', kind: 'slider', label: 'Opacity', value: 40, unit: '%' },
    {
      key: 'cap',
      kind: 'segmented',
      label: 'Ends',
      value: 'butt',
      options: [
        { value: 'butt', label: 'Flat' },
        { value: 'round', label: 'Round' },
      ],
    },
    { key: 'mark', kind: 'custom', label: 'Marker', value: 'pin' },
  ];
  const field = createRawSnippet((spec: () => FieldSpec) => ({
    render: () => `<span>custom ${String(spec().value)}</span>`,
  }));

  it('draws each kind with its control, named by the label', () => {
    const { getByRole, getByText } = render(FieldList, { fields, field });
    expect((getByRole('textbox', { name: 'Label' }) as HTMLInputElement).value).toBe('Gate');
    expect((getByRole('spinbutton', { name: 'Width' }) as HTMLInputElement).value).toBe('2');
    expect((getByRole('combobox', { name: 'Style' }) as HTMLSelectElement).value).toBe('solid');
    expect(getByRole('button', { name: 'Fill' }).textContent).toContain('#E5484D');
    expect(getByRole('switch', { name: 'Shadow' })).toBeTruthy();
    expect(getByRole('slider', { name: 'Opacity' })).toBeTruthy();
    expect(getByText('40%')).toBeTruthy();
    expect(getByRole('group', { name: 'Ends' })).toBeTruthy();
    expect(getByText('custom pin')).toBeTruthy();
  });

  it('reports the change of each kind with its key', async () => {
    const onchange = vi.fn();
    const { getByRole } = render(FieldList, { fields, onchange, field });
    await fireEvent.change(getByRole('textbox', { name: 'Label' }), { target: { value: 'Door' } });
    expect(onchange).toHaveBeenLastCalledWith('label', 'Door');
    const width = getByRole('spinbutton', { name: 'Width' });
    await fireEvent.change(width, { target: { value: '3.5' } });
    expect(onchange).toHaveBeenLastCalledWith('width', 3.5);
    await fireEvent.change(width, { target: { value: '' } });
    expect(onchange).toHaveBeenLastCalledWith('width', null);
    await fireEvent.change(getByRole('combobox', { name: 'Style' }), {
      target: { value: 'dashed' },
    });
    expect(onchange).toHaveBeenLastCalledWith('dash', 'dashed');
    await fireEvent.click(getByRole('switch', { name: 'Shadow' }));
    expect(onchange).toHaveBeenLastCalledWith('shadow', true);
    const slider = getByRole('slider', { name: 'Opacity' });
    await fireEvent.input(slider, { target: { value: '60' } });
    expect(onchange).not.toHaveBeenCalledWith('opacity', 60);
    await fireEvent.change(slider, { target: { value: '60' } });
    expect(onchange).toHaveBeenLastCalledWith('opacity', 60);
    await fireEvent.click(getByRole('button', { name: 'Round' }));
    expect(onchange).toHaveBeenLastCalledWith('cap', 'round');
    await fireEvent.click(getByRole('button', { name: 'Fill' }));
    await tick();
    await fireEvent.click(getByRole('radio', { name: 'Blue' }));
    expect(onchange).toHaveBeenLastCalledWith('fill', '#2D7FF9');
  });

  it('follows a dragged slider with oninput, and reports it with onchange when let go', async () => {
    const onchange = vi.fn();
    const oninput = vi.fn();
    const { getByRole } = render(FieldList, { fields, onchange, oninput, field });
    const slider = getByRole('slider', { name: 'Opacity' });
    await fireEvent.input(slider, { target: { value: '55' } });
    await fireEvent.input(slider, { target: { value: '60' } });
    expect(oninput.mock.calls).toEqual([
      ['opacity', 55],
      ['opacity', 60],
    ]);
    expect(onchange).not.toHaveBeenCalled();
    await fireEvent.change(slider, { target: { value: '60' } });
    expect(onchange).toHaveBeenCalledWith('opacity', 60);
  });

  it('leaves the picker of a color to the application with oncolor', async () => {
    const oncolor = vi.fn();
    const { getByRole, queryByRole } = render(FieldList, { fields, oncolor, field });
    const fill = getByRole('button', { name: 'Fill' });
    expect(fill.textContent).toContain('#E5484D');
    expect(fill.hasAttribute('aria-expanded')).toBe(false);
    await fireEvent.click(fill);
    await tick();
    expect(oncolor).toHaveBeenCalledWith('fill');
    expect(queryByRole('radio', { name: 'Blue' })).toBeNull();
  });

  it('draws end as one row after the fields', () => {
    const { container, getByRole } = render(FieldList, {
      fields: fields.slice(0, 1),
      end: html('<button type="button">Reset</button>'),
    });
    const stack = container.querySelector('[data-role="stack"]');
    expect(stack?.lastElementChild?.contains(getByRole('button', { name: 'Reset' }))).toBe(true);
  });

  it('shows no value for a mixed field, and says Mixed', () => {
    const { getByRole, getAllByText, container } = render(FieldList, {
      fields: [
        { key: 'fill', kind: 'color', label: 'Fill', value: '#E5484D', mixed: true },
        { key: 'width', kind: 'number', label: 'Width', value: 2, mixed: true },
        { key: 'opacity', kind: 'slider', label: 'Opacity', value: 40, mixed: true, unit: '%' },
      ],
    });
    expect(getByRole('button', { name: 'Fill' }).textContent).not.toContain('#E5484D');
    expect(container.querySelector('[data-role="swatch"], .swatch')).toBeNull();
    const width = getByRole('spinbutton', { name: 'Width' }) as HTMLInputElement;
    expect(width.value).toBe('');
    expect(width.placeholder).toBe('Mixed');
    expect(container.textContent).not.toContain('40%');
    // The button of the colour and the hint of each field
    expect(getAllByText('Mixed').length).toBeGreaterThanOrEqual(4);
  });
});

describe('AttributeList', () => {
  const items = [
    { key: 'id', value: 'a41f' },
    { key: 'Kind', value: 'Entrance' },
    { key: '_order', value: '7' },
  ];
  const hide = (key: string) => key.startsWith('_');

  it('shows the attributes, leaves out the hidden ones, and locks the locked ones', () => {
    const { getByText, queryByText, getByRole, queryByRole } = render(AttributeList, {
      items,
      locked: ['id'],
      hide,
      onchange: () => {},
      onremove: () => {},
    });
    expect(getByText('Entrance')).toBeTruthy();
    expect(queryByText('_order')).toBeNull();
    expect(getByRole('img', { name: 'Locked' })).toBeTruthy();
    // The locked attribute is not a button to edit, and has no remove button
    expect(queryByRole('button', { name: 'id' })).toBeNull();
    expect(queryByRole('button', { name: 'Remove id' })).toBeNull();
    expect(getByRole('button', { name: 'Kind' })).toBeTruthy();
  });

  it('reports a value changed where it stands, by its index in items', async () => {
    const onchange = vi.fn();
    const { getByRole } = render(AttributeList, { items, hide, onchange });
    await fireEvent.click(getByRole('button', { name: 'Kind' }));
    await tick();
    const input = getByRole('textbox', { name: 'Kind' });
    await fireEvent.input(input, { target: { value: 'Exit' } });
    await fireEvent.keyDown(input, { key: 'Enter' });
    expect(onchange).toHaveBeenCalledWith(1, { key: 'Kind', value: 'Exit' });
  });

  it('does not report a name emptied, and shows the name again', async () => {
    const onchange = vi.fn();
    const { getAllByRole, getByText } = render(AttributeList, { items, hide, onchange });
    await fireEvent.click(getAllByRole('button', { name: 'Attribute name' })[1]);
    await tick();
    const input = getAllByRole('textbox', { name: 'Attribute name' })[0];
    await fireEvent.input(input, { target: { value: ' ' } });
    await fireEvent.keyDown(input, { key: 'Enter' });
    await tick();
    expect(onchange).not.toHaveBeenCalled();
    expect(getByText('Kind')).toBeTruthy();
  });

  it('removes an attribute by its index', async () => {
    const onremove = vi.fn();
    const { getByRole } = render(AttributeList, { items, hide, onremove });
    await fireEvent.click(getByRole('button', { name: 'Remove Kind' }));
    expect(onremove).toHaveBeenCalledWith(1);
  });

  it('adds an attribute from the new row with Enter, and drops it with Escape', async () => {
    const onadd = vi.fn();
    const { getByRole, queryByRole } = render(AttributeList, { items: [], onadd });
    expect(getByRole('button', { name: 'Add an attribute' })).toBeTruthy();
    await fireEvent.click(getByRole('button', { name: 'Add an attribute' }));
    await tick();
    await fireEvent.input(getByRole('textbox', { name: 'Attribute name' }), {
      target: { value: ' Floor ' },
    });
    const value = getByRole('textbox', { name: 'Value' });
    await fireEvent.input(value, { target: { value: '2' } });
    await fireEvent.keyDown(value, { key: 'Enter' });
    expect(onadd).toHaveBeenCalledWith({ key: 'Floor', value: '2' });
    expect(queryByRole('textbox', { name: 'Value' })).toBeNull();
    await fireEvent.click(getByRole('button', { name: 'Add an attribute' }));
    await tick();
    const name = getByRole('textbox', { name: 'Attribute name' });
    await fireEvent.input(name, { target: { value: 'Other' } });
    await fireEvent.keyDown(name, { key: 'Escape' });
    expect(onadd).toHaveBeenCalledTimes(1);
    expect(queryByRole('textbox', { name: 'Attribute name' })).toBeNull();
  });

  it('is a list to read with readonly, and says when it is empty', () => {
    const read = render(AttributeList, { items, hide, readonly: true, onadd: () => {} });
    expect(read.container.textContent).toContain('Entrance');
    expect(read.container.querySelector('button')).toBeNull();
    const empty = render(AttributeList, { items: [], readonly: true });
    expect(empty.container.textContent).toContain('No attributes.');
  });
});
