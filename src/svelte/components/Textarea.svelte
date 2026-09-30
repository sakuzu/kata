<script lang="ts">
  import '../styles/components.css';

  // Textarea: an input of several lines. It is the same control as TextInput, and only its height
  // grows with the content. The lines take the running line height of body, and the padding above
  // and below makes one line as high as a TextInput, with the text in the same place. Focus shows
  // once, on the control's line.
  //
  //   <Field label="Description" for="d"><Textarea id="d" bind:value rows={3} /></Field>
  let {
    value = $bindable(''),
    placeholder,
    id,
    ariaLabel,
    rows = 2,
    maxRows,
    disabled = false,
    error = false,
    onchange,
    onblur,
    onkeydown,
    el = $bindable(),
  }: {
    value?: string;
    placeholder?: string;
    id?: string;
    /** The accessible name where no <label for> names it */
    ariaLabel?: string;
    /** The least number of lines (2 by default); longer text grows */
    rows?: number;
    /** The most lines it grows to; beyond them it scrolls inside (no limit by default) */
    maxRows?: number;
    disabled?: boolean;
    error?: boolean;
    /** The value is committed (when focus leaves) */
    onchange?: (e: Event & { currentTarget: HTMLTextAreaElement }) => void;
    onblur?: (e: FocusEvent) => void;
    /** The keys (send with Enter, cancel with Escape) are the caller's */
    onkeydown?: (e: KeyboardEvent) => void;
    /** The textarea itself, to move focus or the selection */
    el?: HTMLTextAreaElement;
  } = $props();
</script>

<label
  class="input"
  class:err={error}
  class:disabled={disabled}
  class:capped={maxRows !== undefined}
  data-role="box"
  data-multi
  style:--kata-textarea-rows={rows}
  style:--kata-textarea-max-rows={maxRows}
>
  <textarea
    bind:value
    bind:this={el}
    {placeholder}
    {id}
    {rows}
    {disabled}
    aria-label={ariaLabel}
    aria-invalid={error || undefined}
    {onchange}
    {onblur}
    {onkeydown}
  ></textarea>
</label>

<style lang="scss">
  @use '../styles/kata' as *;

  // The padding above and below: (the control's height − two lines − one line of text) ÷ 2
  .input {
    @include box;
    --kata-textarea-pad: calc((#{box-h()} - #{bw()} * 2 - #{fs(body)} * #{lh(body)}) / 2);
    height: auto;
    min-height: calc(
      #{fs(body)} * #{lh(body)} * var(--kata-textarea-rows) + var(--kata-textarea-pad) * 2 + #{bw()} *
        2
    );
    width: 100%;
    min-width: 0;
    align-items: stretch;
    justify-content: flex-start;
    white-space: normal;
    cursor: text;
    &:focus-within {
      border-color: color(blue-ink);
    }
  }
  .input textarea {
    @include bare-control;
    flex: 1;
    align-self: stretch;
    padding-block: var(--kata-textarea-pad);
    resize: none;
    field-sizing: content;
    line-height: lh(body);
    &::placeholder {
      color: color(faint);
    }
  }
  .capped {
    max-height: calc(
      #{fs(body)} * #{lh(body)} * var(--kata-textarea-max-rows) + var(--kata-textarea-pad) * 2 +
        #{bw()} * 2
    );
  }
  .capped textarea {
    overflow: auto;
  }
  .err {
    border-color: color(red-ink);
  }
  .disabled {
    opacity: dim();
    cursor: default;
  }
</style>
