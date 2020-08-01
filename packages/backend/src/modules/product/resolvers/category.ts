import { ProductModuleResolversType } from '..';
import { connectionFromArray } from '../../../utils/relay';
import { CategoryProvider } from '../../category/category.provider';
import { ProductProvider } from '../product.provider';

const resolvers: ProductModuleResolversType = {
	Category: {
		products: async ({ id }, args, { injector }) => {
			const category = await injector.get(CategoryProvider).getCategory(id);

			const { orderBy } = args;

			let productIds: string[] = category.productIds;
			if (orderBy) {
				const products = await Promise.all(productIds.map(id => injector.get(ProductProvider).getProduct(id)));
				if (orderBy === 'price_ASC') {
					productIds = products.sort((left, right) => left.price - right.price).map(({ id }) => id);
				}

				if (orderBy === 'price_DESC') {
					productIds = products.sort((left, right) => right.price - left.price).map(({ id }) => id);
				}
			}

			return connectionFromArray(
				productIds.map(id => ({ id })),
				args,
			);
		},
	},
};

export default resolvers;
