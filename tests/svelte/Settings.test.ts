import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import SettingsRow from '../../src/svelte/components/SettingsRow.svelte';
import SettingsSection from '../../src/svelte/components/SettingsSection.svelte';

const html = (markup: string) => createRawSnippet(() => ({ render: () => markup }));

describe('SettingsRow', () => {
  it('is a group named by its name and described by its description', () => {
    const { getByRole } = render(SettingsRow, {
      label: 'Autosave',
      description: 'Save after every change.',
      children: html('<input type="checkbox" role="switch" aria-label="Autosave" />'),
    });
    const group = getByRole('group', { name: 'Autosave' });
    const described = group.getAttribute('aria-describedby') ?? '';
    expect(document.getElementById(described)?.textContent).toBe('Save after every change.');
    expect(group.querySelector('[role="switch"]')).toBeTruthy();
  });

  it('labels the control with for, and draws the control snippet', () => {
    const { getByRole } = render(SettingsRow, {
      label: 'Name',
      for: 'doc-name',
      control: html('<input id="doc-name" />'),
    });
    expect(getByRole('textbox', { name: 'Name' }).id).toBe('doc-name');
  });
});

describe('SettingsSection', () => {
  it('shows the title, the description and the status above the rows', () => {
    const { getByRole, getByText } = render(SettingsSection, {
      title: 'General',
      description: 'How the document is named.',
      status: 'Saved',
      children: html('<p>Row</p>'),
    });
    expect(getByRole('heading', { level: 2 }).textContent).toBe('General');
    expect(getByText('How the document is named.')).toBeTruthy();
    expect(getByText('Saved')).toBeTruthy();
    expect(getByText('Row')).toBeTruthy();
  });
});
