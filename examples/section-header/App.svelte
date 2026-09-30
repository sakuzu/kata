<script lang="ts">
  import { Button, Icon, Row, SectionHeader, Stack, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';
</script>

<Example>
  <Case label="Groups in a panel, stacked with gap 0">
    <Surface width="22.5rem">
      <Stack gap={0}>
        <SectionHeader label="Background">
          <Text>The color behind the drawing.</Text>
        </SectionHeader>
        <SectionHeader label="Images">
          {#snippet actions()}
            <Button variant="ghost" icon aria-label="Add an image"><Icon name="image" /></Button>
          {/snippet}
          <Text>An action on the right overlaps the head.</Text>
          <Row><Button>Choose a file</Button></Row>
        </SectionHeader>
        <SectionHeader label="Notes" rule>
          <Text>rule draws a line above; the distance from the ink is the same on both sides.</Text>
        </SectionHeader>
      </Stack>
    </Surface>
  </Case>
</Example>
