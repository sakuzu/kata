<script lang="ts">
  import '../styles/components.css';
  import { untrack } from 'svelte';
  import { getMessages } from '../messages.js';
  import Button from './Button.svelte';
  import ColorGrid from './ColorGrid.svelte';
  import Icon from './Icon.svelte';
  import NumberInput from './NumberInput.svelte';
  import Row from './Row.svelte';
  import Select from './Select.svelte';
  import Stack from './Stack.svelte';
  import Text from './Text.svelte';
  import TextInput from './TextInput.svelte';

  // ColorPicker: a board to pick one color. It stacks, gap-sm apart, the title and a close button,
  // a grid of preset colors (ColorGrid), the plane of saturation and value, the strip of hues with
  // an eyedropper, and the fields of the value (hex, or the components) with a Select of the
  // format. Opened in the content, the board draws its own surface and line; floating in a slot that
  // draws them (bare), it keeps only its padding, so that no line is drawn twice.
  //
  // The plane and the strip are pictures of the color space, so their colors are values, not roles
  // of the design; only their size is layout, and the edges of the knobs take color roles. The
  // eyedropper works where the browser has the EyeDropper API.
  //
  //   <ColorPicker bind:value onpick={apply} onclose={() => (open = false)} />
  let {
    value = $bindable('#E5484D'),
    swatches = defaultSwatches(),
    format = 'hex',
    bare = false,
    title = getMessages().color,
    onpick,
    onclose,
  }: {
    /** The chosen color (#RRGGBB) */
    value?: string;
    /** The preset colors and their names, which screen readers say */
    swatches?: { name: string; hex: string }[];
    /** The format the fields start in */
    format?: Fmt;
    /** The slot around it draws the surface and the line; the board keeps its padding only */
    bare?: boolean;
    /** The title (Color by default) */
    title?: string;
    /** Called with the color picked and its name (the hex when it has none) */
    onpick?: (hex: string, name: string) => void;
    /** Called by the close button */
    onclose?: () => void;
  } = $props();

  type Fmt = 'hex' | 'rgb' | 'hsl';
  /** Nine preset colors, named from the messages */
  function defaultSwatches(): { name: string; hex: string }[] {
    const m = getMessages();
    return [
      { name: m.colorRed, hex: '#E5484D' },
      { name: m.colorOrange, hex: '#D9730D' },
      { name: m.colorGold, hex: '#C29210' },
      { name: m.colorGreen, hex: '#2E9E5B' },
      { name: m.colorBlue, hex: '#2D7FF9' },
      { name: m.colorPurple, hex: '#8A5CF6' },
      { name: m.colorBlack, hex: '#1B1B1B' },
      { name: m.colorBrown, hex: '#9A6B43' },
      { name: m.colorWhite, hex: '#FFFFFF' },
    ];
  }
  const formats: { value: Fmt; label: string }[] = [
    { value: 'hex', label: 'Hex' },
    { value: 'rgb', label: 'RGB' },
    { value: 'hsl', label: 'HSL' },
  ];

  // ── Color conversion (hex ↔ HSV) ───────────────────────────
  function clamp01(n: number): number {
    return Math.min(1, Math.max(0, n));
  }
  function hexToRgb(input: string): [number, number, number] | null {
    let v = input.trim().replace(/^#/, '');
    if (v.length === 3)
      v = v
        .split('')
        .map((c) => c + c)
        .join('');
    if (!/^[0-9a-fA-F]{6}$/.test(v)) return null;
    return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
  }
  function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    if (d) {
      if (max === r) h = ((g - b) / d) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
      if (h < 0) h += 360;
    }
    return { h, s: max === 0 ? 0 : d / max, v: max };
  }
  function hsvToHex(h: number, s: number, v: number): string {
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m0 = v - c;
    let r = 0;
    let g = 0;
    let b = 0;
    if (h < 60) [r, g] = [c, x];
    else if (h < 120) [r, g] = [x, c];
    else if (h < 180) [g, b] = [c, x];
    else if (h < 240) [g, b] = [x, c];
    else if (h < 300) [r, b] = [x, c];
    else [r, b] = [c, x];
    const to2 = (n: number) =>
      Math.round((n + m0) * 255)
        .toString(16)
        .padStart(2, '0');
    return `#${to2(r)}${to2(g)}${to2(b)}`.toUpperCase();
  }
  function rgbToHex(r: number, g: number, b: number): string {
    const to2 = (n: number) => Math.round(n).toString(16).padStart(2, '0');
    return `#${to2(r)}${to2(g)}${to2(b)}`.toUpperCase();
  }
  function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    const l = (max + min) / 2;
    let h = 0;
    let sl = 0;
    if (d) {
      sl = d / (1 - Math.abs(2 * l - 1));
      if (max === r) h = ((g - b) / d) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
      if (h < 0) h += 360;
    }
    return { h: Math.round(h), s: Math.round(sl * 100), l: Math.round(l * 100) };
  }
  function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m0 = l - c / 2;
    let r = 0;
    let g = 0;
    let b = 0;
    if (h < 60) [r, g] = [c, x];
    else if (h < 120) [r, g] = [x, c];
    else if (h < 180) [g, b] = [c, x];
    else if (h < 240) [g, b] = [x, c];
    else if (h < 300) [r, b] = [x, c];
    else [r, b] = [c, x];
    return [Math.round((r + m0) * 255), Math.round((g + m0) * 255), Math.round((b + m0) * 255)];
  }

  // hex (the normalized internal value) and HSV (for SV/Hue interaction). HSV is the primary state for
  // interaction and the two stay in sync.
  let hex = $state(untrack(() => value));
  let fmt = $state<Fmt>(untrack(() => format));
  let h = $state(0);
  let s = $state(0);
  let v = $state(0);
  untrack(() => {
    const c = hexToRgb(value);
    if (c) ({ h, s, v } = rgbToHsv(...c));
  });

  // Pure hue used as the base of the SV plane (saturation/value 100%).
  const hueColor = $derived(hsvToHex(h, 1, 1));

  // Split the current color into components for the fields (hex is the source of truth). fmt decides
  // whether the Hex, RGB or HSL fields are shown.
  const rgb = $derived(hexToRgb(hex) ?? ([0, 0, 0] as [number, number, number]));
  const hsl = $derived(rgbToHsl(...rgb));

  let svEl = $state<HTMLDivElement>();
  let hueEl = $state<HTMLDivElement>();
  let svDragging = $state(false);
  let hueDragging = $state(false);

  function clampInt(raw: string | number, lo: number, hi: number): number {
    const n = Math.round(Number(raw));
    if (Number.isNaN(n)) return lo;
    return Math.min(hi, Math.max(lo, n));
  }
  // Commit HSV → hex and notify (also while dragging SV/Hue). The fields follow through the rgb/hsl derivations.
  function emitHsv() {
    hex = hsvToHex(h, s, v);
    value = hex;
    onpick?.(hex, hex);
  }
  // hex → HSV. Makes SV/Hue follow when a preset or a field changes the color.
  function syncHsvFromHex() {
    const c = hexToRgb(hex);
    if (c) ({ h, s, v } = rgbToHsv(...c));
  }
  // Commit hex, make SV/Hue follow and notify (shared by the fields, presets and eyedropper).
  function applyHex(next: string) {
    hex = next;
    value = next;
    syncHsvFromHex();
    onpick?.(hex, hex);
  }

  function pick(sw: { name: string; hex: string }) {
    hex = sw.hex;
    value = sw.hex;
    syncHsvFromHex();
    onpick?.(sw.hex, sw.name);
  }
  // Commit the Hex field. Accepts only #RRGGBB / #RGB; invalid input reverts to the current value.
  function commitHex(e: Event) {
    const el = e.currentTarget as HTMLInputElement;
    const c = hexToRgb(el.value.trim());
    if (c) applyHex(rgbToHex(...c));
    else el.value = hex;
  }
  // Commit one RGB component (the others come from the current color). Clamped to 0..255.
  function commitRgb(i: number, raw: string) {
    const next: [number, number, number] = [...rgb];
    next[i] = clampInt(raw, 0, 255);
    applyHex(rgbToHex(...next));
  }
  // Commit one HSL component. H is clamped to 0..359, S/L to 0..100 (%).
  function commitHsl(part: 'h' | 's' | 'l', raw: string) {
    let { h: H, s: S, l: L } = hsl;
    if (part === 'h') H = clampInt(raw, 0, 360) % 360;
    else if (part === 's') S = clampInt(raw, 0, 100);
    else L = clampInt(raw, 0, 100);
    applyHex(rgbToHex(...hslToRgb(H, S, L)));
  }

  // ── SV (saturation = x, value = y) ─────────────────────────
  function svAt(clientX: number, clientY: number) {
    const el = svEl;
    if (!el) return;
    const r = el.getBoundingClientRect();
    s = clamp01((clientX - r.left) / r.width);
    v = 1 - clamp01((clientY - r.top) / r.height);
    emitHsv();
  }
  function svDown(e: PointerEvent) {
    svDragging = true;
    svEl?.setPointerCapture(e.pointerId);
    svAt(e.clientX, e.clientY);
  }
  function svMove(e: PointerEvent) {
    if (svDragging) svAt(e.clientX, e.clientY);
  }
  function svUp(e: PointerEvent) {
    svDragging = false;
    svEl?.releasePointerCapture(e.pointerId);
  }
  function svKey(e: KeyboardEvent) {
    const step = 0.02;
    if (e.key === 'ArrowLeft') s = clamp01(s - step);
    else if (e.key === 'ArrowRight') s = clamp01(s + step);
    else if (e.key === 'ArrowUp') v = clamp01(v + step);
    else if (e.key === 'ArrowDown') v = clamp01(v - step);
    else return;
    e.preventDefault();
    emitHsv();
  }

  // ── Hue (0..360) ────────────────────────────────────────────
  function hueAt(clientX: number) {
    const el = hueEl;
    if (!el) return;
    const r = el.getBoundingClientRect();
    h = clamp01((clientX - r.left) / r.width) * 360;
    emitHsv();
  }
  function hueDown(e: PointerEvent) {
    hueDragging = true;
    hueEl?.setPointerCapture(e.pointerId);
    hueAt(e.clientX);
  }
  function hueMove(e: PointerEvent) {
    if (hueDragging) hueAt(e.clientX);
  }
  function hueUp(e: PointerEvent) {
    hueDragging = false;
    hueEl?.releasePointerCapture(e.pointerId);
  }
  function hueKey(e: KeyboardEvent) {
    const step = 2;
    if (e.key === 'ArrowLeft') h = (h - step + 360) % 360;
    else if (e.key === 'ArrowRight') h = (h + step) % 360;
    else return;
    e.preventDefault();
    emitHsv();
  }

  // Eyedropper (Chrome's EyeDropper API; does nothing where unsupported).
  async function useEyedropper() {
    const w = window as unknown as {
      EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> };
    };
    if (!w.EyeDropper) return;
    try {
      const res = await new w.EyeDropper().open();
      applyHex(res.sRGBHex.toUpperCase());
    } catch {
      // Ignore a canceled pick.
    }
  }
</script>

{#snippet board()}
  <Stack gap="sm">
    <Row between>
      <Text role="h2">{title}</Text>
      <Button variant="ghost" icon aria-label={getMessages().close} onclick={onclose}>
        <Icon name="x" />
      </Button>
    </Row>

    <ColorGrid
      colors={swatches}
      value={hex}
      label={title}
      onselect={(picked) => {
        const sw = swatches.find((c) => c.hex === picked);
        if (sw) pick(sw);
      }}
    />

    <!-- The plane takes the pure hue as its ground -->
    <div
      class="sv"
      bind:this={svEl}
      style:--kata-color-picker-hue={hueColor}
      role="slider"
      aria-label={getMessages().saturationValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(s * 100)}
      aria-valuetext={getMessages().saturationValueText({
        s: Math.round(s * 100),
        v: Math.round(v * 100),
      })}
      tabindex="0"
      onpointerdown={svDown}
      onpointermove={svMove}
      onpointerup={svUp}
      onkeydown={svKey}
    >
      <span class="knob" style:left="{s * 100}%" style:top="{(1 - v) * 100}%"></span>
    </div>

    <Row gap="sm">
      <div
        class="hue"
        bind:this={hueEl}
        role="slider"
        aria-label={getMessages().hue}
        aria-valuemin={0}
        aria-valuemax={360}
        aria-valuenow={Math.round(h)}
        tabindex="0"
        onpointerdown={hueDown}
        onpointermove={hueMove}
        onpointerup={hueUp}
        onkeydown={hueKey}
      >
        <span class="knob" style:left="{(h / 360) * 100}%" style:top="50%"></span>
      </div>
      <Button variant="ghost" icon aria-label={getMessages().eyedropper} onclick={useEyedropper}>
        <Icon name="pipette" />
      </Button>
    </Row>

    <!-- A row of controls, which wraps when it does not fit -->
    <Row gap="sm" wrap>
      {#if fmt === 'rgb'}
        {#each ['R', 'G', 'B'] as label, i (label)}
          <NumberInput
            value={rgb[i]}
            unit={label}
            min={0}
            max={255}
            ariaLabel={label}
            onchange={(e) => commitRgb(i, e.currentTarget.value)}
          />
        {/each}
      {:else if fmt === 'hsl'}
        <NumberInput
          value={hsl.h}
          unit="H"
          min={0}
          max={360}
          ariaLabel={getMessages().hue}
          onchange={(e) => commitHsl('h', e.currentTarget.value)}
        />
        <NumberInput
          value={hsl.s}
          unit="S"
          min={0}
          max={100}
          ariaLabel={getMessages().saturation}
          onchange={(e) => commitHsl('s', e.currentTarget.value)}
        />
        <NumberInput
          value={hsl.l}
          unit="L"
          min={0}
          max={100}
          ariaLabel={getMessages().lightness}
          onchange={(e) => commitHsl('l', e.currentTarget.value)}
        />
      {:else}
        <TextInput mono value={hex} onchange={commitHex} aria-label={getMessages().colorCode} />
      {/if}
      <div class="fmt">
        <Select options={formats} bind:value={fmt} />
      </div>
    </Row>
  </Stack>
{/snippet}

<div class="cp" class:bare data-inset data-role={bare ? 'block' : 'card'}>{@render board()}</div>

<style lang="scss">
  @use '../styles/kata' as *;

  // The board is 15rem wide, and never wider than its container. It stays pressable when it floats above content that is not.
  .cp {
    width: 15rem;
    max-width: 100%;
    flex: 0 0 auto;
    pointer-events: auto;
    @include surface(panel);
    border: bw() solid color(line-strong);
    @include container;
    min-width: 0;
    @include scope-box(button);
  }
  // In a slot that draws the surface and the line, only the padding remains
  .cp.bare {
    background: none;
    border: 0;
  }
  // The plane and the strip are pictures of the color space; their gradients are values
  .sv {
    position: relative;
    height: 7.5rem;
    background-image:
      linear-gradient(to top, #000, transparent),
      linear-gradient(to right, #fff, var(--kata-color-picker-hue, #0033ff));
  }
  .hue {
    position: relative;
    flex: 1 1 auto;
    min-width: 0;
    height: 0.5rem;
    background-image: linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00);
  }
  // The knob is the square of an icon, as in Slider. Two edges, in the surface color and in the
  // text color, keep it visible on any color.
  .knob {
    position: absolute;
    width: h(icon);
    height: h(icon);
    border: calc(#{bw()} * 2) solid color(surface);
    box-shadow: 0 0 0 bw() color(text);
    transform: translate(-50%, -50%);
  }
  // The format takes the width of its trigger's text
  .fmt {
    flex: 0 0 auto;
  }
</style>
