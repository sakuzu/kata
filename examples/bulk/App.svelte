<script lang="ts">
  import { Bulk, Button, Icon, Stack } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';
</script>

{#snippet actions()}
  <Button leading="corner-up-right">Move</Button>
  <Button leading="copy">Duplicate</Button>
  <Button variant="danger">Delete…</Button>
  <Button variant="ghost" icon aria-label="Clear the selection"><Icon name="x" /></Button>
{/snippet}

<Example>
  <Case label="The count, its word and the actions; in a narrow place the bar scrolls sideways">
    <Stack gap="md">
      <Bulk count={4} label="selected" {actions} />
      <Surface width="20rem"><Bulk count={12} label="selected" {actions} /></Surface>
    </Stack>
  </Case>
</Example>
