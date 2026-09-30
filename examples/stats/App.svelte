<script lang="ts">
  import { Stat, Stats } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';
</script>

<Example>
  <Case label="Stats side by side, gap-lg apart">
    <Stats>
      <Stat label="Documents" value="24" />
      <Stat label="Files" value="138" />
      <Stat label="Exports this month" value="1,204" />
      <Stat label="Members" value="7" />
    </Stats>
  </Case>
  <Case label="In a narrow container they wrap">
    <Surface width="16rem">
      <Stats>
        <Stat label="Documents" value="24" />
        <Stat label="Files" value="138" />
        <Stat label="Members" value="7" />
      </Stats>
    </Surface>
  </Case>
</Example>
