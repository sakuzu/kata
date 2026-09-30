<script lang="ts">
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import Ellipsis from '@lucide/svelte/icons/ellipsis';
  import { Button, Icon, Stack, Tabs, Text, Toolbar } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  let view = $state('shapes');
</script>

<Example>
  <Case label="A title and icon buttons at the end (tail)">
    <Surface width="22.5rem">
      <Toolbar title="Contents" tail>
        {#snippet end()}
          <Button variant="ghost" icon aria-label="Add"><Icon name="plus" /></Button>
          <Button variant="ghost" icon aria-label="More"><Icon name={Ellipsis} /></Button>
        {/snippet}
      </Toolbar>
    </Surface>
  </Case>
  <Case label="A button before the title, a line along the bottom, a text button at the end">
    <Surface width="22.5rem">
      <Toolbar title="Style" rule>
        {#snippet start()}
          <Button variant="ghost" icon aria-label="Back"><Icon name={ArrowLeft} /></Button>
        {/snippet}
        {#snippet end()}<Button>Reset</Button>{/snippet}
      </Toolbar>
    </Surface>
  </Case>
  <Case label="A long title ends with an ellipsis">
    <Surface width="16rem">
      <Toolbar title="A long title that does not fit in the toolbar" tail>
        {#snippet end()}
          <Button variant="ghost" icon aria-label="Close"><Icon name="x" /></Button>
        {/snippet}
      </Toolbar>
    </Surface>
  </Case>
  <Case label="two: a title with a second line">
    <Surface width="22.5rem">
      <Toolbar two tail>
        <Stack gap="2xs">
          <Text role="h2" as="h2">Export</Text>
          <Text role="caption" muted>Three pages</Text>
        </Stack>
        {#snippet end()}
          <Button variant="ghost" icon aria-label="Close"><Icon name="x" /></Button>
        {/snippet}
      </Toolbar>
    </Surface>
  </Case>
  <Case label="Tabs in a toolbar take its height and meet its line">
    <Surface width="22.5rem">
      <Toolbar rule>
        <Tabs
          tabs={[
            { id: 'shapes', label: 'Shapes' },
            { id: 'pages', label: 'Pages' },
          ]}
          current={view}
          onselect={(id) => (view = id)}
          label="Views"
        />
      </Toolbar>
    </Surface>
  </Case>
</Example>
