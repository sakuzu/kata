<script lang="ts">
  import '../styles/components.css';
  import type { IconSource } from '../icons.js';
  import Icon from './Icon.svelte';

  // Thumbnail: a small picture of a document or a file. The surface is raise-2 with a line, and the
  // image fills it (cover). Without an image (not loaded yet, or none) it shows an icon. Its width
  // is given in rem and its height is two thirds of it (3:2); size="full" fills the container at
  // 16:10. In a list item it holds pad-md above and below, so the item grows to thumbnail-row.
  //
  //   <Thumbnail src={url} alt="" />
  //   <Thumbnail size="full" src={url} alt="" />
  //   <Thumbnail icon={Folder} />
  let {
    src,
    alt = '',
    size = '3rem',
    icon = 'image',
    onerror,
  }: {
    /** The image; without it the icon shows */
    src?: string;
    /** The text alternative of the image (empty when it is decorative) */
    alt?: string;
    /** The width in rem (the height is two thirds of it), or full */
    size?: string;
    /** The icon shown without an image (default image) */
    icon?: IconSource;
    /** Called when the image fails to load (the caller drops src to show the icon) */
    onerror?: () => void;
  } = $props();
  const full = $derived(size === 'full');
</script>

<span
  class="thumbnail"
  class:full
  data-role="mark"
  data-kata-tall={full ? undefined : ''}
  style:--kata-thumbnail-width={full ? null : size}
>
  {#if src}
    <img {src} {alt} onerror={() => onerror?.()} />
  {:else}
    <Icon name={icon} />
  {/if}
</span>

<style lang="scss">
  @use '../styles/kata' as *;

  .thumbnail {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    width: var(--kata-thumbnail-width);
    height: calc(var(--kata-thumbnail-width) / 1.5);
    background: color(raise-2);
    border: bw() solid color(line);
    color: color(muted);
    flex: none;
  }
  .full {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 10;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
</style>
