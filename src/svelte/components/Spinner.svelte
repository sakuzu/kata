<script lang="ts">
  import '../styles/components.css';

  // Spinner: a short wait. Three dots that pulse; nothing turns or blinks. It has no color or
  // size of its own: it follows the text around it. The dots are an icon ÷ φ² square, gap-2xs
  // apart, gap-sm from the label; the label is text that is not trimmed. With reduced motion the
  // dots rest at three strengths.
  //
  //   <Spinner />   <Spinner label="Saving" />
  let {
    label,
  }: {
    /** The words after the dots */
    label?: string;
  } = $props();
</script>

<span class="seat" data-role="spinner" data-edge-pass role="status"
  ><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span
  >{#if label}<span class="t">{label}</span>{/if}</span
>

<style lang="scss">
  @use '../styles/kata' as *;

  .seat {
    display: inline-flex;
    align-items: center;
    gap: gap(sm);
    min-width: 0;
  }
  .dots {
    display: inline-flex;
    align-items: center;
    gap: gap(2xs);
  }
  .dots i {
    display: inline-block;
    width: var(--kata-size-xs-rem);
    height: var(--kata-size-xs-rem);
    background: color(muted);
    animation: pulse 1.2s ease-in-out infinite;
  }
  .dots i:nth-child(2) {
    opacity: 0.6;
    animation-delay: 0.15s;
  }
  .dots i:nth-child(3) {
    opacity: 0.3;
    animation-delay: 0.3s;
  }
  @keyframes pulse {
    0%,
    100% {
      opacity: 0.25;
    }
    50% {
      opacity: 1;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .dots i {
      animation: none;
    }
  }
</style>
