// Physical → flow-relative mappings from CSS Logical Properties and Values Level 1
// (https://drafts.csswg.org/css-logical-1/), for horizontal writing modes.

const inline = {
	start: { ltr: 'left', rtl: 'right' },
	end: { ltr: 'right', rtl: 'left' }
};

/**
 * Box groups whose physical sides map to logical sides. `physical(side)` names a
 * longhand; `logical(axis, edge)` names the flow-relative longhand or axis shorthand.
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
].map(group => ({
	...group,
	logical: (axis, edge) => group.logical(axis, edge).filter(Boolean).join('-')
}));

export const propsThatContainPropsInValue = /^(transition(-property)?|will-change)$/i;

/** Four equal physical sides collapse to the (side-agnostic) physical shorthand. */
export const physical4Prop = sideGroups.map(({ shorthand, physical }) => [
	['top', 'left', 'bottom', 'right'].map(physical),
	shorthand
]);

/** Multi-value physical shorthands split into their block and inline axis shorthands. */
export const physicalShorthandProp = sideGroups.map(({ shorthand, logical }) => ({
	prop: shorthand,
	block: logical('block'),
	inline: logical('inline')
}));

/** Two-value `x y` shorthands split into inline (x) and block (y) properties. */
export const physicalAxesShorthandProp = [
	{ prop: 'overflow', block: 'overflow-block', inline: 'overflow-inline' },
	{ prop: 'overscroll-behavior', block: 'overscroll-behavior-block', inline: 'overscroll-behavior-inline' }
];

export const physical2Prop = dir => sideGroups.flatMap(({ physical, logical }) => [
	[['top', 'bottom'].map(physical), logical('block')],
	[[inline.start[dir], inline.end[dir]].map(physical), logical('inline')]
]);

export const physicalProp = dir => [
	...sideGroups.flatMap(({ physical, logical }) => [
		[[physical('top')], logical('block', 'start')],
		[[physical('bottom')], logical('block', 'end')],
		[[physical(inline.start[dir])], logical('inline', 'start')],
		[[physical(inline.end[dir])], logical('inline', 'end')]
	]),

	[['border-top'], 'border-block-start'],
	[['border-bottom'], 'border-block-end'],
	[[`border-${inline.start[dir]}`], 'border-inline-start'],
	[[`border-${inline.end[dir]}`], 'border-inline-end'],

	[[`border-top-${inline.start[dir]}-radius`], 'border-start-start-radius'],
	[[`border-bottom-${inline.start[dir]}-radius`], 'border-end-start-radius'],
	[[`border-top-${inline.end[dir]}-radius`], 'border-start-end-radius'],
	[[`border-bottom-${inline.end[dir]}-radius`], 'border-end-end-radius'],

	[['height'], 'block-size'],
	[['min-height'], 'min-block-size'],
	[['max-height'], 'max-block-size'],

	[['width'], 'inline-size'],
	[['min-width'], 'min-inline-size'],
	[['max-width'], 'max-inline-size'],

	[['contain-intrinsic-height'], 'contain-intrinsic-block-size'],
	[['contain-intrinsic-width'], 'contain-intrinsic-inline-size'],

	[['overflow-y'], 'overflow-block'],
	[['overflow-x'], 'overflow-inline'],

	[['overscroll-behavior-y'], 'overscroll-behavior-block'],
	[['overscroll-behavior-x'], 'overscroll-behavior-inline']
];

export const physicalValue = dir => [
	[/^(clear|float)$/i, {
		[inline.start[dir]]: 'inline-start',
		[inline.end[dir]]: 'inline-end'
	}],
	[/^text-align(-last)?$/i, {
		[inline.start[dir]]: 'start',
		[inline.end[dir]]: 'end'
	}],
	[/^resize$/i, {
		horizontal: 'inline',
		vertical: 'block'
	}]
];

/** Viewport and container units: width → inline, height → block. */
export const physicalUnit = {
	vw: 'vi', vh: 'vb',
	svw: 'svi', svh: 'svb',
	lvw: 'lvi', lvh: 'lvb',
	dvw: 'dvi', dvh: 'dvb',
	cqw: 'cqi', cqh: 'cqb'
};

export const migrationNoneSpec = [
	[['margin-start'], ['margin-block-start', 'margin-inline-start']],
	[['margin-end'], ['margin-block-end', 'margin-inline-end']],

	[['padding-start'], ['padding-block-start', 'padding-inline-start']],
	[['padding-end'], ['padding-block-end', 'padding-inline-end']],

	[['inset-start'], ['inset-inline-start', 'inset-block-start']],
	[['inset-end'], ['inset-inline-end', 'inset-block-end']],
];
