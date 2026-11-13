import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { migrate, migrateConfigText } from '../lib/migrate.js';

test('rewrites removed entry points and the directions 5.x accepted', () => {
	const json = '{ "plugins": ["stylelint-use-logical-spec/index.cjs.js"], "rules": { "liberty/use-logical-spec": ["always", { "direction": "RTL" }] } }';
	const { text, changes } = migrateConfigText(json, '.stylelintrc.json');

	assert.equal(text, '{ "plugins": ["stylelint-use-logical-spec"], "rules": { "liberty/use-logical-spec": ["always", { "direction": "rtl" }] } }');
	assert.equal(changes.length, 2);

	assert.equal(migrateConfigText("plugins: ['stylelint-use-logical-spec/index.es.mjs']\ndirection: 'auto'", 'stylelint.config.mjs').text, "plugins: ['stylelint-use-logical-spec']\ndirection: 'ltr'");
	assert.equal(migrateConfigText('plugins:\n  - stylelint-use-logical-spec\ndirection: Rtl\n', '.stylelintrc.yml').text, 'plugins:\n  - stylelint-use-logical-spec\ndirection: rtl\n');
});

test('leaves valid values, JS variables and unrelated configs alone', () => {
	const js = "import p from 'stylelint-use-logical-spec';\nconst options = { direction: dir, writingMode: 'vertical-rl' };\nconst o = { direction: 'ltr' };";

	assert.deepEqual(migrateConfigText(js, 'stylelint.config.js'), { text: js, changes: [] });
	assert.deepEqual(migrateConfigText('{ "direction": "RTL" }', 'package.json').changes, []);
});

test('migrates config and stylesheets with only this rule', async () => {
	// inside the package so the plugin resolves by name
	const cwd = mkdtempSync(path.join(import.meta.dirname, '.migrate-'));
	const lines = [];

	try {
		writeFileSync(path.join(cwd, '.stylelintrc.json'), JSON.stringify({
			plugins: ['stylelint-use-logical-spec/index.cjs.js'],
			rules: { 'liberty/use-logical-spec': ['always', { direction: 'RTL' }], 'color-named': 'never' }
		}));
		writeFileSync(path.join(cwd, 'a.css'), 'a { margin-left: 0; color: red; float: left; }');
		writeFileSync(path.join(cwd, 'b.css'), 'b { inline-size: 1px; }');

		const dry = await migrate({ cwd, dryRun: true, log: line => lines.push(line) });

		assert.equal(dry, 0);
		assert.match(readFileSync(path.join(cwd, 'a.css'), 'utf8'), /margin-left/);
		assert.match(readFileSync(path.join(cwd, '.stylelintrc.json'), 'utf8'), /index\.cjs\.js/);

		const left = await migrate({ cwd, log: line => lines.push(line) });

		assert.equal(left, 0);
		assert.equal(readFileSync(path.join(cwd, 'a.css'), 'utf8'), 'a { margin-inline-end: 0; color: red; float: inline-end; }');
		assert.equal(readFileSync(path.join(cwd, 'b.css'), 'utf8'), 'b { inline-size: 1px; }');
		assert.match(readFileSync(path.join(cwd, '.stylelintrc.json'), 'utf8'), /"plugins":\["stylelint-use-logical-spec"\].*"direction":"rtl"/);
		assert.ok(lines.includes('a.css: fixed 2'));

		writeFileSync(path.join(cwd, 'c.css'), 'c { padding-top: 0; padding-bottom: 0; }');
		await migrate({ cwd, dryRun: true, log: line => lines.push(line) });

		assert.ok(lines.includes('c.css: would fix 1'));
		assert.equal(readFileSync(path.join(cwd, 'c.css'), 'utf8'), 'c { padding-top: 0; padding-bottom: 0; }');
	} finally {
		rmSync(cwd, { recursive: true, force: true });
	}
});
