<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // Tag: the label of a kind: what a thing is (a place, a role, a plan, a source). It has the
  // outline of a Badge (the same height, pad-sm at the sides, caption text trimmed to its ink, a
  // capsule) and the same colors: a hue is its fill with the text on it, and without a hue it is
  // a line and text. A state that changes over time is a Badge; in one line, Tags come before
  // Badges.
  //
  //   <Tag>Draft</Tag>   <Tag tone="blue">Recommended</Tag>
  let {
    tone,
    children,
  }: {
    /** A hue; without it the tag is neutral */
    tone?: 'blue' | 'green' | 'yellow' | 'red';
    children: Snippet;
  } = $props();
</script>

<span class="tag {tone ?? ''}" data-role="mark" data-h="badge"
  ><span class="t">{@render children()}</span></span
>

<style lang="scss">
  @use '../styles/kata' as *;

  .tag {
    display: inline-flex;
    align-items: center;
    height: h(badge);
    padding-inline: pad(sm);
    border: bw() solid color(line-strong);
    border-radius: var(--kata-radius-pill);
    @include text(caption);
    color: color(text);
    white-space: nowrap;
    flex: none;
  }
  .t {
    display: block;
    min-width: 0;
    @include trim;
  }
  .blue {
    background: color(blue-fill);
    border-color: transparent;
    color: color(on-blue);
  }
  .green {
    background: color(green-fill);
    border-color: transparent;
    color: color(on-green);
  }
  .yellow {
    background: color(yellow-fill);
    border-color: transparent;
    color: color(on-yellow);
  }
  .red {
    background: color(red-fill);
    border-color: transparent;
    color: color(on-red);
  }
</style>
