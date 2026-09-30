<script lang="ts">
  import { Button, Row, ToastHost, toast } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  // Three toasts on arrival; each goes after a few seconds
  toast.show('Copied the link.');
  toast.show('Saved.');
  toast.error('The file could not be read.');
</script>

<Example>
  <Case label="The toasts of the store, in the flow (inline); at most three, the newest last">
    <Row gap="sm" wrap>
      <Button onclick={() => toast.show('Saved.')}>Show a message</Button>
      <Button onclick={() => toast.error('The file could not be read.')}>Show an error</Button>
    </Row>
    <ToastHost inline />
  </Case>
</Example>
