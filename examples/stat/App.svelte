<script lang="ts">
  import FileText from '@lucide/svelte/icons/file-text';
  import { Block, Divider, Row, Stack, Stat, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';
</script>

<Example>
  <Case label="A figure and its name">
    <Row><Stat label="Documents" value="128" /></Row>
  </Case>
  <Case label="With a unit, and with an icon before the name">
    <Row gap="lg">
      <Stat label="Storage" value="1.2 GB" />
      <Stat label="Pages" value="24" icon={FileText} />
    </Row>
  </Case>
  <Case label="Before and after a Divider: the line is as far from the figure's ink as from the text">
    <Surface width="16rem">
      <Block>
        <Stack gap="sm">
          <Text>Plan</Text>
          <Divider />
          <Stat label="per month" value="$12" />
          <Divider />
          <Text>Up to 10 members</Text>
        </Stack>
      </Block>
    </Surface>
  </Case>
</Example>
