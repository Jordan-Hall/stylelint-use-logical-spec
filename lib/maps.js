// Physical → flow-relative mappings from CSS Logical Properties and Values Level 1
// (https://drafts.csswg.org/css-logical-1/), for any writing mode and direction.

export const writingModes = ['horizontal-tb', 'vertical-rl', 'vertical-lr', 'sideways-rl', 'sideways-lr'];
export const directions = ['ltr', 'rtl'];
export const flows = ['top-to-bottom', 'bottom-to-top', 'left-to-right', 'right-to-left'];

const flowSides = {
	'top-to-bottom': ['top', 'bottom'],
	'bottom-to-top': ['bottom', 'top'],
	'left-to-right': ['left', 'right'],
	'right-to-left': ['right', 'left']
};

/**
 * Converts CSS `writing-mode` and `direction` to the block and inline flow,
 * using the same shape as stylelint's `languageOptions.directionality`.
 * @see https://drafts.csswg.org/css-writing-modes-4/#logical-to-physical
 */
export const toDirectionality = (writingMode = 'horizontal-tb', direction = 'ltr') => {
	const rtl = direction === 'rtl';

	switch (writingMode) {
		case 'vertical-rl':
		case 'sideways-rl':
			return { block: 'right-to-left', inline: rtl ? 'bottom-to-top' : 'top-to-bottom' };
		case 'vertical-lr':
			return { block: 'left-to-right', inline: rtl ? 'bottom-to-top' : 'top-to-bottom' };
		case 'sideways-lr':
			return { block: 'left-to-right', inline: rtl ? 'top-to-bottom' : 'bottom-to-top' };
		default:
			return { block: 'top-to-bottom', inline: rtl ? 'right-to-left' : 'left-to-right' };
	}
};

export const propsThatContainPropsInValue = /^(transition(-property)?|will-change)$/i;

/**
 * Non-standard and vendor-prefixed properties from old drafts and engines. They are
 * already flow-relative (`start` meant inline-start, `before` meant block-start),
 * so they map the same way in every writing mode.
 */
export const legacyProps = (() => {
	const map = {};
	const sides = { start: 'inline-start', end: 'inline-end', before: 'block-start', after: 'block-end' };

	for (const [edge, logical] of Object.entries(sides)) {
		for (const prefix of ['', '-webkit-', '-moz-']) {
			// unprefixed `*-before`/`*-after` never existed
			if (prefix || edge === 'start' || edge === 'end') {
				map[`${prefix}margin-${edge}`] = `margin-${logical}`;
				map[`${prefix}padding-${edge}`] = `padding-${logical}`;
				map[`${prefix}border-${edge}`] = `border-${logical}`;

				for (const part of ['width', 'style', 'color']) {
					map[`${prefix}border-${edge}-${part}`] = `border-${logical}-${part}`;
				}
			}
		}

		map[`inset-${edge}`] = `inset-${logical}`;
	}

	delete map['inset-before'];
	delete map['inset-after'];

	for (const prefix of ['', 'min-', 'max-']) {
		map[`-webkit-${prefix}logical-width`] = `${prefix}inline-size`;
		map[`-webkit-${prefix}logical-height`] = `${prefix}block-size`;
	}

	return map;
})();

/**
 * Box groups whose physical sides map to logical sides. `physical(side)` names a
 * longhand; `logical(axis, edge)` names the flow-relative longhand or axis shorthand.
 * `pairs` groups accept `<start> <end>` axis shorthands.
 */
const sideGroups = [
	{ shorthand: 'inset', physical: side => side, logical: (axis, edge) => ['inset', axis, edge] },
	{ shorthand: 'margin', physical: side => `margin-${side}`, logical: (axis, edge) => ['margin', axis, edge] },
	{ shorthand: 'padding', physical: side => `padding-${side}`, logical: (axis, edge) => ['padding', axis, edge] },
	{ shorthand: 'scroll-margin', physical: side => `scroll-margin-${side}`, logical: (axis, edge) => ['scroll-margin', axis, edge] },
	{ shorthand: 'scroll-padding', physical: side => `scroll-padding-${side}`, logical: (axis, edge) => ['scroll-padding', axis, edge] },
	...['width', 'style', 'color'].map(part => ({
		shorthand: `border-${part}`,
		physical: side => `border-${side}-${part}`,
		logical: (axis, edge) => ['border', axis, edge, part]
	}))
].map(group => {
	const logical = (axis, edge) => group.logical(axis, edge).filter(Boolean).join('-');
	const isBorder = group.shorthand.startsWith('border-');

	return {
		...group,
		logical,
		/**
		 * Every property that sets one of `physicalSides` on `axes`: the box shorthand,
		 * the physical and logical longhands, the axis shorthands and, for border parts,
		 * the `border`, `border-{side}` and `border-{axis}` shorthands.
		 */
		touches: (physicalSides, axes) => new Set([
			group.shorthand,
			...physicalSides.map(group.physical),
			...axes.flatMap(axis => [logical(axis), logical(axis, 'start'), logical(axis, 'end')]),
			...(isBorder ? ['border', ...physicalSides, ...axes.flatMap(axis => [axis, `${axis}-start`, `${axis}-end`])].map(part => part === 'border' ? part : `border-${part}`) : [])
		])
	};
});

/** Expands a 1–4 value box shorthand to its physical sides. */
const expandBox = ([top, right = top, bottom = top, left = right]) => ({ top, right, bottom, left });

/** `auto 10px 20px` → `['auto 10px', '20px']`: `auto` belongs to the value after it. */
const groupAuto = values => values.reduce((groups, value) => {
	const last = groups.at(-1);

	if (last?.toLowerCase() === 'auto') {
		groups[groups.length - 1] = `${last} ${value}`;
	} else {
		groups.push(value);
	}

	return groups;
}, []);

const joinPair = (start, end) => start === end ? start : `${start} ${end}`;

/** Builds every physical → logical map for one block and inline flow. */
const buildMaps = ({ block, inline }) => {
	const [blockStart, blockEnd] = flowSides[block];
	const [inlineStart, inlineEnd] = flowSides[inline];
	const inlineIsHorizontal = inlineStart === 'left' || inlineStart === 'right';
	const horizontal = inlineIsHorizontal ? 'inline' : 'block';
	const vertical = inlineIsHorizontal ? 'block' : 'inline';

	/** physical side → [axis, edge] */
	const logicalSide = {
		[blockStart]: ['block', 'start'],
		[blockEnd]: ['block', 'end'],
		[inlineStart]: ['inline', 'start'],
		[inlineEnd]: ['inline', 'end']
	};
	const sides = [blockStart, blockEnd, inlineStart, inlineEnd];

	/** `margin: 1px 2px 3px 4px` → `{ block: '1px 3px', inline: '4px 2px' }` (horizontal-tb, ltr) */
	const splitBox = values => {
		const box = expandBox(values);

		return {
			block: joinPair(box[blockStart], box[blockEnd]),
			inline: joinPair(box[inlineStart], box[inlineEnd])
		};
	};

	const radius = [];

	for (const v of ['top', 'bottom']) {
		for (const h of ['left', 'right']) {
			const [blockSide, inlineSide] = inlineIsHorizontal ? [v, h] : [h, v];
			radius.push([[`border-${v}-${h}-radius`], `border-${logicalSide[blockSide][1]}-${logicalSide[inlineSide][1]}-radius`]);
		}
	}

	const positionKeyword = Object.fromEntries(sides.map(side => [side, logicalSide[side].join('-')]));
	const axisKeyword = { x: horizontal, y: vertical };
	const tryOrder = { 'most-width': `most-${horizontal}-size`, 'most-height': `most-${vertical}-size` };

	/** `position-area`: physical sides and `x-`/`y-` axis keywords, with their `span-` and `self-` forms. */
	const positionArea = {};

	for (const side of sides) {
		positionArea[side] = positionKeyword[side];
		positionArea[`span-${side}`] = `span-${positionKeyword[side]}`;
	}

	for (const [axis, logicalAxis] of Object.entries(axisKeyword)) {
		for (const edge of ['start', 'end']) {
			positionArea[`${axis}-${edge}`] = `${logicalAxis}-${edge}`;
			positionArea[`span-${axis}-${edge}`] = `span-${logicalAxis}-${edge}`;
			positionArea[`${axis}-self-${edge}`] = `self-${logicalAxis}-${edge}`;
			positionArea[`span-${axis}-self-${edge}`] = `span-self-${logicalAxis}-${edge}`;
		}
	}

	return {
		/** Four equal physical sides collapse to the (side-agnostic) physical shorthand. */
		physical4Prop: sideGroups.map(({ shorthand, physical, touches }) => [
			['top', 'left', 'bottom', 'right'].map(physical),
			shorthand,
			touches(sides, ['block', 'inline'])
		]),

		/** Multi-value physical box shorthands split into block and inline axis shorthands. */
		physicalShorthandProp: sideGroups.map(({ shorthand, logical }) => ({
			prop: shorthand,
			block: logical('block'),
			inline: logical('inline'),
			split: splitBox
		})),

		/** `x y` shorthands split by whichever axis is horizontal. */
		physicalAxesShorthandProp: [
			['overflow', 'overflow-block', 'overflow-inline'],
			['overscroll-behavior', 'overscroll-behavior-block', 'overscroll-behavior-inline'],
			['contain-intrinsic-size', 'contain-intrinsic-block-size', 'contain-intrinsic-inline-size', groupAuto]
		].map(([prop, blockProp, inlineProp, group = values => values]) => ({
			prop,
			block: blockProp,
			inline: inlineProp,
			group,
			split: ([x, y]) => inlineIsHorizontal ? { inline: x, block: y } : { inline: y, block: x }
		})),

		/** Start and end longhands of one axis merge into its `<start> <end>` shorthand. */
		physical2Prop: sideGroups.flatMap(({ physical, logical, touches }) => [
			[[physical(blockStart), physical(blockEnd)], logical('block'), touches([blockStart, blockEnd], ['block'])],
			[[physical(inlineStart), physical(inlineEnd)], logical('inline'), touches([inlineStart, inlineEnd], ['inline'])]
		]),

		physicalProp: [
			...sideGroups.flatMap(({ physical, logical }) => sides.map(side => [[physical(side)], logical(...logicalSide[side])])),
			...sides.map(side => [[`border-${side}`], `border-${logicalSide[side].join('-')}`]),
			...radius,

			[['width'], `${horizontal}-size`],
			[['min-width'], `min-${horizontal}-size`],
			[['max-width'], `max-${horizontal}-size`],

			[['height'], `${vertical}-size`],
			[['min-height'], `min-${vertical}-size`],
			[['max-height'], `max-${vertical}-size`],

			[['contain-intrinsic-width'], `contain-intrinsic-${horizontal}-size`],
			[['contain-intrinsic-height'], `contain-intrinsic-${vertical}-size`],

			[['overflow-x'], `overflow-${horizontal}`],
			[['overflow-y'], `overflow-${vertical}`],

			[['overscroll-behavior-x'], `overscroll-behavior-${horizontal}`],
			[['overscroll-behavior-y'], `overscroll-behavior-${vertical}`]
		],

		/**
		 * Whole-value keywords. `left` and `right` in float, clear and text-align only
		 * have logical equivalents when the inline axis is horizontal.
		 */
		physicalValue: [
			[/^(clear|float)$/i, inlineIsHorizontal ? { [inlineStart]: 'inline-start', [inlineEnd]: 'inline-end' } : {}],
			[/^text-align(-last)?$/i, inlineIsHorizontal ? { [inlineStart]: 'start', [inlineEnd]: 'end' } : {}],
			[/^resize$/i, inlineIsHorizontal ? { horizontal: 'inline', vertical: 'block' } : { horizontal: 'block', vertical: 'inline' }]
		],

		/**
		 * Whole-word keywords per property, replaced anywhere in the value:
		 * `<position>` sides, `position-area` regions, `x`/`y` axes and `position-try-order`.
		 */
		keywordProps: [
			[/^offset-(anchor|position)$/i, positionKeyword],
			[/^(position-area|inset-area|position-try-fallbacks)$/i, positionArea],
			[/^position-try$/i, { ...positionArea, ...tryOrder }],
			[/^position-try-order$/i, tryOrder],
			[/^(scroll-snap-type|scroll-timeline-axis|view-timeline-axis|scroll-timeline|view-timeline)$/i, axisKeyword]
		],

		/** Keyword arguments of functions in any value: `anchor-size(width)`, `scroll(x)`, `view(y)`. */
		functionKeyword: {
			'anchor-size': { width: horizontal, height: vertical },
			scroll: axisKeyword,
			view: axisKeyword
		},

		/** `@container` size features: `(min-width: 1px)` → `(min-inline-size: 1px)`. */
		containerFeature: { width: `${horizontal}-size`, height: `${vertical}-size` },

		/** Viewport and container units: width and height become inline or block. */
		physicalUnit: Object.fromEntries(['v', 'sv', 'lv', 'dv', 'cq'].flatMap(prefix => [
			[`${prefix}w`, `${prefix}${horizontal[0]}`],
			[`${prefix}h`, `${prefix}${vertical[0]}`]
		]))
	};
};

const cache = new Map();

/** Returns the (cached) maps for a `{ block, inline }` directionality. */
export const getMaps = directionality => {
	const key = `${directionality.block}|${directionality.inline}`;

	if (!cache.has(key)) {
		cache.set(key, buildMaps(directionality));
	}

	return cache.get(key);
};
