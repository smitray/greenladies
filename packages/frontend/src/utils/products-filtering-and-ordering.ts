export const parseOrderBy = (orderBy: any) => {
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

	return 'created_DESC';
};

export type OrderBy = 'created_DESC' | 'price_ASC' | 'price_DESC' | 'discount_DESC';

const colorCodeDisplayMapping: Record<string, string> = {
	beige: 'Beige',
	black: 'Svart',
	blue: 'Blå',
	brown: 'Brun',
	darkgreen: 'Mörkgrön',
	gold: 'Guld',
	green: 'Grön',
	grey: 'Grå',
	multi: 'Flerfärgad',
	orange: 'Orange',
	pink: 'Rosa',
	purple: 'Lila',
	red: 'Röd',
	silver: 'Silver',
	transparent: 'Transparent',
	white: 'Vit',
	yellow: 'Gul',
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
