<script lang="ts">
  import Undo from '@lucide/svelte/icons/undo-2';
  import { Button, Icon, Row, Stack, Tooltip } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
</script>

<Example>
  <Case label="The look (inline): a word, and a word with its key">
    <Stack gap="sm" align="start">
      <Tooltip inline text="Undo" shortcut="⌘Z" role="box">
        <Button variant="ghost" icon tip={false} aria-label="Undo"><Icon name={Undo} /></Button>
      </Tooltip>
      <Tooltip inline text="Edit the points" shortcut="E" role="box">
        <Button leading="pencil" tip={false}>Edit</Button>
      </Tooltip>
      <Tooltip inline text="Search" role="box">
        <Button variant="ghost" icon tip={false} aria-label="Search"><Icon name="search" /></Button>
      </Tooltip>
    </Stack>
  </Case>
  <Case label="On hover after a short wait, or at once on keyboard focus">
    <Row gap="sm" wrap>
      <Tooltip text="Undo" shortcut="⌘Z" role="box">
        <Button variant="ghost" icon tip={false} aria-label="Undo"><Icon name={Undo} /></Button>
      </Tooltip>
      <Tooltip text="Edit the points" shortcut="E" role="box">
        <Button leading="pencil" tip={false}>Edit</Button>
      </Tooltip>
      <Tooltip text="A word only" role="box"><Button tip={false}>Hover</Button></Tooltip>
    </Row>
  </Case>
</Example>
