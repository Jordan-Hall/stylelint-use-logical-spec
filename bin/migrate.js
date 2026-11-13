#!/usr/bin/env node
// Migrates a project from stylelint-use-logical-spec 5.x to 6.x.
// Usage: npx stylelint-use-logical-spec migrate [globs...] [--dry-run]
import process from 'node:process';
import { parseArgs } from 'node:util';
import { defaultPatterns, migrate } from '../lib/migrate.js';

const { values, positionals } = parseArgs({
	allowPositionals: true,
	options: {
		'dry-run': { type: 'boolean', default: false },
		help: { type: 'boolean', short: 'h', default: false }
	}
});

const [command, ...patterns] = positionals;

if (values.help || command !== 'migrate') {
	console.log(`Usage: stylelint-use-logical-spec migrate [globs...] [--dry-run]

Moves a project from 5.x to 6.x:
  - checks the Node.js and stylelint versions
  - rewrites removed entry points and invalid "direction" values in stylelint config files
  - applies only this rule's fixes to the stylesheets (default: ${defaultPatterns.join(' ')})

Pass globs for CSS-in-JS files, e.g. "src/**/*.{js,tsx}", with a customSyntax in your config.
--dry-run reports the changes without writing them.`);
	process.exit(values.help ? 0 : 1);
}

const left = await migrate({ patterns: patterns.length ? patterns : defaultPatterns, dryRun: values['dry-run'] });

process.exitCode = left ? 1 : 0;
