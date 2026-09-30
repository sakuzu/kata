<script lang="ts">
  // An irregular polygon with its vertices shown as dots, so that it does not read as a square.
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
  <polygon points="11 3 21 9 17 21 6 20 3 9" />
  <circle cx="11" cy="3" r="1.7" fill="currentColor" stroke="none" />
  <circle cx="21" cy="9" r="1.7" fill="currentColor" stroke="none" />
  <circle cx="17" cy="21" r="1.7" fill="currentColor" stroke="none" />
  <circle cx="6" cy="20" r="1.7" fill="currentColor" stroke="none" />
  <circle cx="3" cy="9" r="1.7" fill="currentColor" stroke="none" />
</svg>
