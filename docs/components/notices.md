# Notices

Notices is the column of notices of an application's frame.

## When to use

Place it between the top bar of the application and the page, with the
[Banner](banner.md) notices that concern the whole application. When
there is no notice, leave it out.

## Props

| Prop | Default | Description |
| --- | --- | --- |
| `children` | required | The Banners |

## Contract

It stacks its children gap-md apart, with the margin of a page around
them: gap-lg above and at the sides, gap-md at the sides below 48rem,
and none below, where the page's own margin follows.

## Example

[Notices](../../examples/notices/)
