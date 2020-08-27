import { ProductModuleResolversType } from '..';
import { toGlobalId } from '../../../utils/global-id';
import { ProductProvider } from '../product.provider';

const resolvers: ProductModuleResolversType = {
	ProductConfiguration: {
		id: ({ id }) => toGlobalId('ProductConfiguration', id),
		name: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProduct({ id });
			if (product.__type === 'VirtualProduct') {
				return product.name;
			}

			throw new Error('Invalid product');
		},
		quantity: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProduct({ id });
			if (product.__type === 'VirtualProduct') {
				return product.quantity;
			}

			throw new Error('Invalid product');
		},
		originalPrice: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProduct({ id });
			if (product.__type === 'VirtualProduct') {
				return product.price.originalPrice;
			}

			throw new Error('Invalid product');
		},
		specialPrice: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProduct({ id });
			if (product.__type === 'VirtualProduct') {
				return product.price.specialPrice;
			}

			throw new Error('Invalid product');
		},
		currency: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProduct({ id });
			if (product.__type === 'VirtualProduct') {
				return product.price.currency;
			}

			throw new Error('Invalid product');
		},
		size: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProduct({ id });
			if (product.__type === 'VirtualProduct') {
				return product.size;
			}

			throw new Error('Invalid product');
		},
		colors: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProduct({ id });
			if (product.__type === 'VirtualProduct') {
				return product.colors;
			}

			throw new Error('Invalid product');
		},
	},
};

export default resolvers;
