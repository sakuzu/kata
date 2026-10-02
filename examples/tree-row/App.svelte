<script lang="ts">
  import Eye from '@lucide/svelte/icons/eye';
  import EyeOff from '@lucide/svelte/icons/eye-off';
  import Lock from '@lucide/svelte/icons/lock';
  import { Button, Icon, Kebab, Text, Tree, TreeRow } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  let open = $state(true);
  let chosen = $state('');
</script>

<Example>
  <Case label="Depths, a row that opens, the selected row, the grip always shown">
    <Surface width="22.5rem">
      <Tree label="Contents">
        <TreeRow expandable bind:expanded={open} gripShow>Background</TreeRow>
        {#if open}
          <TreeRow depth={1} gripShow>Sky</TreeRow>
          <TreeRow depth={1} sel gripShow onclick={() => {}}>Hills</TreeRow>
          <TreeRow depth={2} gripShow>Tree line</TreeRow>
        {/if}
        <TreeRow gripShow>Figures</TreeRow>
      </Tree>
    </Surface>
  </Case>
  <Case label="States: hidden, dimmed (a parent is hidden), dragging">
    <Surface width="22.5rem">
      <Tree label="States">
        <TreeRow hidden>
          Hidden row
          {#snippet end()}
            <Button variant="ghost" icon data-keep aria-label="Show"><Icon name={EyeOff} /></Button>
          {/snippet}
        </TreeRow>
        <TreeRow depth={1} dimmed>Under a hidden row</TreeRow>
        <TreeRow dragging>Being dragged</TreeRow>
      </Tree>
    </Surface>
  </Case>
  <Case label="Actions on hover and focus, data-keep keeps one in view; a long name in a Text with clamp">
    <Surface width="22.5rem">
      <Tree label="Actions">
        <TreeRow onclick={() => {}}>
          <Icon name="polygon" /> Shape
          {#snippet end()}
            <Button variant="ghost" icon data-keep aria-label="Unlock"><Icon name={Lock} /></Button>
            <Button variant="ghost" icon aria-label="Hide"><Icon name={Eye} /></Button>
          {/snippet}
        </TreeRow>
        <TreeRow onclick={() => {}}>
          <Icon name="polyline" />
          <Text as="span" clamp>A line with a long name that ends with an ellipsis</Text>
          {#snippet end()}
            <Button variant="ghost" icon aria-label="Hide"><Icon name={Eye} /></Button>
          {/snippet}
        </TreeRow>
      </Tree>
    </Surface>
  </Case>
  <Case label="A Kebab among the actions: its menu covers the next row and keeps the actions shown">
    <Surface width="22.5rem">
      <Tree label="Menus">
        {#each ['First', 'Second', 'Third'] as name (name)}
          <TreeRow onclick={() => {}} data-id={name}>
            {name}
            {#snippet end()}
              <Kebab
                items={[
                  { id: 'rename', label: 'Rename' },
                  { id: 'duplicate', label: 'Duplicate' },
                ]}
                onselect={(id) => (chosen = `${id} ${name}`)}
              />
            {/snippet}
          </TreeRow>
        {/each}
      </Tree>
    </Surface>
    <Text role="caption" muted>{chosen ? `Chose ${chosen}` : 'Nothing chosen'}</Text>
  </Case>
</Example>
