<script lang="ts">
  import { Stack, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
</script>

<Example>
  <Case label="The nine roles">
    <Stack gap="sm">
      <Text role="num">1,618</Text>
      <Text role="title">The title of a page</Text>
      <Text role="h1">The title of a screen</Text>
      <Text role="h2">The title of a section</Text>
      <Text role="prose">Reading text, one quarter step larger than interface text.</Text>
      <Text>Interface text: list items, cells, controls and paragraphs.</Text>
      <Text role="caption">A caption: notes, dates and hints.</Text>
      <Text role="label">A label: the name of a field or a group</Text>
      <Text role="glyph">A1</Text>
    </Stack>
  </Case>
  <Case label="muted, mono and tabular">
    <Stack gap="sm">
      <Text muted>Secondary information</Text>
      <Text role="caption" mono>name@example.com</Text>
      <Text tabular>1,111.11 and 9,999.99</Text>
    </Stack>
  </Case>
  <Case label="clamp: one line; the full text shows on hover">
    <div style:max-width="16rem">
      <Text clamp>A name that is much too long for the width it is given</Text>
    </div>
  </Case>
  <Case label="lines 2 and wrap">
    <Stack gap="sm">
      <div style:max-width="16rem">
        <Text lines={2}>A comment that runs over more than two lines is cut after the second line with an ellipsis.</Text>
      </div>
      <Text wrap>{'Line breaks\nare kept.'}</Text>
    </Stack>
  </Case>
  <Case label="as a link">
    <Text as="a" href="#top">A name that links, in the colour of the text around it</Text>
  </Case>
</Example>
