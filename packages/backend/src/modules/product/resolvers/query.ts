import { ProductModuleResolversType } from '..';
import { ProductProvider } from '../product.provider';

const resolvers: ProductModuleResolversType = {
	Query: {
		product: async (_parent, { where }, { injector }) => {
			const product = await injector.get(ProductProvider).getProduct(where);

			return { id: String(product.id) };
		},
	},
};

export default resolvers;
