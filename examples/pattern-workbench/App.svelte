<script lang="ts">
  import Layers from '@lucide/svelte/icons/layers';
  import MousePointer from '@lucide/svelte/icons/mouse-pointer';
  import PanelLeft from '@lucide/svelte/icons/panel-left';
  import PanelRight from '@lucide/svelte/icons/panel-right';
  import Square from '@lucide/svelte/icons/square';
  import {
    Block,
    Button,
    Drawbar,
    type DrawbarTool,
    FieldList,
    type FieldSpec,
    Icon,
    InspectorFrame,
    InspectorSection,
    Kebab,
    LayerTree,
    Panel,
    SelectionSummary,
    Shell,
    type Shortcut,
    Text,
    Toolbar,
    Topbar,
    type TreeNode,
  } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import { appMenu } from '../_shared/menu.js';

  // The application's own data: the drawing, the selection and the tool
  const shape = (id: string, name: string, icon: TreeNode['icon'], iconColor: string) =>
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
        shape('path', 'Path', 'polyline', '#3b82f6'),
        shape('field', 'Field', 'polygon', '#3f9d5a'),
        shape('gate', 'Gate', 'point', '#d9a441'),
      ],
    },
    {
      id: 'notes',
      kind: 'layer',
      name: 'Notes',
      icon: Layers,
      visible: true,
      locked: false,
      children: [shape('reminder', 'Check the gate', 'sticky-note', '#d9a441')],
    },
  ]);
  let selected = $state<string[]>(['field']);
  let expanded = $state<string[]>(['sketch', 'notes']);
  let leftOpen = $state(true);
  let rightOpen = $state(true);
  let tool = $state('select');
  let style = $state<Record<string, Record<string, unknown>>>({});

  function find(id: string, list = nodes): TreeNode | undefined {
    for (const n of list) {
      if (n.id === id) return n;
      const inner = n.children && find(id, n.children);
      if (inner) return inner;
    }
    return undefined;
  }
  const one = $derived(selected.length === 1 ? find(selected[0]) : undefined);
  const fields = $derived<FieldSpec[]>(
    one
      ? [
          {
            key: 'fill',
            kind: 'color',
            label: 'Fill',
            value: style[one.id]?.fill ?? one.iconColor,
          },
          {
            key: 'width',
            kind: 'number',
            label: 'Line width',
            unit: 'px',
            min: 0,
            value: style[one.id]?.width ?? 2,
          },
        ]
      : [],
  );
  // What the selected shapes share; a value they do not share shows as mixed
  const shared = $derived<FieldSpec[]>(
    (() => {
      const widths = new Set(selected.map((id) => style[id]?.width ?? 2));
      return [
        {
          key: 'width',
          kind: 'number',
          label: 'Line width',
          unit: 'px',
          min: 0,
          value: [...widths][0],
          mixed: widths.size > 1,
        },
      ];
    })(),
  );
  function change(key: string, value: unknown) {
    for (const id of selected) style[id] = { ...style[id], [key]: value };
  }

  const tools: DrawbarTool[] = [
    { id: 'select', label: 'Select', icon: MousePointer, kbd: 'V', group: 'pick' },
    { id: 'line', label: 'Line', icon: 'polyline', kbd: 'L', group: 'draw' },
    { id: 'shape', label: 'Shape', icon: Square, kbd: 'S', group: 'draw' },
    { id: 'note', label: 'Note', icon: 'sticky-note', kbd: 'N', group: 'text' },
  ];
  const shortcuts: Shortcut[] = [
    ...tools.map((t) => ({
      key: t.kbd?.toLowerCase() ?? '',
      label: t.label,
      group: 'Tools',
      run: () => {
        tool = t.id;
      },
    })),
    {
      key: 'shift+l',
      label: 'Show the layers',
      group: 'Panels',
      run: () => (leftOpen = !leftOpen),
    },
    {
      key: 'shift+r',
      label: 'Show the inspector',
      group: 'Panels',
      run: () => (rightOpen = !rightOpen),
    },
  ];
</script>

{#snippet bar()}
  <Topbar brand="Sketchbook" brandLabel="Sketchbook menu" menu={appMenu}>
    {#snippet center()}<Text clamp>Garden plan</Text>{/snippet}
    {#snippet end({ compact }: { compact: boolean })}
      {#if compact}
        <Kebab
          items={[
            { id: 'layers', label: 'Layers', checked: leftOpen },
            { id: 'inspector', label: 'Inspector', checked: rightOpen },
          ]}
          onselect={(id) => (id === 'layers' ? (leftOpen = !leftOpen) : (rightOpen = !rightOpen))}
        />
      {:else}
        <Button
          variant="ghost"
          icon
          aria-label="Layers"
          aria-pressed={leftOpen}
          onclick={() => (leftOpen = !leftOpen)}
        >
          <Icon name={PanelLeft} />
        </Button>
        <Button
          variant="ghost"
          icon
          aria-label="Inspector"
          aria-pressed={rightOpen}
          onclick={() => (rightOpen = !rightOpen)}
        >
          <Icon name={PanelRight} />
        </Button>
      {/if}
    {/snippet}
  </Topbar>
{/snippet}

{#snippet layers()}
  <Panel label="Layers">
    <LayerTree
      label="Layers"
      {nodes}
      bind:selected
      bind:expanded
      onvisible={(id, v) => {
        const n = find(id);
        if (n) n.visible = v;
      }}
      onrename={(id, name) => {
        const n = find(id);
        if (n) n.name = name;
      }}
    />
  </Panel>
{/snippet}

{#snippet inspector()}
  {#if selected.length > 1}
    <SelectionSummary
      count={selected.length}
      kinds={[{ label: 'Shapes', count: selected.length }]}
      onclose={() => (selected = [])}
    >
      {#snippet fields()}
        <FieldList fields={shared} onchange={change} />
      {/snippet}
    </SelectionSummary>
  {:else if one}
    <InspectorFrame
      title={one.name}
      ontitle={(next) => {
        if (one && next) one.name = next;
      }}
      subtitle={one.kind === 'layer' ? 'Layer' : 'Shape'}
      onclose={() => (rightOpen = false)}
    >
      <InspectorSection title="Style">
        <FieldList {fields} onchange={change} />
      </InspectorSection>
    </InspectorFrame>
  {:else}
    <Panel label="Inspector">
      {#snippet head()}<Toolbar title="Inspector" rule />{/snippet}
      <Block><Text muted>Select something on the stage to change it here.</Text></Block>
    </Panel>
  {/if}
{/snippet}

{#snippet surface()}<div class="grid" aria-label="Drawing" role="img"></div>{/snippet}

{#snippet toolbar()}
  <Drawbar label="Tools" {tools} current={tool} onselect={(id) => (tool = id)} />
{/snippet}

<Example>
  <Case label="The bar with the application's menu, the layers on the left, the inspector of the selection on the right, the stage and its tools">
    <div class="frame">
      <Shell
        bind:leftOpen
        bind:rightOpen
        {shortcuts}
        leftLabel="Layers"
        rightLabel="Inspector"
        onescape={() => (selected = [])}
        top={bar}
        left={layers}
        right={inspector}
        stage={surface}
        bottom={toolbar}
      />
    </div>
  </Case>
</Example>

<style>
  /* The shell fills its frame, as it fills the window of an application */
  .frame {
    position: relative;
    height: 36rem;
    background: var(--kata-color-ground);
    border: var(--kata-border-width) solid var(--kata-color-line);
  }
  /* A plain drawing surface with a grid */
  .grid {
    width: 100%;
    height: 100%;
    background-color: var(--kata-color-ground);
    background-image:
      linear-gradient(var(--kata-color-line) var(--kata-border-width), transparent 0),
      linear-gradient(90deg, var(--kata-color-line) var(--kata-border-width), transparent 0);
    background-size: var(--kata-gap-xl) var(--kata-gap-xl);
    background-position: center;
  }
</style>
