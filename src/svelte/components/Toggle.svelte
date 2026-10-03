<script lang="ts">
  import '../styles/components.css';

  // Toggle: a switch for a setting that takes effect at once. It is a control of the height of a
  // small button, and the whole control is pressed. The switch is centred; its text on the right
  // (on the left with between) is trimmed to its ink and centred. A long text wraps: the control
  // grows, and the switch stays level with the first line. It is a native checkbox with
  // role="switch", so :checked holds the state, and the control is a <label>, so pressing the text
  // switches it too.
  //
  //   <Toggle bind:checked={snap} label="Snap to grid" />
  //   <Toggle bind:checked={snap} label="Snap to grid" between />   the switch at the right end
  let {
    checked = $bindable(false),
    label,
    ariaLabel,
    disabled = false,
    between = false,
    indent = false,
    id,
    onchange,
  }: {
    checked?: boolean;
    /** The text beside the switch, which is its name */
    label?: string;
    /** The text on the left and the switch at the right end (a row of settings) */
    between?: boolean;
    /** Under a parent switch: indented by pad-md */
    indent?: boolean;
    /** The accessible name when there is no text */
    ariaLabel?: string;
    disabled?: boolean;
    id?: string;
    onchange?: (checked: boolean) => void;
  } = $props();
</script>

<label class="ctl" class:disabled={disabled} class:between class:indent data-role="switch" data-control>
  {#if between && label}<span class="line grow"><span class="t">{label}</span></span>{/if}
  <span class="seat">
    <input
      type="checkbox"
      role="switch"
      class="toggle"
      bind:checked
      {id}
      {disabled}
      aria-label={ariaLabel}
      onchange={() => onchange?.(checked)}
    />
  </span>
  {#if label && !between}<span class="line"><span class="t">{label}</span></span>{/if}
</label>

<style lang="scss">
  @use '../styles/kata' as *;

  // The text stands on the baseline of the switch's seat, so that its first line is centred in the
  // height of a small button and a longer text grows downwards
  .ctl {
    display: flex;
    align-items: baseline;
    gap: gap(sm);
    min-height: h(button-sm);
    padding-inline: inset();
    min-width: 0;
    cursor: pointer;
    @include text(body);
  }
  .between {
    justify-content: space-between;
  }
  .indent {
    padding-left: pad(md);
  }
  // The switch, centred in the height of a small button. An empty line of text, trimmed and centred
  // as the text would be, gives the seat the baseline of a centred line
  .seat {
    display: flex;
    align-items: center;
    flex: none;
    height: h(button-sm);
    &::before {
      content: '\200b' / '';
      @include trim;
    }
  }
  // The text, with about the room of the seat below its last line when it wraps (one line leaves
  // it inside the seat's height)
  .line {
    display: block;
    min-width: 0;
    padding-bottom: pad(sm);
  }
  .t {
    display: block;
    min-width: 0;
    overflow-wrap: anywhere;
    @include trim;
  }
  .grow {
    flex: 1 1 auto;
  }
  // The knob is a square that leaves two lines of room inside the track. An input draws no
  // pseudo-elements, so the knob is its background image.
  .toggle {
    appearance: none;
    margin: 0;
    padding: 0;
    flex: none;
    width: h(button);
    height: h(badge);
    border: bw() solid color(line-strong);
    border-radius: 0;
    cursor: pointer;
    background-color: transparent;
    background-image: linear-gradient(color(muted) 0 0);
    background-repeat: no-repeat;
    background-size: calc(#{h(badge)} - #{bw()} * 6) calc(#{h(badge)} - #{bw()} * 6);
    background-position: left calc(#{bw()} * 2) center;
    transition:
      background-color 0.12s ease,
      border-color 0.12s ease;
  }
  .toggle:checked {
    background-color: color(solid);
    background-image: linear-gradient(color(on-solid) 0 0);
    background-position: right calc(#{bw()} * 2) center;
    border-color: color(solid);
  }
  // Disabled is the same shape without hue: the text and an empty switch are dimmed; a switch that
  // is on is the filled shape, not dimmed, with the disabled surface and its text for the knob
  .disabled {
    cursor: default;
    .toggle {
      cursor: default;
    }
    .line,
    .toggle:not(:checked) {
      opacity: dim();
    }
    .toggle:checked {
      background-color: color(solid-disabled);
      background-image: linear-gradient(color(solid-disabled-text) 0 0);
      border-color: color(solid-disabled);
    }
  }
</style>
