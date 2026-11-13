// Type-level checks for index.d.ts, run by `npm run typecheck`.
import type { Config } from 'stylelint';
import plugin, { type RuleSettings } from 'stylelint-use-logical-spec';

const settings: RuleSettings[] = [
	'always',
	true,
	null,
	['always', { except: ['float', /^margin/i], writingMode: 'vertical-rl', direction: 'rtl' }],
	['always', { except: 'vw' }]
];

export const config: Config = {
	plugins: [plugin],
	rules: { [plugin.ruleName]: settings[0] }
};

// @ts-expect-error unknown writing mode
export const badMode: RuleSettings = ['always', { writingMode: 'vertical' }];

// @ts-expect-error unknown direction
export const badDirection: RuleSettings = ['always', { direction: 'auto' }];
