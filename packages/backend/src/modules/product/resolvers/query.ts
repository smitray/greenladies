import { ProductModuleResolversType } from '..';
import { ProductProvider } from '../product.provider';

const resolvers: ProductModuleResolversType = {
	Query: {
		product: async (_parent, { where }, { injector }) => {
			const { sku } = where;
			const product = await injector.get(ProductProvider).getProductBySku(sku);

			return { id: String(product.id) };
		},
	},
};

export default resolvers;
