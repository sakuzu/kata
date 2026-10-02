<script lang="ts">
  import '../styles/components.css';
  import type { IconSource } from '../icons.js';
  import Icon from './Icon.svelte';

  // Stat: a figure (num) with its name (caption) below it. Between the two nothing is trimmed, so
  // they sit with no gap: the line heights are the distance. Like Text, a Stat at an edge (the
  // inner edge of a container, or a line) trims the line that touches it: the top of the figure,
  // the bottom of the name. The edge flags pass through it (data-pass). Figures have equal widths.
  // Stats sets several side by side.
  //
  //   <Stat label="Documents" value="128" />
  let {
    label,
    value,
    icon,
  }: {
    /** The name */
    label: string;
    /** The figure, with its unit written by the application */
    value: string;
    /** An icon before the name, when an icon says what kind of figure it is */
    icon?: IconSource;
  } = $props();
</script>

<div class="stat" data-role="stat" data-pass>
  <span class="v">{value}</span>
  <span class="k">{#if icon}<Icon name={icon} />{/if}<span class="t">{label}</span></span>
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .stat {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .v {
    @include text(num);
    font-variant-numeric: tabular-nums;
  }
  // The name; the icon is centred on its line
  .k {
    display: flex;
    align-items: center;
    gap: gap(2xs);
    min-width: 0;
    @include text(caption);
    color: color(muted);
  }
  .k > :global(svg) {
    flex: none;
  }
  .t {
    display: block;
    min-width: 0;
    @include ellipsis;
  }
  // At an edge, the line that touches it is trimmed (the flags of the Stat, which passes them on)
  @container style(--kata-at-start: 1) {
    .v {
      @include trim-start;
    }
  }
  @container style(--kata-at-end: 1) {
    .t {
      @include trim-end;
    }
  }
</style>
