import { ProductModuleResolversType } from '..';
import { ProductProvider } from '../product.provider';

const resolvers: ProductModuleResolversType = {
	Query: {
		product: async (_parent, { where }, { injector }) => {
			const product = await injector.get(ProductProvider).getProduct(where);

			if (product.__type === 'ConfigurableProduct') {
				return { id: String(product.id) };
			}

			throw new Error('Product not found');
		},
	},
};

export default resolvers;
