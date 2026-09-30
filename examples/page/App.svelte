<script lang="ts">
  import {
    Button,
    Icon,
    List,
    ListItem,
    Page,
    PageHeader,
    Row,
    Section,
    Stack,
    Text,
  } from '@sakuzu/kata/svelte';
</script>

<div data-audit>
  <Stack gap={0}>
    <Page>
      {#snippet head()}
        <PageHeader title="Documents" note="Everything shared with this team.">
          {#snippet crumbs()}<a href="#top">Team</a>{/snippet}
          {#snippet titleEnd()}
            <Button variant="ghost" icon aria-label="Rename"><Icon name="sticky-note" /></Button>
          {/snippet}
        </PageHeader>
      {/snippet}
      <Row><Button variant="primary">New document</Button><Button>Import</Button></Row>
      <Text>The content starts with a row of actions: pad-lg from the head to its outline.</Text>
    </Page>
    <Page width="settings">
      {#snippet head()}<PageHeader title="Settings" />{/snippet}
      <Stack gap={0}>
        <Section title="Profile" status="Saved">
          <Text>width="settings" limits the column; the content starts with a section.</Text>
        </Section>
        <Section title="Appearance">
          <Text>The text size and the theme.</Text>
        </Section>
      </Stack>
    </Page>
    <Page flush>
      {#snippet head()}<PageHeader title="Recent" />{/snippet}
      <List label="Recent documents">
        <ListItem columns="auto minmax(0, 1fr)" onclick={() => {}}>
          <Icon name="image" /><span>flush: the content starts with a list</span>
        </ListItem>
        <ListItem columns="auto minmax(0, 1fr)" onclick={() => {}}>
          <Icon name="image" /><span>Site survey</span>
        </ListItem>
      </List>
    </Page>
  </Stack>
</div>
