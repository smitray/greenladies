import { ShoppingCartModuleResolversType } from '..';

const resolvers: ShoppingCartModuleResolversType = {
	Query: {
		shoppingCart: (_parent, _args, { request }) => {
			console.log(request.session);
			if (request.session?.guestShoppingCartId) {
				return { id: request.session.guestShoppingCartId };
			}

			return null;
		},
	},
};

export default resolvers;
