<script lang="ts">
  import { Panel, Table, Toolbar, Tree, TreeRow } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  // The page around sets scrollbar-color on its root element; the scrollbars of kata's regions
  // under the root are still kata's
  const rows = Array.from({ length: 12 }, (_, i) => `Layer ${i + 1}`);
  const columns = ['Name', 'Kind', 'Owner', 'Updated', 'Size', 'Status'];
</script>

<Example>
  <Case label="A panel whose content scrolls">
    <div class="frame">
      <Panel side="panel" label="Layers">
        {#snippet head()}<Toolbar title="Layers" rule />{/snippet}
        <Tree label="Layers">
          {#each rows as row (row)}
            <TreeRow onclick={() => {}}>{row}</TreeRow>
          {/each}
        </Tree>
      </Panel>
    </div>
  </Case>
  <Case label="A table wider than its frame">
    <Surface width="16rem">
      <Table>
        {#snippet head()}
          {#each columns as c (c)}<th>{c}</th>{/each}
        {/snippet}
        <tr>
          {#each columns as c (c)}<td>{c} of the first row</td>{/each}
        </tr>
      </Table>
    </Surface>
  </Case>
</Example>

<style>
  .frame {
    display: flex;
    height: 16rem;
    border-right: var(--kata-border-width) solid var(--kata-color-line-strong);
    width: max-content;
  }
</style>
