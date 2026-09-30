<script lang="ts">
  import { Button, Row, Section, SettingsPage, Stack, Text } from '@sakuzu/kata/svelte';

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'members', label: 'Members' },
    { id: 'billing', label: 'Billing' },
  ];
  let tab = $state('general');
</script>

<div data-audit>
  <Stack gap={0}>
    <SettingsPage
      title="Team settings"
      crumbs={[{ label: 'Team', href: '#top' }, { label: 'Settings' }]}
      crumbsLabel="Location"
      {tabs}
      current={tab}
      onselect={(id) => (tab = id)}
      tabsLabel="Settings"
    >
      <Section title="Name" status="Saved">
        <Text>The name everyone in the team sees.</Text>
        <Row><Button>Rename</Button></Row>
      </Section>
      <Section title="Danger zone" note="These actions cannot be undone.">
        <Row><Button variant="danger">Delete the team…</Button></Row>
      </Section>
    </SettingsPage>
    <SettingsPage title="Profile">
      <Section title="Appearance">
        <Text>Without tabs, the sections follow the title.</Text>
      </Section>
    </SettingsPage>
  </Stack>
</div>
