<script lang="ts">
  // A point: a small filled circle, as a drawing tool draws a point. It differs from the circle
  // tool (a hollow ring) by fill and size.
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
  aria-hidden="true"
>
  <circle cx="12" cy="12" r="5.5" fill="currentColor" />
</svg>
