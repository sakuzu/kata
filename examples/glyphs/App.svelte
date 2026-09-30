<script lang="ts">
  import { Glyphs } from '@sakuzu/kata/svelte';
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
</script>

<Example>
  <Case label="A grid of eight columns; one is selected">
    <Surface width="22.5rem">
      <Glyphs items={symbols} value={picked} onselect={(g) => (picked = g)} label={(_, i) => names[i]} />
    </Surface>
  </Case>
  <Case label="row: one line that scrolls sideways">
    <Glyphs items={symbols.slice(0, 6)} value={inRow} onselect={(g) => (inRow = g)} row />
  </Case>
</Example>
