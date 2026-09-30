<script lang="ts">
  import MessageSquare from '@lucide/svelte/icons/message-square';
  import { Avatar, Icon, Pin, Row } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  let open = $state(false);
</script>

<Example>
  <Case label="The people of a comment; press to select">
    <Row gap="lg" align="start">
      <Pin label="A comment by Sam Lee" onclick={() => (open = !open)} active={open}>
        <Avatar initial="SL" in />
      </Pin>
      <Pin label="A comment by three people" onclick={() => {}} more="+2">
        <Avatar initial="SL" in /><Avatar initial="KI" in />
      </Pin>
    </Row>
  </Case>
  <Case label="A point being placed (solid), and a pin that is only read">
    <Row gap="lg" align="start">
      <Pin solid label="A new comment"><Icon name={MessageSquare} /></Pin>
      <Pin label="Kim"><Avatar initial="KI" in /></Pin>
    </Row>
  </Case>
</Example>
