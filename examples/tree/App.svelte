<script lang="ts">
  import Eye from '@lucide/svelte/icons/eye';
  import EyeOff from '@lucide/svelte/icons/eye-off';
  import {
    Button,
    Icon,
    type SortMove,
    Stack,
    sortable,
    Text,
    Tree,
    TreeRow,
  } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  type Item = { id: string; name: string; shown: boolean };
  type Group = { id: string; name: string; open: boolean; items: Item[] };

  let groups = $state<Group[]>([
    {
      id: 'g1',
      name: 'Background',
      open: true,
      items: [
        { id: 'a', name: 'Sky', shown: true },
        { id: 'b', name: 'Hills', shown: false },
      ],
    },
    {
      id: 'g2',
      name: 'Figures',
      open: true,
      items: [
        { id: 'c', name: 'Circle', shown: true },
        { id: 'd', name: 'Arrow', shown: true },
      ],
    },
  ]);
  let picked = $state('c');
  let last = $state('');

  // The application applies a move to its own data; the tree is drawn again from it
  function move(m: SortMove) {
    const from = groups.find((g) => g.id === m.from);
    const to = groups.find((g) => g.id === m.to);
    if (!from || !to) return;
    const [item] = from.items.splice(m.oldIndex, 1);
    to.items.splice(m.newIndex, 0, item);
    last = `${item.name} moved to ${to.name}`;
  }
</script>

<Example>
  <Case label="Groups that open and close; drag a row to reorder it, also into the other group">
    <Surface width="22.5rem">
      <Tree label="Contents">
        {#each groups as g (g.id)}
          <TreeRow expandable bind:expanded={g.open} grip={false}>{g.name}</TreeRow>
          {#if g.open}
            <div
              class="zone"
              role="group"
              aria-label={g.name}
              use:sortable={{ group: 'contents', containerId: g.id, filter: 'button', onDrop: move }}
            >
              {#each g.items as it (it.id)}
                <TreeRow
                  data-sortable-item
                  data-id={it.id}
                  depth={1}
                  sel={picked === it.id}
                  hidden={!it.shown}
                  onclick={() => (picked = it.id)}
                >
                  {it.name}
                  {#snippet end()}
                    <Button
                      variant="ghost"
                      icon
                      data-keep={it.shown ? undefined : ''}
                      aria-label={it.shown ? 'Hide' : 'Show'}
                      onclick={(e) => {
                        e.stopPropagation();
                        it.shown = !it.shown;
                      }}><Icon name={it.shown ? Eye : EyeOff} /></Button
                    >
                  {/snippet}
                </TreeRow>
              {/each}
            </div>
          {/if}
        {/each}
      </Tree>
    </Surface>
    {#if last}<Text role="caption">{last}</Text>{/if}
  </Case>
  <Case label="flat: no row opens, so there is no room for the chevron">
    <Surface width="22.5rem">
      <Stack gap={0}>
        <Tree label="Recent" flat>
          <TreeRow grip={false} onclick={() => {}}>Spring layout</TreeRow>
          <TreeRow grip={false} onclick={() => {}}>Poster draft</TreeRow>
          <TreeRow grip={false} onclick={() => {}}>Floor plan</TreeRow>
        </Tree>
      </Stack>
    </Surface>
  </Case>
  <Case label="rows two: every row has the height of two lines">
    <Surface width="22.5rem">
      <Tree label="Files" flat rows="two">
        <TreeRow grip={false} onclick={() => {}}>
          <Stack gap={0}>
            <Text clamp>Poster draft</Text>
            <Text role="caption" clamp>Edited today</Text>
          </Stack>
        </TreeRow>
        <TreeRow grip={false} onclick={() => {}}>Floor plan</TreeRow>
      </Tree>
    </Surface>
  </Case>
</Example>
