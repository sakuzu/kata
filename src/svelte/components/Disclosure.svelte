<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import Icon from './Icon.svelte';
  import Stack from './Stack.svelte';

  // Disclosure: a group that opens and closes. Its head is a button with the height of a list item
  // (pad-md at the sides) on the raise surface, with a chevron on the left and the current value on
  // the right, so the value reads while the group is closed. Open, the content is a container with
  // pad-md, its children gap-sm apart. Disclosures next to each other touch, with a line between
  // them.
  //
  //   <Disclosure title="Appearance" value="3 items" bind:open>…</Disclosure>
  let {
    title,
    value,
    open = $bindable(false),
    ontoggle,
    children,
  }: {
    title: string;
    /** The current value, on the right of the head */
    value?: string;
    /** Whether the content shows (closed by default) */
    open?: boolean;
    /** Called with the new state when the head is pressed */
    ontoggle?: (open: boolean) => void;
    children: Snippet;
  } = $props();
  const id = $props.id();
</script>

<div class="disc" data-role="list-item">
  <button
    type="button"
    class="head"
    data-h="list-item"
    aria-expanded={open}
    aria-controls={id}
    onclick={() => {
      open = !open;
      ontoggle?.(open);
    }}
  >
    <Icon name={open ? 'chevron-down' : 'chevron-right'} />
    <span class="t">{title}</span>
    {#if value}<span class="v t">{value}</span>{/if}
  </button>
  {#if open}<div class="body" {id} data-inset><Stack gap="sm">{@render children()}</Stack></div>{/if}
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .disc {
    min-width: 0;
    flex: none;
    @include scope-box(button);
  }
  // Disclosures next to each other are divided by a line, with no distance
  .disc + :global(.disc) {
    border-top: bw() solid color(line);
  }
  // The head: a button with the box of a list item
  .head {
    display: flex;
    align-items: center;
    gap: gap(sm);
    width: 100%;
    height: h(list-item);
    padding-inline: pad(md);
    border: 0;
    background: color(raise);
    color: color(text);
    font: inherit;
    @include text(body);
    text-align: start;
    cursor: pointer;
    &:hover {
      background: color(raise-2);
    }
    @include focus-inside;
    > :global(svg) {
      flex: none;
    }
  }
  .t {
    display: block;
    min-width: 0;
    @include trim;
    @include ellipsis;
  }
  .v {
    margin-left: auto;
    flex: none;
    max-width: 50%;
    color: color(muted);
    font-variant-numeric: tabular-nums;
  }
  .body {
    @include container;
  }
</style>
