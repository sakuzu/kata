<script lang="ts">
  import { Button, Confirm, Row, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  let open = $state(false);
  let busy = $state(false);
  let result = $state('');

  // The caller closes the confirmation when the work is done, and shows busy until then
  function remove() {
    busy = true;
    setTimeout(() => {
      busy = false;
      open = false;
      result = 'Deleted';
    }, 800);
  }
</script>

<Example>
  <Case label="A destructive confirmation (inline): danger-fill">
    <Confirm
      inline
      title="Delete 4 items?"
      message="They move to the bin and are deleted after 30 days."
      confirmLabel="Delete"
      danger
      onconfirm={() => {}}
    />
  </Case>
  <Case label="Any other confirmation: primary, and the default label">
    <Confirm
      inline
      title="Publish this page?"
      message="Anyone with the link can read it."
      onconfirm={() => {}}
    />
  </Case>
  <Case label="Over the page: cancel has the first focus; busy while the work runs">
    <Row>
      <Button variant="danger" onclick={() => (open = true)}>Delete…</Button>
      {#if result}<Text role="caption" muted>{result}</Text>{/if}
    </Row>
    <Confirm
      bind:open
      title="Delete this document?"
      message="This cannot be undone."
      confirmLabel="Delete"
      danger
      {busy}
      onconfirm={remove}
      oncancel={() => (result = 'Kept')}
    />
  </Case>
</Example>
