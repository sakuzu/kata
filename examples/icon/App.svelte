<script lang="ts">
  import Search from '@lucide/svelte/icons/search';
  import { Icon, type IconName, icons, Row, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';

  const names = Object.keys(icons) as IconName[];
  const tones = ['blue', 'yellow', 'red', 'green', 'muted'] as const;
</script>

<Example>
  <Case label="The icons by name">
    <Row gap="md" wrap>
      {#each names as name (name)}<Row gap="2xs"><Icon {name} /><Text role="caption">{name}</Text></Row>{/each}
    </Row>
  </Case>
  <Case label="Any icon component">
    <Row gap="2xs"><Icon name={Search} /><Text>Search</Text></Row>
  </Case>
  <Case label="Tones">
    <Row gap="md" wrap>
      {#each tones as tone (tone)}<Row gap="2xs"><Icon name="point" {tone} /><Text role="caption">{tone}</Text></Row>{/each}
    </Row>
  </Case>
</Example>
