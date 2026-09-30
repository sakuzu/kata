import { fireEvent, render } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ColorGrid from '../../src/svelte/components/ColorGrid.svelte';
import ColorPicker from '../../src/svelte/components/ColorPicker.svelte';
import { setMessages } from '../../src/svelte/messages.js';

describe('ColorPicker', () => {
  afterEach(() => setMessages({}, { reset: true }));

  it('names its parts from the messages', () => {
    setMessages({ color: 'Farbe', close: 'Schließen' });
    const { getByRole, getAllByRole } = render(ColorPicker, {});
    expect(getByRole('heading', { name: 'Farbe' })).toBeTruthy();
    expect(getByRole('button', { name: 'Schließen' })).toBeTruthy();
    expect(getAllByRole('radio')).toHaveLength(9);
  });

  it('reports a preset with its name', async () => {
    const onpick = vi.fn();
    const { getByRole } = render(ColorPicker, { value: '#E5484D', onpick });
    const blue = getByRole('radio', { name: 'Blue' });
    await fireEvent.click(blue);
    expect(onpick).toHaveBeenCalledWith('#2D7FF9', 'Blue');
    expect(blue.getAttribute('aria-checked')).toBe('true');
  });

  it('takes a hex code and turns back an invalid one', async () => {
    const onpick = vi.fn();
    const { getByRole } = render(ColorPicker, { value: '#E5484D', onpick });
    const code = getByRole('textbox', { name: 'Color code' }) as HTMLInputElement;
    await fireEvent.change(code, { target: { value: '#0f0' } });
    expect(onpick).toHaveBeenLastCalledWith('#00FF00', '#00FF00');
    await fireEvent.change(code, { target: { value: 'green' } });
    expect(code.value).toBe('#00FF00');
    expect(onpick).toHaveBeenCalledTimes(1);
  });

  it('moves the hue with the arrow keys', async () => {
    const onpick = vi.fn();
    const { getByRole } = render(ColorPicker, { value: '#FF0000', onpick });
    const hue = getByRole('slider', { name: 'Hue' });
    await fireEvent.keyDown(hue, { key: 'ArrowRight' });
    expect(hue.getAttribute('aria-valuenow')).toBe('2');
    expect(onpick).toHaveBeenCalledOnce();
  });

  it('shows the fields of the RGB format', () => {
    const { getByRole } = render(ColorPicker, { value: '#102030', format: 'rgb' });
    expect((getByRole('spinbutton', { name: 'R' }) as HTMLInputElement).value).toBe('16');
    expect((getByRole('spinbutton', { name: 'B' }) as HTMLInputElement).value).toBe('48');
  });

  it('calls onclose from the close button', async () => {
    const onclose = vi.fn();
    const { getByRole } = render(ColorPicker, { onclose });
    await fireEvent.click(getByRole('button', { name: 'Close' }));
    expect(onclose).toHaveBeenCalledOnce();
  });
});

describe('ColorGrid', () => {
  it('marks the value without regard to case', () => {
    const { getAllByRole } = render(ColorGrid, {
      colors: [
        { hex: '#AA0000', name: 'Dark red' },
        { hex: '#00AA00', name: 'Dark green' },
      ],
      value: '#00aa00',
      label: 'Colors',
      onselect: () => {},
    });
    expect(getAllByRole('radio').map((r) => r.getAttribute('aria-checked'))).toEqual([
      'false',
      'true',
    ]);
  });
});
