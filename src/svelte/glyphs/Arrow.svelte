<script lang="ts">
  // An arrow: a line with a dot at its tail and a filled triangle at its head (Lucide's
  // arrow-up-right reads as an external link).
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
  <line x1="4" y1="20" x2="16.5" y2="7.5" />
  <circle cx="4" cy="20" r="1.7" fill="currentColor" stroke="none" />
  <polygon points="21 3 19.2 11.2 12.8 4.8" fill="currentColor" stroke="none" />
</svg>
