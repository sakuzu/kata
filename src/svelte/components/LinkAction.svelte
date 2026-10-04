<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import type { IconSource } from '../icons.js';
  import Icon from './Icon.svelte';

  // LinkAction: an action that is text only, for an action that does not call for a control with a
  // line ("Add a description", "Show all"). In a layout its height is the line box of its text, so
  // it is measured like the text around it; the area that is pressed reaches the square of an icon
  // button above and below it. No padding at the sides, so its edge lines up with the text around
  // it. The color is blue-ink, underlined on hover. In a sentence (inside a Text) it takes the size
  // and the line height of the text around it. An action that opens a modal or changes the screen
  // is a Button.
  //
  //   <LinkAction icon="plus" onclick={add}>Add a description</LinkAction>
  //   <LinkAction href={url} external>Terms of use</LinkAction>      opens in a new tab
  let {
    icon,
    href,
    onclick,
    disabled = false,
    external = false,
    children,
  }: {
    /** An icon before the text */
    icon?: IconSource;
    /** Renders a link */
    href?: string;
    onclick?: (e: MouseEvent) => void;
    /** Keeps its place but cannot be pressed (not with href) */
    disabled?: boolean;
    /** A destination outside the application: a new tab and an arrow after the text (with href) */
    external?: boolean;
    children: Snippet;
  } = $props();
</script>

{#snippet inner()}
  {#if icon}<Icon name={icon} />{/if}<span class="t" data-ink>{@render children()}</span>{#if external}<Icon
      name="arrow-up-right"
    />{/if}
{/snippet}

{#if href}
  <a
    class="link"
    data-role="box"
    {href}
    target={external ? '_blank' : undefined}
    rel={external ? 'noreferrer' : undefined}
    {onclick}>{@render inner()}</a
  >
{:else}
  <button type="button" class="link" data-role="box" {disabled} {onclick}>{@render inner()}</button>
{/if}

<style lang="scss">
  @use '../styles/kata' as *;

  .link {
    display: inline-flex;
    align-items: center;
    gap: gap(sm);
    position: relative;
    padding: 0;
    border: 0;
    background: none;
    color: color(blue-ink);
    @include text(body);
    text-align: start;
    text-decoration: none;
    cursor: pointer;
    flex: none;
    &:hover {
      text-decoration: underline;
    }
    // The area that is pressed reaches the height of an icon button; the layout keeps the text's
    &::after {
      content: '';
      position: absolute;
      inset-inline: 0;
      top: 50%;
      height: h(icon-button);
      translate: 0 -50%;
    }
    // Disabled dims the text color (the dimmed blue would fall below 4.5:1)
    &:disabled {
      color: color(text);
      opacity: dim();
      cursor: default;
      text-decoration: none;
    }
    > :global(svg) {
      flex: none;
    }
  }
  // In a sentence (inside a Text) it takes the size and the line height of the text around it, and
  // stays inline
  :global(.kata-text) .link {
    font-size: inherit;
    line-height: inherit;
  }
  // In a layout the text keeps its line box. Inside something that declares a height (a list
  // item, a toolbar) it is text in a control, trimmed to its ink and centred.
  .t {
    display: block;
    min-width: 0;
  }
  :global([data-h]) .t {
    @include trim;
  }
</style>
