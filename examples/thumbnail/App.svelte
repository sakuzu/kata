<script lang="ts">
  import Folder from '@lucide/svelte/icons/folder';
  import { Grid, Row, Stack, Text, Thumbnail } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  const picture =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 20'%3E%3Crect width='30' height='20' fill='%23204ec3'/%3E%3Ccircle cx='10' cy='10' r='5' fill='%23f8cd09'/%3E%3C/svg%3E";
</script>

<Example>
  <Case label="An image, 3rem wide (default)">
    <Row gap="sm"><Thumbnail src={picture} alt="" /><Text>Cover</Text></Row>
  </Case>
  <Case label="No image: the icon (default image, or any icon)">
    <Row gap="sm"><Thumbnail /><Thumbnail icon={Folder} /><Thumbnail icon="sticky-note" /></Row>
  </Case>
  <Case label="size 4rem">
    <Thumbnail src={picture} alt="" size="4rem" />
  </Case>
  <Case label="size full: the width of the container, 16:10">
    <Grid cols={3}>
      <Stack gap="sm"><Thumbnail size="full" src={picture} alt="" /><Text role="caption">First</Text></Stack>
      <Stack gap="sm"><Thumbnail size="full" /><Text role="caption">Second</Text></Stack>
      <Stack gap="sm"><Thumbnail size="full" icon={Folder} /><Text role="caption">Third</Text></Stack>
    </Grid>
  </Case>
</Example>
