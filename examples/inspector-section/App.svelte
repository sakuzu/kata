<script lang="ts">
  import {
    Button,
    Icon,
    InspectorRow,
    InspectorSection,
    NumberInput,
    Stack,
    TextInput,
  } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  let width = $state<number | null>(2);
  let label = $state('North gate');
  let open = $state(false);
</script>

<Example>
  <Case label="Sections stacked with gap 0: an action in the head, a section that folds">
    <Surface width="22.5rem">
      <Stack gap={0}>
        <InspectorSection title="Stroke">
          {#snippet end()}
            <Button variant="ghost" icon aria-label="Reset"><Icon name="x" /></Button>
          {/snippet}
          <InspectorRow label="Width">
            <NumberInput bind:value={width} unit="px" ariaLabel="Width" />
          </InspectorRow>
        </InspectorSection>
        <InspectorSection title="Label" collapsible bind:open>
          <InspectorRow label="Text">
            <TextInput bind:value={label} aria-label="Text" />
          </InspectorRow>
        </InspectorSection>
        <InspectorSection title="Position" collapsible rule>
          <InspectorRow label="Order">
            <NumberInput value={3} ariaLabel="Order" />
          </InspectorRow>
        </InspectorSection>
      </Stack>
    </Surface>
  </Case>
</Example>
