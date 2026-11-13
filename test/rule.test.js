import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import stylelint from 'stylelint';
import plugin from '../index.js';
import cases from './cases.js';

const { ruleName } = plugin;
const { version } = (await import('stylelint/package.json', { with: { type: 'json' } })).default;

/** Lints `code` with only this rule enabled. */
const lint = (code, args, { fix = false, customSyntax, languageOptions } = {}) => stylelint.lint({
	code,
	fix,
	customSyntax,
	config: { plugins: [plugin], languageOptions, rules: { [ruleName]: args } },
});

describe(`${ruleName} (stylelint ${version})`, () => {
	for (const { source, args, warnings, expect, customSyntax, languageOptions } of cases) {
		const label = `${JSON.stringify(args)} ${source}`;

		if (warnings !== undefined) {
			test(`warns ${warnings}x: ${label}`, async () => {
				const { results: [result] } = await lint(source, args, { customSyntax, languageOptions });
				assert.equal(result.warnings.length, warnings, JSON.stringify(result.warnings, null, 2));
			});
		}

		if (expect !== undefined) {
			test(`fixes: ${label}`, async () => {
				const { code } = await lint(source, args, { fix: true, customSyntax, languageOptions });
				assert.equal(code, expect);
			});
		}
	}
});

test('rejects unknown writingMode and direction values', async () => {
	const { results: [result] } = await lint('a { margin-left: 0; }', ['always', { writingMode: 'diagonal', direction: 'up' }]);
	assert.equal(result.invalidOptionWarnings.length, 2);
});
