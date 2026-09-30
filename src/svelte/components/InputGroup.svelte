<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // InputGroup: an input and the actions that belong to it, on its right (load, copy, create).
  // They go here, not in a Footer or a section header. The input takes the rest of the width; when
  // they do not fit, the actions move to the next line and stay at the right end; when even they do
  // not fit on one line, they wrap, so they never reach past the container's edge. Neighbours are
  // gap-sm apart.
  //
  //   <InputGroup>
  //     <TextInput bind:value={address} />
  //     {#snippet action()}<Button>Load</Button>{/snippet}
  //   </InputGroup>
  let {
    children,
    action,
  }: {
    /** The input */
    children: Snippet;
    /** The actions */
    action: Snippet;
  } = $props();
</script>

<div class="group" data-role="box" data-multi>
  <div class="main">{@render children()}</div>
  <div class="act">{@render action()}</div>
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .group {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: gap(sm);
    min-width: 0;
  }
  // The input takes the rest; below 12rem the actions move to the next line
  .main {
    display: flex;
    flex: 1 1 12rem;
    min-width: 0;
  }
  // The actions shrink with the group, and wrap among themselves when even one line of them is
  // wider than the container
  .act {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;
    gap: gap(sm);
    flex: 0 1 auto;
    min-width: 0;
    max-width: 100%;
    margin-inline-start: auto;
  }
</style>
