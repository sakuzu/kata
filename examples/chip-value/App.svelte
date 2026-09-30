<script lang="ts">
  import { Button, ChipValue, List, ListItem, NumberInput } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  let open = $state(true);
  let value = $state(12.5);
</script>

<Example>
  <Case label="An input and its button, at a point of the stage (press Apply to collapse)">
    <div class="frame">
      {#if open}
        <ChipValue left="md" top="md">
          <NumberInput bind:value unit="m" width="6rem" ariaLabel="Length" />
          <Button variant="primary" onclick={() => (open = false)}>Apply</Button>
        </ChipValue>
      {:else}
        <ChipValue left="md" top="md" label="Edit the length" onclick={() => (open = true)}>
          {value} m
        </ChipValue>
      {/if}
    </div>
  </Case>
  <Case label="Several values: rows">
    <div class="frame">
      <ChipValue left="md" top="md" rows>
        <List>
          <ListItem columns="minmax(0, 1fr) auto" plain rule><span>Length</span><span>12.5 m</span></ListItem>
          <ListItem columns="minmax(0, 1fr) auto" plain rule><span>Area</span><span>40 m²</span></ListItem>
        </List>
      </ChipValue>
    </div>
  </Case>
</Example>

<style>
  .frame {
    position: relative;
    height: 10rem;
    border: var(--kata-border-width) solid var(--kata-color-line);
  }
</style>
