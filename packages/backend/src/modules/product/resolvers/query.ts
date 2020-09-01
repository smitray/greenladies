import { ProductModuleResolversType } from '..';
import { connectionFromArray } from '../../../utils/relay';
import { ProductProvider } from '../product.provider';
import { calculateProductFilters } from '../utils/product-filters';

const resolvers: ProductModuleResolversType = {
	Query: {
		product: async (_parent, { where }, { injector }) => {
			const product = await injector.get(ProductProvider).getConfigurableProduct(where);

			return { id: String(product.id) };
		},
		products: async (_parent, args, { injector }) => {
			const products = await injector.get(ProductProvider).getConfigurableProducts();

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
