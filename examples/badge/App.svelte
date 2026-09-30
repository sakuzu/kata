<script lang="ts">
  import { Badge, List, ListItem, Row, Tag } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';
</script>

<Example>
  <Case label="Neutral, the four hues, and faint">
    <Row wrap>
      <Badge>Private</Badge>
      <Badge tone="blue">Can edit</Badge>
      <Badge tone="green">Public</Badge>
      <Badge tone="yellow">Link sharing</Badge>
      <Badge tone="red">Expired</Badge>
      <Badge tone="faint">Ended</Badge>
    </Row>
  </Case>
  <Case label="In a list item, after a Tag: the item grows to the badge and md above and below">
    <Surface>
      <List>
        <ListItem columns="minmax(0, 1fr) auto auto" onclick={() => {}}>
          <span>Quarterly report</span>
          <Tag>Shared</Tag>
          <Badge tone="green">Public</Badge>
        </ListItem>
      </List>
    </Surface>
  </Case>
</Example>
