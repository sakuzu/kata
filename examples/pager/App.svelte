<script lang="ts">
  import { Block, Pager, Row } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  let page = $state(5);
  let short = $state(1);
  let narrow = $state(5);
</script>

<Example>
  <Case label="Twelve pages (press a page)">
    <Row wrap><Pager {page} pages={12} onchange={(p) => (page = p)} /></Row>
  </Case>
  <Case label="In a narrow container: even the compact form does not fit, and the pager scrolls">
    <Surface width="12rem">
      <Block><Pager page={narrow} pages={12} onchange={(p) => (narrow = p)} /></Block>
    </Surface>
  </Case>
  <Case label="Three pages: no gap">
    <Row wrap><Pager page={short} pages={3} onchange={(p) => (short = p)} /></Row>
  </Case>
</Example>
