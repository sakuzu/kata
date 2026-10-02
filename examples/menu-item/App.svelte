<script lang="ts">
  import { Menu, MenuItem, Stack, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Frame from '../_shared/Frame.svelte';

  let grid = $state(true);
  let rulers = $state(false);
</script>

<Example>
  <Case label="An icon, a key, a submenu, an open submenu and disabled">
    <Frame>
      <Menu>
        <div role="menu">
          <MenuItem icon="plus" kbd="⌘N">New</MenuItem>
          <MenuItem sub>Arrange</MenuItem>
          <MenuItem sub on>Align (its submenu is open)</MenuItem>
          <MenuItem disabled>Paste</MenuItem>
          <MenuItem icon="trash-2" danger>Delete…</MenuItem>
        </div>
      </Menu>
    </Frame>
  </Case>
  <Case label="checked: the column of check marks, and a link (href)">
    <Frame>
      <Menu>
        <div role="menu">
          <MenuItem checked={grid} onclick={() => (grid = !grid)}>Grid</MenuItem>
          <MenuItem checked={rulers} onclick={() => (rulers = !rulers)}>Rulers</MenuItem>
          <MenuItem icon="arrow-up-right" href="#top">Open the help</MenuItem>
        </div>
      </Menu>
    </Frame>
  </Case>
  <Case label="Two lines: a Stack makes the item grow">
    <Frame>
      <Menu>
        <div role="menu">
          <MenuItem>
            <Stack gap="sm">
              <Text>Copy a link</Text>
              <Text role="caption" muted>Anyone in the team can open it</Text>
            </Stack>
          </MenuItem>
          <MenuItem>A long name for an item that does not fit on one line of the menu</MenuItem>
        </div>
      </Menu>
    </Frame>
  </Case>
</Example>
