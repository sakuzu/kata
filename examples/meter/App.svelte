<script lang="ts">
  import { Meter, Stack } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
</script>

<Example>
  <Case label="Below, near and over the limit">
    <Stack gap="md">
      <Meter value={4} max={20} label="Storage" text="4 of 20 GB" />
      <Meter value={17} max={20} tone="warn" label="Storage" text="17 of 20 GB" />
      <Meter value={22} max={20} tone="over" label="Storage" text="22 of 20 GB" />
    </Stack>
  </Case>
  <Case label="The bar alone">
    <Meter value={3} max={10} />
  </Case>
</Example>
