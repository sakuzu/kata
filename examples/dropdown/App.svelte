<script lang="ts">
  import {
    Button,
    ColorPicker,
    Dropdown,
    Icon,
    MenuDivider,
    MenuItem,
    Row,
  } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  let sort = $state('changed');
  let color = $state('#2D7FF9');
  const sorts = [
    { value: 'opened', label: 'Last opened' },
    { value: 'changed', label: 'Last changed' },
    { value: 'name', label: 'Name' },
  ];
</script>

<Example>
  <Case label="A menu, open from the start: the arrow keys, Home and End move between the items">
    <Row gap="sm" wrap>
      <Dropdown menu align="start" openInitially role="box">
        {#snippet trigger(toggle, open)}
          <Button trailing="chevron-down" aria-haspopup="menu" aria-expanded={open} onclick={toggle}>
            Sort
          </Button>
        {/snippet}
        {#snippet panel(close)}
          {#each sorts as s (s.value)}
            <MenuItem
              checked={sort === s.value}
              onclick={() => {
                sort = s.value;
                close();
              }}>{s.label}</MenuItem
            >
          {/each}
        {/snippet}
      </Dropdown>
      <Dropdown menu role="icon-button">
        {#snippet trigger(toggle, open)}
          <Button
            variant="ghost"
            icon
            aria-label="More"
            aria-haspopup="menu"
            aria-expanded={open}
            onclick={toggle}><Icon name="ellipsis" /></Button
          >
        {/snippet}
        {#snippet panel(close)}
          <MenuItem icon="settings-2" onclick={close}>Settings</MenuItem>
          <MenuItem icon="copy" onclick={close}>Duplicate</MenuItem>
          <MenuDivider />
          <MenuItem icon="trash-2" danger onclick={close}>Delete…</MenuItem>
        {/snippet}
      </Dropdown>
      <Dropdown bare align="start" role="box">
        {#snippet trigger(toggle, open)}
          <Button trailing="chevron-down" aria-expanded={open} onclick={toggle}>Colour</Button>
        {/snippet}
        {#snippet panel(close)}
          <ColorPicker value={color} onpick={(c) => (color = c)} onclose={close} />
        {/snippet}
      </Dropdown>
    </Row>
  </Case>
</Example>
