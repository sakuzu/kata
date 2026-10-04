<script lang="ts">
  import {
    Block,
    InlineEdit,
    NumberInput,
    Pair,
    Select,
    Stack,
    Textarea,
    TextInput,
  } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  let name = $state('Riverside plan');
  let width = $state<number | null>(2);
  let note = $state('A note that runs over two lines, written by the person who drew it.');
  let kind = $state('line');
  let description = $state(
    'The east bank, from the bridge to the weir.\nDrawn from the survey of May.',
  );
  let empty = $state('');
</script>

<Example>
  <Case label="Edit: the value is a control, with a button's height">
    <Surface width="28rem">
      <Block>
        <Stack gap="sm">
          <Pair label="Name" for="pair-name"><TextInput id="pair-name" bind:value={name} /></Pair>
          <Pair label="Line width"><NumberInput bind:value={width} unit="px" ariaLabel="Line width" /></Pair>
          <Pair label="Kind">
            <Select
              bind:value={kind}
              ariaLabel="Kind"
              options={[
                { value: 'line', label: 'Line' },
                { value: 'shape', label: 'Shape' },
              ]}
            />
          </Pair>
          <Pair label="Opacity" note="0 is transparent, 100 is opaque."><NumberInput value={80} unit="%" ariaLabel="Opacity" /></Pair>
        </Stack>
      </Block>
    </Surface>
  </Case>
  <Case label="top: a value of several lines">
    <Surface width="28rem">
      <Block>
        <Pair label="Note" top><Textarea bind:value={note} ariaLabel="Note" /></Pair>
      </Block>
    </Surface>
  </Case>
  <Case label="top: a value of several lines that is text at rest (an InlineEdit)">
    <Surface width="28rem">
      <Block>
        <Pair label="Description" top>
          <InlineEdit bind:value={description} multiline placeholder="Add a description" label="Description" onCommit={() => {}} />
        </Pair>
      </Block>
    </Surface>
  </Case>
  <Case label="top: an InlineEdit with no value (the add action)">
    <Surface width="28rem">
      <Block>
        <Pair label="Description" top>
          <InlineEdit bind:value={empty} multiline placeholder="Add a description" label="Description" onCommit={() => {}} />
        </Pair>
      </Block>
    </Surface>
  </Case>
  <Case label="Read: text to read; muted, mono with clamp, and a link as the name">
    <Surface width="28rem">
      <Block>
        <Stack gap="sm">
          <Pair read label="Length">13.1 km</Pair>
          <Pair read label="Owner" muted>Not set</Pair>
          <Pair read label="ID" mono clamp>3f2a9c0e-7b41-4d8e-9a55-0c1d2e3f4a5b</Pair>
          <Pair read label="Part 2" href="#part-2">Two sections</Pair>
          <Pair read label="Child" indent={1}>A value one level down</Pair>
        </Stack>
      </Block>
    </Surface>
  </Case>
</Example>
