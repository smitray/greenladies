import { WishlistModuleResolversType } from '..';
import { connectionFromArray } from '../../../utils/relay';
import { ProductProvider } from '../../product/product.provider';

const resolvers: WishlistModuleResolversType = {
	Query: {
		wishlist: async (_parent, args, { request, injector }) => {
			if (!request.session) {
				return {
					...connectionFromArray([], {}),
					availableFilters: [],
				};
			}

			if (!request.session.wishlist) {
				return {
					...connectionFromArray([], {}),
					availableFilters: [],
				};
			}

			const products = await Promise.all(
				request.session.wishlist.map(productId => injector.get(ProductProvider).getProductById(productId)),
			);

			return {
				...connectionFromArray(products, args),
				availableFilters: [],
			};
		},
	},
};

export default resolvers;
