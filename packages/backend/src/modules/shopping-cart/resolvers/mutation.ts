import { ShoppingCartModuleResolversType } from '..';
import { ProductProvider } from '../../product/product.provider';
import { ShoppingCartProvider } from '../shopping-cart.provider';

const resolvers: ShoppingCartModuleResolversType = {
	Mutation: {
		addProductToCart: async (_parent, { input }, { injector, request }) => {
			if (!request.session) {
				throw new Error('There is no session available');
			}

			if (!request.session.guestShoppingCartId) {
				request.session.guestShoppingCartId = await injector.get(ShoppingCartProvider).createGuestShoppingCart();
			}

			const guestShoppingCartId: string = request.session.guestShoppingCartId;

			const product = await injector.get(ProductProvider).getProduct(input.product);

			const a = await injector
				.get(ShoppingCartProvider)
				.addProductToGuestShoppingCart({ cartId: guestShoppingCartId, productId: product.id, quantity: input.amount });
			throw new Error('Operation has not been implemented yet');
		},
		updateProductAmountInCart: () => {
			throw new Error('Operation has not been implemented yet');
		},
		removeProductFromCart: () => {
			throw new Error('Operation has not been implemented yet');
		},
	},
};

export default resolvers;
