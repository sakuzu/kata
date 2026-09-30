<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // Split: two columns, a fixed side column (navigation) and a main column that takes the rest.
  // There is no gap between them; one of the columns draws the line between them (a layout holds
  // distances only, never a surface or a line). Below 48rem the side column moves above the main
  // one.
  //
  //   <Split>…side…{#snippet main()}…{/snippet}</Split>
  let {
    width = '14rem',
    children,
    main,
  }: {
    /** The width of the side column (default 14rem) */
    width?: string;
    /** The side column */
    children: Snippet;
    /** The main column */
    main: Snippet;
  } = $props();
</script>

<div class="split" style:--kata-split-width={width}>
  <div class="side">{@render children()}</div>
  <div class="main">{@render main()}</div>
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .split {
    display: grid;
    grid-template-columns: var(--kata-split-width) minmax(0, 1fr);
    align-items: start;
    min-width: 0;
    min-height: 0;
  }
  .side,
  .main {
    min-width: 0;
    min-height: 0;
  }
  .main {
    width: 100%;
  }
  @include narrow {
    .split {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
