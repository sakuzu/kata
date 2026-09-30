import { fireEvent, render } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import Presence from '../../src/svelte/components/Presence.svelte';
import { setMessages } from '../../src/svelte/messages.js';

// The same person can be here twice (two tabs), so names repeat. A name as the key of the list
// would stop the rendering; the key is the id, or the position in the list without one.
describe('Presence', () => {
  afterEach(() => setMessages({}, { reset: true }));

  it('renders two people with the same name (the key is the id)', () => {
    const users = [
      { id: 'c1', name: 'Alex Morgan', you: true },
      { id: 'c2', name: 'Alex Morgan' },
      { id: 'c3', name: 'Kim' },
    ];
    const { container } = render(Presence, { users, max: 5 });
    expect(container.querySelectorAll('.slot').length).toBe(3);
  });

  it('renders by the position in the list when there is no id', () => {
    const users = [{ name: 'Same name' }, { name: 'Same name' }];
    const { container } = render(Presence, { users, max: 5 });
    expect(container.querySelectorAll('.slot').length).toBe(2);
  });

  it('gathers the people after max as "+n" and names the group by its count', () => {
    const users = ['Ann', 'Ben', 'Cy', 'Dee', 'Eve'].map((name) => ({ name }));
    const { container, getByRole } = render(Presence, { users, max: 3 });
    const initials = [...container.querySelectorAll('.slot .t')].map((e) => e.textContent);
    expect(initials).toEqual(['AN', 'BE', 'CY', '+2']);
    expect(getByRole('group', { name: '5 participants' })).toBeTruthy();
  });

  it('takes two initials of a Latin name and one character of another', () => {
    const users = [{ name: 'sam' }, { name: '山口 千夏' }];
    const { container } = render(Presence, { users });
    const initials = [...container.querySelectorAll('.slot .t')].map((e) => e.textContent);
    expect(initials).toEqual(['SA', '山']);
  });

  it('gives each avatar the colour of its person', () => {
    const { container } = render(Presence, { users: [{ name: 'Kim', color: '#6f86e6' }] });
    const slot = container.querySelector('.slot') as HTMLElement;
    expect(slot.style.getPropertyValue('--kata-color-fill')).toBe('#6f86e6');
  });

  it('lists everyone in the roster, with "(you)" and the role', () => {
    const users = [
      { id: '1', name: 'Sam', you: true, role: 'edit' as const },
      { id: '2', name: 'Kim', role: 'view' as const },
    ];
    const { container, getByRole } = render(Presence, { users, roster: true });
    const items = container.querySelectorAll('[data-role="list-item"]');
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toContain('(you)');
    expect(items[0].textContent).toContain('Can edit');
    expect(items[1].textContent).toContain('Can view');
    expect(getByRole('list', { name: '2 participants' })).toBeTruthy();
    expect(container.querySelector('input')).toBeNull();
  });

  it('searches the roster by name when it has more than eight people', async () => {
    const users = Array.from({ length: 9 }, (_, i) => ({ id: `${i}`, name: `Person ${i}` }));
    users[4].name = 'Rowan';
    const { container, getByRole } = render(Presence, { users, roster: true });
    const search = getByRole('searchbox', { name: 'Search the participants' }) as HTMLInputElement;
    await fireEvent.input(search, { target: { value: 'row' } });
    const items = container.querySelectorAll('[data-role="list-item"]');
    expect(items).toHaveLength(1);
    expect(items[0].textContent).toContain('Rowan');
    await fireEvent.input(search, { target: { value: 'nobody' } });
    expect(container.textContent).toContain('No one matches.');
  });

  it('takes its words from the messages', () => {
    setMessages({ participants: ({ count }) => `${count} 人` });
    const { getByRole } = render(Presence, { users: [{ name: 'Kim' }] });
    expect(getByRole('group', { name: '1 人' })).toBeTruthy();
  });

  it('opens the roster from "+n"', async () => {
    const users = ['Ann', 'Ben', 'Cy', 'Dee', 'Eve'].map((name) => ({ name }));
    const { getByRole } = render(Presence, { users, max: 3 });
    const more = getByRole('button', { name: 'Show 2 more' });
    expect(more.getAttribute('aria-expanded')).toBe('false');
    await fireEvent.click(more);
    expect(more.getAttribute('aria-expanded')).toBe('true');
    expect(document.querySelectorAll('.roster [data-role="list-item"]').length).toBe(5);
  });
});
