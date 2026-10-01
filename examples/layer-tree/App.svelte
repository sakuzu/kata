<script lang="ts">
  import Folder from '@lucide/svelte/icons/folder';
  import Layers from '@lucide/svelte/icons/layers';
  import {
    Button,
    Icon,
    LayerTree,
    Markbox,
    Swatch,
    Text,
    type TreeMove,
    type TreeNode,
  } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  const shape = (id: string, name: string, icon: TreeNode['icon'], iconColor?: string) =>
    ({ id, kind: 'shape', name, icon, iconColor, visible: true, locked: false }) as TreeNode;

  let nodes = $state<TreeNode[]>([
    {
      id: 'sketch',
      kind: 'layer',
      name: 'Sketch',
      icon: Layers,
      visible: true,
      locked: false,
      children: [
        {
          id: 'trees',
          kind: 'group',
          name: 'Trees',
          visible: true,
          locked: false,
          children: [
            shape('oak', 'Oak', 'point', '#3f9d5a'),
            shape('pine', 'Pine', 'point', '#2f7d4a'),
          ],
        },
        shape('river', 'River', 'polyline', '#3b82f6'),
        shape('pond', 'Pond', 'polygon', '#60a5fa'),
      ],
    },
    {
      id: 'notes',
      kind: 'layer',
      name: 'Notes',
      icon: Layers,
      visible: true,
      locked: false,
      children: [
        shape('to-pond', 'Look at the pond', 'arrow', '#d9a441'),
        shape('reminder', 'Ask about the bridge', 'sticky-note', '#d9a441'),
      ],
    },
    {
      id: 'background',
      kind: 'layer',
      name: 'Background',
      icon: Layers,
      visible: false,
      locked: true,
      children: [shape('paper', 'Paper', 'image')],
    },
  ]);
  let flat = $state<TreeNode[]>([
    shape('note', 'Note', 'sticky-note', '#d9a441'),
    shape('frame', 'Frame', 'polygon', '#8a5cf6'),
  ]);
  let flatSelected = $state<string[]>([]);

  // Rows that change their own parts
  let own = $state<TreeNode[]>([
    {
      id: 'ink',
      kind: 'layer',
      name: 'Ink',
      icon: Layers,
      visible: true,
      locked: false,
      current: true,
      children: [shape('outline', 'Outline', 'polyline', '#3b82f6')],
    },
    { ...shape('guides', 'Guides', 'polyline', '#8a5cf6'), eye: false },
    { ...shape('paper', 'Paper', 'image'), lock: false },
    { ...shape('frame', 'Frame', 'polygon', '#d9a441'), draggable: false },
    { ...shape('title', 'Title block', 'sticky-note', '#d9a441'), selectable: false },
    {
      id: 'archive',
      kind: 'layer',
      name: 'Archive',
      icon: Layers,
      visible: false,
      locked: false,
      children: [{ ...shape('old', 'Old sketch', 'polyline'), eyeDisabled: 'The layer is hidden' }],
    },
  ]);
  let ownSelected = $state<string[]>([]);
  let ownExpanded = $state<string[]>(['ink', 'archive']);
  const findOwn = (id: string, list = own): TreeNode | undefined => {
    for (const n of list) {
      if (n.id === id) return n;
      const inner = n.children && findOwn(id, n.children);
      if (inner) return inner;
    }
    return undefined;
  };
  let selected = $state<string[]>(['river']);
  let expanded = $state<string[]>(['sketch', 'trees', 'notes']);
  let last = $state('');

  function find(id: string, list = nodes): TreeNode | undefined {
    for (const n of list) {
      if (n.id === id) return n;
      const inner = n.children && find(id, n.children);
      if (inner) return inner;
    }
    return undefined;
  }
  function parentList(id: string, list = nodes): TreeNode[] | undefined {
    for (const n of list) {
      if (n.id === id) return list;
      const inner = n.children && parentList(id, n.children);
      if (inner) return inner;
    }
    return undefined;
  }

  // The application applies a move to its own data; the tree is drawn again from it
  function move(m: TreeMove) {
    const from = parentList(m.id);
    const node = find(m.id);
    const to = m.parentId ? find(m.parentId)?.children : nodes;
    if (!from || !node || !to) return;
    from.splice(from.indexOf(node), 1);
    to.splice(m.index, 0, node);
    last = `${node.name} moved to ${m.parentId ? find(m.parentId)?.name : 'the top'}`;
  }

  function add(id: string) {
    const n = nodes.length + 1;
    const layer: TreeNode = {
      id: `new-${n}`,
      kind: 'layer',
      name: `Layer ${n}`,
      icon: Layers,
      visible: true,
      locked: false,
      children: [],
    };
    if (id === 'layer') nodes.unshift(layer);
    last = `Added ${id}`;
  }
</script>

<Example>
  <Case label="Layers, groups and shapes: select, show, lock, rename (F2) and drag to reorder">
    <Surface width="22.5rem">
      <LayerTree
        label="Layers"
        {nodes}
        bind:selected
        bind:expanded
        onvisible={(id, v) => {
          const n = find(id);
          if (n) n.visible = v;
        }}
        onlock={(id, v) => {
          const n = find(id);
          if (n) n.locked = v;
        }}
        onrename={(id, name) => {
          const n = find(id);
          if (n) n.name = name;
        }}
        onmove={move}
        addMenu={[
          { id: 'layer', label: 'Layer' },
          { id: 'group', label: 'Group', disabled: true },
        ]}
        onadd={add}
      >
        {#snippet row(node, name)}
          {#if node.kind === 'group'}
            <Markbox><Icon name={Folder} /></Markbox>
            {@render name(node)}
            {#if !expanded.includes(node.id)}<Text muted>{node.children?.length ?? 0}</Text>{/if}
          {:else}
            {#if node.icon}
              <Markbox>
                {#if node.iconColor}
                  <Swatch shape="icon" icon={node.icon} color={node.iconColor} />
                {:else}
                  <Icon name={node.icon} />
                {/if}
              </Markbox>
            {/if}
            {@render name(node)}
          {/if}
        {/snippet}
      </LayerTree>
    </Surface>
    <Text role="caption" muted>
      {selected.length} selected{last ? `; ${last}` : ''}
    </Text>
  </Case>
  <Case label="No head, the grip always shown (gripOnly), and an action before the eye">
    <Surface width="22.5rem">
      <LayerTree
        label="Shapes"
        head={false}
        gripOnly
        nodes={flat}
        bind:selected={flatSelected}
        onvisible={(id, v) => {
          const n = flat.find((x) => x.id === id);
          if (n) n.visible = v;
        }}
        onmove={(m) => {
          const i = flat.findIndex((x) => x.id === m.id);
          const [n] = flat.splice(i, 1);
          flat.splice(m.index, 0, n);
        }}
      >
        {#snippet actions()}
          <Button variant="ghost" icon aria-label="Duplicate"><Icon name="copy" /></Button>
        {/snippet}
      </LayerTree>
    </Surface>
  </Case>
  <Case
    label="Each row's own parts: no eye, no lock, not dragged, not selectable, an eye that cannot be pressed, the current row, subrows, and the actions after the eye and the lock"
  >
    <Surface width="22.5rem">
      <LayerTree
        label="Layers"
        head={false}
        nodes={own}
        bind:selected={ownSelected}
        bind:expanded={ownExpanded}
        actionsAfter
        onvisible={(id, v) => {
          const n = findOwn(id);
          if (n) n.visible = v;
        }}
        onlock={(id, v) => {
          const n = findOwn(id);
          if (n) n.locked = v;
        }}
        onmove={(m) => {
          if (m.parentId) return;
          const i = own.findIndex((x) => x.id === m.id);
          const [n] = own.splice(i, 1);
          own.splice(m.index, 0, n);
        }}
      >
        {#snippet actions()}
          <Button variant="ghost" icon aria-label="More"><Icon name="ellipsis" /></Button>
        {/snippet}
        {#snippet subrows(node)}
          {#if node.current}<Text role="caption" muted>New shapes go into this layer.</Text>{/if}
        {/snippet}
      </LayerTree>
    </Surface>
  </Case>
</Example>
