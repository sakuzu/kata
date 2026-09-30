<script lang="ts">
  import { Kebab, type KebabAction, List, ListItem, Row, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Small from '../_shared/Small.svelte';
  import Surface from '../_shared/Surface.svelte';

  let chosen = $state<KebabAction | ''>('');
</script>

<Example>
  <Case label="The default actions, and a chosen few (the order stays fixed)">
    <Surface width="22.5rem">
      <Small>
        <List>
          <ListItem columns="minmax(0, 1fr) auto" tail plain rule>
            <Text clamp>Quarterly plan</Text>
            <Kebab onaction={(a) => (chosen = a)} />
          </ListItem>
          <ListItem columns="minmax(0, 1fr) auto" tail plain rule>
            <Text clamp>Team notes</Text>
            <Kebab actions={['delete', 'copy', 'publish']} onaction={(a) => (chosen = a)} />
          </ListItem>
        </List>
      </Small>
    </Surface>
    <Row><Text role="caption" muted>Chosen: {chosen || 'nothing yet'}</Text></Row>
  </Case>
</Example>

