// The measurements of the audit, run inside the page (Playwright adds this file with addScriptTag).
// window.kataAudit(rootSelector) measures every visible element inside the roots and returns the
// findings: { kind, el, ...values }. Nothing is estimated; each rule compares a computed value with
// the values the tokens allow, within 0.06px at a root size of 16px.
//
//   space          padding on each side, gap, row-gap and column-gap are 0 or a step of the scale:
//                  the element's font size times a power of φ (pad-*), or the root times one (gap-*)
//   margin         outer margins only inside Prose or a Block, never negative
//   type           font sizes are the sizes of the type roles; line heights are the half step, the
//                  whole step or 1, times the font size
//   border         each border is 0, 1 or 2px and solid (a border left by the user agent fails)
//   height         an element that declares data-h has the height of that token
//   trim           text is trimmed to its ink only inside a control ([data-h], a mark, a pair,
//                  a section head, a table cell), at the inner edge of a container or a section, and
//                  next to a line
//   trim-clip      trimmed text keeps its vertical overflow visible (or clips it with a clip margin
//                  of at least 0.3em), so the descenders and the top of CJK ink are never cut
//   cursor         everything that can be pressed shows the pointer
//   contrast       text reaches 7:1 on its surface (4.5:1 when disabled, or dimmed as a state:
//                  data-dim)
//   focus-halo     text fields show a 2px ring on focus and keep their surface
//   double-rule    no two lines run along one edge
//   double-inset   a container with padding never sits directly in another one
//   bundle-edge    text inside a container without padding (one that declares a non-zero inset for
//                  its items: a Panel's content, a drawer, a flush group; or a surface of the
//                  examples, data-role="surface") that no component with padding of its own holds is
//                  at least pad-md from its left edge
//   inner-gap      inside a container with padding, neighbours are no further apart than the edge
//   box-touch      a control with an outline never touches the padded edge of its container
//   box-gap        controls stacked vertically are at least md apart
//   rule-gap       a line is as far from what is above it as from what is below it
//   head-gap       a section header's head is pad-md from its content
//   head-near      a section header's head is closer to its content than to what comes before
//   page-head-gap  a page's head is pad-lg from the first visible thing of its content
//   section-head-gap  a section's head is gap-lg from its content
//   tabs-gap       the content under the line of Tabs (data-rule) is gap-lg from it; inside a
//                  container without padding (a Panel, a flush Modal, a drawer, a bare surface) the
//                  next item's own padding sets the distance, so it is not measured
//   read-row       a list item that is neither pressed nor parted by a line or a surface is not an
//                  outline (unless another item of its list is; the head of a comment is not an
//                  item of a list)
//   overlap        the children of a layout do not overlap
//   crush          text is never squeezed into a column narrower than two characters
//   fixed-frame    a size container (a Shell's root) and an embedded root ([data-kata-root]) are not
//                  the containing block of fixed elements, so that the tooltips, menus and popovers
//                  inside them still place themselves against the window
//
// data-kata-skip marks what a browser or another library draws; it is not measured.

(() => {
  const PHI = 1.618;
  const PRESSABLE =
    'a[href], button, [role="button"], [role="menuitem"], [role="option"], [role="tab"], tr[tabindex], summary';
  // The steps of the scale, 1/φ⁴ to φ⁵
  const STEPS = [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((k) => PHI ** k);
  const HEIGHTS = [
    'button',
    'button-sm',
    'icon-button',
    'list-item',
    'list-item-two',
    'list-item-mark',
    'list-item-lg',
    'thumbnail-row',
    'badge',
    'toolbar',
    'footer',
    'icon',
    'thumbnail',
  ];
  const ROLES = ['num', 'title', 'h1', 'h2', 'body', 'prose', 'caption', 'label', 'glyph'];
  const OFFSETS = ['num', 'title', 'h1', 'h2', 'prose', 'caption', 'label'];

  /** The length of a CSS value in px, resolved in the context of an element */
  function pxOf(value, el = document.documentElement) {
    const probe = document.createElement('div');
    probe.style.cssText = `position:absolute;visibility:hidden;height:${value};width:0`;
    el.appendChild(probe);
    const h = probe.getBoundingClientRect().height;
    probe.remove();
    return h;
  }
  function label(el) {
    const role = el.getAttribute('data-role') ? `[${el.getAttribute('data-role')}]` : '';
    const cls =
      el.className && typeof el.className === 'string'
        ? `.${el.className
            .split(/\s+/)
            .filter((c) => c && !c.startsWith('svelte-'))
            .slice(0, 2)
            .join('.')}`
        : '';
    const text = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 16);
    return `${el.tagName.toLowerCase()}${cls}${role} "${text}"`;
  }
  function visible(el) {
    if (!(el instanceof Element)) return false;
    if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.display === 'contents' || cs.visibility === 'hidden')
      return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }
  const shownColor = (c) => !!c && c !== 'transparent' && !/rgba\([^)]*,\s*0\)$/.test(c);
  /** A container with padding declares data-inset */
  const isContainer = (el) => el.hasAttribute('data-inset');
  /** Has an edge of its own (a border or a surface) */
  function surfaceOf(el) {
    const cs = getComputedStyle(el);
    return (
      Number.parseFloat(cs.borderTopWidth) > 0 ||
      (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent')
    );
  }
  const rootPx = () => Number.parseFloat(getComputedStyle(document.documentElement).fontSize);

  // The typeface metrics. The ink outside the cap height depends on the root's language, so they
  // are read again on every run.
  let CAP = 0.698;
  let INK_OVER = 0;
  let INK_UNDER = 0;
  let INK = CAP;
  function readInk() {
    CAP = Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--kata-cap'),
    );
    INK_OVER = pxOf('calc(var(--kata-ink-over) * 100px)') / 100;
    INK_UNDER = pxOf('calc(var(--kata-ink-under) * 100px)') / 100;
    INK = CAP + INK_OVER + INK_UNDER;
  }

  /**
   * Whether the line at one edge is trimmed: by the element itself, or by an ancestor in normal
   * flow whose edge it is (a flex or grid parent does not pass a trim on)
   */
  function trimmedEdge(el, side) {
    let n = el;
    for (let i = 0; i < 6 && n instanceof HTMLElement; i++) {
      const t = getComputedStyle(n).getPropertyValue('text-box-trim');
      if (t && t !== 'none' && (t.includes('both') || t.includes(side))) return true;
      const p = n.parentElement;
      if (!p) return false;
      if (!/^(block|flow-root|list-item)$/.test(getComputedStyle(p).display)) return false;
      const kids = [...p.children].filter((k) => k instanceof HTMLElement && visible(k));
      if ((side === 'start' ? kids[0] : kids[kids.length - 1]) !== n) return false;
      n = p;
    }
    return false;
  }
  /**
   * Next to a line: the element itself or one of its four nearest ancestors. The line along the
   * bottom of tabs that draw their own counts for what follows them.
   */
  function nearRule(el) {
    let n = el;
    for (let i = 0; i < 5 && n instanceof HTMLElement; i++) {
      if (
        n.matches(
          ':has(+ [data-role="rule"]), [data-role="rule"] + *, [data-role="tabs"][data-rule] + *',
        )
      )
        return true;
      n = n.parentElement;
    }
    return false;
  }
  /** The half-leading above (start) or below (end) the ink of an untrimmed line */
  function capPad(el, side) {
    const cs = getComputedStyle(el);
    if (trimmedEdge(el, side)) return 0;
    const lh = Number.parseFloat(cs.lineHeight);
    const fs = Number.parseFloat(cs.fontSize);
    if (Number.isNaN(lh) || Number.isNaN(fs)) return 0;
    return (lh - fs * CAP) / 2;
  }
  const LEAF =
    'img, svg, input, textarea, select, [data-role="mark"], [data-role="swatch"], [data-role="markbox"], [data-role="avatar"], [data-role="progress"], [data-role="bar"], [data-role="switch"]';
  /**
   * The visible things inside an element: outlines with a border or a surface (the hover surface
   * of a list item is a state and does not count), leaves, and lines of text. Seen from one side
   * (start: from above, end: from below), a line along the other side only is not an edge on
   * this side, so the element is looked into instead (tabs with a line along their bottom).
   */
  function inkCandidates(el, side) {
    const out = [];
    const walk = (n) => {
      if (!(n instanceof HTMLElement) || !visible(n)) return;
      const cs = getComputedStyle(n);
      const lineTop = Number.parseFloat(cs.borderTopWidth) > 0 && shownColor(cs.borderTopColor);
      const lineBottom =
        Number.parseFloat(cs.borderBottomWidth) > 0 && shownColor(cs.borderBottomColor);
      const surface = shownColor(cs.backgroundColor) || cs.backgroundImage !== 'none';
      const painted =
        surface ||
        (lineTop && lineBottom) ||
        (lineTop && side !== 'end') ||
        (lineBottom && side !== 'start');
      const stateSurface =
        n.matches('[data-role="list-item"], [data-role="menu-item"]') && !lineTop && !lineBottom;
      if (n.matches(LEAF) || (painted && !stateSurface)) {
        out.push({ el: n, box: true });
        return;
      }
      const kids = [...n.children].filter((k) => k instanceof HTMLElement && visible(k));
      const ownText = [...n.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim());
      if (ownText || !kids.length) {
        if (n.textContent.trim()) out.push({ el: n, box: false });
        return;
      }
      for (const k of kids) walk(k);
    };
    walk(el);
    return out;
  }
  /** The top of the first visible thing: an outline's edge, or the ink of text */
  function inkTop(el) {
    let best = null;
    for (const t of inkCandidates(el, 'start')) {
      const r = t.el.getBoundingClientRect();
      const v = t.box ? r.top : r.top + capPad(t.el, 'start');
      if (best === null || v < best) best = v;
    }
    return best;
  }
  function inkBottom(el) {
    let best = null;
    for (const t of inkCandidates(el, 'end')) {
      const r = t.el.getBoundingClientRect();
      const v = t.box ? r.bottom : r.bottom - capPad(t.el, 'end');
      if (best === null || v > best) best = v;
    }
    return best;
  }
  const skipped = (el) => !!el.closest('[data-kata-skip]');
  const sibling = (el, dir) => {
    let n = dir === 'prev' ? el.previousElementSibling : el.nextElementSibling;
    while (n && !visible(n)) n = dir === 'prev' ? n.previousElementSibling : n.nextElementSibling;
    return n;
  };
  const inFlow = (k) => {
    const pos = getComputedStyle(k).position;
    return (pos === 'static' || pos === 'relative') && k.tagName !== 'DIALOG';
  };

  // ---- The element rules ----------------------------------------------------------------------

  function elements(root, bad) {
    const root16 = rootPx();
    const TOL = 0.06 * (root16 / 16);
    const near = (v, set) => set.some((k) => Math.abs(v - k) <= TOL);
    const FS = [...new Set(ROLES.map((r) => pxOf(`var(--kata-text-size-${r})`)))];
    const REM = STEPS.map((k) => root16 * k);
    const H = Object.fromEntries(HEIGHTS.map((n) => [n, pxOf(`var(--kata-height-${n})`)]));
    const OFF = OFFSETS.map((r) => pxOf(`var(--kata-text-offset-${r})`));
    const bodyPx = pxOf('var(--kata-text-size-body)');
    const ROW_MD =
      '[data-role="mark"][data-h]:not([data-h="icon"]), [data-role="mark"][data-kata-tall], [data-role="box"][data-h]:not(.ghost), input, select, textarea';

    for (const el of [root, ...root.querySelectorAll('*')]) {
      if (!visible(el) || skipped(el)) continue;
      if (el.tagName === 'svg' || el.closest('svg')) continue;
      if (el instanceof HTMLDialogElement && !el.open) continue;
      const cs = getComputedStyle(el);
      const fs = Number.parseFloat(cs.fontSize);
      const EM = STEPS.map((k) => fs * k);
      // Untrimmable content inside a control (an input) is centred: (control − lines − leading) / 2
      const box = el.closest('[data-role="box"]');
      const lhPx = Number.parseFloat(cs.lineHeight);
      const inBox =
        box?.parentElement && !Number.isNaN(lhPx)
          ? [(pxOf('var(--kata-box, var(--kata-height-button))', box.parentElement) - 2 - lhPx) / 2]
          : [];
      // Indentation by depth × md (a tree); the name of a pair is centred on its control
      const INDENT = [2, 3, 4, 5, 6].map((k) => fs * k);
      const pair = el.closest('[data-role="pair"]');
      const inPair = pair?.parentElement
        ? [
            (pxOf('var(--kata-box, var(--kata-height-button))', pair.parentElement) - fs * INK) /
              2 +
              fs * INK_OVER,
          ]
        : [];
      // A trimmed line adds back the ink outside the cap height as padding
      const tb = cs.getPropertyValue('text-box-trim');
      const edgeTop = tb && /both|start/.test(tb) ? [fs * INK_OVER] : [];
      const edgeBottom = tb && /both|end/.test(tb) ? [fs * INK_UNDER] : [];
      const SPACE = [0, ...REM, ...EM, ...inBox, ...INDENT, ...inPair];

      for (const p of [
        'paddingTop',
        'paddingRight',
        'paddingBottom',
        'paddingLeft',
        'rowGap',
        'columnGap',
      ]) {
        const raw = cs[p];
        if (raw === 'normal') continue;
        const v = Number.parseFloat(raw) || 0;
        const ok = SPACE.concat(
          p === 'paddingTop' ? edgeTop : p === 'paddingBottom' ? edgeBottom : [],
        );
        if (!near(v, ok)) bad.push({ kind: 'space', el: label(el), prop: p, v: +v.toFixed(2) });
      }

      // Margins: inside Prose or a Block only, never negative. A dialog centred with auto margins,
      // and the md above and below a visible thing inside a list item, do not count.
      const autoMargin = el.tagName === 'DIALOG' && cs.marginLeft === cs.marginRight;
      const rowMd =
        el.matches(ROW_MD) &&
        !!el.closest('[data-role="list-item"]') &&
        near(Number.parseFloat(cs.marginTop) || 0, [bodyPx]);
      for (const p of ['marginTop', 'marginBottom']) {
        const v = Number.parseFloat(cs[p]) || 0;
        if (v === 0 || autoMargin || rowMd) continue;
        if (
          v < 0 ||
          !el.closest('[data-role="prose"], [data-role="block"]') ||
          !near(v, [...SPACE, ...OFF])
        )
          bad.push({ kind: 'margin', el: label(el), prop: p, v: +v.toFixed(2) });
      }

      // Type, on elements that hold text themselves. Code is one quarter step smaller.
      const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (hasText) {
        if (
          !near(fs, FS) &&
          !near(
            fs,
            FS.map((f) => f / 1.128),
          )
        )
          bad.push({ kind: 'type', el: label(el), prop: 'font-size', v: +fs.toFixed(2) });
        const lh = Number.parseFloat(cs.lineHeight);
        if (!Number.isNaN(lh) && !near(lh, [fs * 1.272, fs * 1.618, fs]))
          bad.push({ kind: 'type', el: label(el), prop: 'line-height', v: +lh.toFixed(2) });
      }

      for (const s of ['Top', 'Right', 'Bottom', 'Left']) {
        const w = Number.parseFloat(cs[`border${s}Width`]) || 0;
        const st = cs[`border${s}Style`];
        if (w > 0 && st !== 'solid') bad.push({ kind: 'border', el: label(el), v: `${w} ${st}` });
        if (![0, 1, 2].some((k) => Math.abs(w - k) <= 0.01))
          bad.push({ kind: 'border', el: label(el), v: `${w}px` });
      }

      const declared = el.getAttribute('data-h');
      if (declared) {
        // A button takes the height its container declares (--kata-box)
        const want =
          declared === 'button' && el.parentElement
            ? pxOf('var(--kata-box, var(--kata-height-button))', el.parentElement)
            : H[declared];
        const r = el.getBoundingClientRect();
        // The height of a row and of a footer is a minimum: it grows with its content
        const grows =
          /^(list-item|list-item-two|list-item-mark|list-item-lg|thumbnail-row|footer)$/.test(
            declared,
          );
        if (want === undefined)
          bad.push({ kind: 'height', el: label(el), v: `unknown ${declared}` });
        else if (grows ? r.height < want - TOL : Math.abs(r.height - want) > TOL)
          bad.push({
            kind: 'height',
            el: label(el),
            want: +want.toFixed(2),
            v: +r.height.toFixed(2),
          });
      }

      const trim = cs.getPropertyValue('text-box-trim');
      if (
        trim &&
        trim !== 'none' &&
        !el.closest(
          '[data-h], [data-role="mark"], [data-role="switch"], [data-role="pair"], [data-role="section-head"], td, th, dt, dd',
        ) &&
        !el.parentElement?.closest('[data-inset], [data-role="section"], [data-page]') &&
        !nearRule(el)
      )
        bad.push({
          kind: 'trim',
          el: label(el),
          v: `${trim} outside a control, a container's edge or a line`,
        });
      // Trimmed text reaches outside its box with the descenders and the top of CJK ink, so its
      // vertical overflow is visible, or clipped with a margin of at least 0.3em.
      if (
        trim &&
        trim !== 'none' &&
        cs.overflowY !== 'visible' &&
        !(cs.overflowY === 'clip' && Number.parseFloat(cs.overflowClipMargin) >= fs * 0.3)
      )
        bad.push({
          kind: 'trim-clip',
          el: label(el),
          v: cs.overflowY === 'clip' ? `clip-margin ${cs.overflowClipMargin}` : cs.overflowY,
        });

      if (
        el.matches(PRESSABLE) &&
        !el.matches('[disabled], [aria-disabled="true"], .busy') &&
        !el.closest('[disabled], [aria-disabled="true"], .busy') &&
        !/^(pointer|grab|grabbing|progress)$/.test(cs.cursor)
      )
        bad.push({ kind: 'cursor', el: label(el), cursor: cs.cursor });
    }
  }

  // ---- Colour and focus -------------------------------------------------------------------------

  function parseColor(v) {
    if (!v || v === 'transparent') return null;
    const srgb = /^color\(\s*srgb\b/.test(v);
    const n = (srgb ? v.replace(/^color\(\s*srgb/, '') : v).match(/[-\d.]+/g);
    if (!n || n.length < 3) return null;
    const k = srgb ? 255 : 1;
    const a = n.length > 3 ? Number.parseFloat(n[3]) : 1;
    return [
      Number.parseFloat(n[0]) * k,
      Number.parseFloat(n[1]) * k,
      Number.parseFloat(n[2]) * k,
      a,
    ];
  }
  const mix = (fg, alpha, bg) => [0, 1, 2].map((i) => fg[i] * alpha + bg[i] * (1 - alpha));
  function luminance(c) {
    const f = (x) => {
      const s = x / 255;
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  }
  function ratioOf(a, b) {
    const l1 = luminance(a);
    const l2 = luminance(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }
  function opacityProduct(el) {
    let p = 1;
    for (let a = el; a && a.nodeType === 1; a = a.parentElement) {
      const o = Number.parseFloat(getComputedStyle(a).opacity);
      if (!Number.isNaN(o)) p *= o;
    }
    return p;
  }
  function tokenColor(name) {
    const probe = document.createElement('div');
    probe.style.cssText = `position:absolute;visibility:hidden;color:var(${name})`;
    document.body.appendChild(probe);
    const c = parseColor(getComputedStyle(probe).color) ?? [0, 0, 0, 1];
    probe.remove();
    return c;
  }
  function contrast(root, bad) {
    const GROUND = tokenColor('--kata-color-ground');
    const ON_FILL = ['--kata-color-on-solid', '--kata-color-on-red', '--kata-color-on-yellow'].map(
      tokenColor,
    );
    // The surface behind an element: the opaque and translucent surfaces of its ancestors, composed
    const bgOf = (el) => {
      const layers = [];
      for (let a = el; a && a.nodeType === 1; a = a.parentElement) {
        const c = parseColor(getComputedStyle(a).backgroundColor);
        if (!c || c[3] <= 0) continue;
        const alpha = c[3] * opacityProduct(a);
        layers.push({ c, alpha });
        if (alpha >= 0.999) break;
      }
      let out = [GROUND[0], GROUND[1], GROUND[2]];
      for (let i = layers.length - 1; i >= 0; i--) out = mix(layers[i].c, layers[i].alpha, out);
      return out;
    };
    for (const el of [root, ...root.querySelectorAll('*')]) {
      if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'OPTION') continue;
      if (el.tagName === 'svg' || el.closest('svg')) continue;
      if (el.closest('[data-kata-skip], [data-kata-placeholder], [data-kata-datacolor]')) continue;
      const text = [...el.childNodes]
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent)
        .join('');
      if (!text.trim() || !/[\p{L}\p{N}]/u.test(text)) continue;
      if (!visible(el) || opacityProduct(el) === 0) continue;
      const off =
        el.closest('[disabled], [aria-disabled="true"], .busy, .disabled, [data-dim]') ||
        el.matches(':disabled');
      const col = parseColor(getComputedStyle(el).color);
      if (!col) continue;
      const near3 = (c) =>
        Math.abs(c[0] - col[0]) + Math.abs(c[1] - col[1]) + Math.abs(c[2] - col[2]) < 3;
      // A disabled filled button is exempt (WCAG: inactive components)
      if (off && ON_FILL.some(near3)) continue;
      const bg = bgOf(el);
      const fg = mix(col, col[3] * opacityProduct(el), bg);
      const ratio = ratioOf(fg, bg);
      const need = off ? 4.5 : 7;
      if (ratio < need - 0.05)
        bad.push({ kind: 'contrast', el: label(el), ratio: +ratio.toFixed(2), need });
    }
  }
  function focusHalo(root, bad) {
    const prev = document.activeElement;
    const sel = 'input:not([type=checkbox]):not([type=radio]):not([type=range]), textarea, select';
    for (const el of root.querySelectorAll(sel)) {
      if (el.disabled || el.readOnly || !visible(el)) continue;
      const before = getComputedStyle(el).backgroundColor;
      el.focus({ preventScroll: true });
      const cs = getComputedStyle(el);
      const w = cs.outlineStyle === 'none' ? 0 : Number.parseFloat(cs.outlineWidth) || 0;
      if (Math.abs(w) > 0.1 && Math.abs(w - 2) > 0.1)
        bad.push({ kind: 'focus-halo', el: label(el), outline: cs.outlineWidth });
      if (cs.backgroundColor !== before)
        bad.push({ kind: 'focus-halo', el: label(el), bg: `${before} → ${cs.backgroundColor}` });
      el.blur();
    }
    if (prev && prev !== document.body && typeof prev.focus === 'function')
      prev.focus({ preventScroll: true });
  }

  // ---- Lines ------------------------------------------------------------------------------------

  /** The horizontal lines: Dividers, and borders on the top or bottom only (not an outline) */
  function ruleLines(root) {
    const lines = [];
    const edge = (cs, side) =>
      Number.parseFloat(cs[`border${side}Width`]) > 0 &&
      cs[`border${side}Style`] !== 'none' &&
      cs[`border${side}Color`] !== 'rgba(0, 0, 0, 0)';
    for (const el of [root, ...root.querySelectorAll('*')]) {
      if (el.tagName === 'svg' || el.closest('svg') || skipped(el) || !visible(el)) continue;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const at = (y) => lines.push({ el, y, left: r.left, right: r.right });
      if (el.getAttribute('data-role') === 'rule' || el.tagName === 'HR') {
        at(r.top + (Number.parseFloat(cs.paddingTop) || 0));
        continue;
      }
      const boxed =
        edge(cs, 'Left') ||
        edge(cs, 'Right') ||
        el.matches(
          'button, a, input, select, textarea, summary, [role="tab"], [role="button"], [role="option"], [role="menuitem"]',
        );
      const thin = r.height <= 1.5;
      if (!boxed) {
        if (edge(cs, 'Top')) at(r.top);
        if (!thin && edge(cs, 'Bottom')) at(r.bottom);
      }
    }
    return lines;
  }
  function doubleRule(root, bad) {
    const lines = ruleLines(root);
    // Two lines exactly on top of each other read as one
    const TOL = 0.6;
    lines.sort((a, b) => a.y - b.y);
    for (let i = 1; i < lines.length; i++) {
      for (let j = i - 1; j >= 0 && lines[i].y - lines[j].y <= 1.5; j--) {
        const a = lines[j];
        const b = lines[i];
        if (a.el === b.el || b.y - a.y <= TOL) continue;
        const left = Math.max(a.left, b.left);
        const right = Math.min(a.right, b.right);
        if (right - left <= 2) continue;
        bad.push({ kind: 'double-rule', el: label(a.el), next: label(b.el), y: +b.y.toFixed(1) });
      }
    }
  }
  function ruleGap(root, bad) {
    const T = 5 * (rootPx() / 16);
    // A container with a surface meets the line with its edge; a section that only draws a line
    // along its top is measured by its content below; anything else by its visible content
    const edgeOf = (el, side) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      if (el.matches('[data-inset]') && surfaceOf(el)) return side === 'end' ? r.bottom : r.top;
      const onlyTopRule =
        Number.parseFloat(cs.borderTopWidth) > 0 &&
        !(Number.parseFloat(cs.borderBottomWidth) > 0) &&
        cs.backgroundColor === 'rgba(0, 0, 0, 0)';
      if (onlyTopRule) {
        let best = null;
        for (const kid of el.children) {
          if (!visible(kid)) continue;
          const v = side === 'end' ? inkBottom(kid) : inkTop(kid);
          if (v === null) continue;
          if (best === null || (side === 'end' ? v > best : v < best)) best = v;
        }
        if (best !== null) return best;
      }
      return side === 'end' ? inkBottom(el) : inkTop(el);
    };
    const check = (el, above, below) => {
      if (above === null || below === null) return;
      if (Math.abs(above - below) > T)
        bad.push({
          kind: 'rule-gap',
          el: label(el),
          above: +above.toFixed(1),
          below: +below.toFixed(1),
        });
    };
    // The line a section draws along its top
    for (const el of root.querySelectorAll('[data-role="section"], [data-role="section-header"]')) {
      if (!visible(el) || skipped(el)) continue;
      const bw = Number.parseFloat(getComputedStyle(el).borderTopWidth);
      if (!(bw > 0)) continue;
      const prev = sibling(el, 'prev');
      const r = el.getBoundingClientRect();
      let before = null;
      if (prev)
        for (let i = prev.children.length - 1; i >= 0; i--) {
          const kid = prev.children[i];
          if (!visible(kid)) continue;
          before = inkBottom(kid);
          break;
        }
      let inner = null;
      for (const kid of el.children) {
        if (!visible(kid)) continue;
        inner = inkTop(kid);
        break;
      }
      check(
        el,
        before === null ? null : r.top - before,
        inner === null ? null : inner - (r.top + bw),
      );
    }
    // A line placed in a layout
    for (const el of root.querySelectorAll('[data-role="rule"]')) {
      if (!visible(el) || skipped(el)) continue;
      const prev = sibling(el, 'prev');
      const next = sibling(el, 'next');
      if (!prev || !next) continue;
      const r = el.getBoundingClientRect();
      const a = edgeOf(prev, 'end');
      const b = edgeOf(next, 'start');
      check(el, a === null ? null : r.top - a, b === null ? null : b - r.bottom);
    }
  }

  // ---- Containers -------------------------------------------------------------------------------

  function doubleInset(root, bad) {
    for (const el of root.querySelectorAll('[data-inset]')) {
      if (!visible(el) || skipped(el) || surfaceOf(el)) continue;
      let wall = false;
      for (let up = el.parentElement; up && up !== root.parentElement; up = up.parentElement) {
        if (surfaceOf(up)) wall = true;
        if (isContainer(up)) {
          if (!wall) bad.push({ kind: 'double-inset', el: label(el), outer: label(up) });
          break;
        }
      }
    }
  }
  // What brings its own padding inside a container without padding: a container, a control, a
  // list item, a head and the rows of a table
  const INSET_OWNERS =
    '[data-inset], [data-h], [data-role="list-item"], [data-role="toolbar"], [data-role="section-head"], [data-role="tabs"], [data-role="comment"], [data-role="thread"], [data-role="footer"], [data-role="field"], td, th';
  // A container without padding declares a non-zero inset for the items that reach its edges
  // (the bundle mixin); a container with padding declares 0. The nearest element that declares an
  // inset (its value differs from its parent's) is the container the text belongs to.
  const insetOf = (el) => getComputedStyle(el).getPropertyValue('--kata-inset').trim();
  function bundleOf(el) {
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      const v = insetOf(n);
      if (n.parentElement && v === insetOf(n.parentElement)) continue;
      if (!v || Number.parseFloat(v) === 0) return null;
      return Number.parseFloat(getComputedStyle(n).paddingLeft) === 0 ? n : null;
    }
    return null;
  }
  // A surface (data-role="surface") without padding is a container without padding too, for the
  // text that no container inside it (one that declares an inset of its own) holds
  function surfaceBundleOf(el) {
    const surface = el.closest('[data-role="surface"]');
    if (!surface || Number.parseFloat(getComputedStyle(surface).paddingLeft) !== 0) return null;
    for (let n = el; n && n !== surface; n = n.parentElement)
      if (n.parentElement && insetOf(n) !== insetOf(n.parentElement)) return null;
    return surface;
  }
  function bundleEdge(root, bad) {
    for (const el of root.querySelectorAll('*')) {
      if (!visible(el) || skipped(el) || el.closest('svg')) continue;
      if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
      const bundle = bundleOf(el) ?? surfaceBundleOf(el);
      if (!bundle) continue;
      const owner = el.closest(INSET_OWNERS);
      if (owner && bundle.contains(owner)) continue;
      const md = Number.parseFloat(getComputedStyle(bundle).fontSize);
      const d = el.getBoundingClientRect().left - bundle.getBoundingClientRect().left;
      if (d < md - 1) bad.push({ kind: 'bundle-edge', el: label(el), v: +d.toFixed(1) });
    }
  }
  function innerGap(root, bad) {
    const root16 = rootPx();
    const body = pxOf('var(--kata-text-size-body)');
    const leading = Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--kata-lh-body'),
    );
    const tol = 0.2 * root16 + body * (leading - CAP);
    for (const el of root.querySelectorAll('*')) {
      if (!visible(el) || skipped(el)) continue;
      const cs = getComputedStyle(el);
      const gap = Number.parseFloat(cs.rowGap);
      if (!gap) continue;
      const kids = [...el.children].filter((k) => k instanceof HTMLElement && visible(k));
      if (kids.length < 2) continue;
      // The nearest container with padding, unless a surface or a dialog comes first
      let owner = null;
      for (let up = el.parentElement; up && up !== root; up = up.parentElement) {
        if (isContainer(up)) {
          owner = up;
          break;
        }
        if (up.tagName === 'DIALOG' || surfaceOf(up)) break;
      }
      if (!owner || !(Number.parseFloat(getComputedStyle(owner).paddingTop) > 0)) continue;
      if (
        kids.some(
          (k) =>
            isContainer(k) ||
            k.matches('[data-role="section"], [data-role="panel"], [data-role="card"], dialog'),
        )
      )
        continue;
      const top = inkTop(kids[0]);
      if (top === null) continue;
      const ob = owner.getBoundingClientRect();
      const edge =
        top - (ob.top + (Number.parseFloat(getComputedStyle(owner).borderTopWidth) || 0));
      let worst = 0;
      let at = '';
      const isField = (k) => k.matches('[data-role="field"]');
      for (let i = 0; i + 1 < kids.length; i++) {
        if (isField(kids[i]) && isField(kids[i + 1])) continue;
        const b = inkBottom(kids[i]);
        const t = inkTop(kids[i + 1]);
        if (b === null || t === null) continue;
        if (t - b > worst) {
          worst = t - b;
          at = label(kids[i + 1]);
        }
      }
      if (worst > edge + tol)
        bad.push({
          kind: 'inner-gap',
          el: label(el),
          between: +worst.toFixed(1),
          edge: +edge.toFixed(1),
          next: at,
        });
    }
  }
  const CONTROL = '[data-h="button"], [data-h="button-sm"], [data-h="icon-button"]';
  function boxTouch(root, bad) {
    const HOLDER = '[data-inset], [data-role="panel"] > .scroll, aside.drawer';
    const scrolls = (e) => {
      const c = getComputedStyle(e);
      return /^(auto|scroll)$/.test(c.overflowY) || /^(auto|scroll)$/.test(c.overflowX);
    };
    for (const el of root.querySelectorAll(`input, textarea, select, ${CONTROL}`)) {
      if (!visible(el) || skipped(el) || !surfaceOf(el)) continue;
      const holder = el.parentElement?.closest(HOLDER);
      if (!holder || scrolls(holder)) continue;
      let inner = false;
      for (let up = el.parentElement; up && up !== holder; up = up.parentElement) {
        if (surfaceOf(up) || scrolls(up)) inner = true;
      }
      if (inner) continue;
      const r = el.getBoundingClientRect();
      const s = holder.getBoundingClientRect();
      const cs = getComputedStyle(holder);
      const bw = (side) => Number.parseFloat(cs[`border${side}Width`]) || 0;
      const pad = (side) => Number.parseFloat(cs[`padding${side}`]) || 0;
      const hit = [];
      if (pad('Left') > 0 && r.left - (s.left + bw('Left')) < 0.5) hit.push('left');
      if (pad('Right') > 0 && s.right - bw('Right') - r.right < 0.5) hit.push('right');
      if (pad('Top') > 0 && r.top - (s.top + bw('Top')) < 0.5) hit.push('top');
      if (pad('Bottom') > 0 && s.bottom - bw('Bottom') - r.bottom < 0.5) hit.push('bottom');
      if (hit.length)
        bad.push({ kind: 'box-touch', el: label(el), container: label(holder), side: hit.join() });
    }
  }
  function boxGap(root, bad) {
    const md = pxOf('var(--kata-size-md-rem)');
    const painted = (el) => {
      const cs = getComputedStyle(el);
      return (
        (Number.parseFloat(cs.borderTopWidth) > 0 && shownColor(cs.borderTopColor)) ||
        shownColor(cs.backgroundColor)
      );
    };
    for (const st of root.querySelectorAll('[data-role="stack"]')) {
      if (getComputedStyle(st).flexDirection !== 'column') continue;
      const kids = [...st.children].filter((k) => visible(k) && inFlow(k) && !skipped(k));
      for (let i = 1; i < kids.length; i++) {
        const boxOf = (el) => (el.matches(CONTROL) && painted(el) ? el : null);
        const a = boxOf(kids[i - 1]);
        const b = boxOf(kids[i]);
        if (!a && !b) continue;
        const top = a ? a.getBoundingClientRect().bottom : inkBottom(kids[i - 1]);
        const bottom = b ? b.getBoundingClientRect().top : inkTop(kids[i]);
        if (top === null || bottom === null) continue;
        const d = bottom - top;
        const want = Math.min(md, Number.parseFloat(getComputedStyle(b ?? kids[i]).fontSize) || md);
        if (d < want - 1.5)
          bad.push({ kind: 'box-gap', el: label(b ?? kids[i]), v: +d.toFixed(1), want });
      }
    }
  }

  // ---- Heads ------------------------------------------------------------------------------------

  // How far the action of a flush group's head hangs below the head (0 for any other group)
  function actionOverhang(group, head) {
    if (!group.matches('.flush.acted')) return 0;
    const action = head.children[1];
    if (!action) return 0;
    const bottom = head.getBoundingClientRect().bottom;
    return Math.max(
      0,
      ...[...action.children].map((c) => c.getBoundingClientRect().bottom - bottom),
    );
  }
  function headGap(root, bad) {
    const tol = 6 * (rootPx() / 16);
    for (const group of root.querySelectorAll('[data-role="section-header"]')) {
      if (!visible(group) || skipped(group)) continue;
      const head = group.querySelector(':scope > [data-role="section-head"]');
      const body = group.children[1];
      if (!head || !body || !visible(body)) continue;
      const top = inkTop(body);
      if (top === null) continue;
      const md = Number.parseFloat(getComputedStyle(body).fontSize);
      const headBox = head.getBoundingClientRect();
      const d = top - headBox.bottom;
      // Flush content under a head with an action keeps pad-md above it, so that the action that
      // hangs below the head does not reach the first row: the distance may grow by that padding
      // and the action's overhang
      let extra = 0;
      if (group.matches('.flush.acted'))
        extra = Number.parseFloat(getComputedStyle(body).paddingTop) + actionOverhang(group, head);
      if (d < md - tol || d > md + extra + tol)
        bad.push({ kind: 'head-gap', el: label(head), v: +d.toFixed(1), want: +md.toFixed(1) });
    }
  }
  function headNear(root, bad) {
    const tol = 0.1 * rootPx();
    for (const group of root.querySelectorAll('[data-role="section-header"]')) {
      if (!visible(group)) continue;
      const head = group.querySelector(':scope > [data-role="section-head"]');
      const name = head?.querySelector(':scope > span');
      const body = group.children[1];
      const prev = group.previousElementSibling;
      if (!name || !body || !visible(body) || !prev || !visible(prev)) continue;
      const nameBottom = inkBottom(name);
      const nameTop = inkTop(name);
      const bodyTop = inkTop(body);
      const prevBottom = inkBottom(prev);
      if (nameBottom === null || nameTop === null || bodyTop === null || prevBottom === null)
        continue;
      const above = nameTop - prevBottom;
      const below = bodyTop - nameBottom;
      // Flush content under a head with an action may lie further by the action's overhang
      const extra = head ? actionOverhang(group, head) : 0;
      if (below > above - tol + extra)
        bad.push({
          kind: 'head-near',
          el: label(name),
          above: +above.toFixed(1),
          below: +below.toFixed(1),
        });
    }
  }
  function pageHeadGap(root, bad) {
    const tol = 2.5 * (rootPx() / 16);
    for (const page of root.querySelectorAll('[data-page]')) {
      if (!visible(page) || skipped(page)) continue;
      const head = page.querySelector('[data-role="h1"]');
      const body = page.querySelector(':scope > [data-role="stack"] > .body');
      if (!head || !body || !visible(head) || !visible(body)) continue;
      const top = inkTop(body);
      if (top === null) continue;
      const want = (Number.parseFloat(getComputedStyle(body).fontSize) || 16) * PHI;
      const d = top - head.getBoundingClientRect().bottom;
      if (Math.abs(d - want) > tol)
        bad.push({
          kind: 'page-head-gap',
          el: label(head),
          v: +d.toFixed(1),
          want: +want.toFixed(1),
        });
    }
  }
  function sectionHeadGap(root, bad) {
    const tol = 2.5 * (rootPx() / 16);
    const want = pxOf('var(--kata-gap-lg)');
    for (const section of root.querySelectorAll('[data-role="section"]')) {
      if (!visible(section) || skipped(section)) continue;
      const outer = section.querySelector(':scope > [data-role="stack"]');
      const head = outer?.children[0];
      const body = section.querySelector(':scope > [data-role="stack"] > .body');
      if (!head || !body || !visible(head) || !visible(body)) continue;
      const first = [...(body.querySelector(':scope > [data-role="stack"]')?.children ?? [])].find(
        (k) => visible(k),
      );
      if (!first) continue;
      const d = first.getBoundingClientRect().top - head.getBoundingClientRect().bottom;
      if (Math.abs(d - want) > tol)
        bad.push({
          kind: 'section-head-gap',
          el: label(head),
          v: +d.toFixed(1),
          want: +want.toFixed(1),
        });
    }
  }
  function tabsGap(root, bad) {
    const tol = 6 * (rootPx() / 16);
    const want = pxOf('var(--kata-gap-lg)');
    for (const tabs of root.querySelectorAll('[data-role="tabs"][data-rule]')) {
      if (!visible(tabs) || skipped(tabs)) continue;
      // In a container without padding the next item's own padding is the distance
      const up = tabs.parentElement;
      if (tabs.closest('[data-role="panel"]') || (up && (bundleOf(up) || surfaceBundleOf(up))))
        continue;
      const next = sibling(tabs, 'next');
      if (!next || skipped(next)) continue;
      const top = inkTop(next);
      if (top === null) continue;
      const d = top - tabs.getBoundingClientRect().bottom;
      if (Math.abs(d - want) > tol)
        bad.push({ kind: 'tabs-gap', el: label(tabs), v: +d.toFixed(1), want: +want.toFixed(1) });
    }
  }

  // ---- Lists ------------------------------------------------------------------------------------

  // A list item may be an outline only when it is pressed, or parted from its neighbours by a line
  // or a surface. A row that is only read has no visible edge, so an outline would set its
  // distances by something that cannot be seen. The line is read from the item's declaration
  // (data-rule), since the last item of a list drops its line.
  function readRow(root, bad) {
    const PRESS = 'a[href], button, input, label, select, textarea, summary';
    const press = (k) =>
      k.matches(PRESS) ||
      k.hasAttribute('role') ||
      k.hasAttribute('tabindex') ||
      !!k.querySelector(PRESS);
    const ruled = (k) => k.hasAttribute('data-rule');
    const surfaced = (k) => shownColor(getComputedStyle(k).backgroundColor);
    const ITEM = '[data-h="list-item"], [data-h="list-item-two"], [data-h="thumbnail-row"]';
    for (const el of root.querySelectorAll(ITEM)) {
      if (!visible(el) || skipped(el)) continue;
      if (press(el) || el.parentElement?.closest(PRESS)) continue;
      if (ruled(el) || surfaced(el)) continue;
      // The head of a comment has the metrics of a list item but is not an item of a list
      if (el.parentElement?.matches('[data-role="comment"]')) continue;
      // Another item of the same list that is pressed, ruled or surfaced makes it an item of
      // that list
      const holder = el.closest('[data-role="list"], [data-role="tree"], [data-role="table"]');
      const items = [...((holder ?? el.parentElement)?.querySelectorAll(ITEM) ?? [])];
      if (items.some((k) => k !== el && (ruled(k) || surfaced(k) || press(k)))) continue;
      bad.push({
        kind: 'read-row',
        el: label(el),
        v: 'a list item that is neither pressed nor ruled nor surfaced',
      });
    }
  }

  // ---- Layout -----------------------------------------------------------------------------------

  function overlap(root, bad) {
    for (const layout of root.querySelectorAll(
      '[data-role="stack"], [data-role="block"], [data-role="prose"], [data-role="card"], [data-role="table"], [data-role="grid"], [data-role="list"], [data-role="section"]',
    )) {
      const kids = [...layout.children].filter((k) => visible(k) && inFlow(k));
      for (let i = 1; i < kids.length; i++) {
        for (let j = 0; j < i; j++) {
          const a = kids[j].getBoundingClientRect();
          const c = kids[i].getBoundingClientRect();
          const dy = Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top);
          const dx = Math.min(a.right, c.right) - Math.max(a.left, c.left);
          if (dy > 0.6 && dx > 0.6)
            bad.push({ kind: 'overlap', el: label(kids[i]), v: +dy.toFixed(1) });
        }
      }
    }
  }
  function crush(root, bad) {
    for (const el of root.querySelectorAll('*')) {
      if (!visible(el) || skipped(el) || el.closest('svg')) continue;
      if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 3))
        continue;
      const cs = getComputedStyle(el);
      const fs = Number.parseFloat(cs.fontSize);
      const lh = Number.parseFloat(cs.lineHeight) || fs * 1.5;
      const r = el.getBoundingClientRect();
      if (r.width < fs * 2 && r.height > lh * 2.5)
        bad.push({
          kind: 'crush',
          el: label(el),
          width: +r.width.toFixed(1),
          height: +r.height.toFixed(1),
        });
    }
  }

  function fixedFrame(root, bad) {
    const frames = [
      ...(root.matches('[data-kata-root]') ? [root] : []),
      ...root.querySelectorAll('[data-role="shell"], [data-kata-root]'),
    ];
    for (const frame of frames) {
      if (!visible(frame)) continue;
      const probe = document.createElement('div');
      probe.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;visibility:hidden';
      frame.appendChild(probe);
      const r = probe.getBoundingClientRect();
      probe.remove();
      if (Math.abs(r.left) > 0.06 || Math.abs(r.top) > 0.06)
        bad.push({
          kind: 'fixed-frame',
          el: label(frame),
          v: `${r.left.toFixed(1)},${r.top.toFixed(1)}`,
        });
    }
  }

  window.kataAudit = (rootSelector = '[data-audit]') => {
    readInk();
    const bad = [];
    const roots = [...document.querySelectorAll(rootSelector)];
    for (const root of roots) {
      elements(root, bad);
      contrast(root, bad);
      focusHalo(root, bad);
      doubleRule(root, bad);
      ruleGap(root, bad);
      doubleInset(root, bad);
      bundleEdge(root, bad);
      innerGap(root, bad);
      boxTouch(root, bad);
      boxGap(root, bad);
      headGap(root, bad);
      headNear(root, bad);
      pageHeadGap(root, bad);
      sectionHeadGap(root, bad);
      tabsGap(root, bad);
      readRow(root, bad);
      overlap(root, bad);
      crush(root, bad);
      fixedFrame(root, bad);
    }
    return { roots: roots.length, findings: bad };
  };
})();
