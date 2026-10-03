<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { IconSource } from '../icons.js';
  import Counter from './Counter.svelte';
  import Icon from './Icon.svelte';
  import Tooltip from './Tooltip.svelte';

  // Button: a control that is pressed. Its height is the ink of its text, pad-md above and below
  // and a line on each side. Inside a list item, a toolbar or a bar of bulk actions the container
  // declares the small button (pad-sm above and below); the author never writes a size.
  //
  // variant: outline (the default), primary (one per screen), ghost (no line; the surface shows on
  // hover; for icon buttons only, since a text button without a line does not look pressable),
  // danger (a red line) and danger-fill (the primary action of a confirmation). An icon button has
  // no text: icon and an aria-label, and it is a square small button. block is for the primary
  // action of a one-column form. The area that is pressed, the hover surface, the line and the
  // focus ring are all this control's own.
  //
  //   <Button variant="primary" onclick={save}>Save</Button>
  //   <Button leading="plus">New document</Button>          an icon before the text
  //   <Button trailing="chevron-down">Sort</Button>         the trigger of a menu
  //   <Button icon aria-label="Close"><Icon name="x" /></Button>
  //   <Button kbd="⌘⏎">Send</Button>                         a key hint after the text
  //   <Button trailing="chevron-down">{#snippet mark()}<Swatch color={c} />{/snippet}#FF0077</Button>
  //   <Button icon badge={3} aria-label="Notifications"><Icon name={Bell} /></Button>
  //   <Button icon aria-label="Undo" shortcut="⌘Z"><Icon name={Undo} /></Button>
  //   <Button tip="Export as a file">Export</Button>          a tooltip on a text button
  //
  // The children of a text button are text only; icons go in leading and trailing. An icon button
  // shows its aria-label in a Tooltip, with shortcut as the key hint inside it; tip gives a text
  // button a tooltip, or turns the tooltip of an icon button off (false).
  let {
    variant = 'outline',
    icon = false,
    block = false,
    busy = false,
    disabled = false,
    on = false,
    tone,
    leading,
    trailing,
    kbd,
    mark,
    clamp = false,
    mono = false,
    type = 'button',
    href,
    target,
    onclick,
    shortcut,
    tip,
    badge,
    'aria-label': ariaLabel,
    children,
    ...rest
  }: Omit<HTMLAttributes<HTMLElement>, 'class' | 'style' | 'onclick'> & {
    variant?: 'outline' | 'primary' | 'ghost' | 'danger' | 'danger-fill';
    /** A square button with an icon and no text; it needs an aria-label */
    icon?: boolean;
    /** The full width of its container */
    block?: boolean;
    /** An action in progress: the disabled look with a progress cursor, not pressable */
    busy?: boolean;
    disabled?: boolean;
    /** Selected (a tool in a toolbar) */
    on?: boolean;
    /** A ghost button that removes something: its text turns red on hover */
    tone?: 'danger';
    /** An icon before the text */
    leading?: IconSource;
    /** An icon after the text (the chevron of a menu trigger) */
    trailing?: IconSource;
    /** A kbd hint after the text */
    kbd?: string;
    /** A mark of the value before the text (a color swatch), for the trigger of a value */
    mark?: Snippet;
    /** The trigger of a value: the text is one line with an ellipsis */
    clamp?: boolean;
    /** The text in the monospace font (a code, an identifier) */
    mono?: boolean;
    type?: 'button' | 'submit';
    /** Renders a link with the same look */
    href?: string;
    /** Opens the link in another tab; the component adds rel */
    target?: '_blank';
    /** The key hint inside the tooltip */
    shortcut?: string;
    /** The text of the tooltip (an icon button's aria-label by default); false shows none */
    tip?: string | false;
    /** A count over the top right of an icon button; 100 and more shows 99+ */
    badge?: number;
    'aria-label'?: string;
    onclick?: (e: MouseEvent) => void;
    children: Snippet;
  } = $props();
  const badged = $derived(badge !== undefined && badge > 0);
  const tipText = $derived(tip === false ? undefined : (tip ?? (icon ? ariaLabel : undefined)));
  // A container that shows an icon button only on hover reads data-keep on the wrapper too
  const keep = $derived(rest['data-keep' as keyof typeof rest] !== undefined);
  // A full-width button with a trailing icon is a chooser: the text on the left, the icon at the
  // right end
  const spread = $derived(block && !!trailing);
</script>

{#snippet inner()}
  {#if icon}{@render children()}{:else}{#if leading}<Icon name={leading} />{:else if mark}{@render mark()}{/if}<span
      class="t"
      class:clamp
      class:mono>{@render children()}</span
    >{#if kbd}<span class="kbd t">{kbd}</span>{/if}{#if trailing}<Icon name={trailing} />{/if}{/if}
{/snippet}

{#snippet unread()}
  {#if badged}<span class="unread" aria-hidden="true"
      ><Counter>{(badge ?? 0) > 99 ? '99+' : badge}</Counter></span
    >{/if}
{/snippet}

{#snippet control()}
  {#if href}
    <a
      class="btn {variant}"
      class:icon
      class:block
      class:spread
      class:busy
      class:on
      class:badged
      data-tone={tone}
      data-role="box"
      data-h={icon ? 'icon-button' : 'button'}
      {href}
      {onclick}
      aria-label={ariaLabel}
      {target}
      rel={target ? 'noopener' : undefined}
      {...rest}
    >
      {@render inner()}{@render unread()}
    </a>
  {:else}
    <button
      class="btn {variant}"
      class:icon
      class:block
      class:spread
      class:busy
      class:on
      class:badged
      data-tone={tone}
      data-role="box"
      data-h={icon ? 'icon-button' : 'button'}
      {type}
      disabled={disabled || busy}
      {onclick}
      aria-label={ariaLabel}
      {...rest}
    >
      {@render inner()}{@render unread()}
    </button>
  {/if}
{/snippet}

{#if tipText}
  <Tooltip text={tipText} {shortcut} role="box" {keep}>{@render control()}</Tooltip>
{:else}
  {@render control()}
{/if}

<style lang="scss">
  @use '../styles/kata' as *;

  .btn {
    @include box;
    position: relative;
    color: color(text);
    cursor: pointer;
    text-decoration: none;
    // A control keeps its size, unless it is wider than its container: then it shrinks and its
    // text ends with an ellipsis, so that it never reaches past the container's edge
    flex: 0 1 auto;
    max-width: 100%;
    &:hover:not(:disabled) {
      background: color(raise);
      text-decoration: none;
    }
    &:active {
      background: color(raise-2);
      transition: none;
    }
    &:disabled {
      opacity: dim();
      cursor: default;
    }
    > :global(svg) {
      flex: none;
    }
    // The text is trimmed to its ink and centred; it is one line
    .t {
      display: block;
      min-width: 0;
      @include trim;
      @include ellipsis;
    }
    .t.mono {
      font-family: var(--kata-font-mono);
    }
    .kbd {
      font-family: var(--kata-font-mono);
      @include text(caption);
      color: color(muted);
      flex: none;
    }
  }
  // The count's lower left corner sits pad-2xs up and right of the icon's centre, so it covers
  // only the icon's top right corner
  .unread {
    position: absolute;
    left: calc(50% + #{pad(2xs)});
    bottom: calc(50% + #{pad(2xs)});
    pointer-events: none;
    line-height: 0;
  }
  .primary {
    background: color(solid);
    border-color: color(solid);
    color: color(on-solid);
    &:hover:not(:disabled) {
      background: color(solid-hover);
      border-color: color(solid-hover);
    }
    &:active {
      background: color(solid-active);
      border-color: color(solid-active);
    }
  }
  // The hint on the fill keeps the fill's text color
  .btn.primary .kbd {
    color: color(on-solid);
  }
  // The same size as the other buttons, with a transparent line
  .ghost {
    border-color: transparent;
    background: transparent;
  }
  .danger {
    color: color(red-ink);
    border-color: color(red-ink);
    &:hover:not(:disabled) {
      background: color(red-wash);
    }
  }
  // A fill stays a fill on hover and when pressed, one step darker each time
  .danger-fill {
    background: color(red-fill);
    border-color: color(red-fill);
    color: color(on-red);
    &:hover:not(:disabled) {
      background: color(red-fill-hover);
      border-color: color(red-fill-hover);
    }
    &:active {
      background: color(red-fill-active);
      border-color: color(red-fill-active);
    }
  }
  // An icon button: the square of a small button, wherever it is
  .icon {
    width: h(icon-button);
    height: h(icon-button);
    padding: 0;
    justify-content: center;
  }
  .block {
    width: 100%;
    justify-content: center;
  }
  .spread {
    justify-content: space-between;
    .t {
      flex: 1 1 auto;
      text-align: start;
    }
  }
  .busy {
    opacity: dim();
    cursor: progress;
  }
  // Disabled and busy are the same shape without hue; busy differs only in its cursor. A filled
  // shape is not dimmed: it takes the disabled surface and its text. A link is not :disabled, so
  // busy is written as well
  .btn.primary:disabled,
  .btn.primary.busy,
  .btn.danger-fill:disabled,
  .btn.danger-fill.busy {
    opacity: 1;
    background: color(solid-disabled);
    border-color: color(solid-disabled);
    color: color(solid-disabled-text);
  }
  .btn.primary:disabled .kbd,
  .btn.primary.busy .kbd,
  .btn.danger-fill:disabled .kbd,
  .btn.danger-fill.busy .kbd {
    color: color(solid-disabled-text);
  }
  // A line shape takes the outline's text and line, dimmed
  .btn.danger:disabled,
  .btn.danger.busy {
    color: color(text);
    border-color: color(line-strong);
    background: transparent;
  }
  // Selected: the stronger surface. The icon of a selected tool turns blue; text keeps its color
  .on {
    background: color(raise-2);
  }
  .on.icon > :global(svg) {
    color: color(blue-ink);
  }
  .ghost[data-tone='danger']:hover:not(:disabled) {
    color: color(red-ink);
  }
  // The trigger of an open menu keeps the hover surface
  .btn[aria-expanded='true'][aria-haspopup] {
    background: color(raise);
  }
</style>
