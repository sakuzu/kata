<script lang="ts">
  import { Block, Field, NativeSelect, Stack } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Small from '../_shared/Small.svelte';
  import Surface from '../_shared/Surface.svelte';

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'de', label: 'Deutsch' },
    { value: 'ja', label: '日本語' },
    { value: 'ko', label: '한국어', disabled: true },
  ];
  const paper = [
    {
      label: 'ISO',
      options: [
        { value: 'a4', label: 'A4' },
        { value: 'a3', label: 'A3' },
      ],
    },
    { label: 'North America', options: [{ value: 'letter', label: 'Letter' }] },
  ];
  let lang = $state('en');
</script>

<Example>
  <Case label="A value, a placeholder, groups, an error and disabled">
    <Surface width="22.5rem">
      <Block>
        <Stack gap="md">
          <NativeSelect options={languages} bind:value={lang} ariaLabel="Language" />
          <NativeSelect options={languages} placeholder="Choose a language" ariaLabel="Second language" />
          <NativeSelect groups={paper} value="a4" ariaLabel="Paper" />
          <NativeSelect options={languages} placeholder="Required" error ariaLabel="Required language" />
          <NativeSelect options={languages} value="ja" disabled ariaLabel="Fixed language" />
        </Stack>
      </Block>
    </Surface>
  </Case>
  <Case label="In a field, and the small button">
    <Surface width="22.5rem">
      <Block>
        <Stack gap="lg">
          <Field label="Language" for="native-lang">
            <NativeSelect id="native-lang" options={languages} bind:value={lang} />
          </Field>
          <Small><NativeSelect options={languages} value="de" ariaLabel="Row language" /></Small>
        </Stack>
      </Block>
    </Surface>
  </Case>
</Example>
