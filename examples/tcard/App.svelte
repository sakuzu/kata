<script lang="ts">
  import { Button, Stack, Tcard } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';
</script>

<Example>
  <Case label="Rows of a table as cards, with actions in foot; the second is selected">
    <Surface width="36rem">
      <Stack gap="sm">
        <Tcard>
          <dt>Name</dt>
          <dd>Laptop</dd>
          <dt>Last used</dt>
          <dd>2026-09-12 14:03</dd>
          <dt>Place</dt>
          <dd>Office</dd>
          {#snippet foot()}<Button variant="danger">Revoke</Button>{/snippet}
        </Tcard>
        <Tcard sel>
          <dt>Name</dt>
          <dd>Phone (this device)</dd>
          <dt>Last used</dt>
          <dd>Now</dd>
          <dt>Place</dt>
          <dd></dd>
        </Tcard>
      </Stack>
    </Surface>
  </Case>
</Example>
