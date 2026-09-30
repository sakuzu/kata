/**
 * The configuration of the documentation site (VitePress).
 *
 * The site reads the chapters in docs/ where they are, so that they stay readable on GitHub. The
 * index of the chapters, docs/README.md, is the home page. Two rules adapt the links, which are
 * written for GitHub:
 *
 * - A paragraph that holds nothing but a link to an example (examples/<name>/) becomes that
 *   example, embedded in an iframe. The examples are separate pages built by Vite
 *   (examples/vite.config.mjs) into the examples/ directory of the site, so the documents do
 *   not depend on the framework an example is written with.
 * - A link to a file of the repository outside docs/ goes to that file on GitHub.
 */

import { posix } from 'node:path';
import { defineConfig, type MarkdownRenderer } from 'vitepress';

/** The state a core rule of markdown-it receives */
type StateCore = Parameters<Parameters<MarkdownRenderer['core']['ruler']['push']>[1]>[0];

const REPO = 'https://github.com/sakuzu/kata';
const BASE = '/kata/';

/** The path of a link target relative to the repository root, or null for an external link */
function repoPath(href: string, sourcePath: string): { path: string; hash: string } | null {
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('#') || href.startsWith('//')) {
    return null;
  }
  const at = href.indexOf('#');
  const path = at === -1 ? href : href.slice(0, at);
  if (path === '') return null;
  return {
    path: posix.normalize(posix.join('docs', posix.dirname(sourcePath), path)),
    hash: at === -1 ? '' : href.slice(at),
  };
}

function escapeHtml(text: string): string {
  return text.replace(
    /[&<>"]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] ?? c,
  );
}

/** Replaces a paragraph that is only a link to an example with the example in an iframe */
function embedExamples(state: StateCore): void {
  const source = (state.env as { relativePath?: string }).relativePath ?? '';
  const tokens = state.tokens;
  for (let i = 0; i + 2 < tokens.length; i++) {
    if (tokens[i].type !== 'paragraph_open' || tokens[i + 2].type !== 'paragraph_close') continue;
    const children = tokens[i + 1].children ?? [];
    if (children.length !== 3 || children[0].type !== 'link_open') continue;
    const target = repoPath(children[0].attrGet('href') ?? '', source);
    const example = target?.path.match(/^examples\/([a-z0-9-]+)\/?$/);
    if (!example) continue;
    const title = escapeHtml(children[1].content);
    const src = `${BASE}examples/${example[1]}/`;
    const html = new state.Token('html_block', '', 0);
    html.content =
      `<figure class="kata-example">` +
      `<iframe src="${src}" title="${title}" loading="lazy"` +
      ` style="width: 100%; height: 32rem; border: 1px solid var(--vp-c-divider);` +
      ` border-radius: 8px;"></iframe>` +
      `<figcaption><a href="${src}" target="_blank" rel="noopener">${title}</a>` +
      `</figcaption></figure>\n`;
    tokens.splice(i, 3, html);
  }
}

/** Sends a link to a repository file outside docs/ to GitHub */
function linkOutside(state: StateCore): void {
  const source = (state.env as { relativePath?: string }).relativePath ?? '';
  for (const block of state.tokens) {
    for (const token of block.children ?? []) {
      if (token.type !== 'link_open') continue;
      const target = repoPath(token.attrGet('href') ?? '', source);
      if (!target || target.path.startsWith('docs/')) continue;
      const isDir = !posix.extname(target.path);
      token.attrSet('href', `${REPO}/${isDir ? 'tree' : 'blob'}/main/${target.path}${target.hash}`);
    }
  }
}

export default defineConfig({
  title: 'kata',
  description: 'The design system of sakuzu',
  lang: 'en-US',
  base: BASE,
  srcDir: '../docs',
  rewrites: { 'README.md': 'index.md', 'components/README.md': 'components/index.md' },
  cleanUrls: true,
  appearance: 'dark',
  lastUpdated: false,
  markdown: {
    config(md) {
      md.core.ruler.push('kata-examples', embedExamples);
      md.core.ruler.push('kata-links', linkOutside);
    },
  },
  themeConfig: {
    nav: [
      { text: 'Chapters', link: '/' },
      { text: 'Components', link: '/components/' },
    ],
    sidebar: [
      {
        text: 'Chapters',
        items: [
          { text: 'Principles', link: '/principles' },
          { text: 'Scale', link: '/scale' },
          { text: 'Tokens', link: '/tokens' },
          { text: 'Checks', link: '/checks' },
        ],
      },
      {
        text: 'Components',
        items: [
          { text: 'Using the components', link: '/components/' },
          {
            text: 'Layout and text',
            items: [
              ['Stack', 'stack'],
              ['Row', 'row'],
              ['Grid', 'grid'],
              ['Split', 'split'],
              ['Block', 'block'],
              ['Section', 'section'],
              ['SectionHeader', 'section-header'],
              ['Divider', 'divider'],
              ['Indent', 'indent'],
              ['Page', 'page'],
              ['PageHeader', 'page-header'],
              ['Footer', 'footer'],
              ['Text', 'text'],
              ['Prose', 'prose'],
              ['Kbd', 'kbd'],
              ['Icon', 'icon'],
              ['Thumbnail', 'thumbnail'],
              ['Figure', 'figure'],
              ['Glyphs', 'glyphs'],
            ].map(([text, page]) => ({ text, link: `/components/${page}` })),
          },
          {
            text: 'Controls',
            items: [
              ['Actions', 'actions'],
              ['Button', 'button'],
              ['Checkbox', 'checkbox'],
              ['ColorGrid', 'color-grid'],
              ['ColorPicker', 'color-picker'],
              ['Counter', 'counter'],
              ['Field', 'field'],
              ['FileInput', 'file-input'],
              ['InlineEdit', 'inline-edit'],
              ['InputGroup', 'input-group'],
              ['LinkAction', 'link-action'],
              ['NativeSelect', 'native-select'],
              ['NumberInput', 'number-input'],
              ['Palette', 'palette'],
              ['Radio', 'radio'],
              ['RadioGroup', 'radio-group'],
              ['SearchInput', 'search-input'],
              ['Segmented', 'segmented'],
              ['Select', 'select'],
              ['Slider', 'slider'],
              ['Swatch', 'swatch'],
              ['Textarea', 'textarea'],
              ['TextInput', 'text-input'],
              ['Toggle', 'toggle'],
            ].map(([text, page]) => ({ text, link: `/components/${page}` })),
          },
          {
            text: 'Data display',
            items: [
              ['Avatar', 'avatar'],
              ['Badge', 'badge'],
              ['Bars', 'bars'],
              ['Board', 'board'],
              ['Card', 'card'],
              ['Chip', 'chip'],
              ['ChipValue', 'chip-value'],
              ['ColHead', 'col-head'],
              ['Gtile', 'gtile'],
              ['Kv', 'kv'],
              ['List', 'list'],
              ['ListItem', 'list-item'],
              ['Markbox', 'markbox'],
              ['Meter', 'meter'],
              ['Pager', 'pager'],
              ['Pair', 'pair'],
              ['Pin', 'pin'],
              ['Presence', 'presence'],
              ['Progress', 'progress'],
              ['ReadValue', 'read-value'],
              ['Spinner', 'spinner'],
              ['Stat', 'stat'],
              ['State', 'state'],
              ['Stats', 'stats'],
              ['StepBar', 'step-bar'],
              ['Table', 'table'],
              ['Tag', 'tag'],
              ['Tcard', 'tcard'],
              ['Tcards', 'tcards'],
              ['Tile', 'tile'],
            ].map(([text, page]) => ({ text, link: `/components/${page}` })),
          },
          {
            text: 'Overlay and feedback',
            items: [
              ['Banner', 'banner'],
              ['Bubble', 'bubble'],
              ['Bulk', 'bulk'],
              ['Confirm', 'confirm'],
              ['Drawer', 'drawer'],
              ['Dropdown', 'dropdown'],
              ['Floating', 'floating'],
              ['Kebab', 'kebab'],
              ['Menu', 'menu'],
              ['MenuDivider', 'menu-divider'],
              ['MenuHead', 'menu-head'],
              ['MenuItem', 'menu-item'],
              ['Modal', 'modal'],
              ['Note', 'note'],
              ['Notices', 'notices'],
              ['Popover', 'popover'],
              ['Sheet', 'sheet'],
              ['Toast', 'toast'],
              ['ToastHost', 'toast-host'],
              ['Tooltip', 'tooltip'],
              ['Veil', 'veil'],
            ].map(([text, page]) => ({ text, link: `/components/${page}` })),
          },
        ],
      },
    ],
    search: { provider: 'local' },
    socialLinks: [{ icon: 'github', link: REPO }],
    footer: {
      message: 'Released under the Apache-2.0 license.',
      copyright: 'Copyright 2026 Kasika, Inc.',
    },
  },
});
