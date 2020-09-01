import { ProductModuleResolversType } from '..';
import { connectionFromArray } from '../../../utils/relay';
import { CategoryProvider } from '../../category/category.provider';
import { ProductProvider } from '../product.provider';
import { calculateProductFilters } from '../utils/product-filters';

const resolvers: ProductModuleResolversType = {
	Category: {
		products: async ({ id }, args, { injector }) => {
			const category = await injector.get(CategoryProvider).getCategory(id);
			const products = await Promise.all(
				category.productIds.map(id => injector.get(ProductProvider).getConfigurableProduct({ id })),
			);
			if (products.length === 0) {
				return {
					...connectionFromArray(products, args),
					availableFilters: {
						brands: [],
						colors: [],
						price: {
							from: 0,
							to: 0,
						},
						sizes: [],
					},
				};
			}

			const { products: filteredAndOrderedProducts, filters } = calculateProductFilters(
				products,
				args.orderBy,
				args.filters,
			);
			return {
				...connectionFromArray(filteredAndOrderedProducts, args),
				availableFilters: filters,
			};
		},
	},
};

export default resolvers;
