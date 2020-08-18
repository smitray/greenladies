import { WishlistModuleResolversType } from '..';
import { transformGlobaIdInObject } from '../../../utils/global-id';
import { ProductProvider } from '../../product/product.provider';

const resolvers: WishlistModuleResolversType = {
	Mutation: {
		addProductToWishlist: async (_parent, { input }, { request, injector }) => {
			if (!request.session) {
				throw new Error('There is no session available');
			}

			const product = await injector
				.get(ProductProvider)
				.getProduct(transformGlobaIdInObject('Product', input.product));

			if (!request.session.wishlist) {
				request.session.wishlist = [product.id];
			} else {
				request.session.wishlist = [...new Set([...request.session.wishlist, product.id])];
			}

			return {
				product,
			};
		},
		removeProductFromWishlist: async (_parent, { input }, { request, injector }) => {
			if (!request.session) {
				throw new Error('There is no session available');
			}

			const product = await injector
				.get(ProductProvider)
				.getProduct(transformGlobaIdInObject('Product', input.product));

			if (request.session.wishlist) {
				request.session.wishlist = request.session.wishlist.filter(productId => productId !== product.id);
			}

			return {
				success: true,
			};
		},
	},
};

export default resolvers;
