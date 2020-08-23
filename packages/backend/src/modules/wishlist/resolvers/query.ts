import { WishlistModuleResolversType } from '..';
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
				request.session.wishlist.map(productId => injector.get(ProductProvider).getProductById(productId)),
			);

			return {
				products: {
					...connectionFromArray(products, args),
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
