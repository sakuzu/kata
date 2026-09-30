<script lang="ts">
  import { Fab, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  let presses = $state(0);
</script>

<Example>
  <Case label="md from the bottom right (the default)">
    <div class="area">
      <Fab label="Edit" icon="pencil" onclick={() => (presses += 1)} />
    </div>
    <Text role="caption">Pressed {presses} times</Text>
  </Case>
  <Case label="top and left given: the other sides are free; disabled">
    <div class="area">
      <Fab label="Add" icon="plus" top="sm" left="sm" disabled />
    </div>
  </Case>
</Example>

<style>
  /* The drawing area: a positioned container */
  .area {
    position: relative;
    height: 8rem;
    background: var(--kata-color-ground);
    border: var(--kata-border-width) solid var(--kata-color-line);
  }
</style>
