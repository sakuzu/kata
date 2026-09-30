<script lang="ts">
  import { Banner, Button, Notices } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';
</script>

<Example>
  <Case label="The notices of a frame, with the margin of the page around them">
    <Surface>
      <Notices>
        <Banner tone="warn">
          Your address is not verified yet.
          {#snippet act()}<Button>Send again</Button>{/snippet}
        </Banner>
        <Banner tone="error">The payment of this month failed.</Banner>
      </Notices>
    </Surface>
  </Case>
</Example>
