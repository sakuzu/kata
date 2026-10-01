<script lang="ts" module>
  /** The kinds of field a FieldList draws, each with its control */
  export type FieldKind =
    | 'text'
    | 'number'
    | 'select'
    | 'color'
    | 'toggle'
    | 'slider'
    | 'segmented'
    | 'custom';

  /** One field of a FieldList: what it edits, how, and its current value */
  export interface FieldSpec {
    /** The key the change is reported with */
    key: string;
    /** The control that edits it */
    kind: FieldKind;
    /** The name shown before the control */
    label: string;
    /** The current value, as the application holds it */
    value?: unknown;
    /** The things selected do not share one value; value is not shown */
    mixed?: boolean;
    /** The choices of select and segmented */
    options?: { value: string; label: string }[];
    min?: number;
    max?: number;
    step?: number;
    /** A unit shown after the value, as text only */
    unit?: string;
    /** A word shown while a text or a number is empty */
    placeholder?: string;
    disabled?: boolean;
    /** A caption under the control */
    hint?: string;
  }
</script>

<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import { SvelteMap } from 'svelte/reactivity';
  import { getMessages } from '../messages.js';
  import Button from './Button.svelte';
  import ColorPicker from './ColorPicker.svelte';
  import Dropdown from './Dropdown.svelte';
  import InspectorRow from './InspectorRow.svelte';
  import NativeSelect from './NativeSelect.svelte';
  import NumberInput from './NumberInput.svelte';
  import ReadValue from './ReadValue.svelte';
  import Row from './Row.svelte';
  import Segmented from './Segmented.svelte';
  import Slider from './Slider.svelte';
  import Stack from './Stack.svelte';
  import Swatch from './Swatch.svelte';
  import TextInput from './TextInput.svelte';
  import Toggle from './Toggle.svelte';

  // FieldList: the rows of settings drawn from a list of field specs. Each spec names a key, a
  // kind, a label and the current value; the list draws one InspectorRow per spec with the control
  // of its kind and reports a committed change with onchange(key, value). The values are the
  // application's: the list does not convert them, and a unit is text after the value.
  //
  //   text       TextInput; a string, on change (Enter or leaving the input)
  //   number     NumberInput; a number, or null when emptied, on change
  //   select     NativeSelect of the options; the option's value
  //   color      a button with a Swatch and the value, which opens a ColorPicker; #RRGGBB, per
  //              pick. With oncolor, the button opens nothing and calls oncolor(key), so that the
  //              application opens its own picker
  //   toggle     Toggle at the end of the row; a boolean
  //   slider     Slider with the value and its unit; a number, when it is let go. oninput(key,
  //              value) follows it while it is dragged
  //   segmented  Segmented of the options; the option's value
  //   custom     the field snippet, which receives the spec
  //
  // A field with mixed (a selection whose things differ) shows no value: an empty input, no chosen
  // option, a button without a swatch, the thumb at the start; the hint says Mixed. Any change sets
  // the one value. end is one row after the fields, for an action on the whole list (a reset).
  //
  //   <FieldList fields={[{ key: 'width', kind: 'number', label: 'Width', value: 2, unit: 'px' }]}
  //     onchange={(key, value) => apply(key, value)} />
  let {
    fields,
    onchange,
    oninput,
    oncolor,
    field,
    end,
  }: {
    /** The fields, in order */
    fields: FieldSpec[];
    /** Called with the key and the value of a committed change */
    onchange?: (key: string, value: unknown) => void;
    /** Called with the key and the value of a slider at each value while it is dragged */
    oninput?: (key: string, value: number) => void;
    /** Called with the key of a color field when its button is pressed; it then opens no picker */
    oncolor?: (key: string) => void;
    /** Draws the control of a custom field (a snippet that receives the spec) */
    field?: Snippet<[FieldSpec]>;
    /** One row after the fields, for an action on the whole list (a snippet) */
    end?: Snippet;
  } = $props();

  const uid = $props.id();
  // The value of a slider while it is dragged, by key; it is reported when the slider is let go
  const dragging = new SvelteMap<string, number>();

  const report = (key: string, value: unknown) => onchange?.(key, value);
  const text = (f: FieldSpec) => (f.mixed || f.value == null ? '' : String(f.value));
  const num = (f: FieldSpec) =>
    !f.mixed && typeof f.value === 'number' && Number.isFinite(f.value) ? f.value : null;

  function commitNumber(f: FieldSpec, raw: string) {
    if (raw.trim() === '') {
      report(f.key, null);
      return;
    }
    const n = Number(raw);
    if (!Number.isNaN(n)) report(f.key, n);
  }

  function slide(f: FieldSpec) {
    const v = dragging.get(f.key) ?? num(f);
    return { value: v ?? f.min ?? 0, display: v === null ? '' : `${v}${f.unit ?? ''}` };
  }
</script>

<Stack gap="sm">
  {#each fields as f, i (f.key)}
    {@const id = `${uid}-${i}`}
    {@const hint = f.mixed ? getMessages().mixed : f.hint}
    <InspectorRow
      label={f.label}
      for={f.kind === 'color' || f.kind === 'segmented' || f.kind === 'custom' ? undefined : id}
      {hint}
      align={f.kind === 'toggle' ? 'end' : 'start'}
      small={f.kind === 'toggle' || f.kind === 'slider'}
    >
      {#if f.kind === 'text'}
        <TextInput
          {id}
          value={text(f)}
          aria-label={f.label}
          unit={f.unit}
          placeholder={f.mixed ? getMessages().mixed : f.placeholder}
          disabled={f.disabled}
          onchange={(e) => report(f.key, e.currentTarget.value)}
        />
      {:else if f.kind === 'number'}
        <NumberInput
          {id}
          value={num(f)}
          ariaLabel={f.label}
          unit={f.unit}
          min={f.min}
          max={f.max}
          step={f.step ?? 'any'}
          placeholder={f.mixed ? getMessages().mixed : f.placeholder}
          disabled={f.disabled}
          onchange={(e) => commitNumber(f, e.currentTarget.value)}
        />
      {:else if f.kind === 'select'}
        <NativeSelect
          {id}
          options={f.options ?? []}
          value={f.mixed ? undefined : text(f)}
          ariaLabel={f.label}
          placeholder={f.mixed ? getMessages().mixed : f.placeholder}
          disabled={f.disabled}
          onchange={(v) => report(f.key, v)}
        />
      {:else if f.kind === 'color'}
        <Dropdown bare align="start" role="box">
          {#snippet trigger(toggle, open)}
            <Button
              trailing="chevron-down"
              clamp
              mono={!f.mixed}
              disabled={f.disabled}
              aria-label={f.label}
              aria-haspopup={oncolor ? undefined : 'dialog'}
              aria-expanded={oncolor ? undefined : open}
              onclick={oncolor ? () => oncolor(f.key) : toggle}
              mark={f.mixed ? undefined : swatch}
            >
              {f.mixed ? getMessages().mixed : text(f)}
            </Button>
            {#snippet swatch()}<Swatch color={text(f)} />{/snippet}
          {/snippet}
          {#snippet panel(close)}
            <ColorPicker
              value={f.mixed ? '#000000' : text(f)}
              title={f.label}
              onpick={(hex) => report(f.key, hex)}
              onclose={close}
            />
          {/snippet}
        </Dropdown>
      {:else if f.kind === 'toggle'}
        <Toggle
          {id}
          checked={!f.mixed && f.value === true}
          ariaLabel={f.label}
          disabled={f.disabled}
          onchange={(v) => report(f.key, v)}
        />
      {:else if f.kind === 'slider'}
        {@const s = slide(f)}
        <Slider
          {id}
          value={s.value}
          display={s.display}
          ariaLabel={f.label}
          min={f.min}
          max={f.max}
          step={f.step}
          disabled={f.disabled}
          oninput={(v) => {
            dragging.set(f.key, v);
            oninput?.(f.key, v);
          }}
          onchange={(v) => {
            dragging.delete(f.key);
            report(f.key, v);
          }}
        />
      {:else if f.kind === 'segmented'}
        <Segmented
          options={(f.options ?? []).map((o) => ({ ...o, disabled: f.disabled }))}
          value={f.mixed ? '' : text(f)}
          ariaLabel={f.label}
          onchange={(v) => report(f.key, v)}
        />
      {:else if field}
        {@render field(f)}
      {:else}
        <ReadValue value={text(f)} />
      {/if}
    </InspectorRow>
  {/each}
  {#if end}<Row>{@render end()}</Row>{/if}
</Stack>
