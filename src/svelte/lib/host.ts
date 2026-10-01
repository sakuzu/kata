// The element that kata puts things into when they have to leave the component that shows them:
// the tooltips (Tooltip, clampTip) and the hidden probes that measure a token.
//
// On a page that kata owns, it is the body. When kata is embedded in a page it does not own, the
// tokens are scoped to a root element instead of :root, and that root declares itself with the
// attribute data-kata-root: everything kata appends outside a component goes into the nearest such
// root, where the tokens, the language and the theme apply.
//
//   <div class="app-root" data-kata-root lang="en">…</div>

/** The attribute that marks the root element of kata embedded in a page it does not own */
export const KATA_ROOT_ATTRIBUTE = 'data-kata-root';

/**
 * The host of what kata appends outside a component on behalf of an element: the nearest ancestor
 * (or the element itself) with data-kata-root, else the body.
 */
export function hostOf(el?: Element | null): HTMLElement {
  return el?.closest<HTMLElement>(`[${KATA_ROOT_ATTRIBUTE}]`) ?? document.body;
}
