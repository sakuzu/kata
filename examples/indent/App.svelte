<script lang="ts">
  import { Block, Icon, Indent, Row, Stack, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import DemoButton from '../_shared/DemoButton.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';
</script>

<Example>
  <Case label="The content of an open item, lined up with its name">
    <Surface width="22.5rem">
      <Stack gap={0}>
        <Block>
          <Row>
            <DemoButton icon label="Collapse"><Icon name="polygon" /></DemoButton>
            <Text role="label">Outline</Text>
          </Row>
        </Block>
        <Indent>
          <Block>
            <Stack gap="sm">
              <Text>The content starts under the name, not under the button.</Text>
              <Text role="caption" muted>The space on the left is an empty column.</Text>
            </Stack>
          </Block>
        </Indent>
      </Stack>
    </Surface>
  </Case>
</Example>
