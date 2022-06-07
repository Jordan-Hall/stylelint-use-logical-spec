module.exports = {
	"liberty/use-logical-spec": [
		{
			source: "body { margin-start: 0; }",
			expect: "body { margin-block-start: 0; margin-inline-start: 0; }",
			args: "always",
		},
		{
			source: "body { margin-end: 0; }",
			expect: "body { margin-block-end: 0; margin-inline-end: 0; }",
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
	],
};
