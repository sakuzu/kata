<script lang="ts">
  import { Menu, MenuDivider, MenuHead, MenuItem } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Frame from '../_shared/Frame.svelte';

  let size = $state('large');
  let theme = $state('dark');
</script>

<Example>
  <Case label="Two groups, each with its name">
    <Frame>
      <Menu>
        <div role="menu">
          <MenuHead>Text size</MenuHead>
          <MenuItem checked={size === 'default'} onclick={() => (size = 'default')}>Default</MenuItem>
          <MenuItem checked={size === 'large'} onclick={() => (size = 'large')}>Large</MenuItem>
          <MenuDivider />
          <MenuHead>Theme</MenuHead>
          <MenuItem checked={theme === 'dark'} onclick={() => (theme = 'dark')}>Dark</MenuItem>
          <MenuItem checked={theme === 'light'} onclick={() => (theme = 'light')}>Light</MenuItem>
        </div>
      </Menu>
    </Frame>
  </Case>
</Example>
