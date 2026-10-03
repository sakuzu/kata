<script lang="ts">
  import { Block, InlineEdit, Stack } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Small from '../_shared/Small.svelte';
  import Surface from '../_shared/Surface.svelte';

  let title = $state('Quarterly plan');
  let description = $state('');
  let notes = $state('The first line of the notes.\nThe second line.');
</script>

<Example>
  <Case label="A value, empty and not editable">
    <Surface width="22.5rem">
      <Block>
        <Stack gap="sm">
          <InlineEdit bind:value={title} placeholder="Add a name" label="Name" onCommit={() => {}} />
          <InlineEdit bind:value={description} placeholder="Add a description" onCommit={() => {}} />
          <InlineEdit value="Owned by the team" editable={false} placeholder="Owner" onCommit={() => {}} />
        </Stack>
      </Block>
    </Surface>
  </Case>
  <Case label="A title, and several lines">
    <Surface width="22.5rem">
      <Block>
        <Stack gap="sm">
          <InlineEdit bind:value={title} title placeholder="Add a title" label="Title" onCommit={() => {}} />
          <InlineEdit bind:value={notes} multiline placeholder="Add notes" label="Notes" onCommit={() => {}} />
        </Stack>
      </Block>
    </Surface>
  </Case>
  <Case label="The small button, declared by the container">
    <Small><InlineEdit value="Layer 3" placeholder="Name" onCommit={() => {}} /></Small>
  </Case>
</Example>
