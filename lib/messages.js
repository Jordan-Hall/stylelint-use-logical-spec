import stylelint from 'stylelint';
import ruleName from './rule-name';

export default stylelint.utils.ruleMessages(ruleName, {
	unexpectedProp(physicalProperty, logicalProperty) {
		return `Unexpected "${physicalProperty}" property. Use "${logicalProperty}".`;
	},
	unexpectedValue(property, physicalValue, logicalValue) {
		return `Unexpected "${physicalValue}" value in "${property}" property. Use "${logicalValue}".`;
	},
	unsupportedProp(physicalProperty, logicalProperty) {
		return `"${physicalProperty}" is not part of CSS specs. Use "${logicalProperty[0]}" and "${logicalProperty[1]}".`;
	},
});
