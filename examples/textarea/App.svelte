<script lang="ts">
  import { Block, Field, Stack, Textarea } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  let text = $state(
    'The first line.\nThe second line.\nA third line, which grows the box.\nAnd a fourth.',
  );
</script>

<Example>
  <Case label="Two lines by default, one line, and growth up to four lines">
    <Surface width="22.5rem">
      <Block>
        <Stack gap="md">
          <Textarea placeholder="Write a note" ariaLabel="Note" />
          <Textarea rows={1} placeholder="One line to start" ariaLabel="Comment" />
          <Textarea bind:value={text} maxRows={4} ariaLabel="Description" />
        </Stack>
      </Block>
    </Surface>
  </Case>
  <Case label="An error and disabled, in fields">
    <Surface width="22.5rem">
      <Block>
        <Stack gap="lg">
          <Field label="Summary" for="summary" error="The summary is too long.">
            <Textarea id="summary" value="A summary that is far too long." error />
          </Field>
          <Field label="Notes" for="notes">
            <Textarea id="notes" value="Only the owner can change the notes." disabled />
          </Field>
        </Stack>
      </Block>
    </Surface>
  </Case>
</Example>
