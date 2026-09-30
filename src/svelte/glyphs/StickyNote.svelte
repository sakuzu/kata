<script lang="ts">
  // A sticky note: a square with a folded corner and two lines of writing.
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
  <path d="M5 3h14a2 2 0 0 1 2 2v9l-7 7H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
  <path d="M21 14h-5a2 2 0 0 0-2 2v5" />
  <line x1="8" y1="8.5" x2="17" y2="8.5" />
  <line x1="8" y1="12.5" x2="13" y2="12.5" />
</svg>
