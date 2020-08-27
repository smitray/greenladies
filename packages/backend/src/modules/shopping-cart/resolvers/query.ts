import { ShoppingCartModuleResolversType } from '..';
import { ShoppingCartProvider } from '../shopping-cart.provider';

const resolvers: ShoppingCartModuleResolversType = {
	Query: {
		shoppingCart: async (_parent, _args, { request, injector }) => {
			if (!request.session) {
				throw new Error('No session available');
			}

			if (!request.session.guestShoppingCart) {
				request.session.guestShoppingCart = {
					cartId: await injector.get(ShoppingCartProvider).createGuestShoppingCart(),
				};
			}

			return { id: request.session.guestShoppingCart.cartId };
		},
	},
};

export default resolvers;
