import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import stylelint from 'stylelint';
import plugin from '../index.js';
import cases from './cases.js';

const { ruleName } = plugin;
const { version } = (await import('stylelint/package.json', { with: { type: 'json' } })).default;

/** Lints `code` with only this rule enabled, optionally autofixing or using a custom syntax. */
const lint = (code, args, fix = false, customSyntax = undefined) => stylelint.lint({
	code,
	fix,
	customSyntax,
	config: { plugins: [plugin], rules: { [ruleName]: args } },
});

describe(`${ruleName} (stylelint ${version})`, () => {
	for (const { source, args, warnings, expect, customSyntax } of cases) {
		const label = `${JSON.stringify(args)} ${source}`;

		if (warnings !== undefined) {
			test(`warns ${warnings}x: ${label}`, async () => {
				const { results: [result] } = await lint(source, args, false, customSyntax);
				assert.equal(result.warnings.length, warnings, JSON.stringify(result.warnings, null, 2));
			});
		}

		if (expect !== undefined) {
			test(`fixes: ${label}`, async () => {
				const { code } = await lint(source, args, true, customSyntax);
				assert.equal(code, expect);
			});
		}
	}
});
