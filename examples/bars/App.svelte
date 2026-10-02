<script lang="ts">
  import { Bars, Block, Stack, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  const bins = [2, 5, 9, 14, 20, 17, 11, 8, 6, 4, 3, 2, 1, 1, 0, 1];
</script>

<Example>
  <Case label="A distribution with two breaks">
    <Surface width="22.5rem">
      <Block>
        <Stack gap="xs">
          <Bars {bins} marks={[1 / 4, 7 / 10]} />
          <Text role="caption">Breaks at 25% and 70% of the range</Text>
        </Stack>
      </Block>
    </Surface>
  </Case>
  <Case label="No breaks">
    <Surface width="22.5rem"><Block><Bars bins={[1, 3, 2, 5, 4]} /></Block></Surface>
  </Case>
</Example>
