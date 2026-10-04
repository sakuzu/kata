<script lang="ts">
  import '../styles/components.css';
  import { clampTip } from '../lib/clampTip.js';

  // ReadValue: a value that is read, not edited. It has no outline: it is text in the place of the
  // control of a Field or a Pair, which hold the distances. It stands in for an input on a screen
  // that is only viewed, or for a value that cannot be changed. Identifiers use mono.
  //
  // It trims its text the way Text does: inside a control (a pair or a list item) to its ink,
  // elsewhere not, and at the edge of a container on the side that touches the edge.
  //
  //   <Field label="Handle"><ReadValue value="studio" mono /></Field>
  //   <Field label="Email"><Row between><ReadValue value={email} clamp /><Button>Change…</Button></Row></Field>
  let {
    value,
    mono = false,
    muted = false,
    clamp = false,
  }: {
    value: string;
    /** The monospace font, with figures of equal width */
    mono?: boolean;
    /** Not set, or left at the default (a sentence rather than a value) */
    muted?: boolean;
    /** One line with an ellipsis; the full text shows on hover when it is clipped */
    clamp?: boolean;
  } = $props();
</script>

{#if clamp}
  <span class="v clamp" class:mono class:muted data-role="value" data-ink use:clampTip>{value}</span>
{:else}
  <span class="v" class:mono class:muted data-role="value" data-ink>{value}</span>
{/if}

<style lang="scss">
  @use '../styles/kata' as *;

  .v {
    display: block;
    min-width: 0;
    font-size: fs(body);
    line-height: lh(body);
  }
  @container style(--kata-in-control: 1) {
    .v {
      @include trim;
    }
  }
  .mono {
    font-family: var(--kata-font-mono);
    font-variant-numeric: tabular-nums;
  }
  .muted {
    color: color(muted);
  }
  .clamp {
    @include ellipsis;
  }
</style>
