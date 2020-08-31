import { ProductModuleResolversType } from '..';
import { toGlobalId } from '../../../utils/global-id';
import { ProductProvider } from '../product.provider';

const resolvers: ProductModuleResolversType = {
	ProductConfiguration: {
		id: ({ id }) => toGlobalId('ProductConfiguration', id),
		name: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProductConfiguration({ id });
			return product.name;
		},
		quantity: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProductConfiguration({ id });
			return product.quantity;
		},
		originalPrice: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProductConfiguration({ id });
			return product.price.originalPrice;
		},
		specialPrice: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProductConfiguration({ id });
			return product.price.specialPrice;
		},
		currency: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProductConfiguration({ id });
			return product.price.currency;
		},
		size: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProductConfiguration({ id });
			return product.size;
		},
		colors: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProductConfiguration({ id });
			return product.colors;
		},
		parent: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProductConfiguration({ id });
			return { id: product.parentId };
		},
	},
};

export default resolvers;
