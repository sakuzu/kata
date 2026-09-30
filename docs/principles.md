# Principles

kata is built on six principles. Every value in the tokens and every
component follows from them, and the automated checks enforce them. When a
screen looks wrong, the fix is to the rule that produced it, applied
everywhere, never a special case at the place where the symptom shows.

## The six principles

### 1. Every number comes from the scale

Type sizes and spacing are powers of φ. Padding is measured against the
component's own text (em) and gaps against the root (rem), and the text
inside a control is trimmed to its ink. A number that the formulas cannot
produce is not written. The only exceptions are the width of a line, the
radius of a capsule and the fixed widths of layout regions.

### 2. Text is trimmed in three places only

A line of text keeps its full line box, and distances are measured from the
edge of that box, except in three places: inside a control, where a text
edge meets the edge of a container or a rule, and where text aligns to a
column. There the half-leading above the cap height and below the baseline
is trimmed, so that the visible ink sits exactly where the scale says.

### 3. A control is one shape

A control has its own padding, and its hit area, hover surface, border and
focus ring are all drawn on that one shape. Nothing is drawn outside it: no
negative margins, no pseudo-elements that reach past the edge.

### 4. Height comes from content

A component's height is the sum of what it holds: the ink of its text, its
padding and its lines. The same kind of container holds the same kind of
content (a toolbar holds small buttons, a footer holds buttons, a list item
holds text), so containers of one kind share a height. A container never
changes its spacing by inspecting its content; when it holds controls, it
declares their height.

### 5. Spacing belongs to containers and layouts

Neighbours are separated by the gap of the layout that holds them (a stack,
a row or a grid), and the distance to an edge is the padding of the
container. Components have no outer margin. Reading text, where paragraphs
and headings follow the conventions of prose, is the one exception.

### 6. Only names are written

A page is written with components, their props and their placement. A
component is written with the names of tokens. The formulas live in one
place, the tokens, so a change to a formula reaches every component and
every page at once.

## Vocabulary

The documents use a small, fixed vocabulary.

- Four layers. The scale is the numbers derived from φ. A token is a named
  value built from the scale. A component is a part with a shape and
  behaviour, named with one English word (Button, ListItem, Badge). A
  pattern is a common arrangement of components.
- Three scales carry names: spacing (`pad-*` inside a component, `gap-*`
  between components), type (the text roles such as `body` and `h1`) and
  color. Their steps are 2xs, xs, sm, md, lg, xl and 2xl.
- No other value gets a name of its own. The height of a button is said as
  a formula of the scale and the component's name (the ink of its text,
  plus `pad-md` above and below, plus two lines), and the token that holds
  it is named after the component.

## Scope

kata holds only what every drawing application shares. It has no
geography vocabulary, and nothing in it knows what is drawn: the content
of a panel, a tree or an inspector is passed in by the application. Every
string a component shows comes from outside, through props or a messages
API, with English defaults.
