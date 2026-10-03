<script lang="ts">
  import { Banner, Button, Notices, Page, PageHeader, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';
</script>

<Example>
  <Case label="The notices of a frame, and the page after them, which brings the space below">
    <Surface>
      <Notices>
        <Banner tone="warn">
          Your address is not verified yet.
          {#snippet act()}<Button>Send again</Button>{/snippet}
        </Banner>
        <Banner tone="error">The payment of this month failed.</Banner>
      </Notices>
      <Page>
        {#snippet head()}<PageHeader title="Documents" />{/snippet}
        <Text>The page's own margin is the space below the last notice.</Text>
      </Page>
    </Surface>
  </Case>
</Example>
