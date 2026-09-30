<script lang="ts">
  import { Block, Button, Field, List, ListItem, ReadValue, Row, Stack } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';
</script>

<Example>
  <Case label="In the place of a control in a Field">
    <Surface width="28rem">
      <Block>
        <Stack gap="lg">
          <Field label="Handle"><ReadValue value="studio-north" mono /></Field>
          <Field label="Description"><ReadValue value="Not set" muted /></Field>
          <Field label="Email">
            <Row between>
              <ReadValue value="a.very.long.address@example.com" clamp />
              <Button>Change…</Button>
            </Row>
          </Field>
        </Stack>
      </Block>
    </Surface>
  </Case>
  <Case label="Inside a list item: trimmed to its ink">
    <Surface width="28rem">
      <List>
        <ListItem columns="minmax(0, 1fr) auto" plain rule>
          <span>Plan</span>
          <ReadValue value="Team" />
        </ListItem>
      </List>
    </Surface>
  </Case>
</Example>
