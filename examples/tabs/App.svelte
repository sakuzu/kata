<script lang="ts">
  import { Tabs, Text, Toolbar } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  const views = [
    { id: 'shapes', label: 'Shapes' },
    { id: 'pages', label: 'Pages' },
    { id: 'assets', label: 'Assets' },
  ];
  let view = $state('shapes');
  let many = $state('fonts');
</script>

<Example>
  <Case label="Buttons that switch a view; the arrow keys move between them">
    <Tabs tabs={views} current={view} onselect={(id) => (view = id)} label="Views" />
    <Text>The current view: {views.find((v) => v.id === view)?.label}.</Text>
  </Case>
  <Case label="Links to pages (href)">
    <Tabs
      tabs={[
        { id: 'general', label: 'General', href: '#general' },
        { id: 'members', label: 'Members', href: '#members' },
        { id: 'billing', label: 'Billing', href: '#billing' },
      ]}
      current="members"
      label="Settings"
    />
  </Case>
  <Case label="In a toolbar: the height of the toolbar, and its line">
    <Surface width="22.5rem">
      <Toolbar rule>
        <Tabs tabs={views} current={view} onselect={(id) => (view = id)} label="Views" />
      </Toolbar>
    </Surface>
  </Case>
  <Case label="The tabs that do not fit fold into More; the current one always shows">
    <Surface width="16rem">
      <Tabs
        tabs={[
          { id: 'general', label: 'General' },
          { id: 'colors', label: 'Colors' },
          { id: 'fonts', label: 'Fonts' },
          { id: 'shortcuts', label: 'Shortcuts' },
          { id: 'export', label: 'Export' },
        ]}
        current={many}
        onselect={(id) => (many = id)}
        label="Preferences"
      />
    </Surface>
  </Case>
</Example>
