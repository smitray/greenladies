import { ProductModuleResolversType } from '..';
import { ProductProvider } from '../product.provider';

const resolvers: ProductModuleResolversType = {
	Query: {
		product: async (_parent, { where }, { injector }) => {
			const { urlKey } = where;
			const product = await injector.get(ProductProvider).getProductByUrlKey(urlKey);

			return { id: String(product.id) };
		},
	},
};

export default resolvers;
