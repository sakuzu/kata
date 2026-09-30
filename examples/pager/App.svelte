<script lang="ts">
  import { Pager, Row } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  let page = $state(5);
  let short = $state(1);
</script>

<Example>
  <Case label="Twelve pages (press a page)">
    <Row wrap><Pager {page} pages={12} onchange={(p) => (page = p)} /></Row>
  </Case>
  <Case label="Three pages: no gap">
    <Row wrap><Pager page={short} pages={3} onchange={(p) => (short = p)} /></Row>
  </Case>
</Example>
