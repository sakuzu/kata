<script lang="ts">
  import Bell from '@lucide/svelte/icons/bell';
  import { Button, Counter, Icon, Row } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
</script>

<Example>
  <Case label="One and two digits, and more than 99">
    <Row><Counter>3</Counter><Counter>42</Counter><Counter>99+</Counter></Row>
  </Case>
  <Case label="On an icon button">
    <Row gap="0">
      <Button variant="ghost" icon badge={7} aria-label="Notifications"><Icon name={Bell} /></Button>
    </Row>
  </Case>
</Example>
