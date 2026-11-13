# Changelog

Releases from 6.0.0 on are written by [release-please](https://github.com/googleapis/release-please) from conventional commits. See [UPGRADING.md](UPGRADING.md) for the 6.0.0 migration notes.

## [6.0.0](https://github.com/Jordan-Hall/stylelint-use-logical-spec/compare/stylelint-use-logical-spec-v5.0.1...stylelint-use-logical-spec-v6.0.0) (2026-11-13)


### ⚠ BREAKING CHANGES

* requires stylelint ^16.7.0 || ^17 || ^18 and Node.js >= 22.

### Features

* add a migrate command for upgrading from 5.x ([9574a20](https://github.com/Jordan-Hall/stylelint-use-logical-spec/commit/9574a20f1ebf8eba5ee6838aa1f6040a493b6e51))
* map anchor positioning, scroll axes, container queries and prefixed logical properties ([ac347d0](https://github.com/Jordan-Hall/stylelint-use-logical-spec/commit/ac347d076ea0bf75de97469e2b27a437ac92f9a5))
* rename inset-area to position-area and merge top-level declarations ([01c278f](https://github.com/Jordan-Hall/stylelint-use-logical-spec/commit/01c278fb220584f6f52041c2571d07760c9f2e22))
* ship TypeScript types and check the published package ([9e1c298](https://github.com/Jordan-Hall/stylelint-use-logical-spec/commit/9e1c298ec6b09aac7254c568e32145a7949c284e))
* support every writing mode and offset position keywords ([c1b807e](https://github.com/Jordan-Hall/stylelint-use-logical-spec/commit/c1b807e731925ee099c56d567bd916ea4428aaba))
* support stylelint 16.7-18, full CSS Logical coverage and working CI ([f2a6f62](https://github.com/Jordan-Hall/stylelint-use-logical-spec/commit/f2a6f62e9a4b157047ce6f8574e10821b48e17bd))


### Bug Fixes

* keep cascade order when an override sits between merged sides ([9faa339](https://github.com/Jordan-Hall/stylelint-use-logical-spec/commit/9faa339243888360cb8e18a4c9ff532df4b911de))

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
