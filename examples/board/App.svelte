<script lang="ts">
  import { Block, Board, Glyphs, List, ListItem, SearchInput, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  let query = $state('');
  let value = $state('★');
  const items = ['★', '☆', '●', '○', '■', '□', '▲', '△', '◆', '◇', '♥', '♦'];
  let setQuery = $state('');
  let set = $state('Shapes');
  const sets = ['Shapes', 'Arrows', 'Weather', 'Transport'];
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
  <Case label="bare, in a slot that draws the surface and the line">
    <Surface width="22.5rem">
      <Board bare>
        <Glyphs {items} {value} onselect={(g) => (value = g)} />
      </Board>
    </Surface>
  </Case>
  <Case label="flush: a list reaches the line of the board; the search goes in a Block">
    <Surface width="22.5rem">
      <Board flush>
        <Block>
          <SearchInput bind:value={setQuery} placeholder="Find a set" label="Find a set" />
        </Block>
        <List label="Sets">
          {#each sets.filter((s) => !setQuery || s.toLowerCase().includes(setQuery.toLowerCase())) as s (s)}
            <ListItem
              columns="minmax(0, 1fr)"
              sel={set === s}
              aria-current={set === s ? 'true' : undefined}
              onclick={() => (set = s)}
            >
              <Text clamp>{s}</Text>
            </ListItem>
          {/each}
        </List>
      </Board>
    </Surface>
  </Case>
</Example>
