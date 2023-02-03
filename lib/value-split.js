export const cssValueSplit = (value) => {
	const ret = [];
	const stack = [];

	let part = '';
	let esc = false;
	let q = '';

	for (let i = 0; i < value.length; i++) {
		const c = value[i];

		if (esc) {
			esc = false;
		} else if (c === '\\') {
			esc = true;
		} else if (q) {
			if (c === q) {
				q = '';
			}
		} else if (c === '\'' || c === '"') {
			q = c;
		} else if (c === ' ' && stack.length === 0) {
			if (part) {
				ret.push(part);
			}
			part = '';
			continue;

		} else if (c === '(') {
			stack.push(')');
		} else if (c === '{') {
			stack.push('}');
		} else if (c === '[') {
			stack.push(']');
		} else if (stack.length && c === stack[stack.length - 1]) {
			stack.length--;
		}

		part += c;
	}

	if (part) {
		ret.push(part);
	}

	return ret;
}

// console.log(cssValueSplit('3px  0 5px'));
// -> [ '3px', '0', '5px' ]
// console.log(cssValueSplit('3px calc(--bla, 0) 5px'));
// -> [ '3px', 'calc(--bla, 0)', '5px' ]
// console.log(cssValueSplit('3px map-get($spacers, 2) 5px'));
// -> [ '3px', 'map-get($spacers, 2)', '5px' ]
// console.log(cssValueSplit('-#{map-get($spacers, 2)} #{map-get($spacers, 3)} 5px'));
// -> [ '-#{map-get($spacers, 2)}', '#{map-get($spacers, 3)}', '5px' ]
// console.log(cssValueSplit('-#{function("something ) else\')\\" bla", 2)} #{map-get($spacers, 3)} 5px'));
// [ `-#{function("something ) else')\\" bla", 2)}`, '#{map-get($spacers, 3)}', '5px' ]
