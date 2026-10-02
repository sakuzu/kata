<script lang="ts">
  import { Block, Menu, MenuDivider, MenuHead, MenuItem, Stack, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Frame from '../_shared/Frame.svelte';

  let sort = $state('changed');
</script>

<Example>
  <Case label="Actions with icons and keys, and a destructive one after a divider">
    <Frame>
      <Menu>
        <div role="menu">
          <MenuItem icon="copy" kbd="⌘D">Duplicate</MenuItem>
          <MenuItem icon="pencil">Rename…</MenuItem>
          <MenuDivider />
          <MenuItem icon="trash-2" danger>Delete…</MenuItem>
        </div>
      </Menu>
    </Frame>
  </Case>
  <Case label="A choice of one value: the column of check marks">
    <Frame>
      <Menu>
        <div role="menu">
          <MenuHead>Sort by</MenuHead>
          <MenuItem checked={sort === 'opened'} onclick={() => (sort = 'opened')}>Last opened</MenuItem>
          <MenuItem checked={sort === 'changed'} onclick={() => (sort = 'changed')}>Last changed</MenuItem>
          <MenuItem checked={sort === 'name'} onclick={() => (sort = 'name')}>Name</MenuItem>
        </div>
      </Menu>
    </Frame>
  </Case>
  <Case label="A name and an address in a Block, above the items">
    <Frame>
      <Menu>
        <Block>
          <Stack gap={0}>
            <Text clamp>Ana Lima</Text>
            <Text role="caption" muted clamp>ana@example.com</Text>
          </Stack>
        </Block>
        <MenuDivider />
        <div role="menu">
          <MenuItem icon="settings-2" href="#top">Account</MenuItem>
          <MenuItem icon="arrow-up-right">Sign out</MenuItem>
        </div>
      </Menu>
    </Frame>
  </Case>
  <Case label="rows: every item as high as an item with a mark">
    <Frame>
      <Menu rows="mark">
        <div role="menu">
          <MenuItem icon="image">Picture</MenuItem>
          <MenuItem icon="sticky-note">Note</MenuItem>
        </div>
      </Menu>
    </Frame>
  </Case>
</Example>
