<script lang="ts">
  import {
    Button,
    NativeSelect,
    SettingsPage,
    SettingsRow,
    SettingsSection,
    TextInput,
    Toggle,
  } from '@sakuzu/kata/svelte';

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'notifications', label: 'Notifications' },
  ];
  let tab = $state('general');
  let name = $state('Spring catalogue');
  let autosave = $state(true);
  let units = $state('mm');
  let mentions = $state(true);
  let digest = $state('daily');
  let replies = $state(false);
</script>

<div data-audit>
  <SettingsPage
    title="Document settings"
    crumbs={[{ label: 'Drafts', href: '#top' }, { label: 'Spring catalogue' }]}
    crumbsLabel="Location"
    {tabs}
    current={tab}
    onselect={(id) => (tab = id)}
    tabsLabel="Settings"
  >
    {#if tab === 'general'}
      <SettingsSection title="General" description="How the document is named and saved." status="Saved">
        <SettingsRow label="Name" for="settings-name" width="20rem">
          <TextInput id="settings-name" bind:value={name} />
        </SettingsRow>
        <SettingsRow label="Autosave" description="Save after every change, without asking.">
          <Toggle bind:checked={autosave} ariaLabel="Autosave" />
        </SettingsRow>
        <SettingsRow label="Units" description="The unit of the rulers and of the sizes." for="settings-units" width="12rem">
          <NativeSelect
            id="settings-units"
            bind:value={units}
            options={[
              { value: 'mm', label: 'Millimetres' },
              { value: 'in', label: 'Inches' },
              { value: 'px', label: 'Pixels' },
            ]}
          />
        </SettingsRow>
      </SettingsSection>
      <SettingsSection title="Danger zone" description="These actions cannot be undone.">
        <SettingsRow label="Delete the document" description="Everyone loses access to it at once.">
          <Button variant="danger">Delete…</Button>
        </SettingsRow>
      </SettingsSection>
    {:else}
      <SettingsSection title="Notifications" description="When the document tells you about changes.">
        <SettingsRow label="Mentions" description="When someone mentions you in a comment.">
          <Toggle bind:checked={mentions} ariaLabel="Mentions" />
        </SettingsRow>
        <SettingsRow label="Replies" description="When someone replies in a thread you follow.">
          <Toggle bind:checked={replies} ariaLabel="Replies" />
        </SettingsRow>
        <SettingsRow label="Summary by email" for="settings-digest" width="12rem">
          <NativeSelect
            id="settings-digest"
            bind:value={digest}
            options={[
              { value: 'never', label: 'Never' },
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
            ]}
          />
        </SettingsRow>
      </SettingsSection>
    {/if}
  </SettingsPage>
</div>
