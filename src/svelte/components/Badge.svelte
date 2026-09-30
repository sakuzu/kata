<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  // Badge: the label of a state, next to the text it describes. A capsule, so that it is told
  // apart from what can be pressed (a rectangle). Its height is the ink of its caption text, pad-xs
  // above and below and a line on each side; pad-sm at the sides; the text is trimmed to its ink.
  // A hue is one look: the hue's fill with the text that reads on it, and no line. Without a hue
  // (neutral) it is a line and text; faint is the weaker neutral, for a state that has ended. What
  // a thing is (its kind) is a Tag. Inside a list item it is centred and does not change the
  // item's height beyond its own.
  //
  //   <Badge tone="blue">Can edit</Badge>   <Badge>Private</Badge>   <Badge tone="red">Expired</Badge>
  let {
    tone,
    children,
    ...rest
  }: Omit<HTMLAttributes<HTMLSpanElement>, 'class' | 'style'> & {
    /** blue: in progress or a permission; green: done or public; yellow: a warning; red: a
     * failure; faint: ended. Without it the badge is neutral */
    tone?: 'blue' | 'green' | 'yellow' | 'red' | 'faint';
    children: Snippet;
  } = $props();
</script>

<span class="pill {tone ?? ''}" data-role="mark" data-h="badge" {...rest}
  ><span class="t">{@render children()}</span></span
>

<style lang="scss">
  @use '../styles/kata' as *;

  .pill {
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
  // A hue: the fill and the text on it. The line turns transparent, so the height stays the same
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
  .faint {
    border-color: color(line);
    color: color(muted);
  }
</style>
