<script lang="ts">
  import { Icon, Row, SectionHeader, Stack, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import DemoButton from '../_shared/DemoButton.svelte';
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
            <DemoButton icon label="Add an image"><Icon name="image" /></DemoButton>
          {/snippet}
          <Text>An action on the right overlaps the head.</Text>
          <Row><DemoButton>Choose a file</DemoButton></Row>
        </SectionHeader>
        <SectionHeader label="Notes" rule>
          <Text>rule draws a line above; the distance from the ink is the same on both sides.</Text>
        </SectionHeader>
      </Stack>
    </Surface>
  </Case>
</Example>
