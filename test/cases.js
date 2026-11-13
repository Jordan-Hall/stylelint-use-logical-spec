/** Rule cases: `warnings` is checked without fix, `expect` is the autofixed output. */
export default [
	{
		source: "body { margin-start: 0; }",
		expect: "body { margin-inline-start: 0; }",
		args: "always",
	},
	{
		source: "body { margin-end: 0; }",
		expect: "body { margin-inline-end: 0; }",
		args: "always",
	},
	{
		source: "body { padding-end: 0; }",
		warnings: 1,
		args: "always",
	},
	{
		source: "body { left: 0 }",
		args: "always",
		warnings: 1,
	},
	{
		source: "body { left: 0 }",
		args: ["always", { except: "left" }],
		warnings: 0,
	},
	{
		source: "body { top: 0; left: 0 }",
		args: "always",
		warnings: 2,
	},
	{
		source: "body { border-left: 0; left: 0 }",
		args: "always",
		warnings: 2,
	},
	{
		source: "body { top: 0; margin-left: 0 }",
		args: "always",
		warnings: 2,
	},
	{
		source: "body { top: 0; margin-left: 0 }",
		args: ["always", { except: ["top", /^margin/] }],
		warnings: 0,
	},
	{
		source: "body { padding-left: 0; margin-right: 0 }",
		args: "always",
		warnings: 2,
	},
	{
		source: "body { clear: left }",
		args: "always",
		warnings: 1,
	},
	{
		source: "body { float: left }",
		args: "always",
		warnings: 1,
	},
	{
		source: "body { text-align: left }",
		args: "always",
		warnings: 1,
	},
	{
		source: "body:dir(ltr) { top: 0; margin-left: 0; float: left }",
		args: "always",
		warnings: 0,
	},
	{
		source: "body { padding-left: 10px; padding-right: 20px; }",
		expect: "body { padding-inline: 10px 20px; }",
		args: "always",
	},
	{
		source: "body { left: 0 }",
		expect: "body { inset-inline-start: 0 }",
		args: "always",
	},
	{
		source: "body { left: 0; right: 0 }",
		expect: "body { inset-inline: 0 }",
		args: "always",
	},
	{
		source: "body { top: 0; right: 0; bottom: 0; left: 0 }",
		expect: "body { inset: 0 }",
		args: "always",
	},
	{
		source: "body { margin-top: 10px; margin-right: 10px; margin-bottom: 10px; margin-left: 10px }",
		expect: "body { margin: 10px }",
		args: "always",
	},
	{
		source: "body { top: 10px; right: 20px; bottom: 10px; left: 20px }",
		expect: "body { inset-block: 10px; inset-inline: 20px }",
		args: "always",
	},
	{
		source: "body { top: 10px; right: 20px; bottom: 20px; left: 20px }",
		expect: "body { inset-block: 10px 20px; inset-inline: 20px }",
		args: "always",
	},
	{
		source: "body { top: 10px; right: 20px; bottom: 20px; left: 30px }",
		expect: "body { inset-block: 10px 20px; inset-inline: 30px 20px }",
		args: "always",
	},
	{
		source: "body { top: 10px; right: 20px; bottom: 20px; left: 30px }",
		expect: "body { inset-block: 10px 20px; inset-inline: 20px 30px }",
		args: ["always", { direction: "rtl" }],
	},
	{
		source: "body { margin: 0; }",
		expect: "body { margin: 0; }",
		args: "always",
	},
	{
		source: "body { padding: 20px 0; }",
		expect: "body { padding-block: 20px; padding-inline: 0; }",
		args: "always",
	},
	{
		source: "body { inset: 20px 30px 10px; }",
		expect: "body { inset-block: 20px 10px; inset-inline: 30px; }",
		args: "always",
	},
	{
		source: "body { inset: calc(20px * 1) calc(30px * 1) calc(10px * 1); }",
		expect: "body { inset-block: calc(20px * 1) calc(10px * 1); inset-inline: calc(30px * 1); }",
		args: "always",
	},
	{
		source: "body { margin: 20px 30px 10px 40px; }",
		expect: "body { margin-block: 20px 10px; margin-inline: 40px 30px; }",
		args: "always",
	},
	{
		source: "body { margin: 20px 30px 10px 40px; }",
		expect: "body { margin-block: 20px 10px; margin-inline: 30px 40px; }",
		args: ["always", { direction: "rtl" }],
	},
	{
		source: "body { margin-top: 0; margin-right: 0; margin-bottom: 0; margin-left: 0 }",
		expect: "body { margin: 0 }",
		args: "always",
	},
	{
		source: "body { margin-top: 10px; margin-right: 20px; margin-bottom: 10px; margin-left: 20px }",
		expect: "body { margin-block: 10px; margin-inline: 20px }",
		args: "always",
	},
	{
		source: "body { padding-top: 10px; padding-right: 20px; padding-bottom: 20px; padding-left: 20px }",
		expect: "body { padding-block: 10px 20px; padding-inline: 20px }",
		args: "always",
	},
	{
		source: "body { padding-top: 10px; padding-right: 20px; padding-bottom: 20px; padding-left: 30px }",
		expect: "body { padding-block: 10px 20px; padding-inline: 30px 20px }",
		args: "always",
	},
	{
		source: "body { margin-top: 0; margin-right: 0; margin-bottom: 0; }",
		expect: "body { margin-block: 0; margin-inline-end: 0; }",
		args: "always",
	},
	{
		source: "body { margin-top: 0; margin-right: 0; margin-bottom: 0; }",
		expect: "body { margin-block: 0; margin-inline-start: 0; }",
		args: ["always", { direction: "rtl" }],
	},
	{
		source: "body { margin-left: 0; }",
		expect: "body { margin-inline-start: 0; }",
		args: "always",
	},
	{
		source: "body { clear: left }",
		expect: "body { clear: inline-start }",
		args: "always",
	},
	{
		source: "body { float: right }",
		expect: "body { float: inline-end }",
		args: "always",
	},
	{
		source: "body { text-align: left }",
		expect: "body { text-align: start }",
		args: "always",
	},
	{
		source: "body:dir(ltr) { text-align: left }",
		expect: "body:dir(ltr) { text-align: left }",
		args: ["always"],
	},
	{
		source: "body { float: left; text-align: left }",
		expect: "body { float: left; text-align: start }",
		args: [
			"always",
			{
				except: [/^float$/i],
			},
		],
	},
	{
		source: "body { border-left: 0; }",
		expect: "body { border-inline-start: 0; }",
		args: "always",
	},
	{
		source: "body { border-right: 0; }",
		expect: "body { border-inline-end: 0; }",
		args: "always",
	},
	{
		source: "body { border-top: 0; }",
		expect: "body { border-block-start: 0; }",
		args: "always",
	},
	{
		source: "body { border-bottom: 0; }",
		expect: "body { border-block-end: 0; }",
		args: "always",
	},
	{
		source: "body { border-left-color: 0; }",
		expect: "body { border-inline-start-color: 0; }",
		args: "always",
	},
	{
		source: "body { border-right-color: 0; }",
		expect: "body { border-inline-end-color: 0; }",
		args: "always",
	},
	{
		source: "body { border-top-color: 0; }",
		expect: "body { border-block-start-color: 0; }",
		args: "always",
	},
	{
		source: "body { border-bottom-color: 0; }",
		expect: "body { border-block-end-color: 0; }",
		args: "always",
	},
	{
		source: "body { border-left-style: 0; }",
		expect: "body { border-inline-start-style: 0; }",
		args: "always",
	},
	{
		source: "body { border-right-style: 0; }",
		expect: "body { border-inline-end-style: 0; }",
		args: "always",
	},
	{
		source: "body { border-top-style: 0; }",
		expect: "body { border-block-start-style: 0; }",
		args: "always",
	},
	{
		source: "body { border-bottom-style: 0; }",
		expect: "body { border-block-end-style: 0; }",
		args: "always",
	},
	{
		source: "body { border-left-width: 0; }",
		expect: "body { border-inline-start-width: 0; }",
		args: "always",
	},
	{
		source: "body { border-right-width: 0; }",
		expect: "body { border-inline-end-width: 0; }",
		args: "always",
	},
	{
		source: "body { border-top-width: 0; }",
		expect: "body { border-block-start-width: 0; }",
		args: "always",
	},
	{
		source: "body { border-bottom-width: 0; }",
		expect: "body { border-block-end-width: 0; }",
		args: "always",
	},
	{
		source: "body { border-top-left-radius: 0; }",
		expect: "body { border-start-start-radius: 0; }",
		args: "always",
	},
	{
		source: "body { border-top-right-radius: 0; }",
		expect: "body { border-start-end-radius: 0; }",
		args: "always",
	},
	{
		source: "body { border-bottom-left-radius: 0; }",
		expect: "body { border-end-start-radius: 0; }",
		args: "always",
	},
	{
		source: "body { border-bottom-right-radius: 0; }",
		expect: "body { border-end-end-radius: 0; }",
		args: "always",
	},
	{
		source: "body { margin-top: 0.5rem; margin-bottom: 0.5rem; }",
		expect: "body { margin-top: 0.5rem; margin-bottom: 0.5rem; }",
		args: ["always", { except: ["margin-top", "margin-bottom"] }],
		warnings: 0,
	},
	{
		source: "body { height: 250rem; }",
		expect: "body { block-size: 250rem; }",
		args: "always",
	},
	{
		source: "body { min-height: 250rem; }",
		expect: "body { min-block-size: 250rem; }",
		args: "always",
	},
	{
		source: "body { max-height: 250rem; }",
		expect: "body { max-block-size: 250rem; }",
		args: "always",
	},
	{
		source: "body { width: 250rem; }",
		expect: "body { inline-size: 250rem; }",
		args: "always",
	},
	{
		source: "body { min-width: 250rem; }",
		expect: "body { min-inline-size: 250rem; }",
		args: "always",
	},
	{
		source: "body { max-width: 250rem; }",
		expect: "body { max-inline-size: 250rem; }",
		args: "always",
	},
	{
		source: "body { transition-property: border-top-color; }",
		expect: "body { transition-property: border-block-start-color; }",
		args: "always",
	},
	{
		source: "body { will-change: padding-left; }",
		expect: "body { will-change: padding-inline-start; }",
		args: "always",
	},
	{
		source: "body { transition: width 1s, top 2s, left 3s; }",
		expect: "body { transition: inline-size 1s, inset-block-start 2s, inset-inline-start 3s; }",
		args: "always",
	},
	{
		source: "body { transition: width 1s, top 2s, left 3s; }",
		expect: "body { transition: inline-size 1s, inset-block-start 2s, inset-inline-end 3s; }",
		args: ["always", { direction: "rtl" }],
	},
	{
		source: "body { transition: width 1s, top 2s, left 3s; }",
		expect: "body { transition: width 1s, inset-block-start 2s, inset-inline-start 3s; }",
		args: ["always", { except: ["width"] }],
	},
	{
		source: "body { will-change: padding-left; transition: width 1s, top 2s, left 3s; }",
		warnings: 2,
		args: "always",
	},
	{
		source: "body { margin: 20px; }",
		expect: "body { margin: 20px; }",
		args: "always",
	},
	{
		source: "body { margin: map-get($spacers, 4); }",
		expect: "body { margin: map-get($spacers, 4); }",
		args: "always",
	},
	{
		source: "body { margin: map-get($spacers, 4) map-get($spacers, 2); }",
		expect: "body { margin-block: map-get($spacers, 4); margin-inline: map-get($spacers, 2); }",
		args: "always",
	},
	{
		source: "margin-start: 0;",
		expect: "margin-inline-start: 0;",
		args: "always",
	},
	{
		source: "max-width: 250rem;",
		expect: "max-inline-size: 250rem;",
		args: "always",
	},
	{
		// Original tape case: plain CSS cannot parse a JS interpolation, so this reports one CssSyntaxError
		source: 'padding: ${props => props ? 1 : 2};',
		warnings: 1,
		args: 'always'
	},
	{
		// CSS-in-JS: interpolations are left alone, plain declarations are fixed
		source: "const A = styled.div`\n  padding: ${p => p.x};\n  margin-left: 0;\n  width: 100vw;\n`;",
		expect: "const A = styled.div`\n  padding: ${p => p.x};\n  margin-inline-start: 0;\n  inline-size: 100vi;\n`;",
		warnings: 3,
		args: "always",
		customSyntax: "postcss-styled-syntax",
	},
	{
		// #41: the standard stylelint disable comments switch the rule off locally
		source: "body {\n/* stylelint-disable-next-line liberty/use-logical-spec */\nmargin-left: 0;\n}",
		expect: "body {\n/* stylelint-disable-next-line liberty/use-logical-spec */\nmargin-left: 0;\n}",
		warnings: 0,
		args: "always",
	},
	// CSS Logical Level 1 coverage aligned with stylelint's *-layout-mappings rules
	{
		source: "body { scroll-margin-left: 0; }",
		expect: "body { scroll-margin-inline-start: 0; }",
		args: "always",
	},
	{
		source: "body { scroll-padding-top: 1px; scroll-padding-bottom: 2px; }",
		expect: "body { scroll-padding-block: 1px 2px; }",
		args: "always",
	},
	{
		source: "body { scroll-margin: 1px 2px; }",
		expect: "body { scroll-margin-block: 1px; scroll-margin-inline: 2px; }",
		args: "always",
	},
	{
		source: "body { border-width: 1px 2px; }",
		expect: "body { border-block-width: 1px; border-inline-width: 2px; }",
		args: "always",
	},
	{
		source: "body { border-color: red blue green yellow; }",
		expect: "body { border-block-color: red green; border-inline-color: yellow blue; }",
		args: "always",
	},
	{
		source: "body { border-top-color: red; border-bottom-color: red; }",
		expect: "body { border-block-color: red; }",
		args: "always",
	},
	{
		source: "body { border-top-width: 1px; border-left-width: 1px; border-bottom-width: 1px; border-right-width: 1px; }",
		expect: "body { border-width: 1px; }",
		args: "always",
	},
	{
		source: "body { overflow-x: hidden; }",
		expect: "body { overflow-inline: hidden; }",
		args: "always",
	},
	{
		source: "body { overflow: hidden auto; }",
		expect: "body { overflow-block: auto; overflow-inline: hidden; }",
		args: "always",
	},
	{
		source: "body { overflow: hidden; }",
		warnings: 0,
		args: "always",
	},
	{
		source: "body { overscroll-behavior-y: contain; }",
		expect: "body { overscroll-behavior-block: contain; }",
		args: "always",
	},
	{
		source: "body { contain-intrinsic-width: 10px; }",
		expect: "body { contain-intrinsic-inline-size: 10px; }",
		args: "always",
	},
	{
		source: "body { resize: horizontal; }",
		expect: "body { resize: inline; }",
		args: "always",
	},
	{
		source: "body { resize: both; }",
		warnings: 0,
		args: "always",
	},
	{
		source: "body { text-align-last: left; }",
		expect: "body { text-align-last: start; }",
		args: "always",
	},
	{
		source: "body { width: 100vw; }",
		expect: "body { inline-size: 100vi; }",
		warnings: 2,
		args: "always",
	},
	{
		source: "body { block-size: calc(100dvh - 2cqh); }",
		expect: "body { block-size: calc(100dvb - 2cqb); }",
		warnings: 1,
		args: "always",
	},
	{
		source: "body { background: url(10vw.png); }",
		warnings: 0,
		args: "always",
	},
	{
		source: "body { margin: 10vw; }",
		warnings: 0,
		args: ["always",{"except":["vw"]}],
	},
	// Writing modes, offset keywords and languageOptions.directionality
	{
		source: "body { margin-top: 0; }",
		expect: "body { margin-inline-start: 0; }",
		args: ["always",{"writingMode":"vertical-rl"}],
	},
	{
		source: "body { margin-right: 0; }",
		expect: "body { margin-block-start: 0; }",
		args: ["always",{"writingMode":"vertical-rl"}],
	},
	{
		source: "body { margin-bottom: 0; }",
		expect: "body { margin-inline-end: 0; }",
		args: ["always",{"writingMode":"vertical-rl"}],
	},
	{
		source: "body { margin-left: 0; }",
		expect: "body { margin-block-end: 0; }",
		args: ["always",{"writingMode":"vertical-rl"}],
	},
	{
		source: "body { left: 0; }",
		expect: "body { inset-block-end: 0; }",
		args: ["always",{"writingMode":"vertical-rl"}],
	},
	{
		source: "body { border-top-color: red; }",
		expect: "body { border-inline-start-color: red; }",
		args: ["always",{"writingMode":"vertical-rl"}],
	},
	{
		source: "body { border-right: 0; }",
		expect: "body { border-block-start: 0; }",
		args: ["always",{"writingMode":"vertical-rl"}],
	},
	{
		source: "body { width: 1px; height: 2px; }",
		expect: "body { block-size: 1px; inline-size: 2px; }",
		warnings: 2,
		args: ["always",{"writingMode":"vertical-rl"}],
	},
	{
		source: "body { max-width: 1px; min-height: 2px; }",
		expect: "body { max-block-size: 1px; min-inline-size: 2px; }",
		args: ["always",{"writingMode":"vertical-rl"}],
	},
	{
		source: "body { contain-intrinsic-width: 1px; }",
		expect: "body { contain-intrinsic-block-size: 1px; }",
		args: ["always",{"writingMode":"vertical-rl"}],
	},
	{
		source: "body { margin: 1px 2px 3px 4px; }",
		expect: "body { margin-block: 2px 4px; margin-inline: 1px 3px; }",
		warnings: 1,
		args: ["always",{"writingMode":"vertical-rl"}],
	},
	{
		source: "body { margin-left: 1px; margin-right: 2px; }",
		expect: "body { margin-block: 2px 1px; }",
		warnings: 1,
		args: ["always",{"writingMode":"vertical-rl"}],
	},
	{
		source: "body { border-top-left-radius: 0; }",
		expect: "body { border-end-start-radius: 0; }",
		args: ["always",{"writingMode":"vertical-rl"}],
	},
	{
		source: "body { border-top-right-radius: 0; }",
		expect: "body { border-start-start-radius: 0; }",
		args: ["always",{"writingMode":"vertical-rl"}],
	},
	{
		source: "body { overflow-x: hidden; }",
		expect: "body { overflow-block: hidden; }",
		args: ["always",{"writingMode":"vertical-rl"}],
	},
	{
		source: "body { overflow: hidden auto; }",
		expect: "body { overflow-block: hidden; overflow-inline: auto; }",
		args: ["always",{"writingMode":"vertical-rl"}],
	},
	{
		source: "body { float: left; text-align: right; }",
		warnings: 0,
		args: ["always",{"writingMode":"vertical-rl"}],
	},
	{
		source: "body { resize: horizontal; }",
		expect: "body { resize: block; }",
		args: ["always",{"writingMode":"vertical-rl"}],
	},
	{
		source: "body { block-size: 100vw; }",
		expect: "body { block-size: 100vb; }",
		args: ["always",{"writingMode":"vertical-rl"}],
	},
	{
		source: "body { offset-position: left top; }",
		expect: "body { offset-position: block-end inline-start; }",
		args: ["always",{"writingMode":"vertical-rl"}],
	},
	{
		source: "body { margin-bottom: 0; }",
		expect: "body { margin-inline-start: 0; }",
		args: ["always",{"writingMode":"vertical-rl","direction":"rtl"}],
	},
	{
		source: "body { margin-left: 0; }",
		expect: "body { margin-block-start: 0; }",
		args: ["always",{"writingMode":"vertical-lr"}],
	},
	{
		source: "body { border-bottom-left-radius: 0; }",
		expect: "body { border-start-end-radius: 0; }",
		args: ["always",{"writingMode":"vertical-lr"}],
	},
	{
		source: "body { margin-right: 0; }",
		expect: "body { margin-block-start: 0; }",
		args: ["always",{"writingMode":"sideways-rl"}],
	},
	{
		source: "body { margin-bottom: 0; margin-left: 1px; }",
		expect: "body { margin-inline-start: 0; margin-block-start: 1px; }",
		args: ["always",{"writingMode":"sideways-lr"}],
	},
	{
		source: "body { margin-top: 0; }",
		expect: "body { margin-inline-start: 0; }",
		args: ["always",{"writingMode":"sideways-lr","direction":"rtl"}],
	},
	{
		source: "body { offset-position: left top; }",
		expect: "body { offset-position: inline-start block-start; }",
		warnings: 1,
		args: "always",
	},
	{
		source: "body { offset-anchor: right 10px bottom; }",
		expect: "body { offset-anchor: inline-end 10px block-end; }",
		warnings: 1,
		args: "always",
	},
	{
		source: "body { offset-anchor: center; }",
		warnings: 0,
		args: "always",
	},
	{
		source: "body { offset-position: left top; }",
		expect: "body { offset-position: inline-end block-start; }",
		args: ["always",{"direction":"rtl"}],
	},
	{
		source: "body { margin-right: 0; }",
		expect: "body { margin-block-start: 0; }",
		args: "always",
		languageOptions: {"directionality":{"block":"right-to-left","inline":"top-to-bottom"}},
	},
	{
		source: "body { margin-left: 0; }",
		expect: "body { margin-inline-start: 0; }",
		args: ["always",{"writingMode":"horizontal-tb"}],
		languageOptions: {"directionality":{"block":"right-to-left","inline":"top-to-bottom"}},
	},
	{
		// a logical override between the pair keeps its cascade position: rename in place, no merge
		source: 'a { border-top-color: red; border-block-end-color: blue; border-bottom-color: red }',
		expect: 'a { border-block-start-color: red; border-block-end-color: blue; border-block-end-color: red }',
		warnings: 2,
		args: 'always'
	},
	{
		source: 'a { margin-top: 1px; margin-block-start: 2px; margin-bottom: 1px }',
		expect: 'a { margin-block-start: 1px; margin-block-start: 2px; margin-block-end: 1px }',
		warnings: 2,
		args: 'always'
	},
	{
		source: 'a { top: 0; inset: 1px; left: 0; bottom: 0; right: 0 }',
		expect: 'a { inset-block-start: 0; inset: 1px; inset-inline: 0; inset-block-end: 0 }',
		warnings: 3,
		args: 'always'
	},
	{
		// an unrelated declaration in between does not block the merge
		source: 'a { margin-top: 1px; color: red; margin-bottom: 1px }',
		expect: 'a { margin-block: 1px; color: red }',
		warnings: 1,
		args: 'always'
	},
	{
		// an override on the other axis does not block the merge
		source: 'a { margin-top: 1px; margin-inline-start: 2px; margin-bottom: 1px }',
		expect: 'a { margin-block: 1px; margin-inline-start: 2px }',
		warnings: 1,
		args: 'always'
	},
	{
		source: "a { margin-top: 1px !important; margin-bottom: 1px }",
		expect: "a { margin-block-start: 1px !important; margin-block-end: 1px }",
		warnings: 2,
		args: "always"
	},
	{
		source: "a { top: 0 !important; right: 0; bottom: 0; left: 0 }",
		expect: "a { inset-block-start: 0 !important; inset-inline: 0; inset-block-end: 0 }",
		warnings: 3,
		args: "always"
	},
	{
		source: "a { margin-top: 1px !important; margin-bottom: 1px !important }",
		expect: "a { margin-block: 1px !important }",
		warnings: 1,
		args: "always"
	},
	{
		source: "a { -webkit-margin-start: 0; -moz-margin-end: 0; -webkit-margin-before: 0; -webkit-margin-after: 0 }",
		expect: "a { margin-inline-start: 0; margin-inline-end: 0; margin-block-start: 0; margin-block-end: 0 }",
		warnings: 4,
		args: "always"
	},
	{
		source: "a { -webkit-padding-start: 0; -moz-padding-end: 0; padding-start: 0; inset-start: 0; inset-end: 0 }",
		expect: "a { padding-inline-start: 0; padding-inline-end: 0; padding-inline-start: 0; inset-inline-start: 0; inset-inline-end: 0 }",
		warnings: 5,
		args: "always"
	},
	{
		source: "a { -webkit-border-start: 1px solid; -moz-border-end-color: red; -webkit-border-before-width: 1px }",
		expect: "a { border-inline-start: 1px solid; border-inline-end-color: red; border-block-start-width: 1px }",
		warnings: 3,
		args: "always"
	},
	{
		source: "a { -webkit-logical-width: 1px; -webkit-min-logical-height: 1px; -webkit-max-logical-width: 1px }",
		expect: "a { inline-size: 1px; min-block-size: 1px; max-inline-size: 1px }",
		warnings: 3,
		args: "always"
	},
	{
		source: "a { scroll-snap-type: x mandatory }",
		expect: "a { scroll-snap-type: inline mandatory }",
		warnings: 1,
		args: "always"
	},
	{
		source: "a { scroll-snap-type: both; scroll-timeline-axis: y; view-timeline-axis: x }",
		expect: "a { scroll-snap-type: both; scroll-timeline-axis: block; view-timeline-axis: inline }",
		warnings: 2,
		args: "always"
	},
	{
		source: "a { scroll-timeline: --x x; view-timeline: --y y }",
		expect: "a { scroll-timeline: --x inline; view-timeline: --y block }",
		warnings: 2,
		args: "always"
	},
	{
		source: "a { animation-timeline: scroll(root x), view(y 10px) }",
		expect: "a { animation-timeline: scroll(root inline), view(block 10px) }",
		warnings: 1,
		args: "always"
	},
	{
		source: "a { contain-intrinsic-size: 10px 20px }",
		expect: "a { contain-intrinsic-block-size: 20px; contain-intrinsic-inline-size: 10px }",
		warnings: 1,
		args: "always"
	},
	{
		source: "a { contain-intrinsic-size: auto 10px auto 20px }",
		expect: "a { contain-intrinsic-block-size: auto 20px; contain-intrinsic-inline-size: auto 10px }",
		warnings: 1,
		args: "always"
	},
	{
		source: "a { contain-intrinsic-size: auto 10px }",
		expect: "a { contain-intrinsic-size: auto 10px }",
		warnings: 0,
		args: "always"
	},
	{
		source: "a { width: anchor-size(width); max-height: anchor-size(--a height, 10vh) }",
		expect: "a { inline-size: anchor-size(inline); max-block-size: anchor-size(--a block, 10vb) }",
		warnings: 4,
		args: "always"
	},
	{
		source: "a { position-area: top left }",
		expect: "a { position-area: block-start inline-start }",
		warnings: 1,
		args: "always"
	},
	{
		source: "a { position-area: span-right bottom; inset-area: x-start y-self-end }",
		expect: "a { position-area: span-inline-end block-end; position-area: inline-start self-block-end }",
		warnings: 3,
		args: "always"
	},
	{
		source: "a { position-area: center span-all }",
		expect: "a { position-area: center span-all }",
		warnings: 0,
		args: "always"
	},
	{
		source: "a { position-try-order: most-width; position-try: most-height flip-block, --custom, top }",
		expect: "a { position-try-order: most-inline-size; position-try: most-block-size flip-block, --custom, block-start }",
		warnings: 2,
		args: "always"
	},
	{
		source: "a { position-try-fallbacks: flip-inline, right span-y-start }",
		expect: "a { position-try-fallbacks: flip-inline, inline-end span-block-start }",
		warnings: 1,
		args: "always"
	},
	{
		source: "@container (min-width: 400px) { a { color: red } }",
		expect: "@container (min-inline-size: 400px) { a { color: red } }",
		warnings: 1,
		args: "always"
	},
	{
		source: "@container card (400px < width <= 800px) and (max-height: 1px) { a { color: red } }",
		expect: "@container card (400px < inline-size <= 800px) and (max-block-size: 1px) { a { color: red } }",
		warnings: 1,
		args: "always"
	},
	{
		source: "@container (min-inline-size: 1px) and style(--width: 1) {}",
		expect: "@container (min-inline-size: 1px) and style(--width: 1) {}",
		warnings: 0,
		args: "always"
	},
	{
		source: "@media (min-width: 400px) { a { color: red } }",
		expect: "@media (min-width: 400px) { a { color: red } }",
		warnings: 0,
		args: "always"
	},
	{
		source: "a { position-area: top left; height: anchor-size(width); scroll-snap-type: y }",
		expect: "a { position-area: inline-start block-end; inline-size: anchor-size(block); scroll-snap-type: inline }",
		warnings: 4,
		args: ["always",{"writingMode":"vertical-rl"}]
	},
	{
		source: "@container (width > 1px) {}",
		expect: "@container (block-size > 1px) {}",
		warnings: 1,
		args: ["always",{"writingMode":"vertical-rl"}]
	},
	{
		source: "a { contain-intrinsic-size: 10px 20px }",
		expect: "a { contain-intrinsic-block-size: 10px; contain-intrinsic-inline-size: 20px }",
		warnings: 1,
		args: ["always",{"writingMode":"vertical-rl"}]
	},
	{
		source: "a { scroll-snap-type: x; width: anchor-size(width) } @container (min-width: 1px) {}",
		warnings: 0,
		args: ["always", { except: ["x", "width", "min-width"] }]
	},
	{
		// a later !important side keeps its importance
		source: 'a { margin-top: 1px; margin-bottom: 2px !important }',
		expect: 'a { margin-block-start: 1px; margin-block-end: 2px !important }',
		warnings: 2,
		args: 'always'
	},
	{
		// top-level declarations merge like a rule body
		source: 'margin-top: 1px; margin-bottom: 1px; top: 0; right: 0; bottom: 0; left: 0',
		expect: 'margin-block: 1px; inset: 0',
		warnings: 2,
		args: 'always'
	},
	{
		source: "const A = styled.div`\n  padding-left: 1px;\n  padding-right: 2px;\n`;",
		expect: "const A = styled.div`\n  padding-inline: 1px 2px;\n`;",
		warnings: 1,
		args: 'always',
		customSyntax: 'postcss-styled-syntax'
	},
];
