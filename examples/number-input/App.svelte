<script lang="ts">
  import { Block, Field, NumberInput, Row, Stack } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Small from '../_shared/Small.svelte';
  import Surface from '../_shared/Surface.svelte';

  let width = $state<number | null>(2);
</script>

<Example>
  <Case label="The three widths, with units">
    <Row wrap>
      <NumberInput bind:value={width} unit="px" width="6rem" ariaLabel="Line width" />
      <NumberInput value={45} unit="°" width="8rem" ariaLabel="Angle" />
      <NumberInput value={0.25} step="any" width="12rem" ariaLabel="Ratio" />
    </Row>
  </Case>
  <Case label="Empty with a placeholder, an error, disabled and read only">
    <Row wrap>
      <NumberInput value={null} placeholder="Auto" width="8rem" ariaLabel="Size" />
      <NumberInput value={-4} min={0} error width="6rem" ariaLabel="Count" />
      <NumberInput value={12} unit="px" disabled width="6rem" ariaLabel="Gap" />
      <NumberInput value={3} readonly width="6rem" ariaLabel="Pages" />
    </Row>
  </Case>
  <Case label="In a field, and the small button">
    <Surface width="22.5rem">
      <Block>
        <Stack gap="lg">
          <Field label="Line width" for="line-width" note="From 1 to 64.">
            <NumberInput id="line-width" bind:value={width} unit="px" min={1} max={64} width="6rem" />
          </Field>
          <Small><NumberInput value={8} unit="px" width="6rem" ariaLabel="Radius" /></Small>
        </Stack>
      </Block>
    </Surface>
  </Case>
</Example>
