<script lang="ts">
  import { Icon, Page, PageHeader, Row, Section, Stack, Text } from '@sakuzu/kata/svelte';
  import DemoButton from '../_shared/DemoButton.svelte';
</script>

<div data-audit>
  <Stack gap={0}>
    <Page>
      {#snippet head()}
        <PageHeader title="Documents" note="Everything shared with this team.">
          {#snippet crumbs()}<a href="#top">Team</a>{/snippet}
          {#snippet titleEnd()}
            <DemoButton icon label="Rename"><Icon name="sticky-note" /></DemoButton>
          {/snippet}
        </PageHeader>
      {/snippet}
      <Row><DemoButton variant="primary">New document</DemoButton><DemoButton>Import</DemoButton></Row>
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
  </Stack>
</div>
