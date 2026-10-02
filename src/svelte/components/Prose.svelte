<script lang="ts">
  import '../styles/components.css';
  import type { Snippet } from 'svelte';

  // Prose: a container for reading text (help, terms, tutorials). Its width is at most the prose
  // measure and its text is the prose role. The content is plain HTML (h1 to h4, p, ul, ol, dl,
  // code, pre, a, img, figure, table, blockquote, details); the container styles the elements.
  //
  // Prose is the one component whose children have outer margins, in em: pad-lg before each block,
  // pad-xl before an h2, and after a heading the heading's offset, so that a heading sits closer to
  // the text it introduces. Items of a list are apart by the leading only. Prose has no padding; it
  // behaves as edge text and passes the edge flags through, so at the start of a Page its first
  // heading is trimmed to its ink.
  //
  //   <Prose>{@html article}</Prose>
  //   <Prose><h2>…</h2><p>…</p></Prose>
  let { children }: { children: Snippet } = $props();
</script>

<div class="prose" data-role="prose" data-pass>{@render children()}</div>

<style lang="scss">
  @use '../styles/kata' as *;

  .prose {
    @include text(prose);
    max-width: var(--kata-width-prose);
    min-width: 0;
  }
  // Remove the elements' own margins first (:where keeps the specificity low)
  .prose :global(:where(h1, h2, h3, h4, p, ul, ol, dl, dd, blockquote, pre, figure, table, hr)) {
    margin: 0;
  }
  .prose > :global(* + *),
  .prose :global(li > * + *) {
    margin-top: pad(lg);
  }
  // Headings: h1 takes the title role, h2 the h1 role, h3 the h2 role and h4 the label role
  .prose :global(h1) {
    @include text(title);
  }
  .prose :global(h2) {
    @include text(h1);
  }
  .prose :global(h3) {
    @include text(h2);
  }
  .prose :global(h4) {
    @include text(label);
  }
  .prose > :global(* + h2) {
    margin-top: pad(xl);
  }
  // A folded part: the summary is body text at the label weight after a chevron, which turns down
  // when the part is open. The chevron is the chevron-right icon at the icon size, drawn with a
  // mask so that it takes the color of the text. A folded part is a block: pad-lg before it
  .prose :global(summary) {
    @include text(body);
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: gap(2xs);
    list-style: none;
    cursor: pointer;
    &::-webkit-details-marker {
      display: none;
    }
    &::before {
      content: '';
      flex: none;
      width: h(icon);
      height: h(icon);
      background: currentColor;
      mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m9 18 6-6-6-6'/%3E%3C/svg%3E")
        center / contain no-repeat;
    }
  }
  .prose :global(details[open] > summary::before) {
    rotate: 90deg;
  }
  .prose > :global(* + details) {
    margin-top: pad(lg);
  }
  .prose :global(details > * + *) {
    margin-top: pad(lg);
  }
  // The summary is body text at the label weight: the label's offset (the one of the body size)
  .prose :global(summary + *) {
    margin-top: off(label);
  }
  .prose > :global(h1 + *) {
    margin-top: off(title);
  }
  .prose > :global(h2 + *) {
    margin-top: off(h1);
  }
  .prose > :global(h3 + *) {
    margin-top: off(h2);
  }
  .prose > :global(h4 + *) {
    margin-top: off(label);
  }
  // Terms and descriptions: the term (bold) above its description, pad-sm between entries
  .prose :global(dl) {
    display: flex;
    flex-direction: column;
    gap: pad(xs); /* kata-allow-pad-gap */
  }
  .prose :global(dt) {
    font-weight: 600;
    min-width: 0;
  }
  .prose :global(dd) {
    min-width: 0;
  }
  .prose :global(dd + dt) {
    margin-top: pad(sm);
  }
  .prose :global(hr) {
    border: 0;
    border-top: bw() solid color(line);
  }
  .prose :global(ul),
  .prose :global(ol) {
    padding-left: pad(lg);
  }
  .prose :global(ul) {
    list-style: disc;
  }
  .prose :global(ol) {
    list-style: decimal;
  }
  .prose :global(li) {
    min-width: 0;
  }
  .prose :global(figcaption) {
    @include text(caption);
    margin-top: pad(xs);
  }
  .prose :global(img) {
    display: block;
    max-width: 100%;
    height: auto;
    border: bw() solid color(line);
  }
  .prose :global(blockquote) {
    padding-left: pad(md);
    border-left: 2px solid color(line-strong);
  }
  // Code is one quarter step smaller than the text around it
  .prose :global(code) {
    font-family: var(--kata-font-mono);
    font-size: calc(1em / var(--kata-step-quarter));
    background: color(raise);
    padding: 0 pad(2xs);
  }
  .prose :global(pre) {
    font-family: var(--kata-font-mono);
    font-size: calc(1em / var(--kata-step-quarter));
    line-height: lh(prose);
    background: color(raise);
    padding: pad(sm) pad(md);
    overflow-x: auto;
  }
  .prose :global(pre code) {
    background: transparent;
    padding: 0;
    font-size: inherit;
  }
  // Links in running text are underlined
  .prose :global(a:not([data-role])) {
    color: color(blue-ink);
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  // Links that are terms (a table of contents) are underlined on hover only
  .prose :global(dt > a:not([data-role])) {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  // A table scrolls sideways on its own when it is wider than the container
  .prose :global(table) {
    display: block;
    max-width: 100%;
    overflow-x: auto;
    border-collapse: collapse;
  }
  .prose :global(th) {
    text-align: start;
    font-weight: 600;
    padding: pad(sm);
    border-bottom: bw() solid color(line);
  }
  .prose :global(td) {
    padding: pad(sm);
    border-bottom: bw() solid color(line);
    vertical-align: top;
  }
</style>
