<script lang="ts">
  import {
    Button,
    Icon,
    List,
    ListItem,
    Row,
    SectionHeader,
    Stack,
    Text,
  } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';
</script>

<Example>
  <Case label="Groups in a panel, stacked with gap 0">
    <Surface width="22.5rem">
      <Stack gap={0}>
        <SectionHeader label="Background">
          <Text>The color behind the drawing.</Text>
        </SectionHeader>
        <SectionHeader label="Images">
          {#snippet actions()}
            <Button variant="ghost" icon aria-label="Add an image"><Icon name="image" /></Button>
          {/snippet}
          <Text>An action on the right overlaps the head.</Text>
          <Row><Button>Choose a file</Button></Row>
        </SectionHeader>
        <SectionHeader label="Notes" rule>
          <Text>rule draws a line above; the distance from the ink is the same on both sides.</Text>
        </SectionHeader>
      </Stack>
    </Surface>
  </Case>
  <Case label="flush: a list reaches the edges">
    <Surface width="22.5rem">
      <Stack gap={0}>
        <SectionHeader label="Pages" flush>
          <List label="Pages">
            <ListItem columns="auto minmax(0, 1fr)" onclick={() => {}}>
              <Icon name="image" /><span>Cover</span>
            </ListItem>
            <ListItem columns="auto minmax(0, 1fr)" onclick={() => {}}>
              <Icon name="image" /><span>Site plan</span>
            </ListItem>
          </List>
        </SectionHeader>
        <SectionHeader label="Notes">
          <Text>The next group keeps its distance from the list.</Text>
        </SectionHeader>
      </Stack>
    </Surface>
  </Case>
  <Case label="status and note: a count on the right, a sentence under the name">
    <Surface width="22.5rem">
      <Stack gap={0}>
        <SectionHeader label="Background" note="Applies to every page of the drawing.">
          <Text>The color behind the drawing.</Text>
        </SectionHeader>
        <SectionHeader
          label="Members"
          status="3 people"
          note="Everyone here can edit the drawing."
          flush
        >
          <List label="Members">
            <ListItem columns="minmax(0, 1fr)" onclick={() => {}}><span>Ana Silva</span></ListItem>
            <ListItem columns="minmax(0, 1fr)" onclick={() => {}}><span>Ken Ito</span></ListItem>
            <ListItem columns="minmax(0, 1fr)" onclick={() => {}}><span>Sam Lee</span></ListItem>
          </List>
        </SectionHeader>
        <SectionHeader label="Images" status="None">
          <Row><Button>Choose a file</Button></Row>
        </SectionHeader>
      </Stack>
    </Surface>
  </Case>
</Example>
