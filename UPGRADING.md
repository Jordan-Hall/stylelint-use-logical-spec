# Upgrading to 6.0.0

After upgrading, run the migration from your project root:

```bash
npx stylelint-use-logical-spec migrate --dry-run   # report only
npx stylelint-use-logical-spec migrate             # apply
npx stylelint-use-logical-spec migrate "src/**/*.{js,tsx}"   # CSS-in-JS, with a customSyntax in your config
```

It:
- warns when Node.js or stylelint is older than 6.x supports
- rewrites the removed `stylelint-use-logical-spec/index.cjs.js` and `index.es.mjs`
  entry points in your stylelint config to `stylelint-use-logical-spec`
- rewrites `direction` values 6.x rejects to the value 5.x used for them
  (`"RTL"` → `"rtl"`, anything else → `"ltr"`)
- applies only this rule's fixes to your stylesheets, using each file's own config
  (syntax, options, ignores), and lists what is left to change by hand

It exits with code 1 when warnings are left for you to fix by hand.

## Breaking
- Requires stylelint `^16.7.0 || ^17 || ^18` and Node.js `>=22`
- Published as a native ES module; the `index.cjs.js` and `index.es.mjs` builds are removed
- `direction` must be exactly `"ltr"` or `"rtl"` (other values are now invalid options)
- `margin-start`, `margin-end`, `padding-start`, `padding-end`, `inset-start` and
  `inset-end` now map to the inline side only (`margin-start` → `margin-inline-start`),
  as the engines that used them did. Before, they became both a block and an inline property

## New
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
- `inset-area` (the old name of `position-area`) is renamed
- Top-level declarations (CSS-in-JS templates, style attributes) merge like rule bodies
- TypeScript types for the rule settings (`RuleSettings`, `SecondaryOptions`, ...)
- Viewport and container units `vw/vh` (and `sv*`, `lv*`, `dv*`, `cq*`) → `vi/vb` (#38)

## Fixes
- Autofix no longer changes the cascade: sides are not merged around a declaration
  that sets the same side, or when their `!important` flags differ
- Autofix works again on stylelint 17 and 18 (uses the `report({ fix })` API)
- The CSS-in-JS expression check no longer alternates between results (stateful `/g` regex)
- No more `console.warn` output for the non-standard `margin-start`-style properties

## Internal
- Tests run on `node:test`; CI derives the Node.js and stylelint matrix from the
  Node.js release schedule and `peerDependencies`, plus a weekly canary on stylelint latest and next
- GitHub Actions CI, npm trusted publishing with provenance, and Dependabot
  with auto-merge for patch and minor updates
- release-please writes the changelog and release PR from conventional commits
- `publint` and `@arethetypeswrong/cli` check the published package
