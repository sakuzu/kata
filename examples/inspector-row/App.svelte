<script lang="ts">
  import {
    InspectorRow,
    NumberInput,
    ReadValue,
    SectionHeader,
    Slider,
    Textarea,
    TextInput,
    Toggle,
  } from '@sakuzu/kata/svelte';
  import Case from '../_shared/Case.svelte';
  import Example from '../_shared/Example.svelte';
  import Surface from '../_shared/Surface.svelte';

  let name = $state('Front entrance');
  let size = $state<number | null>(12);
  let opacity = $state(70);
  let visible = $state(true);
  let note = $state('A note that runs over two lines, written by the person who drew it.');
</script>

<Example>
  <Case label="A control that fills the column, a value read, a hint under the value">
    <Surface width="22.5rem">
      <SectionHeader label="Shape">
        <InspectorRow label="Name" for="row-name">
          <TextInput id="row-name" bind:value={name} />
        </InspectorRow>
        <InspectorRow label="Kind"><ReadValue value="Group of 3" /></InspectorRow>
        <InspectorRow label="Size" hint="Measured on the screen.">
          <NumberInput bind:value={size} unit="px" ariaLabel="Size" />
        </InspectorRow>
      </SectionHeader>
    </Surface>
  </Case>
  <Case label="small controls: a slider, and a switch at the end">
    <Surface width="22.5rem">
      <SectionHeader label="Display">
        <InspectorRow label="Opacity" small>
          <Slider
            value={opacity}
            ariaLabel="Opacity"
            display={`${opacity}%`}
            oninput={(v) => (opacity = v)}
          />
        </InspectorRow>
        <InspectorRow label="Visible" align="end" small>
          <Toggle bind:checked={visible} ariaLabel="Visible" />
        </InspectorRow>
      </SectionHeader>
    </Surface>
  </Case>
  <Case label="top: a value of several lines, with the name level with its first line">
    <Surface width="22.5rem">
      <SectionHeader label="Notes">
        <InspectorRow label="Note" top>
          <Textarea bind:value={note} ariaLabel="Note" />
        </InspectorRow>
      </SectionHeader>
    </Surface>
  </Case>
</Example>
