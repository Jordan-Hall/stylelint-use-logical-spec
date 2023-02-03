export const validateRuleWithProps = (root, props, fn) => {
	// For supporting css-in-js
	const { nodes = [root] } = root;
	// conditionally walk nodes with children
	if (nodes && nodes.length) {
		const args = [];

		const hasProps = props.every(prop => {
			const declIndex = nodes.findIndex(child => child.type === 'decl' && child.prop === prop);
			const decl = nodes[declIndex];

			if (decl) {
				args.push(decl, declIndex);
			}

			return decl;
		});

		if (hasProps) {
			fn(...args);
		}
	}
};
