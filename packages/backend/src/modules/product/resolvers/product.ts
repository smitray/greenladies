import { ProductModuleResolversType } from '..';
import { toGlobalId } from '../../../utils/global-id';
import { ProductProvider } from '../product.provider';

const resolvers: ProductModuleResolversType = {
	Product: {
		id: ({ id }) => {
			return toGlobalId('Product', id);
		},
		name: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProduct({ id });

			return product.name;
		},
		urlKey: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProduct({ id });

			return product.urlKey;
		},
		price: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProduct({ id });

			return product.price;
		},
	},
};

export default resolvers;
