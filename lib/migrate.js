import { globSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';
import stylelint from 'stylelint';
import plugin, { ruleName } from '../index.js';

/** Config files stylelint looks for, in a project root. */
export const configFiles = [
	'.stylelintrc',
	'.stylelintrc.json',
	'.stylelintrc.yaml',
	'.stylelintrc.yml',
	'.stylelintrc.js',
	'.stylelintrc.cjs',
	'.stylelintrc.mjs',
	'stylelint.config.js',
	'stylelint.config.cjs',
	'stylelint.config.mjs',
	'stylelint.config.ts',
	'stylelint.config.cts',
	'stylelint.config.mts',
	'package.json'
];

export const defaultPatterns = ['**/*.{css,scss,sass,less,pcss,postcss,sss}'];

const oldEntry = /stylelint-use-logical-spec\/index\.(?:cjs\.js|es\.mjs)/g;
const quotedDirection = /(\bdirection["']?\s*:\s*)(["'])([^"'\n]*)\2/g;
const bareDirection = /^(\s*direction\s*:\s*)([\w-]+)[ \t]*$/gm;

/** 5.x treated `direction` as "rtl" when it matched /^rtl$/i and "ltr" for anything else. */
const toDirection = value => (/^rtl$/i.test(value) ? 'rtl' : 'ltr');

/**
 * Rewrites 5.x config text for 6.x: removed entry points become the package name, and
 * `direction` values 6.x rejects become the value 5.x used for them.
 */
export const migrateConfigText = (text, fileName) => {
	const changes = [];

	if (!text.includes('use-logical-spec')) {
		return { text, changes };
	}

	let migrated = text.replace(oldEntry, match => {
		changes.push(`"${match}" → "stylelint-use-logical-spec"`);
		return 'stylelint-use-logical-spec';
	});

	const replaceDirection = (match, prefix, quote, value) => {
		if (value === 'ltr' || value === 'rtl') {
			return match;
		}

		const direction = toDirection(value);

		changes.push(`direction "${value}" → "${direction}"`);
		return prefix + quote + direction + quote;
	};

	migrated = migrated.replace(quotedDirection, replaceDirection);

	// YAML may leave values unquoted; JS never does (a bare word there is a variable)
	if (/(^\.stylelintrc$|\.ya?ml$)/.test(fileName)) {
		migrated = migrated.replace(bareDirection, (match, prefix, value) => replaceDirection(match, prefix, '', value));
	}

	return { text: migrated, changes };
};

const isEnabled = setting => {
	const primary = Array.isArray(setting) ? setting[0] : setting;

	return primary === true || primary === 'always';
};

const majorMinor = version => version.split('.').slice(0, 2).map(Number);

/**
 * Migrates the project in `cwd` from 5.x to 6.x: checks Node.js and stylelint, rewrites
 * config files, then applies only this rule's fixes to the matching stylesheets.
 * Returns the number of warnings left that need a manual change.
 */
export const migrate = async ({ cwd = process.cwd(), patterns = defaultPatterns, dryRun = false, log = console.log } = {}) => {
	const [nodeMajor] = majorMinor(process.versions.node);
	const stylelintVersion = createRequire(path.join(cwd, 'package.json'))('stylelint/package.json').version;
	const [major, minor] = majorMinor(stylelintVersion);

	if (nodeMajor < 22) {
		log(`! Node.js ${process.versions.node}: 6.x needs Node.js 22 or later`);
	}

	if (major < 16 || (major === 16 && minor < 7)) {
		log(`! stylelint ${stylelintVersion}: 6.x needs stylelint ^16.7.0 || ^17 || ^18. Run: npm install --save-dev stylelint@latest`);
	}

	let configChanged = false;

	for (const name of configFiles) {
		const file = path.join(cwd, name);

		if (existsSync(file)) {
			const { text, changes } = migrateConfigText(readFileSync(file, 'utf8'), name);

			changes.forEach(change => log(`${name}: ${change}`));
			configChanged ||= changes.length > 0;

			if (changes.length && !dryRun) {
				writeFileSync(file, text);
			}
		}
	}

	let fixed = 0;
	let left = 0;

	const files = globSync(patterns, { cwd, exclude: name => path.basename(name) === 'node_modules' });

	for (const relative of files) {
		const file = path.join(cwd, relative);
		let resolved;

		try {
			resolved = await stylelint.resolveConfig(file, { cwd });
		} catch (error) {
			// the 5.x config cannot load until it is rewritten
			if (dryRun && configChanged) {
				log('Stylesheets are checked once the config is migrated: run again without --dry-run.');
				break;
			}

			throw error;
		}

		const setting = resolved?.rules?.[ruleName];

		if (!isEnabled(setting)) {
			continue;
		}

		const code = readFileSync(file, 'utf8');
		const before = await lintOnly(code, file, cwd, resolved, setting, false);

		if (before.ignored || !before.warnings.length) {
			continue;
		}

		const after = await lintOnly(code, file, cwd, resolved, setting, true);
		const count = before.warnings.length - after.warnings.length;

		fixed += count;
		left += after.warnings.length;

		log(`${relative}: ${dryRun ? 'would fix' : 'fixed'} ${count}${after.warnings.length ? `, ${after.warnings.length} to change by hand` : ''}`);
		after.warnings.forEach(warning => log(`  ${warning.line}:${warning.column} ${warning.text}`));

		if (!dryRun && after.code !== code) {
			writeFileSync(file, after.code);
		}
	}

	log(`${dryRun ? 'Would fix' : 'Fixed'} ${fixed} warning(s); ${left} need a manual change.`);

	return left;
};

/** Lints `code` with only this rule, keeping the file's syntax, language options and ignores. */
const lintOnly = async (code, file, cwd, resolved, setting, fix) => {
	const { results: [result], code: output } = await stylelint.lint({
		code,
		codeFilename: file,
		cwd,
		fix,
		allowEmptyInput: true,
		config: {
			plugins: [plugin],
			customSyntax: resolved.customSyntax,
			languageOptions: resolved.languageOptions,
			ignoreFiles: resolved.ignoreFiles,
			rules: { [ruleName]: setting }
		}
	});

	return {
		ignored: Boolean(result?.ignored),
		code: output ?? code,
		warnings: (result?.warnings ?? []).filter(warning => warning.rule === ruleName)
	};
};
