<script lang="ts">
  import '../styles/components.css';
  import { type IconSource, iconComponent } from '../icons.js';

  // Icon: a line icon, a square of the root size, in the current text color. In a list item or a
  // line of text it is centred by the flex layout; its white space is never cancelled with a
  // negative margin. A button with an icon and no text is an icon button with an aria-label.
  //
  //   <Icon name="image" />   <Icon name={Search} tone="muted" />
  let {
    name,
    tone,
  }: {
    /** A name from the icons list, or an icon component */
    name: IconSource;
    /** A hue (blue: in progress or done, yellow: warning, red: failure, green: success) or muted */
    tone?: 'blue' | 'yellow' | 'red' | 'green' | 'muted';
  } = $props();
  const Cmp = $derived(iconComponent(name));
</script>

<Cmp class={tone ? `kata-icon tone-${tone}` : 'kata-icon'} />

<style lang="scss">
  @use '../styles/kata' as *;

  :global(svg.kata-icon) {
    width: h(icon);
    height: h(icon);
    flex: none;
    stroke-width: 1.5;
    display: block;
  }
  :global(svg.kata-icon.tone-blue) {
    color: color(blue-ink);
  }
  :global(svg.kata-icon.tone-yellow) {
    color: color(yellow-ink);
  }
  :global(svg.kata-icon.tone-red) {
    color: color(red-ink);
  }
  :global(svg.kata-icon.tone-green) {
    color: color(green-ink);
  }
  :global(svg.kata-icon.tone-muted) {
    color: color(muted);
  }
</style>
