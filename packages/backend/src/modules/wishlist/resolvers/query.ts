import { WishlistModuleResolversType } from '..';
import { Product } from '../../../magento-sync';
import { connectionFromArray } from '../../../utils/relay';
import { ProductProvider } from '../../product/product.provider';

const resolvers: WishlistModuleResolversType = {
	Query: {
		wishlist: async (_parent, args, { request, injector }) => {
			if (!request.session) {
				return {
					products: {
						...connectionFromArray([], args),
						availableFilters: {
							brands: [],
							colors: [],
							price: {
								from: 0,
								to: 0,
							},
							sizes: [],
						},
					},
				};
			}

			if (!request.session.wishlist) {
				return {
					products: {
						...connectionFromArray([], args),
						availableFilters: {
							brands: [],
							colors: [],
							price: {
								from: 0,
								to: 0,
							},
							sizes: [],
						},
					},
				};
			}

			const products = await Promise.all(
				request.session.wishlist.map(productId =>
					injector
						.get(ProductProvider)
						.getProductById(productId)
						.catch(() => productId),
				),
			);

			const { foundProducts, notFoundProductsIds } = products.reduce<{
				foundProducts: Product[];
				notFoundProductsIds: string[];
			}>(
				(prev, current) => {
					if (typeof current === 'string') {
						return {
							foundProducts: prev.foundProducts,
							notFoundProductsIds: [...prev.notFoundProductsIds, current],
						};
					}

					return {
						foundProducts: [...prev.foundProducts, current],
						notFoundProductsIds: prev.notFoundProductsIds,
					};
				},
				{
					foundProducts: [],
					notFoundProductsIds: [],
				},
			);

			if (notFoundProductsIds.length > 0) {
				request.session.wishlist = request.session.wishlist.filter(
					productId => notFoundProductsIds.findIndex(notFoundProductId => notFoundProductId === productId) === -1,
				);
			}

			return {
				products: {
					...connectionFromArray(foundProducts, args),
					availableFilters: {
						brands: [],
						colors: [],
						price: {
							from: 0,
							to: 0,
						},
						sizes: [],
					},
				},
			};
		},
	},
};

export default resolvers;
