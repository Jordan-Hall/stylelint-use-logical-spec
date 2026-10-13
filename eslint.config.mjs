export default [
	{
		languageOptions: {
			sourceType: "module",
			globals: {
				console: "readonly",
			},
		},
		rules: {
			"eqeqeq": "error",
			"no-shadow": "error",
			"no-param-reassign": ["error", { "props": false }],
			"no-undef": "error",
			"no-unused-vars": "error",
		},
	},
	{
		ignores: ["index.*.*", "*.log*", ".*"],
	},
];
