<script lang="ts">
  import Ellipsis from '@lucide/svelte/icons/ellipsis';
  import { Block, Button, Comment, Icon, Stack, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';
</script>

<Example>
  <Case label="In a column without padding: pad-md at the sides">
    <Surface width="22.5rem">
      <Stack gap={0}>
        <Comment name="Sam Taylor" initial="ST" time="3 minutes ago">
          {#snippet actions()}
            <Button variant="ghost" icon aria-label="Actions"><Icon name={Ellipsis} /></Button>
          {/snippet}
          <Text wrap>Can we move the title a little to the left?</Text>
        </Comment>
        <Comment name="Kai Morgan" initial="KM" time="1 minute ago" edited="(edited)">
          <Text wrap>Done. It now lines up with the column.</Text>
        </Comment>
      </Stack>
    </Surface>
  </Case>
  <Case label="In a block with padding: no padding at the sides">
    <Surface width="22.5rem">
      <Block>
        <Comment name="A person with a very long name that does not fit" initial="AP" time="Yesterday">
          <Text wrap>The name ends with an ellipsis; the time keeps its own line.</Text>
        </Comment>
      </Block>
    </Surface>
  </Case>
</Example>
