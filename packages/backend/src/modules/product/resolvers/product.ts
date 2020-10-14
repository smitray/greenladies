import { ProductModuleResolversType } from '..';
import { toGlobalId } from '../../../utils/global-id';
import { connectionFromArray } from '../../../utils/relay';
import { ProductProvider } from '../product.provider';

const resolvers: ProductModuleResolversType = {
	Product: {
		id: ({ id }) => {
			return toGlobalId('Product', id);
		},
		sku: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getConfigurableProduct({ id });
			return product.sku;
		},
		urlKey: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getConfigurableProduct({ id });
			return product.urlKey;
		},
		name: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getConfigurableProduct({ id });

			return product.name;
		},
		brand: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getConfigurableProduct({ id });
			return product.brand;
		},
		metaTitle: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getConfigurableProduct({ id });
			return product.metaData.title;
		},
		metaKeyword: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getConfigurableProduct({ id });
			return product.metaData.keyword;
		},
		metaDescription: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getConfigurableProduct({ id });
			return product.metaData.description;
		},
		fullDescription: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getConfigurableProduct({ id });
			return product.description.full;
		},
		shortDescription: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getConfigurableProduct({ id });
			return product.description.short;
		},
		washingDescription: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getConfigurableProduct({ id });
			return product.washingDescription;
		},
		material: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getConfigurableProduct({ id });
			return product.material;
		},
		condition: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getConfigurableProduct({ id });
			return product.condition;
		},
		image: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getConfigurableProduct({ id });
			const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
			const DOMAIN = String(process.env.DOMAIN);

			return `${protocol}://magento.${DOMAIN}/media/catalog/product${product.image}`;
		},
		images: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getConfigurableProduct({ id });
			const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
			const DOMAIN = String(process.env.DOMAIN);

			return product.images.map(path => `${protocol}://magento.${DOMAIN}/media/catalog/product${path}`);
		},
		productConfigurations: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getConfigurableProduct({ id });
			return product.productConfigurationIds.map(virtualProductId => ({ id: virtualProductId }));
		},
		originalPrice: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getConfigurableProduct({ id });
			return product.price;
		},
		specialPrice: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getConfigurableProduct({ id });
			return product.specialPrice;
		},
		currency: async ({ id }, _args, { injector }) => {
			const product = await injector.get(ProductProvider).getConfigurableProduct({ id });
			return product.currency;
		},
		relatedProducts: async ({ id }, args, { injector }) => {
			const product = await injector.get(ProductProvider).getConfigurableProduct({ id });
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
		},
	},
};

export default resolvers;
