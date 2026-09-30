<script lang="ts">
  import { Kebab, type KebabAction, Row, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Small from '../_shared/Small.svelte';
  import Surface from '../_shared/Surface.svelte';

  let chosen = $state<KebabAction | ''>('');
</script>

<!-- TODO(kata): the rows are ListItems once the data display family is published -->
<Example>
  <Case label="The default actions, and a chosen few (the order stays fixed)">
    <Surface width="22.5rem">
      <Small>
        <div class="row">
          <Text clamp>Quarterly plan</Text>
          <Kebab onaction={(a) => (chosen = a)} />
        </div>
        <div class="row">
          <Text clamp>Team notes</Text>
          <Kebab actions={['delete', 'copy', 'publish']} onaction={(a) => (chosen = a)} />
        </div>
      </Small>
    </Surface>
    <Row><Text role="caption" muted>Chosen: {chosen || 'nothing yet'}</Text></Row>
  </Case>
</Example>

<style>
  /* An item of a list: the name, and the Kebab at the right end */
  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--kata-gap-sm);
    padding-inline: var(--kata-pad-md) var(--kata-pad-sm);
  }
</style>
