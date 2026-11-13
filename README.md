# Property Use Logical [stylelint]

[![NPM Version][npm-img]][npm-url]

[Property Use Logical] is a [stylelint] rule to enforce the usage of
[Logical Properties and Values] in CSS.

Physical dimensions and directions are described _left_ to _right_ and _top_ to
_bottom_, while their logical counterparts are described _start_ to _end_ and
_inline_ or _block_.

---

For example, to add spacing before the start of a paragraph, we might use the
physical `padding-left` property.

```css
p {
  padding-left: 2em;
}
```

Were the content Hebrew or Arabic — flowing _right to left_ — then we might
use alternating `padding-left` and `padding-right` properties.

```css
p:dir(ltr) {
  padding-left: 2em;
}

p:dir(rtl) {
  padding-right: 2em;
}
```

Selector weight aside, we can instead use the logical `padding-inline-start`
property.

```css
p {
  padding-inline-start: 2em;
}
```

Similarly, physical _horizontal_ and _vertical_ dimensions are described
more succinctly using their logical counterparts.

```css
h1, h2, h3 {
  margin-top: 1em;
  margin-bottom: 1em;
}

blockquote {
  margin-left: 1em;
  margin-right: 1em;
}

/* becomes */

h1, h2, h3 {
  margin-block: 1em;
}

blockquote {
  margin-inline: 1em;
}
```

## Usage

Add [stylelint] and [Property Use Logical] to your project. Version 6 supports
stylelint 16.7+, 17 and 18 on Node.js 22 or later, and ships as an ES module.

```bash
npm install stylelint stylelint-use-logical-spec --save-dev
```

Add [Property Use Logical] to your [stylelint configuration].

```js
{
  "plugins": [
    "stylelint-use-logical-spec"
  ],
  "rules": {
    "liberty/use-logical-spec": ("always" || true) || ("ignore" || false || null)
  }
}
```

To turn the rule off for one line or block, use the standard stylelint
disable comments:

```css
a {
  /* stylelint-disable-next-line liberty/use-logical-spec */
  margin-left: 0;
}
```

## Options

### always

The `"always"` option (alternatively `true`) requires logical properties and
values to be used, and the following patterns are _not_ considered violations:

```pcss
.inset {
  inset: 0;
}

.margin {
  margin-inline-start: 0;
}

.padding {
  padding-inline: 0;
}

.float {
  float: inline-start;
}

.text-align {
  text-align: start;
}

.text-align-ignored:dir(ltr) {
  text-align: left;
}
```

While the following patterns _are_ considered violations:

```pcss
.inset {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.margin {
  margin-left: 0;
}

.padding {
  padding-left: 0;
  padding-right: 0;
}

.float {
  float: left;
}

.text-align {
  text-align: left;
}
```

### ignore

The `"ignore"` option (alternatively `false` or `null`) disables the rule.

## Secondary Options

### except

The `except` option ignores reporting or autofixing properties and values
matching a case-insensitive string or regular expression.

```js
{
  "rules": {
    "liberty/use-logical-spec": ["always", { "except": ['float', /^margin/i] }]
  }
}
```

### direction

The `direction` option controls whether _left to right_ or _right to left_
properties and values should be reported or autofixed.

```js
{
  "rules": {
    "liberty/use-logical-spec": ["always", { "direction": "ltr" || "rtl" }]
  }
}
```

## Property and Value Mapping

Assuming _left to right_ directionality:

# Positioning

| Physical Property | Logical Property       |
| ----------------- | ---------------------- |
| `top`             | `inset-block-start`    |
| `right`           | `inset-inline-end`     |
| `bottom`          | `inset-block-end`      |
| `left`            | `inset-inline-start`   |

### margin

| Physical Property | Logical Property       |
| ----------------- | ---------------------- |
| `margin-top`      | `margin-block-start`   |
| `margin-right`    | `margin-inline-end`    |
| `margin-bottom`   | `margin-block-end`     |
| `margin-left`     | `margin-inline-start`  |

### Padding

| Physical Property | Logical Property       |
| ----------------- | ---------------------- |
| `padding-top`     | `padding-block-start`  |
| `padding-right`   | `padding-inline-end`   |
| `padding-bottom`  | `padding-block-end`    |
| `padding-left`    | `padding-inline-start` |

### Logical Height and Logical Width

| Physical Property | Logical Property       |
| ----------------- | ---------------------- |
| `height`          | `block-size`           |
| `min-height`      | `min-block-size`       |
| `max-height`      | `max-block-size`       |
| `width`           | `inline-size`          |
| `min-width`       | `min-inline-size`      |
| `max-width`       | `max-inline-size`      |

### Border

| Physical Property            | Logical Property            |
| ---------------------------- | --------------------------- |
| `border-top`                 | `border-block-start`        |
| `border-top-color`           | `border-block-start-color`  |
| `border-top-style`           | `border-block-start-style`  |
| `border-top-width`           | `border-block-start-width`  |
| `border-bottom`              | `border-block-end`          |
| `border-bottom-color`        | `border-block-end-color`    |
| `border-bottom-style`        | `border-block-end-style`    |
| `border-bottom-width`        | `border-block-end-width`    |
| `border-left`                | `border-inline-start`       |
| `border-left-color`          | `border-inline-start-color` |
| `border-left-style`          | `border-inline-start-style` |
| `border-left-width`          | `border-inline-start-width` |
| `border-right`               | `border-inline-end`         |
| `border-right-color`         | `border-inline-end-color`   |
| `border-right-style`         | `border-inline-end-style`   |
| `border-right-width`         | `border-inline-end-width`   |
| `border-top-left-radius`     | `border-start-start-radius` |
| `border-top-right-radius`    | `border-start-end-radius`   |
| `border-bottom-left-radius`  | `border-end-start-radius`   |
| `border-bottom-right-radius` | `border-end-end-radius`     |

`border-width`, `border-style` and `border-color` with more than one value
split into `border-block-*` and `border-inline-*`.

### Scroll margin and padding

`scroll-margin-*` and `scroll-padding-*` map like `margin-*` and
`padding-*`, for example `scroll-margin-left` → `scroll-margin-inline-start`.

### Overflow, overscroll and intrinsic size

| Physical Property          | Logical Property                |
| -------------------------- | ------------------------------- |
| `overflow-x`               | `overflow-inline`               |
| `overflow-y`               | `overflow-block`                |
| `overscroll-behavior-x`    | `overscroll-behavior-inline`    |
| `overscroll-behavior-y`    | `overscroll-behavior-block`     |
| `contain-intrinsic-width`  | `contain-intrinsic-inline-size` |
| `contain-intrinsic-height` | `contain-intrinsic-block-size`  |

`overflow: x y` and `overscroll-behavior: x y` split into the inline (x)
and block (y) properties.

### Shorthands

Pairs of sides merge into an axis shorthand, for example `margin-top` and
`margin-bottom` become `margin-block`. Multi-value `inset`, `margin`,
`padding`, `scroll-margin` and `scroll-padding` split into `*-block` and
`*-inline`. Four equal sides collapse to the plain shorthand.

### Values

| Property                     | Physical Value          | Logical Value             |
| ---------------------------- | ----------------------- | ------------------------- |
| `float`, `clear`             | `left` / `right`        | `inline-start` / `inline-end` |
| `text-align`, `text-align-last` | `left` / `right`   | `start` / `end`           |
| `resize`                     | `horizontal` / `vertical` | `inline` / `block`      |

Physical property names inside `transition`, `transition-property` and
`will-change` values are mapped too.

### Units

| Physical Unit                    | Logical Unit                     |
| -------------------------------- | -------------------------------- |
| `vw`, `svw`, `lvw`, `dvw`, `cqw` | `vi`, `svi`, `lvi`, `dvi`, `cqi` |
| `vh`, `svh`, `lvh`, `dvh`, `cqh` | `vb`, `svb`, `lvb`, `dvb`, `cqb` |

Add a unit to `except` (for example `{ "except": ["vw"] }`) to keep it.

### Stylelint's built-in rules

stylelint 17.12 and later include `property-layout-mappings`,
`value-keyword-layout-mappings` and `unit-layout-mappings`. This plugin
adds the `direction: "rtl"` option, mapping inside `transition` and
`will-change` values, migration of the non-standard `margin-start`-style
properties, and support for stylelint 16.

## Special thanks
Codebase off https://github.com/csstools/stylelint-use-logical


[npm-img]: https://img.shields.io/npm/v/stylelint-use-logical-spec.svg
[npm-url]: https://www.npmjs.com/package/stylelint-use-logical-spec

[Logical Properties and Values]: https://www.w3.org/TR/css-logical-1/
[stylelint]: https://github.com/stylelint/stylelint
[stylelint configuration]: https://github.com/stylelint/stylelint/blob/master/docs/user-guide/configuration.md#readme
[Property Use Logical]: https://github.com/Jordan-Hall/stylelint-use-logical-spec
