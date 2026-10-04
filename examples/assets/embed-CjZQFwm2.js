import"./modulepreload-polyfill-P2Xu9kJm.js";import{$ as e,A as t,E as n,K as r,L as i,M as a,N as o,P as s,Q as c,X as l,Z as u,k as d,mt as f,pt as p}from"./Stack-DpGirixp.js";import{t as m}from"./Toolbar-D8ENeiFc.js";import{t as h}from"./Panel-BvlgBosB.js";import{n as g,t as _}from"./TreeRow-CK11Dij-.js";import{t as v}from"./Table-D4XLOrdk.js";import{t as y}from"./Case-D1evtL5C.js";import{t as b}from"./Example-CGZIT6h2.js";import{t as x}from"./Surface-Ccu3kjoB.js";var S=`/*
 * The numeric scale of kata, generated from φ = 1.618 by \`npm run scale\`. Do not edit.
 * The formulas are in src/scale/scale.mjs and docs/scale.md.
 */
:root {
  --kata-step-whole: 1.618;
  --kata-step-half: 1.272;
  --kata-step-quarter: 1.128;
  --kata-size-2xs: 0.2360828548em;
  --kata-size-xs: 0.3819820591em;
  --kata-size-sm: 0.6180469716em;
  --kata-size-md: 1em;
  --kata-size-lg: 1.618em;
  --kata-size-xl: 2.617924em;
  --kata-size-2xl: 4.235801032em;
  --kata-size-2xs-rem: 0.2360828548rem;
  --kata-size-xs-rem: 0.3819820591rem;
  --kata-size-sm-rem: 0.6180469716rem;
  --kata-size-md-rem: 1rem;
  --kata-size-lg-rem: 1.618rem;
  --kata-size-xl-rem: 2.617924rem;
  --kata-size-2xl-rem: 4.235801032rem;
  --kata-fs-display2: 2.617924rem;
  --kata-lh-display2: 1.272;
  --kata-ls-display2: -0.022em;
  --kata-offset-display2: 2.058096rem;
  --kata-fs-title1: 2.058096rem;
  --kata-lh-title1: 1.272;
  --kata-ls-title1: -0.022em;
  --kata-offset-title1: 1.617984rem;
  --kata-fs-title2: 1.618rem;
  --kata-lh-title2: 1.272;
  --kata-ls-title2: -0.02em;
  --kata-offset-title2: 1.272rem;
  --kata-fs-title3: 1.272rem;
  --kata-lh-title3: 1.272;
  --kata-ls-title3: -0.017em;
  --kata-offset-title3: 0.9999901112rem;
  --kata-fs-heading: 1.128rem;
  --kata-lh-heading: 1.272;
  --kata-ls-heading: -0.014em;
  --kata-offset-heading: 0.8867836836rem;
  --kata-fs-subheading: 0.8865248227rem;
  --kata-lh-subheading: 1.272;
  --kata-ls-subheading: -0.007em;
  --kata-offset-subheading: 0.696946585rem;
  --kata-fs-body: 1rem;
  --kata-lh-body: 1.618;
  --kata-ls-body: -0.011em;
  --kata-offset-body: 0.6180469716rem;
  --kata-fs-capline: 0.786163522rem;
  --kata-lh-capline: 1.272;
  --kata-ls-capline: 0.0618em;
  --kata-offset-capline: 0.6180469716rem;
}
`,C=`/*
 * The tokens of kata: the named values that components and pages use. docs/tokens.md lists them.
 *
 * Every length is written with the numeric scale (scale.css), except widths, the line width and
 * the pill radius. Only three kinds of value have names of their own (spacing, type and color);
 * the heights are named after the component they belong to, and the rest are plain properties
 * (line, width, opacity, layer, font).
 *
 * The selectors are :root, the light theme and the language switches; nothing else.
 */

:root {
  /* ---- Typeface metrics --------------------------------------------------------------------
   * The cap height of the sans typeface as a ratio of the em, and the ascent and descent of CJK
   * ink. A control trims its text to the cap height and the baseline; when the page's language
   * is Chinese, Japanese or Korean, the ink that reaches above the cap height and below the
   * baseline is added back as padding (see the language switch at the end).
   */
  --kata-cap: 0.698;
  --kata-cjk-ascent: 0.837;
  --kata-cjk-descent: 0.079;
  --kata-ink-over: 0;
  --kata-ink-under: 0;
  /* The height of the ink of one line of text in a control, as a ratio of its font size */
  --kata-ink: calc(var(--kata-cap) + var(--kata-ink-over) + var(--kata-ink-under));
  /* What a trimmed line at a visible edge adds back */
  --kata-edge-top: calc(var(--kata-ink-over) * 1em);
  --kata-edge-bottom: calc(var(--kata-ink-under) * 1em);

  /* ---- Type roles ---------------------------------------------------------------------------
   * Each role takes its size, line height and letter spacing from a step of the type scale.
   * The offset is the distance from a heading to the text it introduces.
   */
  --kata-text-size-num: var(--kata-fs-display2);
  --kata-text-leading-num: var(--kata-lh-display2);
  --kata-text-tracking-num: var(--kata-ls-display2);
  --kata-text-size-title: var(--kata-fs-title1);
  --kata-text-leading-title: var(--kata-lh-title1);
  --kata-text-tracking-title: var(--kata-ls-title1);
  --kata-text-size-h1: var(--kata-fs-title2);
  --kata-text-leading-h1: var(--kata-lh-title2);
  --kata-text-tracking-h1: var(--kata-ls-title2);
  --kata-text-size-h2: var(--kata-fs-title3);
  --kata-text-leading-h2: var(--kata-lh-title3);
  --kata-text-tracking-h2: var(--kata-ls-title3);
  /* Reading text (help, terms, long descriptions) is one quarter step larger than interface text */
  --kata-text-size-prose: var(--kata-fs-heading);
  --kata-text-leading-prose: var(--kata-lh-body);
  --kata-text-tracking-prose: var(--kata-ls-heading);
  /* Body and caption wrap as paragraphs outside controls, so they take the running line height */
  --kata-text-size-body: var(--kata-fs-body);
  --kata-text-leading-body: var(--kata-lh-body);
  --kata-text-tracking-body: var(--kata-ls-body);
  --kata-text-size-caption: var(--kata-fs-subheading);
  --kata-text-leading-caption: var(--kata-lh-body);
  --kata-text-tracking-caption: var(--kata-ls-subheading);
  /* A label is as large as the value it names; only its weight sets it apart */
  --kata-text-size-label: var(--kata-text-size-body);
  --kata-text-leading-label: var(--kata-step-half);
  --kata-text-tracking-label: var(--kata-text-tracking-body);
  /* The small characters inside a mark (initials, counts, step numbers); never a heading */
  --kata-text-size-glyph: var(--kata-fs-capline);
  --kata-text-leading-glyph: var(--kata-lh-capline);
  --kata-text-tracking-glyph: var(--kata-ls-capline);

  --kata-text-offset-num: var(--kata-offset-display2);
  --kata-text-offset-title: var(--kata-offset-title1);
  --kata-text-offset-h1: var(--kata-offset-title2);
  --kata-text-offset-h2: var(--kata-offset-title3);
  --kata-text-offset-prose: var(--kata-offset-heading);
  --kata-text-offset-caption: var(--kata-offset-subheading);
  --kata-text-offset-label: var(--kata-offset-body);

  /* ---- Spacing -----------------------------------------------------------------------------
   * Two scales that are never mixed.
   * pad-*  the padding inside a component or container, in em: it follows the component's text
   * gap-*  the distance between items of a layout and the margin of a page, in rem
   */
  --kata-pad-2xs: var(--kata-size-2xs);
  --kata-pad-xs: var(--kata-size-xs);
  --kata-pad-sm: var(--kata-size-sm);
  --kata-pad-md: var(--kata-size-md);
  --kata-pad-lg: var(--kata-size-lg);
  --kata-pad-xl: var(--kata-size-xl);
  --kata-pad-2xl: var(--kata-size-2xl);
  --kata-gap-2xs: var(--kata-size-2xs-rem);
  --kata-gap-xs: var(--kata-size-xs-rem);
  --kata-gap-sm: var(--kata-size-sm-rem);
  --kata-gap-md: var(--kata-size-md-rem);
  --kata-gap-lg: var(--kata-size-lg-rem);
  --kata-gap-xl: var(--kata-size-xl-rem);
  --kata-gap-2xl: var(--kata-size-2xl-rem);

  /* ---- Line and corner ---------------------------------------------------------------------
   * One line width. Corners are square; only marks shaped as a capsule use the pill radius.
   */
  --kata-border-width: 1px;
  --kata-radius-pill: 999px;

  /* ---- Heights -----------------------------------------------------------------------------
   * The height of a component comes from its content: the ink of its text, its padding and its
   * lines. Each is named after the component.
   */
  /* Text, padding of one font size above and below, and two lines */
  --kata-height-button: calc(
    var(--kata-text-size-body) * (var(--kata-ink) + 2) + var(--kata-border-width) * 2
  );
  /* The small button: padding of one size-sm above and below */
  --kata-height-button-sm: calc(
    var(--kata-text-size-body) * (var(--kata-ink) + 2 / var(--kata-step-whole)) +
      var(--kata-border-width) * 2
  );
  /* A square small button */
  --kata-height-icon-button: var(--kata-height-button-sm);
  /* A list item of text only, and a tab */
  --kata-height-list-item: calc(var(--kata-text-size-body) * (var(--kata-ink) + 2));
  /* A list item with a title and a caption */
  --kata-height-list-item-two: calc(
    var(--kata-height-list-item) + var(--kata-size-sm-rem) +
      var(--kata-text-size-caption) * var(--kata-ink)
  );
  /* A badge: caption text, padding of size-xs above and below, and two lines */
  --kata-height-badge: calc(
    var(--kata-text-size-caption) *
      (var(--kata-ink) + 2 / var(--kata-step-whole) / var(--kata-step-whole)) +
      var(--kata-border-width) * 2
  );
  /* A list item that holds a small button, a mark or a thumbnail: the item plus one font size
   * above and below */
  --kata-height-list-item-lg: calc(var(--kata-height-button-sm) + var(--kata-text-size-body) * 2);
  --kata-height-list-item-mark: calc(var(--kata-height-badge) + var(--kata-text-size-body) * 2);
  --kata-height-thumbnail-row: calc(var(--kata-height-thumbnail) + var(--kata-text-size-body) * 2);
  /* A toolbar always holds small buttons; a footer holds buttons */
  --kata-height-toolbar: var(--kata-height-list-item-lg);
  --kata-height-footer: calc(var(--kata-height-button) + var(--kata-text-size-body) * 2);
  /* An icon is a square of the root size; a thumbnail in a list item has a fixed height */
  --kata-height-icon: var(--kata-size-md-rem);
  --kata-height-thumbnail: 2rem;

  /* ---- Widths ------------------------------------------------------------------------------
   * Fixed widths of layout regions, in rem so that they grow with the root font size.
   */
  --kata-width-rail: 14.5rem;
  --kata-width-panel: 22.5rem;
  --kata-width-drawer: 17.5rem;
  --kata-width-modal-sm: 25rem;
  --kata-width-modal-md: 35rem;
  --kata-width-modal-lg: 45rem;
  --kata-width-modal-xl: 60rem;
  --kata-width-popover: 18rem;
  --kata-width-toast: 22rem;
  --kata-width-prose: 46rem;
  --kata-width-settings: 51.25rem;

  /* ---- Opacity and layers ------------------------------------------------------------------ */
  /* Disabled or busy content; disabled text still reaches a contrast of 4.5:1 */
  --kata-opacity-dim: 0.64;
  --kata-z-floating: 10;
  --kata-z-sheet: 20;
  --kata-z-menu: 30;
  --kata-z-modal: 40;
  --kata-z-toast: 50;

  /* ---- Fonts ------------------------------------------------------------------------------- */
  --kata-font-sans:
    "IBM Plex Sans", "IBM Plex Sans JP", "Noto Sans SC", "Noto Sans TC", system-ui, sans-serif;
  --kata-font-mono:
    ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;

  /* ---- Color (dark, the default) -----------------------------------------------------------
   * Surfaces from the lowest to the highest: ground, panel, raise, raise-2, fill, solid. Raise
   * and raise-2 are translucent and are laid over the panel.
   */
  --kata-color-ground: #202021;
  --kata-color-panel: #2b2b2d;
  /* The opaque surface an element sits on: the ground, or the surface of the component around it
   * (the surface mixin). A cover (a sticky cell, a ring cut out of the surface) paints it. var()
   * resolves where it is declared, so the light theme declares it again */
  --kata-color-surface: var(--kata-color-ground);
  --kata-color-raise: rgba(245, 245, 248, 0.07);
  --kata-color-raise-2: rgba(245, 245, 248, 0.14);
  --kata-color-fill: #46464a;
  --kata-color-solid: #204ec3;
  --kata-color-solid-hover: #123eb2;
  --kata-color-solid-active: #062da1;
  /* A disabled or busy filled shape (a primary action, a switch that is on): the same shape
   * without hue: the fill's grey with the text at the dimmed opacity, as dim as the text of a
   * disabled outline, so that it reads neither as a darker primary nor as a button to press.
   * The light theme declares them again, as var() resolves where it is declared */
  --kata-color-solid-disabled: var(--kata-color-fill);
  --kata-color-solid-disabled-text: rgba(245, 245, 248, 0.64);
  --kata-color-on-solid: #ffffff;
  /* Text in three levels and lines in two. Only faint text (placeholders, disabled) is light */
  --kata-color-text: #f5f5f8;
  --kata-color-muted: rgba(245, 245, 248, 0.92);
  --kata-color-faint: rgba(245, 245, 248, 0.48);
  --kata-color-line: rgba(245, 245, 248, 0.17);
  --kata-color-line-strong: rgba(245, 245, 248, 0.32);
  /* The thumb of a scrollbar: text at the least alpha that reaches 3:1 on ground and panel and on
   * raise and raise-2 laid over either; on hover, the least that reaches 4.5:1 on them */
  --kata-color-thumb: rgba(245, 245, 248, 0.44);
  --kata-color-thumb-hover: rgba(245, 245, 248, 0.64);
  /* Four hues in three roles: ink (text and lines, 7:1 on the panel and on raise), fill (a
   * surface) and on (text on the fill). Fills are the same in both themes; hover and active
   * lower the lightness by 0.05 and 0.10 in OKLCH */
  --kata-color-blue-ink: #b0d0ff;
  --kata-color-blue-fill: #204ec3;
  --kata-color-on-blue: #ffffff;
  --kata-color-yellow-ink: #ffe45c;
  --kata-color-yellow-fill: #f8cd09;
  --kata-color-on-yellow: #1d1f20;
  --kata-color-red-ink: #ffbbad;
  --kata-color-red-fill: #a82514;
  --kata-color-red-fill-hover: #951303;
  --kata-color-red-fill-active: #7e0f02;
  --kata-color-red-wash: rgb(255 187 173 / 12%);
  --kata-color-on-red: #ffffff;
  --kata-color-green-ink: #5cff9d;
  --kata-color-green-fill: #51bf68;
  --kata-color-on-green: #1d1f20;
  /* The focus ring, the backdrop of a modal and selected text */
  --kata-color-focus: var(--kata-color-blue-ink);
  --kata-color-scrim: rgba(0, 0, 0, 0.5);
  --kata-color-selection: rgba(0, 51, 255, 0.35);
}

/* Chinese and Japanese text takes no negative letter spacing */
:lang(ja),
:lang(zh) {
  --kata-text-tracking-num: 0;
  --kata-text-tracking-title: 0;
  --kata-text-tracking-h1: 0;
  --kata-text-tracking-h2: 0;
  --kata-text-tracking-body: 0;
  --kata-text-tracking-prose: 0;
  --kata-text-tracking-caption: 0;
  --kata-text-tracking-label: 0;
  --kata-text-tracking-glyph: 0;
}

/* The light theme, on any element and the elements inside it */
[data-color-mode="light"] {
  --kata-color-ground: #f2f2f3;
  --kata-color-panel: #ffffff;
  --kata-color-surface: var(--kata-color-ground);
  --kata-color-raise: rgba(29, 31, 32, 0.06);
  --kata-color-raise-2: rgba(29, 31, 32, 0.12);
  --kata-color-fill: #e4e4e5;
  --kata-color-solid-disabled: var(--kata-color-fill);
  --kata-color-solid-disabled-text: rgba(29, 31, 32, 0.64);
  --kata-color-text: #1d1f20;
  --kata-color-muted: rgba(29, 31, 32, 0.94);
  --kata-color-faint: rgba(29, 31, 32, 0.5);
  --kata-color-line: rgba(29, 31, 32, 0.16);
  --kata-color-line-strong: rgba(29, 31, 32, 0.32);
  --kata-color-thumb: rgba(29, 31, 32, 0.51);
  --kata-color-thumb-hover: rgba(29, 31, 32, 0.66);
  --kata-color-blue-ink: #0029b8;
  --kata-color-blue-fill: #204ec3;
  --kata-color-on-blue: #ffffff;
  --kata-color-yellow-ink: #664a00;
  --kata-color-yellow-fill: #f8cd09;
  --kata-color-on-yellow: #1d1f20;
  --kata-color-red-ink: #950010;
  --kata-color-red-fill: #a82514;
  --kata-color-red-fill-hover: #951303;
  --kata-color-red-fill-active: #7e0f02;
  --kata-color-red-wash: rgb(149 0 16 / 8%);
  --kata-color-on-red: #ffffff;
  --kata-color-green-ink: #0a5623;
  --kata-color-green-fill: #51bf68;
  --kata-color-on-green: #1d1f20;
  --kata-color-focus: #0033ff;
}

/* When the page is mainly Chinese, Japanese or Korean, controls take their edges from CJK ink */
:root:lang(ja),
:root:lang(zh),
:root:lang(ko) {
  --kata-ink-over: calc(var(--kata-cjk-ascent) - var(--kata-cap));
  --kata-ink-under: var(--kata-cjk-descent);
}
`,w=s(`<div class="frame svelte-1drjygd"><!></div>`),T=s(`<th> </th>`),E=s(`<td> </td>`),D=s(`<tr></tr>`),O=s(`<!> <!>`,1);function k(s){let d=Array.from({length:12},(e,t)=>`Layer ${t+1}`),S=[`Name`,`Kind`,`Owner`,`Updated`,`Size`,`Status`];b(s,{children:(s,b)=>{var C=O(),k=u(C);y(k,{label:`A panel whose content scrolls`,children:(e,s)=>{var c=w(),v=l(c);h(v,{side:`panel`,label:`Layers`,head:e=>{m(e,{title:`Layers`,rule:!0})},children:(e,s)=>{g(e,{label:`Layers`,children:(e,s)=>{var c=o(),l=u(c);n(l,16,()=>d,e=>e,(e,n)=>{_(e,{onclick:()=>{},children:(e,o)=>{p();var s=i();r(()=>t(s,n)),a(e,s)},$$slots:{default:!0}})}),a(e,c)},$$slots:{default:!0}})},$$slots:{head:!0,default:!0}}),f(c),a(e,c)},$$slots:{default:!0}});var A=e(k,2);y(A,{label:`A table wider than its frame`,children:(e,i)=>{x(e,{width:`16rem`,children:(e,i)=>{v(e,{head:e=>{var i=o(),s=u(i);n(s,16,()=>S,e=>e,(e,n)=>{var i=T(),o=c(i,!0);r(()=>t(o,n)),a(e,i)}),a(e,i)},children:(e,i)=>{var o=D();n(o,20,()=>S,e=>e,(e,n)=>{var i=E(),o=c(i);r(()=>t(o,`${n??``} of the first row`)),a(e,i)}),f(o),a(e,o)},$$slots:{head:!0,default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}}),a(s,C)},$$slots:{default:!0}})}var A=`.embed-root`,j=document.createElement(`style`);j.textContent=`${S}\n${C}`.replaceAll(`:root`,A).replace(`[data-color-mode="light"] {`,`[data-color-mode="light"] ${A}, ${A}[data-color-mode="light"] {`),document.head.append(j);var M=document.querySelector(A);M&&d(k,{target:M});