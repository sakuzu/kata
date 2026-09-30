# Veil

Veil covers its parent while the content is not ready.

## When to use

Use it over a drawing or a view that must not show until it has loaded,
with a short loading state in the centre. A wait inside a view that
already shows is a [Spinner](spinner.md).

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `busy` | `false` | Tells assistive technology that it is loading |
| `children` | required | What shows in the centre |

## Contract

It fills its parent, which must be a positioned element, with the ground
color, and centres its content. It is on the modal layer, above the
panels of the frame. It has no text, padding or spacing of its own.

## Example

[Veil](../../examples/veil/)
