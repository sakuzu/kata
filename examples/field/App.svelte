<script lang="ts">
  import { Block, Field, NativeSelect, Stack, TextInput } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  let name = $state('Quarterly plan');
  let email = $state('someone@');
</script>

<Example>
  <Case label="Fields stacked gap-lg apart: a note, an error and a fixed width">
    <Surface width="28rem">
      <Block>
        <Stack gap="lg">
          <Field label="Name" for="field-name" note="Shown to everyone who opens it.">
            <TextInput id="field-name" bind:value={name} />
          </Field>
          <Field label="Email" for="field-email" error="Enter a whole address.">
            <TextInput id="field-email" type="email" bind:value={email} error />
          </Field>
          <Field label="Language" for="field-lang" width="12rem">
            <NativeSelect
              id="field-lang"
              value="en"
              options={[
                { value: 'en', label: 'English' },
                { value: 'ja', label: '日本語' },
              ]}
            />
          </Field>
        </Stack>
      </Block>
    </Surface>
  </Case>
</Example>
