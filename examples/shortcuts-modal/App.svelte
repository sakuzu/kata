<script lang="ts">
  import { Button, Row, ShortcutsModal } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  let open = $state(false);
  const shortcuts = [
    { key: 'mod+k', label: 'Search' },
    { key: 'v', label: 'Select', group: 'Tools' },
    { key: 'l', label: 'Line', group: 'Tools' },
    { key: 'n', label: 'Note', group: 'Tools' },
    { key: 'mod+z', label: 'Undo', group: 'Edit' },
    { key: 'shift+mod+z', label: 'Redo', group: 'Edit' },
    { key: 'delete', label: 'Delete the selection', group: 'Edit' },
  ];
</script>

<Example>
  <Case label="Over the page: open it with the button">
    <Row><Button onclick={() => (open = true)}>Keyboard shortcuts</Button></Row>
    <ShortcutsModal bind:open {shortcuts} />
  </Case>
  <Case label="The same list in the flow (inline), as the platform writes the keys">
    <ShortcutsModal inline {shortcuts} />
  </Case>
  <Case label="As a Mac writes the keys (mac)">
    <ShortcutsModal inline mac {shortcuts} />
  </Case>
</Example>
