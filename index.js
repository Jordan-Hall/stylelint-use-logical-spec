import stylelint from 'stylelint';
import { physicalProp, physical2Prop, physicalShorthandProp, physical4Prop, physicalValue, migrationNoneSpec } from './lib/maps';
import { validateRuleWithProps } from './lib/validate';
import ruleName from './lib/rule-name';
import messages from './lib/messages';
import walk from './lib/walk';

const reportedDecls = new WeakMap();

export default stylelint.createPlugin(ruleName, (method, opts, context) => {
	const propExceptions = [].concat(Object(opts).except || []);
	const isAutofix = isContextAutofixing(context);
	const dir = /^rtl$/i.test(Object(opts).direction) ? 'rtl' : 'ltr';

	return (root, result) => {
		// validate the method
		const isMethodValid = stylelint.utils.validateOptions(result, ruleName, {
			actual: method,
			possible() {
				return isMethodIndifferent(method) ||
					isMethodAlways(method)
			}
		});

		const reportUnexpectedProperty = (decl, logicalProperty) => stylelint.utils.report({
			message: messages.unexpectedProp(decl.prop, logicalProperty),
			node: decl,
			result,
			ruleName
		});

		const reportUnsupportedProp = (decl, logicalProperty) => stylelint.utils.report({
			message: messages.unsupportedProp(decl.prop, logicalProperty),
			node: decl,
			result,
			ruleName
		});

		const reportUnexpectedValue = (node, value) => stylelint.utils.report({
			message: messages.unexpectedValue(node.prop, node.value, value),
			node,
			result,
			ruleName
		});

		if (isMethodValid && isMethodAlways(method)) {
			walk(root, node => {

				// MIGRATION from out of date props https://github.com/csstools/stylelint-use-logical/issues/1

				migrationNoneSpec.forEach(([prop, props]) => {
					validateRuleWithProps(node, prop, (outDateDecl) => {
						console.warn(`Property ${prop[0]} is not part of Logical standards.`);
						if (isAutofix) {
							console.warn(`Migrating ${prop[0]} to Logical standards.`);
							const value = outDateDecl.value;
							outDateDecl.cloneBefore({
								prop:	props[0],
								value
							});
							outDateDecl.cloneAfter({
								prop: props[1],
								value
							});
							outDateDecl.remove();
						} else if (!isDeclReported(outDateDecl)) {
							reportUnsupportedProp(outDateDecl, props);
							reportedDecls.set(outDateDecl);
						}
					})
				})


				/* logical shorthands do not work yet in browsers */
				/* but we can still use shorthand if all values are the same */
				// validate or autofix 4 physical properties as logical shorthands
				physical4Prop.forEach(([props, prop]) => {
					validateRuleWithProps(node, props, (blockStartDecl, blockStartIndex, inlineStartDecl, inlineStartIndex, blockEndDecl, blockEndIndex, inlineEndDecl, inlineEndIndex) => { // eslint-disable-line
						const firstInlineDecl = blockStartDecl;
						const values = shorthandValueShorten([blockStartDecl.value, inlineStartDecl.value, blockEndDecl.value, inlineEndDecl.value]);
						if (
							!isDeclAnException(blockStartDecl, propExceptions) &&
							!isDeclAnException(inlineStartDecl, propExceptions) &&
							!isDeclAnException(blockEndDecl, propExceptions) &&
							!isDeclAnException(inlineEndDecl, propExceptions) &&
							values.length === 1 // only report issues if there is 1 value after shortening
						) {
							if (isAutofix) {
								firstInlineDecl.cloneBefore({
									prop,
									value: values.join(' ')
								});

								blockStartDecl.remove();
								inlineStartDecl.remove();
								blockEndDecl.remove();
								inlineEndDecl.remove();
							} else if (!isDeclReported(blockStartDecl) && !isDeclReported(inlineStartDecl) && !isDeclReported(blockEndDecl) && !isDeclReported(inlineEndDecl)) {
								reportUnexpectedProperty(firstInlineDecl, prop);

								reportedDecls.set(blockStartDecl);
								reportedDecls.set(inlineStartDecl);
								reportedDecls.set(blockEndDecl);
								reportedDecls.set(inlineEndDecl);
							}
						}
					});
				});


				// validate or autofix shorthand properties that are not supported
				physicalShorthandProp.forEach((prop) => {
					validateRuleWithProps(node, [prop], physicalDecl => { // eslint-disable-line
						let inputValues = physicalDecl.value.trim().split(' ');
						if (
							!isDeclAnException(physicalDecl, propExceptions) &&
							inputValues.length !== 1
						) {

							if (isAutofix) {
								let outputValues = convertShorthandValues(inputValues, dir);

								['block', 'inline'].forEach(type => {
									physicalDecl.cloneBefore({
										prop: prop + "-" + type,
										value: outputValues[type]
									});
								})

								physicalDecl.remove();

							} else if (!isDeclReported(physicalDecl)) {
								reportUnexpectedProperty(physicalDecl, `${prop}-block and ${prop}-inline`);

								reportedDecls.set(physicalDecl);
							}
						}
					});
				});

				// validate or autofix 2 physical properties as logical shorthands
				physical2Prop().forEach(([props, prop]) => {
					validateRuleWithProps(node, props, (startDecl, startIndex, endDecl, endStartIndex) => { // eslint-disable-line
						const firstInlineDecl = startIndex < endStartIndex
							? startDecl
							: endDecl;

						if (!isDeclAnException(startDecl, propExceptions) && !isDeclAnException(endDecl, propExceptions)) {
							if (isAutofix) {
								firstInlineDecl.cloneBefore({
									prop,
									value: startDecl.value === endDecl.value
										? startDecl.value
										: [startDecl.value, endDecl.value].join(' ')
								});

								startDecl.remove();
								endDecl.remove();
							} else if (!isDeclReported(startDecl) && !isDeclReported(endDecl)) {
								reportUnexpectedProperty(firstInlineDecl, prop);

								reportedDecls.set(startDecl);
								reportedDecls.set(endDecl);
							}
						}
					});
				});

				// validate or autofix physical properties as logical
				physicalProp(dir).forEach(([props, prop]) => {
					validateRuleWithProps(node, props, physicalDecl => {
						if (!isDeclAnException(physicalDecl, propExceptions)) {
							if (isAutofix) {
								physicalDecl.prop = prop;
							} else if (!isDeclReported(physicalDecl)) {
								reportUnexpectedProperty(physicalDecl, prop);

								reportedDecls.set(physicalDecl);
							}
						}
					});
				});

				// validate or autofix physical values as logical
				physicalValue(dir).forEach(([regexp, props]) => {
					if (isNodeMatchingDecl(node, regexp) && !isDeclAnException(node, propExceptions)) {
						const valuekey = node.value.toLowerCase();

						if (valuekey in props) {
							const value = props[valuekey];

							if (isAutofix) {
								node.value = value;
							} else {
								reportUnexpectedValue(node, value);

								reportedDecls.set(node);
							}
						}
					}
				});
			});
		}
	};
});

export { ruleName }

const isMethodIndifferent = method => method === 'ignore' || method === false || method === null;
const isMethodAlways = method => method === 'always' || method === true;
const isContextAutofixing = context => Boolean(Object(context).fix);
const isNodeMatchingDecl = (decl, regexp) => decl.type === 'decl' && regexp.test(decl.prop);
const isDeclAnException = (decl, propExceptions) => propExceptions.some(match => match instanceof RegExp
	? match.test(decl.prop)
: String(match || '').toLowerCase() === String(decl.prop || '').toLowerCase());
const isDeclReported = decl => reportedDecls.has(decl);

const shorthandValueShorten = values => {
	const map = [[1, 0], [0, 2], [1, 3]];
	for (let x = values.length - 2; x >= 0; x--)
	{
		if (values[map[x][0]] !== values[map[x][1]]) {
			break;
		}
		values.pop();
	}
	return values;
};

const convertShorthandValues = (input, dir) => {
	let block, inline;
	if (input.length === 1) {
		block = input[0];
		inline = input[0];
	}
	if (input.length === 2) {
		block = input[0];
		inline = input[1];
	}
	if (input.length === 3) {
		block = input[0] + ' ' + input[2];
		inline = input[1];
	}
	if (input.length === 4) {
		block = input[0] + ' ' + input[2];
		inline = dir === 'ltr' ? input[3] + ' ' + input[1] : input[1] + ' ' + input[3];
	}
	return {
		block: optimizeCssValues(block),
		inline: optimizeCssValues(inline)
	};
};

const optimizeCssValues = (value) => {
	let values = value.split(' ');
	if (values.length === 2 && values[0] === values[1]) {
		return value[0];
	}
	return value;
}
