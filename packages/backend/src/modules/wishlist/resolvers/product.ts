import { WishlistModuleResolversType } from '..';

const resolvers: WishlistModuleResolversType = {
	Product: {
		inWishlist: ({ id }, _args, { request }) => {
			if (request.session?.wishlist) {
				return request.session.wishlist.findIndex(productId => productId === id) !== -1;
			}

			return false;
		},
	},
};

export default resolvers;
