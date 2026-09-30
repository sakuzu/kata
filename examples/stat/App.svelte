<script lang="ts">
  import FileText from '@lucide/svelte/icons/file-text';
  import { Row, Stat } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
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
</Example>
