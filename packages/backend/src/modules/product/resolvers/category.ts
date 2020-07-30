import { ProductModuleResolversType } from '..';
import { connectionFromArray } from '../../../utils/relay';
import { ProductProvider } from '../product.provider';

const resolvers: ProductModuleResolversType = {
	Category: {
		products: async ({ id }, args, { injector }) => {
			const simpleProducts = await injector.get(ProductProvider).getProductsByCategoryId(id);

			const products = await Promise.all(
				simpleProducts.map(({ sku }) => injector.get(ProductProvider).getProductBySku(sku)),
			);

			return connectionFromArray(
				products.map(product => ({ ...product, id: String(product.id) })),
				args,
			);
		},
	},
};

export default resolvers;
