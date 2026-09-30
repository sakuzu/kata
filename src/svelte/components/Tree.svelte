<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import { setContext } from 'svelte';
  import Stack from './Stack.svelte';

  // Tree: a list with depth. It stacks TreeRows and DropLines only; the rows touch, and the tree's
  // outline is the edges of its rows, so the distance to what is around it belongs to the Stack it
  // sits in. The depth of a row is its depth prop, so the elements inside a tree may be flat, or
  // nested in groups that a drag and drop reorders (see sortable); a group needs no distance of its
  // own.
  //
  // flat is for a tree where no row opens: the rows leave no room for the chevron, so their text
  // starts where the head of a SectionHeader does. A row takes its height from its content (the
  // content and pad-md above and below); rows raises the least height, so that rows with different
  // content in one tree are the same height: mark (a mark before the name), box (a control), thumb
  // (a thumbnail) or two (two lines).
  //
  //   <Tree label="Contents"><TreeRow …/><TreeRow depth={1} …/></Tree>
  let {
    label,
    flat = false,
    rows,
    children,
  }: {
    /** The name of the tree */
    label?: string;
    /** No row opens: no room for the chevron */
    flat?: boolean;
    /** The least height of every row */
    rows?: 'mark' | 'box' | 'thumb' | 'two';
    children: Snippet;
  } = $props();
  // The rows read whether the tree is flat
  setContext('kata-tree-flat', () => flat);
</script>

<div class="tree" role="tree" aria-label={label} data-role="list" data-rows={rows}>
  <Stack gap={0}>{@render children()}</Stack>
</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .tree {
    min-width: 0;
    flex: none;
    &[data-rows='mark'] {
      --kata-row-h: #{h(list-item-mark)};
    }
    &[data-rows='box'] {
      --kata-row-h: #{h(list-item-lg)};
    }
    &[data-rows='thumb'] {
      --kata-row-h: #{h(thumbnail-row)};
    }
    &[data-rows='two'] {
      --kata-row-h: #{h(list-item-two)};
    }
  }
</style>
