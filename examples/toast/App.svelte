<script lang="ts">
  import { Button, Stack, Toast } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
</script>

<Example>
  <Case label="The four tones; only an error turns the line red">
    <Stack gap="sm">
      <Toast>Copied the link.</Toast>
      <Toast tone="warn">Some rows were skipped.</Toast>
      <Toast tone="error">The file could not be read.</Toast>
      <Toast tone="ok">Saved.</Toast>
    </Stack>
  </Case>
  <Case label="One action at the right end">
    <Toast tone="ok">
      Moved 4 items to the bin.
      {#snippet act()}<Button>Undo</Button>{/snippet}
    </Toast>
  </Case>
</Example>
