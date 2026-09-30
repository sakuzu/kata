<script lang="ts">
  import Grid from '@lucide/svelte/icons/layout-grid';
  import List from '@lucide/svelte/icons/list';
  import { Segmented } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Small from '../_shared/Small.svelte';

  let view = $state<'grid' | 'list' | 'table'>('grid');
  let unit = $state<'px' | 'pt' | 'mm'>('px');
  let shape = $state<'grid' | 'list'>('grid');
</script>

<Example>
  <Case label="Text options, one disabled">
    <Segmented
      bind:value={view}
      ariaLabel="View"
      options={[
        { value: 'grid', label: 'Grid' },
        { value: 'list', label: 'List' },
        { value: 'table', label: 'Table', disabled: true },
      ]}
    />
  </Case>
  <Case label="Icon options are square">
    <Segmented
      bind:value={shape}
      ariaLabel="Layout"
      options={[
        { value: 'grid', icon: Grid, ariaLabel: 'Grid' },
        { value: 'list', icon: List, ariaLabel: 'List' },
      ]}
    />
  </Case>
  <Case label="The small button, declared by the container">
    <Small>
      <Segmented
        bind:value={unit}
        ariaLabel="Unit"
        options={[
          { value: 'px', label: 'px' },
          { value: 'pt', label: 'pt' },
          { value: 'mm', label: 'mm' },
        ]}
      />
    </Small>
  </Case>
</Example>
