<script lang="ts">
  import Folder from '@lucide/svelte/icons/folder';
  import { Icon, List, ListItem, Row, Tile } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';
</script>

<Example>
  <Case label="An initial, two initials and an icon">
    <Row><Tile>W</Tile><Tile>DS</Tile><Tile><Icon name={Folder} /></Tile></Row>
  </Case>
  <Case label="At the start of a list item">
    <Surface width="22.5rem">
      <List>
        <ListItem columns="auto minmax(0, 1fr)" onclick={() => {}}>
          <Tile>W</Tile><span>Workspace</span>
        </ListItem>
        <ListItem columns="auto minmax(0, 1fr)" onclick={() => {}}>
          <Tile>DS</Tile><span>Design studio</span>
        </ListItem>
      </List>
    </Surface>
  </Case>
</Example>
