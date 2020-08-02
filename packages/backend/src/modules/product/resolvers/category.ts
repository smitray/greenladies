import { ProductModuleResolversType } from '..';
import { connectionFromArray } from '../../../utils/relay';
import { CategoryProvider } from '../../category/category.provider';
import { ProductProvider } from '../product.provider';

const resolvers: ProductModuleResolversType = {
	Category: {
		products: async ({ id }, args, { injector }) => {
			const category = await injector.get(CategoryProvider).getCategory(id);

			const { orderBy, filter } = args;

			let products = await Promise.all(category.productIds.map(id => injector.get(ProductProvider).getProduct(id)));
			if (orderBy || filter) {
				if (filter) {
					products = products.filter(product => {
						if (filter.brand_in) {
							// TODO: filter by brand
						}

						if (filter.colour_in) {
							// TODO: filter by brand
						}

						if (filter.size_in) {
							// TODO: filter by size
						}

						if (filter.price_between) {
							if (product.price < filter.price_between.min || product.price > filter.price_between.max) {
								return false;
							}
						}

						return true;
					});
				}

				if (orderBy) {
					if (orderBy === 'price_ASC') {
						products = products.sort((left, right) => left.price - right.price);
					}

					if (orderBy === 'price_DESC') {
						products = products.sort((left, right) => right.price - left.price);
					}
				}
			}

			const brands: string[] = []; // [...new Set(products.map(product => product.brand))]
			const colours: string[] = []; // [...new Set(products.map(product => product.colour))]
			const sizes: string[] = []; // [...new Set(products.map(product => product.size))]
			const price = products.reduce(
				(prev, current) => {
					return {
						min: Math.min(prev.min, current.price),
						max: Math.max(prev.max, current.price),
					};
				},
				{ min: 1000000000, max: -1000000000 },
			);

			return {
				...connectionFromArray(
					products.map(({ id }) => ({ id })),
					args,
				),
				filterValues: {
					brands,
					colours,
					sizes,
					price,
				},
			};
		},
	},
};

export default resolvers;
