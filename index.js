import stylelint from 'stylelint';
import valueParser from 'postcss-value-parser';
import {
	directions,
	getMaps,
	migrationNoneSpec,
	positionProps,
	propsThatContainPropsInValue,
	toDirectionality,
	writingModes
} from './lib/maps.js';
import { validateRuleWithProps } from './lib/validate.js';
import { cssValueSplit } from './lib/value-split.js';
import ruleName from './lib/rule-name.js';
import messages from './lib/messages.js';
import walk from './lib/walk.js';

// Declarations already reported, per check kind, so overlapping groups report once.
const reported = { prop: new WeakSet(), value: new WeakSet(), unit: new WeakSet() };

// Template-literal expressions (CSS-in-JS) are reported but never autofixed.
const expressionRegex = /^\$\{.*\}$/;
const isExpression = node => expressionRegex.test(node.value ?? '');

/**
 * Picks the block and inline flow: the `writingMode` and `direction` options first,
 * then stylelint's `languageOptions.directionality`, then horizontal-tb, ltr.
 */
const resolveDirectionality = (opts, result) => {
	const { writingMode, direction } = Object(opts);
	const configured = result.stylelint.config?.languageOptions?.directionality;

	if (!writingMode && !direction && configured?.block && configured?.inline) {
		return configured;
	}

	return toDirectionality(writingMode, direction);
};

const isString = value => typeof value === 'string';
const isRegExp = value => value instanceof RegExp;

function ruleFunc(method, opts) {
	const propExceptions = [].concat(Object(opts).except || []);

	return (root, result) => {
		const isMethodValid = stylelint.utils.validateOptions(result, ruleName, {
			actual: method,
			possible() {
				return isMethodIndifferent(method) || isMethodAlways(method);
			}
		}, {
			actual: opts,
			possible: {
				except: [isString, isRegExp],
				direction: directions,
				writingMode: writingModes
			},
			optional: true
		});

		if (!isMethodValid || !isMethodAlways(method)) {
			return;
		}

		const {
			physical2Prop,
			physical4Prop,
			physicalAxesShorthandProp,
			physicalProp,
			physicalShorthandProp,
			physicalUnit,
			physicalValue,
			positionKeyword
		} = getMaps(resolveDirectionality(opts, result));

		/**
		 * Reports once per group of declarations. Stylelint runs `fix` itself
		 * when linting with `--fix`; otherwise the problem becomes a warning.
		 */
		const report = ({ message, decls, owner, fix, kind = 'prop' }) => {
			if (decls.some(decl => reported[kind].has(decl))) {
				return;
			}

			decls.forEach(decl => reported[kind].add(decl));

			stylelint.utils.report({
				message,
				node: decls[0],
				result,
				ruleName,
				...(isExpression(owner) ? {} : { fix })
			});
		};

		/** Reports a physical shorthand and replaces it with its block and inline properties. */
		const reportSplit = (physicalDecl, props, values) => report({
			message: messages.unexpectedProp(physicalDecl.prop, `${props.block} and ${props.inline}`),
			decls: [physicalDecl],
			owner: physicalDecl,
			fix() {
				physicalDecl.cloneBefore({ prop: props.block, value: values.block });
				physicalDecl.cloneBefore({ prop: props.inline, value: values.inline });
				physicalDecl.remove();
			}
		});

		walk(root, node => {
			migrationNoneSpec.forEach(([prop, props]) => {
				validateRuleWithProps(node, prop, outDateDecl => {
					report({
						message: messages.unsupportedProp(outDateDecl.prop, props),
						decls: [outDateDecl],
						owner: node,
						fix() {
							const { value } = outDateDecl;
							outDateDecl.cloneBefore({ prop: props[0], value });
							outDateDecl.cloneAfter({ prop: props[1], value });
							outDateDecl.remove();
						}
					});
				});
			});

			// 4 physical properties become a logical shorthand only when every value is equal
			physical4Prop.forEach(([props, prop]) => {
				validateRuleWithProps(node, props, (blockStartDecl, _a, inlineStartDecl, _b, blockEndDecl, _c, inlineEndDecl) => {
					const decls = [blockStartDecl, inlineStartDecl, blockEndDecl, inlineEndDecl];
					const values = new Set(decls.map(decl => decl.value));

					if (values.size === 1 && !decls.some(decl => isDeclAnException(decl, propExceptions))) {
						report({
							message: messages.unexpectedProp(blockStartDecl.prop, prop),
							decls,
							owner: node,
							fix() {
								blockStartDecl.cloneBefore({ prop, value: blockStartDecl.value });
								decls.forEach(decl => decl.remove());
							}
						});
					}
				});
			});

			// multi-value physical shorthands become *-block and *-inline
			physicalShorthandProp.forEach(({ prop, block, inline, split }) => {
				validateRuleWithProps(node, [prop], physicalDecl => {
					const inputValues = cssValueSplit(physicalDecl.value);

					if (!isDeclAnException(physicalDecl, propExceptions) && inputValues.length > 1 && inputValues.length <= 4) {
						reportSplit(physicalDecl, { block, inline }, split(inputValues));
					}
				});
			});

			// two-value `x y` shorthands (overflow, overscroll-behavior) become *-inline and *-block
			physicalAxesShorthandProp.forEach(({ prop, block, inline, split }) => {
				validateRuleWithProps(node, [prop], physicalDecl => {
					const [x, y, ...rest] = cssValueSplit(physicalDecl.value);

					if (!isDeclAnException(physicalDecl, propExceptions) && y !== undefined && rest.length === 0 && x !== y) {
						reportSplit(physicalDecl, { block, inline }, split([x, y]));
					}
				});
			});

			// 2 physical properties become a logical shorthand
			physical2Prop.forEach(([props, prop]) => {
				validateRuleWithProps(node, props, (startDecl, startIndex, endDecl, endIndex) => {
					if (!isDeclAnException(startDecl, propExceptions) && !isDeclAnException(endDecl, propExceptions)) {
						const firstDecl = startIndex < endIndex ? startDecl : endDecl;

						report({
							message: messages.unexpectedProp(firstDecl.prop, prop),
							decls: [firstDecl, firstDecl === startDecl ? endDecl : startDecl],
							owner: node,
							fix() {
								firstDecl.cloneBefore({
									prop,
									value: startDecl.value === endDecl.value
										? startDecl.value
										: `${startDecl.value} ${endDecl.value}`
								});
								startDecl.remove();
								endDecl.remove();
							}
						});
					}
				});
			});

			// physical properties become logical properties
			physicalProp.forEach(([props, prop]) => {
				validateRuleWithProps(node, props, physicalDecl => {
					if (!isDeclAnException(physicalDecl, propExceptions)) {
						report({
							message: messages.unexpectedProp(physicalDecl.prop, prop),
							decls: [physicalDecl],
							owner: node,
							fix() {
								physicalDecl.prop = prop;
							}
						});
					}
				});
			});

			// physical values become logical values
			physicalValue.forEach(([regexp, props]) => {
				if (isNodeMatchingDecl(node, regexp) && !isDeclAnException(node, propExceptions)) {
					const valuekey = node.value.toLowerCase();

					if (valuekey in props) {
						const value = props[valuekey];

						report({
							kind: 'value',
							message: messages.unexpectedValue(node.prop, node.value, value),
							decls: [node],
							owner: node,
							fix() {
								node.value = value;
							}
						});
					}
				}
			});

			// physical property names inside values (e.g. transition) become logical
			if (isNodeMatchingDecl(node, propsThatContainPropsInValue) && !isDeclAnException(node, propExceptions)) {
				const originalValue = node.value.toLowerCase();
				let value = originalValue;

				physicalProp.forEach(([props, prop]) => {
					props.forEach(searchProp => {
						if (!isValueAnException(searchProp, propExceptions)) {
							value = value.replace(new RegExp(`(?<!-)${searchProp}(?!-)`, 'g'), prop);
						}
					});
				});

				if (value !== originalValue) {
					report({
						kind: 'value',
						message: messages.unexpectedValue(node.prop, node.value, value),
						decls: [node],
						owner: node,
						fix() {
							node.value = value;
						}
					});
				}
			}

			// physical <position> keywords in offset-anchor and offset-position become flow-relative
			if (isNodeMatchingDecl(node, positionProps) && !isDeclAnException(node, propExceptions)) {
				const parsed = valueParser(node.value);
				let changed = false;

				parsed.nodes.forEach(valueNode => {
					const logical = valueNode.type === 'word' && positionKeyword[valueNode.value.toLowerCase()];

					if (logical && !isValueAnException(valueNode.value, propExceptions)) {
						valueNode.value = logical;
						changed = true;
					}
				});

				if (changed) {
					const value = parsed.toString();

					report({
						kind: 'value',
						message: messages.unexpectedValue(node.prop, node.value, value),
						decls: [node],
						owner: node,
						fix() {
							node.value = value;
						}
					});
				}
			}

			// physical viewport and container units (vw, vh, cqw, ...) become logical (vi, vb, cqi, ...)
			if (node.type === 'decl' && !isDeclAnException(node, propExceptions)) {
				const parsed = valueParser(node.value);
				let changed = false;

				parsed.walk(valueNode => {
					if (valueNode.type === 'function' && valueNode.value.toLowerCase() === 'url') {
						return false;
					}

					const dimension = valueNode.type === 'word' && valueParser.unit(valueNode.value);
					const logicalUnit = dimension && physicalUnit[dimension.unit.toLowerCase()];

					if (logicalUnit && !isValueAnException(dimension.unit, propExceptions)) {
						valueNode.value = dimension.number + logicalUnit;
						changed = true;
					}
				});

				if (changed) {
					const value = parsed.toString();

					report({
						kind: 'unit',
						message: messages.unexpectedValue(node.prop, node.value, value),
						decls: [node],
						owner: node,
						fix() {
							node.value = value;
						}
					});
				}
			}
		});
	};
}

ruleFunc.ruleName = ruleName;
ruleFunc.messages = messages;
ruleFunc.meta = {
	url: 'https://github.com/Jordan-Hall/stylelint-use-logical-spec#readme',
	fixable: true
};

export default stylelint.createPlugin(ruleName, ruleFunc);

const isMethodIndifferent = method => method === 'ignore' || method === false || method === null;
const isMethodAlways = method => method === 'always' || method === true;
const isNodeMatchingDecl = (decl, regexp) => decl.type === 'decl' && regexp.test(decl.prop);
const isDeclAnException = (decl, propExceptions) => isValueAnException(decl.prop, propExceptions);
const isValueAnException = (value, propExceptions) => propExceptions.some(match => match instanceof RegExp
	? match.test(value)
: String(match || '').toLowerCase() === String(value || '').toLowerCase());

