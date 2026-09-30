<script lang="ts">
  import '../styles/components.css';
  import type { IconSource } from '../icons.js';
  import Icon from './Icon.svelte';

  // Stat: a figure (num) with its name (caption) below it. Neither text is trimmed, so the two sit
  // with no gap: the line heights are the distance. Figures have equal widths. Stats sets several
  // side by side.
  //
  //   <Stat label="Documents" value="128" />
  let {
    label,
    value,
    icon,
  }: {
    /** The name */
    label: string;
    /** The figure, with its unit written by the caller */
    value: string;
    /** An icon before the name, when an icon says what kind of figure it is */
    icon?: IconSource;
  } = $props();
</script>

<div class="stat" data-role="stat">
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
</style>
