<script lang="ts">
  import { Avatar, Kbd, List, ListItem, Row } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';
</script>

<Example>
  <Case label="Two initials, one character, and the small size (in)">
    <Row gap="md"><Avatar initial="SL" /><Avatar initial="山" /><Avatar initial="SL" in /></Row>
  </Case>
  <Case label="At the start of a list item">
    <Surface width="22.5rem">
      <List>
        <ListItem columns="auto minmax(0, 1fr) auto" onclick={() => {}}>
          <Avatar initial="SL" in /><span>Sam Lee</span><Kbd>⌘1</Kbd>
        </ListItem>
      </List>
    </Surface>
  </Case>
</Example>
