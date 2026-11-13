import stylelint from 'stylelint';
import ruleName from './rule-name.js';

export default stylelint.utils.ruleMessages(ruleName, {
	unexpectedProp(physicalProperty, logicalProperty) {
		return `Unexpected "${physicalProperty}" property. Use "${logicalProperty}".`;
	},
	unexpectedValue(property, physicalValue, logicalValue) {
		return `Unexpected "${physicalValue}" value in "${property}" property. Use "${logicalValue}".`;
	},
	unsupportedProp(legacyProperty, logicalProperty) {
		return `"${legacyProperty}" is not part of CSS specs. Use "${logicalProperty}".`;
	},
	unexpectedQuery(physicalQuery, logicalQuery) {
		return `Unexpected "${physicalQuery}" container query. Use "${logicalQuery}".`;
	},
});
