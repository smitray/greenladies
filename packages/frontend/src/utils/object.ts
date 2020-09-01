export function filterObjectByKeys(allowedKeys: string[], object: Record<string, any>): Record<string, any> {
	return Object.keys(object)
		.filter(key => allowedKeys.includes(key))
		.reduce((prev, current) => {
			return {
				...prev,
				[current]: object[current],
			};
		}, {});
}
