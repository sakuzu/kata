<script lang="ts">
  import FileText from '@lucide/svelte/icons/file-text';
  import Folder from '@lucide/svelte/icons/folder';
  import { Icon, List, ListItem, Markbox, Swatch } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';
</script>

<Example>
  <Case label="Marks of different sizes keep the first column in place">
    <Surface width="22.5rem">
      <List>
        <ListItem columns="auto minmax(0, 1fr)" onclick={() => {}}>
          <Markbox><Icon name={Folder} /></Markbox><span>An icon</span>
        </ListItem>
        <ListItem columns="auto minmax(0, 1fr)" onclick={() => {}}>
          <Markbox><Swatch color="#2d7ff9" /></Markbox><span>A colour</span>
        </ListItem>
        <ListItem columns="auto minmax(0, 1fr)" onclick={() => {}}>
          <Markbox glyph>🏔️</Markbox><span>An emoji</span>
        </ListItem>
        <ListItem columns="auto minmax(0, 1fr)" onclick={() => {}}>
          <Markbox><Icon name={FileText} /></Markbox><span>Another icon</span>
        </ListItem>
      </List>
    </Surface>
  </Case>
</Example>
