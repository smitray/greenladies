export const parseOrderBy = (orderBy: any) => {
	if (orderBy === 'popularity_DESC') {
		return 'popularity_DESC';
	}

	if (orderBy === 'created_DESC') {
		return 'created_DESC';
	}

	if (orderBy === 'price_ASC') {
		return 'price_ASC';
	}

	if (orderBy === 'price_DESC') {
		return 'price_DESC';
	}

	if (orderBy === 'discount_DESC') {
		return 'discount_DESC';
	}

	return 'popularity_DESC';
};

export type OrderBy = 'popularity_DESC' | 'created_DESC' | 'price_ASC' | 'price_DESC' | 'discount_DESC';

const colorCodeDisplayMapping: Record<string, string> = {
	black: 'Svart',
	darkgreen: 'Mörkgrön',
	blue: 'Blå',
};

export function colorCodeToDisplay(code: string) {
	return colorCodeDisplayMapping[code] || '';
}

export const initializeSelectedFilters = (
	brands: string[],
	sizes: string[],
	colors: string[],
	lowerPrice: number | null,
	upperPrice: number | null,
) => {
	return [
		...brands.map(brand => ({
			filter: 'brand',
			code: brand,
			display: brand,
		})),
		...sizes.map(size => ({
			filter: 'size',
			code: size,
			display: size,
		})),
		...colors.map(color => ({
			filter: 'color',
			code: color,
			display: colorCodeToDisplay(color),
		})),
		...(lowerPrice !== null || upperPrice !== null
			? [
					{
						filter: 'price',
						code: 'price',
						display: `${lowerPrice !== null ? `${lowerPrice} kr ` : ''}-${
							upperPrice !== null ? ` ${upperPrice} kr` : ''
						}`,
					},
			  ]
			: []),
	];
};
