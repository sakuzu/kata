<script lang="ts">
  import { Block, Slider, Stack } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  let opacity = $state(70);
</script>

<Example>
  <Case label="A value with a unit, a plain number and disabled">
    <Surface width="22.5rem">
      <Block>
        <Stack gap={0}>
          <Slider value={opacity} display="{opacity}%" ariaLabel="Opacity" oninput={(v) => (opacity = v)} />
          <Slider value={4} min={1} max={12} ariaLabel="Line width" />
          <Slider value={30} display="30%" ariaLabel="Blur" disabled />
        </Stack>
      </Block>
    </Surface>
  </Case>
</Example>
