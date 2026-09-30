<script lang="ts">
  import { Block, Button, Row, Text, Veil } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  let loading = $state(true);
</script>

<Example>
  <Case label="A veil over a drawing that is not ready yet">
    <Row>
      <Button onclick={() => (loading = !loading)}>{loading ? 'Finish loading' : 'Load again'}</Button>
    </Row>
    <div class="frame">
      <Block><Text>The drawing, shown once it is ready.</Text></Block>
      {#if loading}
        <Veil busy><Text role="caption" muted>Loading</Text></Veil>
      {/if}
    </div>
  </Case>
</Example>

<style>
  /* A positioned frame, as the frame of a drawing is */
  .frame {
    position: relative;
    height: 14rem;
    overflow: hidden;
    background: var(--kata-color-panel);
    border: var(--kata-border-width) solid var(--kata-color-line);
  }
</style>
