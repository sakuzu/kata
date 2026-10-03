<script lang="ts">
  import Ellipsis from '@lucide/svelte/icons/ellipsis';
  import FileText from '@lucide/svelte/icons/file-text';
  import {
    Button,
    Checkbox,
    Icon,
    List,
    ListItem,
    Panel,
    Stack,
    Text,
    Toggle,
  } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  let on = $state(true);
  let snap = $state(true);
  let shared = $state(false);
</script>

<Example>
  <Case label="Pressed (onclick), a link (href), selected and disabled">
    <Surface width="22.5rem">
      <List>
        <ListItem columns="auto minmax(0, 1fr)" onclick={() => {}}>
          <Icon name={FileText} /><span>Opens on a press</span>
        </ListItem>
        <ListItem columns="auto minmax(0, 1fr)" href="#top">
          <Icon name={FileText} /><span>A link</span>
        </ListItem>
        <ListItem columns="auto minmax(0, 1fr)" sel onclick={() => {}}>
          <Icon name={FileText} /><span>Selected</span>
        </ListItem>
        <ListItem columns="auto minmax(0, 1fr)" disabled onclick={() => {}}>
          <Icon name={FileText} /><span>Cannot be pressed now</span>
        </ListItem>
      </List>
    </Surface>
  </Case>
  <Case label="Plain items with lines between them">
    <Surface width="22.5rem">
      <List>
        <ListItem columns="minmax(0, 1fr) auto" plain rule>
          <span>Notifications</span>
          <Toggle bind:checked={on} ariaLabel="Notifications" />
        </ListItem>
        <ListItem columns="minmax(0, 1fr) auto" plain rule>
          <span>A name that is too long for the item ends with an ellipsis</span>
          <Text role="caption" as="span">Today</Text>
        </ListItem>
      </List>
    </Surface>
  </Case>
  <Case label="In a panel, a Toggle (between) and a Checkbox among plain items: the names at the same x">
    <Panel side="panel" fit label="Settings">
      <List>
        <ListItem columns="minmax(0, 1fr)" plain rule>
          <span>Grid</span>
        </ListItem>
        <ListItem columns="minmax(0, 1fr)" plain rule>
          <Toggle bind:checked={snap} label="Snap to grid" between />
        </ListItem>
        <ListItem columns="minmax(0, 1fr)" plain rule>
          <Checkbox bind:checked={shared} label="Share with the team" />
        </ListItem>
        <ListItem columns="minmax(0, 1fr) auto" plain rule>
          <span>Notifications</span>
          <Toggle bind:checked={on} ariaLabel="Notifications" />
        </ListItem>
      </List>
    </Panel>
  </Case>
  <Case label="A title and a caption (the item grows), and tail with an icon button">
    <Surface width="22.5rem">
      <List>
        <ListItem columns="auto minmax(0, 1fr) auto" tail plain rule>
          <Icon name={FileText} />
          <Stack gap="sm">
            <Text clamp>Quarterly report</Text>
            <Text role="caption" clamp>Edited 3 minutes ago</Text>
          </Stack>
          <Button variant="ghost" icon aria-label="More"><Icon name={Ellipsis} /></Button>
        </ListItem>
      </List>
    </Surface>
  </Case>
</Example>
