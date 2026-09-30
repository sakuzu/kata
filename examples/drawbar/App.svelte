<script lang="ts">
  import MousePointer from '@lucide/svelte/icons/mouse-pointer';
  import Trash from '@lucide/svelte/icons/trash-2';
  import Type from '@lucide/svelte/icons/type';
  import { Drawbar, type DrawbarTool } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  const tools: DrawbarTool[] = [
    { id: 'select', label: 'Select', icon: MousePointer, kbd: 'V', group: 'pick' },
    { id: 'point', label: 'Point', icon: 'point', kbd: 'P', group: 'draw' },
    { id: 'polyline', label: 'Line', icon: 'polyline', kbd: 'L', group: 'draw' },
    { id: 'arrow', label: 'Arrow', icon: 'arrow', kbd: 'A', group: 'draw' },
    { id: 'polygon', label: 'Shape', icon: 'polygon', kbd: 'S', group: 'draw' },
    { id: 'note', label: 'Note', icon: 'sticky-note', kbd: 'N', group: 'text' },
    { id: 'text', label: 'Text', icon: Type, kbd: 'T', group: 'text' },
    { id: 'delete', label: 'Delete', icon: Trash, group: 'edit', tone: 'danger' },
  ];
  let tool = $state('polyline');
</script>

<Example>
  <Case label="Groups of tools, the current one on; bottom md (the default)">
    <div class="area">
      <Drawbar
        label="Tools"
        {tools}
        current={tool}
        onselect={(id) => {
          if (id !== 'delete') tool = id;
        }}
      />
    </div>
  </Case>
  <Case label="bottom 0, and a disabled tool">
    <div class="area">
      <Drawbar
        label="Tools"
        bottom={0}
        tools={tools.map((t) => (t.id === 'delete' ? { ...t, disabled: true } : t))}
        current="select"
      />
    </div>
  </Case>
</Example>

<style>
  /* The drawing area: a positioned container */
  .area {
    position: relative;
    height: 10rem;
    background: var(--kata-color-ground);
    border: var(--kata-border-width) solid var(--kata-color-line);
  }
</style>
