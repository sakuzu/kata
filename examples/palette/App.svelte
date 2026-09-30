<script lang="ts">
  import { Palette, Row } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  const schemes = [
    { name: 'Blues', colors: ['#eff3ff', '#bdd7e7', '#6baed6', '#3182bd', '#08519c'] },
    { name: 'Oranges', colors: ['#feedde', '#fdbe85', '#fd8d3c', '#e6550d', '#a63603'] },
    { name: 'Greys', colors: ['#f7f7f7', '#cccccc', '#969696', '#636363', '#252525'] },
  ];
  let current = $state('Blues');
</script>

<Example>
  <Case label="A group of schemes, one chosen, one disabled">
    <div role="radiogroup" aria-label="Color scheme">
      <Row wrap>
        {#each schemes as s (s.name)}
          <Palette colors={s.colors} label={s.name} sel={current === s.name} onclick={() => (current = s.name)} />
        {/each}
        <Palette colors={['#fff', '#000']} label="Unavailable" disabled />
      </Row>
    </div>
  </Case>
</Example>
