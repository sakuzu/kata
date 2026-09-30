<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import Stack from './Stack.svelte';

  // List: a column of list items and nothing else. The items touch; the list's outline runs from
  // the top of the first item to the bottom of the last, and the distance to what is outside is
  // the gap of the layout around it. A switch, a checkbox or a radio is not a list item and goes
  // in a Stack.
  //
  // An item's height comes from its content. When a list mixes items that hold different things
  // and they must line up, rows raises the least height: mark (a mark), box (a control with an
  // outline), thumb (a thumbnail) or two (a title and a caption).
  //
  //   <List label="Documents">{#each docs as d (d.id)}<ListItem …>…</ListItem>{/each}</List>
  let {
    label,
    role = 'list',
    rows,
    children,
  }: {
    /** The name of the list */
    label?: string;
    /** The role when the list has a name: group when its items are choices (icons, suggestions) */
    role?: 'list' | 'group';
    /** The least height of the items, named after what they hold */
    rows?: 'mark' | 'box' | 'thumb' | 'two';
    children: Snippet;
  } = $props();
</script>

<div
  class="list"
  role={label ? role : undefined}
  aria-label={label}
  data-role="list"
  data-rows={rows}
>
  <Stack gap={0}>{@render children()}</Stack>
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .list {
    min-width: 0;
    @include rows;
  }
</style>
