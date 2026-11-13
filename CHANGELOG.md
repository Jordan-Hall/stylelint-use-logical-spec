# Changes to Property Use Logical

## 6.0.0
  ### Breaking
  - Requires stylelint `^16.7.0 || ^17 || ^18` and Node.js `>=22`
  - Published as a native ES module; the `index.cjs.js` and `index.es.mjs` builds are removed
  - `direction` must be exactly `"ltr"` or `"rtl"` (other values are now invalid options)
  - `margin-start`, `margin-end`, `padding-start`, `padding-end`, `inset-start` and
    `inset-end` now map to the inline side only (`margin-start` → `margin-inline-start`),
    as the engines that used them did. Before, they became both a block and an inline property

  ### New
  - Vertical writing modes: `writingMode` option (`horizontal-tb`, `vertical-rl`,
    `vertical-lr`, `sideways-rl`, `sideways-lr`) combined with `direction`; every
    side, size, corner, axis, keyword and unit mapping follows it
  - Falls back to stylelint's `languageOptions.directionality` when no option is set
  - `offset-anchor` and `offset-position` keywords map to flow-relative sides
  - Invalid `writingMode` and `direction` values are reported as invalid options
  - Full CSS Logical Level 1 coverage: `scroll-margin-*`, `scroll-padding-*`,
    `overflow-x/y`, `overscroll-behavior-x/y`, `contain-intrinsic-width/height`
  - Multi-value `border-width`, `border-style`, `border-color`, `scroll-margin`,
    `scroll-padding`, `overflow` and `overscroll-behavior` split by axis
  - `resize: horizontal/vertical` → `inline/block` and `text-align-last` (#11)
  - Vendor-prefixed logical properties (`-webkit-margin-start`, `-moz-padding-end`,
    `-webkit-margin-before`, `-webkit-border-start-color`, `-webkit-logical-width`, ...)
  - Anchor positioning: `position-area` (and `inset-area`, `position-try`,
    `position-try-fallbacks`) keywords, `position-try-order`, `anchor-size(width/height)`
  - `x`/`y` axes in `scroll-snap-type`, `scroll-timeline(-axis)`, `view-timeline(-axis)`,
    `scroll()` and `view()`
  - `contain-intrinsic-size: w h` splits by axis
  - `@container` size features: `(min-width: 1px)` → `(min-inline-size: 1px)`
  - Viewport and container units `vw/vh` (and `sv*`, `lv*`, `dv*`, `cq*`) → `vi/vb` (#38)

  ### Fixes
  - Autofix no longer changes the cascade: sides are not merged around a declaration
    that sets the same side, or when their `!important` flags differ
  - Autofix works again on stylelint 17 and 18 (uses the `report({ fix })` API)
  - The CSS-in-JS expression check no longer alternates between results (stateful `/g` regex)
  - No more `console.warn` output for the non-standard `margin-start`-style properties

  ### Internal
  - Tests run on `node:test`; CI derives the Node.js and stylelint matrix from the
    Node.js release schedule and `peerDependencies`, plus a weekly canary on stylelint latest and next
  - GitHub Actions CI, npm trusted publishing with provenance, and Dependabot

## 5.0.1
  ### fixes
  - add support for stylelint 16

## 5.0.0 (February 3rd, 2023)
  ### New feature
  - Add support for CSS in JS #35

  ###  Fixes
  - Fix shorthand properties that uses calc  #28

## 4.1.0 (June 3rd, 2022)

#22

The script loops through the maps listing of all properties and will make multiple replacements in a single string such as:
`transition: max-width 1s, padding-left 2s, margin-top 3s;`
will recommend (or change to):
`transition: max-inline-size 1s, padding-inline-start 2s, margin-block-start 3s;` (for 'ltr' anyway)

I could only find 3 properties that would seem to fit this use case:
- transition
- transition-property
- will-change

If there are more, this is easy to update as the regex is stored in the `maps.js` file. By selecting only these nodes, I feel this one should run pretty lean instead of scanning all values for property names.

## 4.0.0 (May 31st, 2022)

  ### New feature
  - check shorthand properties and convert them to appropriate logical counterparts #12
  - Skips over declaration if the shorthand property value is a single value - example `margin: 0;`

  ### Fixes
  - Fixes bug with 2 prop mapping
  - Alters 4 prop loop to only consolidate if all values are equal, and will output without the unsupported `logical` keyword

## 3.2.2 (July 26th, 2021)

- Update package-lock dependencies
- fix git workflow

## 3.2.1 (July 26th, 2021)

- Update stylelint peer dependency to use current version or late

## 3.2.0 (February 16th, 2021)

- Added: support for `Logical height`
- Added: support for `Logical width`

## 3.1.0 (November 3rd, 2020)

- Added: migration from version 2.0.0  to 3.1.0 removing none compliant code outlined in version 2.1.0
- Added: Documentation for `border` support
- Updated: peer-dependency of styleline to `13.7.2`
- Fixed: repaired `Except` issues reported on original codebase - https://github.com/csstools/stylelint-use-logical/issues/3

## 3.0.* (November 3rd, 2020)

- Updated: Support for `border` logical values


## 2.1.0 (November 3rd, 2020)

- removed none compliant properties `inset-start`, `inset-end` `margin-start` `margin-end` `padding-start` `padding-end` (*Breaking changes*)

## 2.0.0 (May 12, 2018)

- Updated: peer `stylelint` to 10.0.1 (major)
- Updated: Node 8+ compatibility (major)

## 1.1.0 (September 29, 2018)

- Added: `direction` option to control whether properties and values are
  reported or autofixed using _left to right_ or _right to left_ counterparts
- Fixed: Physical properties and values within `:dir(ltr)` or `:dir(rtl)` are
  ignored

## 1.0.1 (September 28, 2018)

- Fix usage name

## 1.0.0 (September 26, 2018)

- Initial version
