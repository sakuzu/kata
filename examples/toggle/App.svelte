<script lang="ts">
  import { Block, Stack, Toggle } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  let grid = $state(true);
</script>

<Example>
  <Case label="Off, on and disabled">
    <Stack gap={0}>
      <Toggle label="Show the rulers" />
      <Toggle label="Snap to the grid" bind:checked={grid} />
      <Toggle label="Snap to other shapes" disabled />
      <Toggle label="Locked on" checked disabled />
    </Stack>
  </Case>
  <Case label="between: the switch at the right end, and a switch under it">
    <Surface width="22.5rem">
      <Block>
        <Stack gap={0}>
          <Toggle label="Snap to the grid" between bind:checked={grid} />
          <Toggle label="Snap to the corners only" between indent disabled={!grid} />
        </Stack>
      </Block>
    </Surface>
  </Case>
</Example>
