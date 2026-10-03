<script lang="ts">
  import { Block, InlineEdit, Stack, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Small from '../_shared/Small.svelte';
  import Surface from '../_shared/Surface.svelte';

  let title = $state('Quarterly plan');
  let description = $state('');
  let notes = $state('The first line of the notes.\nThe second line.');
  let empty = $state('');
  let about = $state('A hall for the weekly market.');
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
  <Case label="At the edge of a Block: the text, not a box, is md from the edge">
    <Surface width="22.5rem">
      <Stack gap={0}>
        <Block>
          <Stack gap="sm"><InlineEdit bind:value={empty} multiline placeholder="Add a description" onCommit={() => {}} /></Stack>
        </Block>
        <Block><Text>The next block</Text></Block>
        <Block>
          <Stack gap="sm">
            <InlineEdit bind:value={about} multiline placeholder="Add a description" label="Description" onCommit={() => {}} />
          </Stack>
        </Block>
        <Block><Text>The next block</Text></Block>
        <Block>
          <Stack gap="sm"><InlineEdit bind:value={title} placeholder="Add a name" label="Name" onCommit={() => {}} /></Stack>
        </Block>
      </Stack>
    </Surface>
  </Case>
  <Case label="The small button, declared by the container">
    <Small><InlineEdit value="Layer 3" placeholder="Name" onCommit={() => {}} /></Small>
  </Case>
</Example>
