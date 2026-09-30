<script lang="ts">
  import { DropLine, Tree, TreeRow } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  let picked = $state('');
</script>

<Example>
  <Case label="Between two rows at depth 0">
    <Surface width="22.5rem">
      <Tree label="Contents">
        <TreeRow sel={picked === 'Background'} onclick={() => (picked = 'Background')}>Background</TreeRow>
        <DropLine />
        <TreeRow sel={picked === 'Figures'} onclick={() => (picked = 'Figures')}>Figures</TreeRow>
        <TreeRow sel={picked === 'Notes'} onclick={() => (picked = 'Notes')}>Notes</TreeRow>
      </Tree>
    </Surface>
  </Case>
  <Case label="Inside a group: indented to depth 1">
    <Surface width="22.5rem">
      <Tree label="Contents">
        <TreeRow expandable expanded>Background</TreeRow>
        <TreeRow depth={1} sel={picked === 'Sky'} onclick={() => (picked = 'Sky')}>Sky</TreeRow>
        <DropLine depth={1} />
        <TreeRow depth={1} sel={picked === 'Hills'} onclick={() => (picked = 'Hills')}>Hills</TreeRow>
        <TreeRow sel={picked === 'Figures'} onclick={() => (picked = 'Figures')}>Figures</TreeRow>
      </Tree>
    </Surface>
  </Case>
</Example>
