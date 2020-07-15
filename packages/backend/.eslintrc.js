// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('../../.eslintrc');

module.exports = {
	...baseConfig,
	rules: {
		...(baseConfig.rules || {}),
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/naming-convention': 'off',
	},
};
