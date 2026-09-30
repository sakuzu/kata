<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // MenuHead: the name of a group of items in a menu. It is an item that cannot be pressed: as high
  // as a MenuItem, pad-md at the sides, the name in the label role, trimmed to its ink and centred,
  // so it keeps the same distance to a divider or an edge as an item. What is not a name (a name
  // and an address, a list of people) goes in a Block.
  //
  //   <MenuHead>Text size</MenuHead>
  let { children }: { children: Snippet } = $props();
</script>

<div class="head" data-role="list-item" data-h="list-item">
  <span class="label">{@render children()}</span>
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .head {
    display: flex;
    align-items: center;
    min-height: h(list-item);
    padding-inline: pad(md);
    min-width: 0;
    flex: none;
    @include text(body);
    @include scope-box(button-sm);
  }
  .label {
    flex: 1;
    min-width: 0;
    @include text(label);
    @include trim;
    @include ellipsis;
  }
</style>
