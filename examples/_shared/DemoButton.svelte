<script lang="ts">
  import type { Snippet } from 'svelte';

  // A plain button drawn with the tokens, for the examples of the layout components: it has the
  // height of a button (or of the small button its container declares) and is trimmed to its ink.
  // icon makes it a square small button without a border, labelled by aria-label.
  let {
    variant = 'outline',
    icon = false,
    label,
    children,
  }: {
    variant?: 'outline' | 'primary';
    icon?: boolean;
    label?: string;
    children: Snippet;
  } = $props();
</script>

<button
  type="button"
  class="demo-button"
  class:icon
  data-variant={variant}
  data-role="box"
  data-h={icon ? 'icon-button' : 'button'}
  aria-label={label}
>
  {#if icon}{@render children()}{:else}<span class="label">{@render children()}</span>{/if}
</button>
