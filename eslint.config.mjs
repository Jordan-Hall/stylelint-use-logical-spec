export default [
	{
		ignores: ['node_modules/**'],
	},
	{
		files: ['**/*.js', '**/*.mjs'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: { console: 'readonly', fetch: 'readonly', URL: 'readonly' },
		},
		rules: {
			'eqeqeq': 'error',
			'no-shadow': 'error',
			'no-param-reassign': ['error', { props: false }],
			'no-undef': 'error',
			'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		},
	},
];
