# Changes to Property Use Logical

## 3.1.0 (February 16th, 2021)

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
