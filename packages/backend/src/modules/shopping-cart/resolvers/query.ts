import { ShoppingCartModuleResolversType } from '..';

const resolvers: ShoppingCartModuleResolversType = {
	Query: {
		shoppingCart: (_parent, _args, { request }) => {
			if (request.session?.shoppingCart) {
				// return shopping cart
			}

			return null;
		},
	},
};

export default resolvers;
