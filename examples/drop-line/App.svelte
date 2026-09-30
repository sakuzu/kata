<script lang="ts">
  import { DropLine, Tree, TreeRow } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';
</script>

<Example>
  <Case label="Between two rows at depth 0">
    <Surface width="22.5rem">
      <Tree label="Contents">
        <TreeRow>Background</TreeRow>
        <DropLine />
        <TreeRow>Figures</TreeRow>
        <TreeRow>Notes</TreeRow>
      </Tree>
    </Surface>
  </Case>
  <Case label="Inside a group: indented to depth 1">
    <Surface width="22.5rem">
      <Tree label="Contents">
        <TreeRow expandable expanded>Background</TreeRow>
        <TreeRow depth={1}>Sky</TreeRow>
        <DropLine depth={1} />
        <TreeRow depth={1}>Hills</TreeRow>
        <TreeRow>Figures</TreeRow>
      </Tree>
    </Surface>
  </Case>
</Example>
