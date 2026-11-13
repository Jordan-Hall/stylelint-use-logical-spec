import type stylelint from 'stylelint';

/** Values of the CSS `writing-mode` property. */
export type WritingMode = 'horizontal-tb' | 'vertical-rl' | 'vertical-lr' | 'sideways-rl' | 'sideways-lr';

/** Values of the CSS `direction` property. */
export type Direction = 'ltr' | 'rtl';

/** `"always"`/`true` enforces logical properties; `"ignore"`/`false`/`null` disables the rule. */
export type PrimaryOption = 'always' | true | 'ignore' | false | null;

export interface SecondaryOptions {
	/** Properties, values or units to skip, matched case-insensitively. */
	except?: string | RegExp | Array<string | RegExp>;
	/** Writing mode of the content. Defaults to `languageOptions.directionality`, then `horizontal-tb`. */
	writingMode?: WritingMode;
	/** Inline direction of the content. Defaults to `languageOptions.directionality`, then `ltr`. */
	direction?: Direction;
}

/** Settings for `"liberty/use-logical-spec"` in a stylelint config. */
export type RuleSettings = PrimaryOption | [PrimaryOption] | [PrimaryOption, SecondaryOptions];

export declare const ruleName: 'liberty/use-logical-spec';

declare const plugin: {
	ruleName: typeof ruleName;
	rule: stylelint.Rule<PrimaryOption, SecondaryOptions>;
};

export default plugin;
