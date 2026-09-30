<script lang="ts">
  import { Button, Row, Spinner, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
</script>

<Example>
  <Case label="The dots alone, and with a label">
    <Row gap="lg"><Spinner /><Spinner label="Saving" /></Row>
  </Case>
  <Case label="It follows the text around it">
    <Row gap="md" wrap><Text role="caption">Syncing</Text><Spinner /><Button busy>Saving</Button></Row>
  </Case>
</Example>
