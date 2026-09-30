<script lang="ts">
  import { Block, Chip, Row } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  let values = $state(['Public', 'Link sharing', 'Private']);
</script>

<Example>
  <Case label="Removable values (press ✕)">
    <Row wrap>
      {#each values as v (v)}
        <Chip onremove={() => (values = values.filter((x) => x !== v))}>{v}</Chip>
      {/each}
    </Row>
  </Case>
  <Case label="Pressable text, and a value that cannot be removed">
    <Row wrap>
      <Chip onclick={() => {}} onremove={() => {}}>Updated in the last 7 days</Chip>
      <Chip>Owner is me</Chip>
    </Row>
  </Case>
  <Case label="A long value in a narrow container ends with an ellipsis">
    <Surface width="14rem">
      <Block>
        <Row><Chip onremove={() => {}}>A long value that does not fit the container</Chip></Row>
      </Block>
    </Surface>
  </Case>
</Example>
