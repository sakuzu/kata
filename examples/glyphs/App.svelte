<script lang="ts">
  import { Block, Glyphs, Stack } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  const symbols = ['★', '●', '▲', '■', '◆', '♥', '♣', '♠', '✚', '✖', '✔', '☀', '☂', '☎', '✉', '♪'];
  const names = [
    'star',
    'circle',
    'triangle',
    'square',
    'diamond',
    'heart',
    'club',
    'spade',
    'cross',
    'multiply',
    'check',
    'sun',
    'umbrella',
    'telephone',
    'envelope',
    'note',
  ];
  let picked = $state('▲');
  let inRow = $state('●');
  let at = $state(2);
  const bands = ['★', '☀', '♪', '✉'];
  let band = $state('★');
</script>

<Example>
  <Case label="A grid of eight columns; one is selected">
    <Surface width="22.5rem">
      <Block>
        <Glyphs items={symbols} value={picked} onselect={(g) => (picked = g)} label={(_, i) => names[i]} />
      </Block>
    </Surface>
  </Case>
  <Case label="columns: a band and a grid of six columns, lined up">
    <Surface width="22.5rem">
      <Block>
        <Stack gap="sm">
          <Glyphs items={bands} value={band} onselect={(g) => (band = g)} columns={6} row />
          <Glyphs
            items={symbols.slice(0, 12)}
            value={picked}
            onselect={(g) => (picked = g)}
            label={(_, i) => names[i]}
            columns={6}
          />
        </Stack>
      </Block>
    </Surface>
  </Case>
  <Case label="row: one line that scrolls sideways">
    <Glyphs items={symbols.slice(0, 6)} value={inRow} onselect={(g) => (inRow = g)} row />
  </Case>
  <Case label="selected: the same symbol twice, told apart by position">
    <Glyphs
      items={['★', '●', '★', '▲']}
      onselect={(_, i) => (at = i)}
      selected={(_, i) => i === at}
      row
    />
  </Case>
</Example>
