<script lang="ts">
  import { Avatar, Button, List, ListItem, Row, Section, Stack, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
</script>

<Example>
  <Case label="Sections stacked with gap 0">
    <Stack gap={0}>
      <Section title="General" status="Saved">
        <Text>The name and the description of the document.</Text>
        <Row><Button>Rename</Button></Row>
      </Section>
      <Section title="Sharing" note="Who can open this document." gap="md">
        <Row><Button variant="primary">Invite</Button></Row>
        <Text>Only you can open it.</Text>
        <Text role="caption" muted>1 person</Text>
      </Section>
      <Section title="Danger zone" note="These actions cannot be undone.">
        <Row><Button>Delete document</Button></Row>
      </Section>
    </Stack>
  </Case>
  <Case label="flush: the content ends with a list">
    <Stack gap={0}>
      <Section title="Members" gap="md" flush>
        <Row><Button variant="primary">Invite</Button></Row>
        <List label="Members">
          <ListItem columns="auto minmax(0, 1fr)" plain rule>
            <Avatar initial="SL" in /><span>Sam Lee</span>
          </ListItem>
          <ListItem columns="auto minmax(0, 1fr)" plain rule>
            <Avatar initial="KI" in /><span>Kim</span>
          </ListItem>
        </List>
      </Section>
      <Section title="Danger zone">
        <Row><Button>Leave the team</Button></Row>
      </Section>
    </Stack>
  </Case>
</Example>
