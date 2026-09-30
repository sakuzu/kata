<script lang="ts">
  import {
    Avatar,
    Badge,
    Button,
    Kebab,
    List,
    ListItem,
    NativeSelect,
    Row,
    Section,
    SettingsPage,
    SettingsRow,
    SettingsSection,
    Stack,
    Text,
    TextInput,
    Toggle,
  } from '@sakuzu/kata/svelte';

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'members', label: 'Members' },
  ];
  let tab = $state('general');
  let name = $state('Design team');
  let language = $state('en');
  let comments = $state(true);
  const members = [
    { id: 'sl', name: 'Sam Lee', role: 'Owner' },
    { id: 'ak', name: 'Alex Kim', role: 'Can edit' },
    { id: 'jm', name: 'Jo Moreau', role: 'Can view' },
  ];
</script>

<div data-audit>
  <SettingsPage
    title="Team settings"
    crumbs={[{ label: 'Design team', href: '#top' }, { label: 'Settings' }]}
    crumbsLabel="Location"
    {tabs}
    current={tab}
    onselect={(id) => (tab = id)}
    tabsLabel="Settings"
  >
    {#if tab === 'general'}
      <SettingsSection title="General" description="How the team is named and shown." status="Saved">
        <SettingsRow label="Name" for="team-name" width="20rem">
          <TextInput id="team-name" bind:value={name} />
        </SettingsRow>
        <SettingsRow label="Language" description="The language of new documents." for="team-language" width="12rem">
          <NativeSelect
            id="team-language"
            bind:value={language}
            options={[
              { value: 'en', label: 'English' },
              { value: 'ja', label: 'Japanese' },
            ]}
          />
        </SettingsRow>
        <SettingsRow label="Comments" description="Members can comment on every document.">
          <Toggle bind:checked={comments} ariaLabel="Comments" />
        </SettingsRow>
      </SettingsSection>
      <SettingsSection title="Danger zone" description="These actions cannot be undone.">
        <SettingsRow label="Delete the team" description="Every document of the team is deleted with it.">
          <Button variant="danger">Delete…</Button>
        </SettingsRow>
      </SettingsSection>
    {:else}
      <Section title="Members" gap="md" flush>
        <Row><Button leading="plus">Invite</Button></Row>
        <List label="Members" rows="mark">
          {#each members as m (m.id)}
            <ListItem columns="auto minmax(0, 1fr) auto auto" tail plain rule>
              <Avatar initial={m.id.toUpperCase()} in />
              <Text clamp>{m.name}</Text>
              <Badge>{m.role}</Badge>
              <Kebab actions={['settings', 'delete']} />
            </ListItem>
          {/each}
        </List>
      </Section>
      <Section title="Invitations">
        <Stack gap="sm">
          <Text>No invitation is waiting for an answer.</Text>
        </Stack>
      </Section>
    {/if}
  </SettingsPage>
</div>
