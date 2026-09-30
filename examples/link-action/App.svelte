<script lang="ts">
  import { LinkAction, Row, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
</script>

<Example>
  <Case label="In a sentence">
    <Text>Three people can open this document. <LinkAction onclick={() => {}}>Show all</LinkAction></Text>
  </Case>
  <Case label="An icon, a link, a destination outside and disabled">
    <Row gap="md" wrap>
      <LinkAction icon="plus" onclick={() => {}}>Add a description</LinkAction>
      <LinkAction href="#top">Open the help</LinkAction>
      <LinkAction href="#top" external>Terms of use</LinkAction>
      <LinkAction onclick={() => {}} disabled>Not allowed</LinkAction>
    </Row>
  </Case>
</Example>
