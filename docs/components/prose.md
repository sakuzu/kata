# Prose

Prose is a container for text meant to be read: help, terms, tutorials.

## When to use

Use it for long text written as plain HTML: headings h1 to h4, paragraphs,
lists, terms and descriptions, code, quotations, figures, tables and
folded parts. Prose styles the elements; the content needs no classes.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `children` | | The content, plain HTML |

## Contract

The width is at most `--kata-width-prose` and the text takes the prose
role, one quarter step larger than interface text. Prose is the one
component whose children have outer margins, in em: pad-lg before each
block, pad-xl before an h2, and after a heading the heading's offset, so
that a heading sits closer to the text it introduces. The headings take
the roles title, h1, h2 and label. Code is one quarter step smaller than
the text around it, links in running text are underlined and a wide table
scrolls sideways.

## Example

[Prose](../../examples/prose/)
