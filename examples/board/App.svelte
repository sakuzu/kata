<script lang="ts">
  import { Board, Glyphs, SearchInput } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  let query = $state('');
  let value = $state('★');
  const items = ['★', '☆', '●', '○', '■', '□', '▲', '△', '◆', '◇', '♥', '♦'];
</script>

<Example>
  <Case label="A picker of symbols inside a panel">
    <Surface width="22.5rem">
      <Board>
        <SearchInput bind:value={query} placeholder="Find a symbol" label="Find a symbol" />
        <Glyphs items={items.filter((g) => !query || g.includes(query))} {value} onselect={(g) => (value = g)} />
      </Board>
    </Surface>
  </Case>
</Example>
