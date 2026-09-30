<script lang="ts">
  import { Block, Note, Stack } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';
</script>

<Example>
  <Case label="Muted, a warning and an error, with and without an icon">
    <Stack gap="md">
      <Note>Importing does not change the original file.</Note>
      <Note tone="warn" icon="triangle-alert">This cannot be undone.</Note>
      <Note tone="error" icon="circle-alert">The link is broken.</Note>
      <Note icon="info">A note can run over several lines when the place is narrow; the icon stays on the first line.</Note>
    </Stack>
  </Case>
  <Case label="clamp: one line with an ellipsis; the full text shows on hover">
    <Surface width="16rem">
      <Block>
        <Note clamp>The link to the source file is broken since it was moved.</Note>
      </Block>
    </Surface>
  </Case>
</Example>
