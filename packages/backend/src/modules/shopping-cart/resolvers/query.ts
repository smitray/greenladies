import { ShoppingCartModuleResolversType } from '..';
import { ShoppingCartProvider } from '../shopping-cart.provider';

const resolvers: ShoppingCartModuleResolversType = {
	Query: {
		shoppingCart: async (_parent, _args, { request, injector }) => {
			if (!request.session) {
				throw new Error('No session available');
			}

			if (!request.session.guestShoppingCartId) {
				request.session.guestShoppingCartId = await injector.get(ShoppingCartProvider).createGuestShoppingCart();
			}

			return { id: request.session.guestShoppingCartId };
		},
	},
};

export default resolvers;
