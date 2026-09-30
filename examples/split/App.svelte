<script lang="ts">
  import { Block, Split, Stack, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';
</script>

<Example>
  <Case label="A side column of 14rem and the main column (one column below 48rem)">
    <Surface>
      <Split>
        <Block>
          <Stack gap="sm">
            <Text role="label">General</Text>
            <Text>Members</Text>
            <Text>Billing</Text>
          </Stack>
        </Block>
        {#snippet main()}
          <Block>
            <Stack gap="sm">
              <Text role="h2">General</Text>
              <Text>The main column takes the rest of the width.</Text>
            </Stack>
          </Block>
        {/snippet}
      </Split>
    </Surface>
  </Case>
  <Case label="width 10rem">
    <Surface>
      <Split width="10rem">
        <Block><Text role="label">Side</Text></Block>
        {#snippet main()}<Block><Text>Main</Text></Block>{/snippet}
      </Split>
    </Surface>
  </Case>
</Example>
