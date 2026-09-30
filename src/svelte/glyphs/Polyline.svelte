<script lang="ts">
  // A polyline: straight segments between vertices, with the vertices shown as dots.
  // A 24-unit grid like Lucide's; Icon passes the class that sizes it.
  let {
    size = 24,
    strokeWidth = 1.75,
    style,
    class: cls,
  }: { size?: number; strokeWidth?: number; style?: string; class?: string } = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  {style}
  class={cls}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width={strokeWidth}
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  <polyline points="3 17 8 11 14 14 21 6" />
  <circle cx="3" cy="17" r="1.7" fill="currentColor" stroke="none" />
  <circle cx="8" cy="11" r="1.7" fill="currentColor" stroke="none" />
  <circle cx="14" cy="14" r="1.7" fill="currentColor" stroke="none" />
  <circle cx="21" cy="6" r="1.7" fill="currentColor" stroke="none" />
</svg>
