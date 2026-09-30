<script lang="ts">
  import { Button, Icon, Kbd, Row, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  const keys = ['⌘K', '⌘P', '⌘S', '⌘Z', '⇧⌘Z', '⌘C', '⌘V', '⌘X', '⌘A', '⌘F'];
</script>

<Example>
  <Case label="gap 2xs: an icon and its text">
    <Row gap="2xs"><Icon name="image" /><Text>Cover image</Text></Row>
  </Case>
  <Case label="gap sm (default): controls">
    <Row><Button>Cancel</Button><Button variant="primary">Save</Button></Row>
  </Case>
  <Case label="gap lg: groups">
    <Row gap="lg">
      <Row><Kbd>⌘Z</Kbd><Kbd>⇧⌘Z</Kbd></Row>
      <Row><Kbd>⌘C</Kbd><Kbd>⌘V</Kbd></Row>
    </Row>
  </Case>
  <Case label="between: the two ends">
    <Row between><Text>Shortcuts</Text><Kbd>⌘/</Kbd></Row>
  </Case>
  <Case label="justify end">
    <Row justify="end"><Button>Cancel</Button><Button variant="primary">Save</Button></Row>
  </Case>
  <Case label="wrap: items move to the next line whole">
    <Row wrap>
      {#each keys as key (key)}<Kbd>{key}</Kbd>{/each}
    </Row>
  </Case>
  <Case label="text shrinks and wraps; marks keep their size">
    <Row gap="sm" align="start">
      <Kbd>⌘K</Kbd>
      <Text>A long sentence beside a mark wraps inside the width that is left, while the mark keeps its own size.</Text>
    </Row>
  </Case>
</Example>
