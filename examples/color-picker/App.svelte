<script lang="ts">
  import { ColorPicker, Text } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  let value = $state('#2D7FF9');
</script>

<Example>
  <Case label="In the content: the board draws its surface and line">
    <ColorPicker bind:value />
    <Text role="caption" muted>{value}</Text>
  </Case>
  <Case label="The components of RGB">
    <ColorPicker value="#8A5CF6" format="rgb" />
  </Case>
  <Case label="bare, in a slot that draws the surface and the line">
    <Surface width="15rem"><ColorPicker value="#2E9E5B" format="hsl" bare title="Fill" /></Surface>
  </Case>
</Example>
