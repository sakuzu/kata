import { afterEach, describe, expect, it } from 'vitest';
import { fontScaleLabel } from '../../src/svelte/lib/fontScale.js';
import { defaultMessages, getMessages, setMessages } from '../../src/svelte/messages.js';

describe('messages', () => {
  afterEach(() => setMessages({}, { reset: true }));

  it('starts with the English defaults', () => {
    expect(getMessages()).toEqual(defaultMessages);
    expect(fontScaleLabel('max')).toBe('Maximum');
  });

  it('replaces only the keys that are given', () => {
    setMessages({ fontScaleMax: '最大' });
    expect(getMessages().fontScaleMax).toBe('最大');
    expect(getMessages().fontScaleLarge).toBe('Large');
    expect(fontScaleLabel('max')).toBe('最大');
  });

  it('returns to the defaults with reset', () => {
    setMessages({ fontScaleMax: '最大' });
    setMessages({ fontScaleLarge: '大' }, { reset: true });
    expect(getMessages().fontScaleMax).toBe('Maximum');
    expect(getMessages().fontScaleLarge).toBe('大');
  });
});
