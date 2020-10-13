// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('../../.eslintrc');

module.exports = {
	...baseConfig,
	extends: [...baseConfig.extends, 'plugin:react/recommended'],
	parserOptions: {
		...baseConfig.parserOptions,
		ecmaFeatures: {
			...(baseConfig.parserOptions || {}).ecmaFeatures,
			jsx: true,
		},
	},
	plugins: [...baseConfig.plugins, 'react-hooks'],
	rules: {
		...baseConfig.rules,
		'react/prop-types': 'off',
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'warn',
		'@typescript-eslint/camelcase': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/naming-convention': 'off',
		'no-console': 'error',
	},
	settings: {
		...baseConfig.settings,
		react: {
			...(baseConfig.react || {}),
			version: '16.13',
		},
	},
};
