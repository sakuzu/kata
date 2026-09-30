<script lang="ts">
  import { Menu, MenuDivider, MenuItem } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
</script>

<Example>
  <Case label="The hover surface of the items meets the line">
    <Menu>
      <div role="menu">
        <MenuItem icon="copy">Duplicate</MenuItem>
        <MenuItem icon="corner-up-right">Move…</MenuItem>
        <MenuDivider />
        <MenuItem icon="ungroup">Ungroup</MenuItem>
        <MenuDivider />
        <MenuItem icon="trash-2" danger>Delete…</MenuItem>
      </div>
    </Menu>
  </Case>
</Example>
