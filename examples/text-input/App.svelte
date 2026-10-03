<script lang="ts">
  import { Block, Field, Stack, TextInput } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Frame from '../_shared/Frame.svelte';
  import Small from '../_shared/Small.svelte';
  import Surface from '../_shared/Surface.svelte';

  let name = $state('Quarterly plan');
</script>

<Example>
  <Case label="Empty with a placeholder, a value, an error, disabled and read only">
    <Surface width="22.5rem">
      <Block>
        <Stack gap="md">
          <TextInput placeholder="Untitled" aria-label="Title" />
          <TextInput bind:value={name} aria-label="Name" />
          <TextInput value="not an address" error aria-label="Email" />
          <TextInput value="Locked" disabled aria-label="Owner" />
          <TextInput value="kt_4f9a2c" mono readonly aria-label="Key" />
        </Stack>
      </Block>
    </Surface>
  </Case>
  <Case label="A unit, a title and suggestions">
    <Surface width="22.5rem">
      <Block>
        <Stack gap="md">
          <TextInput value="12" unit="px" aria-label="Gap" />
          <TextInput bind:value={name} title aria-label="Title" />
          <TextInput suggestions={['Draft', 'Review', 'Done']} placeholder="Status" aria-label="Status" />
        </Stack>
      </Block>
    </Surface>
  </Case>
  <Case label="In a field">
    <Surface width="22.5rem">
      <Block>
        <Field label="Name" for="text-name" note="Shown to everyone who opens it.">
          <TextInput id="text-name" bind:value={name} />
        </Field>
      </Block>
    </Surface>
  </Case>
  <Case label="The small button, declared by the container">
    <Frame width="22.5rem">
      <Small><TextInput value="Layer 3" aria-label="Layer name" /></Small>
    </Frame>
  </Case>
</Example>
