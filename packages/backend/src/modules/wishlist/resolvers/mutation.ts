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
				.getConfigurableProduct(transformGlobaIdInObject('Product', input.product));

			if (!request.session.wishlist) {
				request.session.wishlist = [product.id];
			} else {
				request.session.wishlist = [...new Set([...request.session.wishlist, product.id])];
			}

			return {
				productEdge: {
					node: product,
					cursor: '',
				},
			};
		},
		removeProductFromWishlist: async (_parent, { input }, { request, injector }) => {
			if (!request.session) {
				throw new Error('There is no session available');
			}

			const product = await injector
				.get(ProductProvider)
				.getConfigurableProduct(transformGlobaIdInObject('Product', input.product));

			if (request.session.wishlist) {
				request.session.wishlist = request.session.wishlist.filter(productId => productId !== product.id);
			}

			return {
				productEdge: {
					node: product,
					cursor: '',
				},
			};
		},
		clearWishlist: (_parent, _args, { request }) => {
			if (!request.session) {
				throw new Error('There is no session available');
			}

			request.session.wishlist = [];

			return true;
		},
	},
};

export default resolvers;
