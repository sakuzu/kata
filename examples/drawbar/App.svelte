<script lang="ts">
  import Circle from '@lucide/svelte/icons/circle';
  import Grid from '@lucide/svelte/icons/grid-3x3';
  import Magnet from '@lucide/svelte/icons/magnet';
  import MousePointer from '@lucide/svelte/icons/mouse-pointer';
  import Type from '@lucide/svelte/icons/type';
  import { Drawbar, type DrawbarToggle, type DrawbarTool } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  const tools: DrawbarTool[] = [
    { id: 'select', label: 'Select', icon: MousePointer, kbd: 'V', group: 'pick' },
    { id: 'point', label: 'Point', icon: 'point', kbd: 'P', group: 'draw' },
    { id: 'polyline', label: 'Line', icon: 'polyline', kbd: 'L', group: 'draw' },
    { id: 'arrow', label: 'Arrow', icon: 'arrow', kbd: 'A', group: 'draw' },
    { id: 'polygon', label: 'Shape', icon: 'polygon', kbd: 'S', group: 'draw' },
    { id: 'circle', label: 'Circle', icon: Circle, kbd: 'O', group: 'draw' },
    { id: 'note', label: 'Note', icon: 'sticky-note', kbd: 'N', group: 'text' },
    { id: 'text', label: 'Text', icon: Type, kbd: 'T', group: 'text' },
  ];
  let tool = $state('polyline');
  let snap = $state(true);
  let grid = $state(false);
  const toggles: DrawbarToggle[] = $derived([
    { id: 'snap', label: 'Snap', icon: Magnet, kbd: '⇧S', on: snap, onchange: (v) => (snap = v) },
    { id: 'grid', label: 'Grid', icon: Grid, kbd: '⇧G', on: grid, onchange: (v) => (grid = v) },
  ]);
  const deleteTool: DrawbarTool = {
    id: 'delete',
    label: 'Delete',
    icon: 'trash-2',
    group: 'edit',
    tone: 'danger',
  };
</script>

<Example>
  <Case label="Eight tools and two switches, all of them fitting">
    <div class="area">
      <Drawbar label="Tools" {tools} {toggles} current={tool} onselect={(id) => (tool = id)} />
    </div>
  </Case>
  <Case label="A narrower area (24rem): what does not fit folds into More">
    <div class="area" style:max-width="24rem">
      <Drawbar label="Tools" {tools} {toggles} current={tool} onselect={(id) => (tool = id)} />
    </div>
  </Case>
  <Case label="The narrowest (14rem): the current tool always shows">
    <div class="area" style:max-width="14rem">
      <Drawbar label="Tools" {tools} {toggles} current={tool} onselect={(id) => (tool = id)} />
    </div>
  </Case>
  <Case label="bottom 0, a tool that removes (danger) and a disabled one">
    <div class="area">
      <Drawbar
        label="Tools"
        bottom={0}
        tools={[
          ...tools.slice(0, 3),
          { ...tools[3], disabled: true },
          deleteTool,
        ]}
        current="select"
      />
    </div>
  </Case>
</Example>

<style>
  /* The stage: a positioned container */
  .area {
    position: relative;
    height: 10rem;
    background: var(--kata-color-ground);
    border: var(--kata-border-width) solid var(--kata-color-line);
  }
</style>
