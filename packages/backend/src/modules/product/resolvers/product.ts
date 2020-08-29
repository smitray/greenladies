import { ProductModuleResolversType } from '..';
import { toGlobalId } from '../../../utils/global-id';
import { connectionFromArray } from '../../../utils/relay';
import { ProductProvider } from '../product.provider';

const resolvers: ProductModuleResolversType = {
	Product: {
		id: ({ id }) => {
			return toGlobalId('Product', id);
		},
		urlKey: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProduct({ id });
			if (product.__type === 'ConfigurableProduct') {
				return product.urlKey;
			}

			throw new Error('Invalid product');
		},
		name: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProduct({ id });

			return product.name;
		},
		brand: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProduct({ id });
			if (product.__type === 'ConfigurableProduct') {
				return product.brand;
			}

			throw new Error('Invalid product');
		},
		metaTitle: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProduct({ id });
			if (product.__type === 'ConfigurableProduct') {
				return product.metaData.title;
			}

			throw new Error('Invalid product');
		},
		metaKeyword: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProduct({ id });
			if (product.__type === 'ConfigurableProduct') {
				return product.metaData.keyword;
			}

			throw new Error('Invalid product');
		},
		metaDescription: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProduct({ id });
			if (product.__type === 'ConfigurableProduct') {
				return product.metaData.description;
			}

			throw new Error('Invalid product');
		},
		fullDescription: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProduct({ id });
			if (product.__type === 'ConfigurableProduct') {
				return product.description.full;
			}

			throw new Error('Invalid product');
		},
		shortDescription: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProduct({ id });
			if (product.__type === 'ConfigurableProduct') {
				return product.description.short;
			}

			throw new Error('Invalid product');
		},
		washingDescription: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProduct({ id });
			if (product.__type === 'ConfigurableProduct') {
				return product.washingDescription;
			}

			throw new Error('Invalid product');
		},
		image: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProduct({ id });
			const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
			const DOMAIN = String(process.env.DOMAIN);

			if (product.__type === 'ConfigurableProduct') {
				return `${protocol}://magento.${DOMAIN}/media/catalog/product${product.image}`;
			}

			throw new Error('Invalid product');
		},
		images: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProduct({ id });
			if (product.__type === 'ConfigurableProduct') {
				const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
				const DOMAIN = String(process.env.DOMAIN);

				return product.images.map(path => `${protocol}://magento.${DOMAIN}/media/catalog/product${path}`);
			}

			throw new Error('Invalid product');
		},
		configurationAttributes: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProduct({ id });
			if (product.__type === 'ConfigurableProduct') {
				return product.configurationAttributes;
			}

			throw new Error('Invalid product');
		},
		virtualProducts: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProduct({ id });
			if (product.__type === 'ConfigurableProduct') {
				return product.virtualProductIds.map(virtualProductId => ({ id: virtualProductId }));
			}

			throw new Error('Invalid product');
		},
		originalPrice: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProduct({ id });
			if (product.__type === 'ConfigurableProduct') {
				return product.price;
			}

			throw new Error('Invalid product');
		},
		specialPrice: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProduct({ id });
			if (product.__type === 'ConfigurableProduct') {
				return product.specialPrice;
			}

			throw new Error('Invalid product');
		},
		currency: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getProduct({ id });
			if (product.__type === 'ConfigurableProduct') {
				return product.currency;
			}

			throw new Error('Invalid product');
		},
		relatedProducts: async ({ id }, args, { injector }) => {
			const product = await injector.get(ProductProvider).getProduct({ id });
			if (product.__type === 'ConfigurableProduct') {
				return {
					...connectionFromArray(
						product.relatedProductIds.map(id => ({ id })),
						args,
					),
					availableFilters: {
						brands: [],
						colors: [],
						price: { from: 0, to: 0 },
						sizes: [],
					},
				};
			}

			throw new Error('Invalid product');
		},
	},
};

export default resolvers;
