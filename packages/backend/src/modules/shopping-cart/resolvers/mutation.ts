import { ShoppingCartModuleResolversType } from '..';
import { fromGlobalId, transformGlobaIdInObject } from '../../../utils/global-id';
import { ProductProvider } from '../../product/product.provider';
import { ShoppingCartProvider } from '../shopping-cart.provider';

const resolvers: ShoppingCartModuleResolversType = {
	Mutation: {
		addProductToCart: async (_parent, { input }, { injector, request }) => {
			try {
				if (!request.session) {
					throw new Error('There is no session available');
				}

				if (!request.session.guestShoppingCart) {
					request.session.guestShoppingCart = {
						cartId: await injector.get(ShoppingCartProvider).createGuestShoppingCart(),
					};
				}

				request.session.guestShoppingCart.klarna = undefined;

				const cartId = request.session.guestShoppingCart.cartId;

				const product = await injector
					.get(ProductProvider)
					.getProductConfiguration(transformGlobaIdInObject('ProductConfiguration', input.product));

				const item = await injector.get(ShoppingCartProvider).addProductToGuestShoppingCart({
					cartId,
					productId: product.id,
					quantity: input.quantity,
				});

				return {
					shoppingCartItemEdge: {
						node: {
							id: item.item_id.toString(),
							amount: item.qty,
							product: product,
						},
						cursor: '',
					},
				};
			} catch (error) {
				console.log(error);
				throw error;
			}
		},
		updateProductAmountInCart: async (_parent, { input }, { injector, request }) => {
			if (!request.session) {
				throw new Error('There is no session available');
			}

			if (!request.session.guestShoppingCart) {
				throw new Error('There is no cart available');
			}

			request.session.guestShoppingCart.klarna = undefined;

			const cartId = request.session.guestShoppingCart.cartId;

			const item = await injector.get(ShoppingCartProvider).updateGuestShoppingCartProductQuantity({
				cartId,
				itemId: fromGlobalId(input.itemId).id,
				quantity: input.quantity,
			});

			const product = await injector.get(ProductProvider).getProductConfiguration({ sku: item.sku });

			return {
				shoppingCartItemEdge: {
					node: {
						id: item.item_id.toString(),
						amount: item.qty,
						product: product,
					},
					cursor: '',
				},
			};
		},
		removeProductFromCart: async (_parent, { input }, { injector, request }) => {
			if (!request.session) {
				throw new Error('There is no session available');
			}

			if (!request.session.guestShoppingCart) {
				throw new Error('There is no cart available');
			}

			request.session.guestShoppingCart.klarna = undefined;

			const cartId = request.session.guestShoppingCart.cartId;

			const success = await injector.get(ShoppingCartProvider).deleteProductFromGuestShoppingCart({
				cartId,
				itemId: fromGlobalId(input.itemId).id,
			});

			return {
				success,
			};
		},
	},
};

export default resolvers;
