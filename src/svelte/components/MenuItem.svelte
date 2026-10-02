<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { IconSource } from '../icons.js';
  import Icon from './Icon.svelte';

  // MenuItem: one item of a menu. It is as high as a list item, with pad-md at the sides and gap-sm
  // between its columns: an icon or a check mark on the left, the name in the rest, and a key hint
  // (plain monospace) or a chevron for a submenu at the right end. danger turns the text red; a
  // destructive item goes last, after a MenuDivider.
  //
  // It is a <button> (an <a> with href), always with role="menuitem" and tabindex="-1": the menu
  // moves the focus with the arrow keys. Other attributes (data-*, aria-*, onmouseenter) go to the
  // element. An item grows with its content: a Stack (gap sm) with a second line of description
  // makes it two lines high.
  //
  //   <MenuItem icon="copy" kbd="⌘D" onclick={duplicate}>Duplicate</MenuItem>
  //   <MenuItem checked={sort === 'name'} onclick={() => (sort = 'name')}>Name</MenuItem>
  //   <MenuItem sub on={openSub === i} onmouseenter={open}>Arrange</MenuItem>
  let {
    icon,
    kbd,
    danger = false,
    disabled = false,
    checked,
    sub = false,
    on = false,
    href,
    onclick,
    children,
    ...rest
  }: Omit<HTMLAttributes<HTMLElement>, 'class' | 'style' | 'onclick'> & {
    /** An icon on the left (a name or a component) */
    icon?: IconSource;
    /** A key hint at the right end (⌘Z) */
    kbd?: string;
    /** A destructive action: red text */
    danger?: boolean;
    /** Shown but not chosen: dimmed, with no hover */
    disabled?: boolean;
    /** The column of check marks on the left; without it the column is not drawn */
    checked?: boolean;
    /** The item opens a submenu: a chevron at the right end */
    sub?: boolean;
    /** The submenu of this item is open: it keeps the hover surface */
    on?: boolean;
    /** Renders a link */
    href?: string;
    onclick?: (e: MouseEvent) => void;
    children: Snippet;
  } = $props();

  function fire(e: MouseEvent) {
    e.stopPropagation();
    if (disabled) return;
    onclick?.(e);
  }
</script>

{#snippet inner()}
  {#if icon}
    <Icon name={icon} />
  {:else if checked !== undefined}
    <span class="chk">{#if checked}<Icon name="check" />{/if}</span>
  {/if}
  <span class="grow t">{@render children()}</span>
  {#if kbd}<span class="kbd t">{kbd}</span>{/if}
  {#if sub}<span class="sub"><Icon name="chevron-right" /></span>{/if}
{/snippet}

{#if href && !disabled}
  <a
    class="item"
    class:danger
    class:on
    data-role="list-item"
    data-h="list-item"
    {href}
    role="menuitem"
    tabindex="-1"
    onclick={fire}
    {...rest}
  >
    {@render inner()}
  </a>
{:else}
  <button
    type="button"
    class="item"
    class:danger
    class:disabled
    class:on
    data-role="list-item"
    data-h="list-item"
    role="menuitem"
    tabindex="-1"
    aria-disabled={disabled ? 'true' : undefined}
    onclick={fire}
    {...rest}
  >
    {@render inner()}
  </button>
{/if}

<style lang="scss">
  @use '../styles/kata' as *;

  .item {
    display: flex;
    align-items: center;
    gap: gap(sm);
    width: 100%;
    // The least height is a text item's; the content can make it higher
    min-height: var(--kata-list-item-height, #{h(list-item)});
    padding-inline: pad(md);
    border: 0;
    background: none;
    color: inherit;
    @include text(body);
    text-align: start;
    text-decoration: none;
    cursor: pointer;
    flex: none;
    &:hover {
      background: color(raise);
      text-decoration: none;
    }
    @include focus-inside;
    > :global(svg) {
      flex: none;
    }
    // Every visible thing inside keeps md above and below, as in a list item
    @include row-content;
  }
  // Text in a control: trimmed to its ink and centred
  .t {
    display: block;
    min-width: 0;
    @include trim;
  }
  .on {
    background: color(raise);
  }
  .danger {
    color: color(red-ink);
  }
  .disabled {
    opacity: dim();
    cursor: default;
    &:hover {
      background: transparent;
    }
  }
  // The name is one line with an ellipsis
  .grow {
    flex: 1;
    min-width: 0;
    @include ellipsis;
  }
  // The column of check marks, so that items with and without a mark line up
  .chk {
    display: flex;
    width: h(icon);
    flex: none;
  }
  // The key hint and the chevron are plain, in the right-hand column
  .kbd,
  .sub {
    margin-left: auto;
    color: color(muted);
    flex: none;
  }
  .kbd {
    font-family: var(--kata-font-mono);
    @include text(caption);
    white-space: nowrap;
  }
  .sub {
    display: flex;
  }
</style>
