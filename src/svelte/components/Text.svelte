<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';
  import type { Action } from 'svelte/action';
  import { clampTip } from '../lib/clampTip.js';

  // Text: text in one of the nine type roles, each with its size, leading, tracking, weight and
  // element. Text outside a control keeps its line box (it is not trimmed); the distance to its
  // neighbours is the gap of a Stack or a Row. Inside a component that declares its height
  // (a list item, a toolbar) it is trimmed to its ink and clipped to one line.
  //
  //   <Text role="h1">The title of a screen</Text>        an h1
  //   <Text role="caption">A note</Text>                   a span shown as a block
  //   <Text role="prose">A paragraph to read</Text>        a p
  //   <Text role="caption" mono clamp>name@example.com</Text>
  //   <Text as="a" href="/files/1" clamp>A name</Text>     a link that keeps the color around it
  type Role = 'num' | 'title' | 'h1' | 'h2' | 'prose' | 'body' | 'caption' | 'label' | 'glyph';
  let {
    role = 'body',
    as,
    clamp = false,
    lines,
    wrap = false,
    muted = false,
    mono = false,
    tabular = false,
    id,
    for: htmlFor,
    href,
    children,
  }: {
    /** The type role (default body) */
    role?: Role;
    /** Another element than the role's own: h1 (title, h1), h2 (h2), p (body, prose) or span */
    as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'label' | 'dt' | 'dd' | 'a';
    /** One line with an ellipsis; the full text shows on hover when it is clipped */
    clamp?: boolean;
    /** Two lines with an ellipsis */
    lines?: 2;
    /** Keep line breaks and wrap long words (text that people wrote) */
    wrap?: boolean;
    /** The muted text color */
    muted?: boolean;
    /** The monospace font, at the role's size */
    mono?: boolean;
    /** Figures of equal width, for columns of numbers and times */
    tabular?: boolean;
    id?: string;
    /** The labelled control, with as="label" */
    for?: string;
    /** The target, with as="a" */
    href?: string;
    children: Snippet;
  } = $props();
  const tag = $derived(
    as ??
      (role === 'h1' || role === 'title'
        ? 'h1'
        : role === 'h2'
          ? 'h2'
          : role === 'prose' || role === 'body'
            ? 'p'
            : 'span'),
  );
  const dataRole = $derived(role === 'body' || role === 'prose' ? 'p' : role);
  // The full text of a clipped line shows as a tooltip (clampTip), only while clamp is on
  const clampTipIf: Action<HTMLElement, boolean> = (node, on) => {
    let inner: ReturnType<typeof clampTip> | undefined = on ? clampTip(node) : undefined;
    return {
      update(next: boolean) {
        if (next && !inner) inner = clampTip(node);
        else if (!next && inner) {
          inner?.destroy?.();
          inner = undefined;
        }
      },
      destroy() {
        inner?.destroy?.();
      },
    };
  };
</script>

<svelte:element
  this={tag}
  class="kata-text {role}"
  class:clamp
  class:clamp2={lines === 2}
  class:wrap
  class:muted
  class:mono
  class:tabular
  data-role={dataRole}
  {id}
  for={tag === 'label' ? htmlFor : undefined}
  href={tag === 'a' ? href : undefined}
  use:clampTipIf={clamp}
>
  {@render children()}
</svelte:element>

<style lang="scss">
  @use '../styles/kata' as *;

  .kata-text {
    display: block;
    margin: 0;
    min-width: 0;
  }
  // Inside a component that declares its height ([data-h], which raises --kata-in-control), text is
  // trimmed to its ink and centred; a container with padding lowers the flag again. Unless it wraps
  // on purpose, it stays on one line. Table cells line their text up in columns, so they trim too.
  @container style(--kata-in-control: 1) {
    .kata-text {
      @include trim;
    }
    .kata-text:not(.clamp2):not(.wrap) {
      @include ellipsis;
    }
  }
  :global(td) .kata-text,
  :global(th) .kata-text {
    @include trim;
  }
  .num {
    @include text(num);
  }
  .title {
    @include text(title);
  }
  .h1 {
    @include text(h1);
  }
  .h2 {
    @include text(h2);
  }
  .body {
    @include text(body);
  }
  .prose {
    @include text(prose);
  }
  .caption {
    @include text(caption);
  }
  .label {
    @include text(label);
  }
  .glyph {
    @include text(glyph);
  }
  .kata-text.mono {
    font-family: var(--kata-font-mono);
    font-variant-numeric: tabular-nums;
  }
  // A name that links (as="a"): the color of the text around it, underlined on hover only
  a.kata-text {
    color: inherit;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  .tabular {
    font-variant-numeric: tabular-nums;
  }
  .muted {
    color: color(muted);
  }
  .clamp {
    @include ellipsis;
  }
  .wrap {
    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: anywhere;
  }
  .kata-text.clamp2 {
    @include untrim;
  }
  .clamp2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: anywhere;
  }
</style>
