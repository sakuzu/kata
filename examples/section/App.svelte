<script lang="ts">
  import { Button, Row, Section, Stack, Text } from '@sakuzu/kata/svelte';
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
</Example>
