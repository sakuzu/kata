<script lang="ts">
  import { Block, ColorGrid } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  const colors = [
    { name: 'Red', hex: '#E5484D' },
    { name: 'Orange', hex: '#D9730D' },
    { name: 'Gold', hex: '#C29210' },
    { name: 'Green', hex: '#2E9E5B' },
    { name: 'Blue', hex: '#2D7FF9' },
    { name: 'Purple', hex: '#8A5CF6' },
    { name: 'Black', hex: '#1B1B1B' },
    { name: 'Brown', hex: '#9A6B43' },
    { name: 'White', hex: '#FFFFFF' },
  ];
  let value = $state('#2D7FF9');
</script>

<Example>
  <Case label="Nine columns, one color chosen">
    <Surface width="15rem">
      <Block>
        <ColorGrid {colors} {value} label="Color" onselect={(hex) => (value = hex)} />
      </Block>
    </Surface>
  </Case>
  <Case label="Five columns">
    <Surface width="10rem">
      <Block>
        <ColorGrid colors={colors.slice(0, 5)} columns={5} label="Accent" onselect={() => {}} />
      </Block>
    </Surface>
  </Case>
</Example>
