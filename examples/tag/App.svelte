<script lang="ts">
  import { Badge, Row, Tag } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
</script>

<Example>
  <Case label="Neutral and the four hues">
    <Row wrap>
      <Tag>Draft</Tag>
      <Tag>Shared</Tag>
      <Tag tone="blue">Recommended</Tag>
      <Tag tone="green">Free</Tag>
      <Tag tone="yellow">Pro</Tag>
      <Tag tone="red">Suspended</Tag>
    </Row>
  </Case>
  <Case label="A kind before a state">
    <Row><Tag>Template</Tag><Badge tone="blue">Can edit</Badge></Row>
  </Case>
</Example>
