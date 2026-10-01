<script lang="ts">
  import { Crumbs, Toolbar } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';
</script>

<Example>
  <Case label="Links, then the current place">
    <Crumbs
      items={[
        { label: 'Team', href: '#top' },
        { label: 'Drafts', href: '#top' },
        { label: 'Spring layout' },
      ]}
      label="Location"
    />
  </Case>
  <Case label="A place pressed with onclick">
    <Crumbs
      items={[{ label: 'All documents', onclick: () => {} }, { label: 'Archive' }]}
      label="Location"
    />
  </Case>
  <Case label="Long places end with an ellipsis; in a toolbar the text is trimmed">
    <Surface width="22.5rem">
      <Toolbar>
        <Crumbs
          items={[
            { label: 'A team with a long name that does not fit', href: '#top' },
            { label: 'A folder with another long name', href: '#top' },
            { label: 'The current document' },
          ]}
          label="Location"
        />
      </Toolbar>
    </Surface>
  </Case>
  <Case label="current={false}: the last place is a link like the others, for a trail that a title follows">
    <Crumbs
      items={[
        { label: 'Team', href: '#top' },
        { label: 'Drafts', href: '#top' },
      ]}
      label="Location"
      current={false}
    />
  </Case>
</Example>
