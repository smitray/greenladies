import { ShoppingCartModuleResolversType } from '..';
import { toGlobalId } from '../../../utils/global-id';
import { ProductProvider } from '../../product/product.provider';
import { ShoppingCartProvider } from '../shopping-cart.provider';

const resolvers: ShoppingCartModuleResolversType = {
	ShoppingCart: {
		id: ({ id }) => {
			return toGlobalId('ShoppingCart', id);
		},
		items: async ({ id }, _args, { injector }) => {
			const items = await injector.get(ShoppingCartProvider).getGuestShoppingCartItems(id);

			return Promise.all(
				items.map(async item => {
					const product = await injector.get(ProductProvider).getProductBySku(item.sku);
					return {
						product: {
							id: product.id,
						},
						amount: item.qty,
					};
				}),
			);
		},
	},
};

export default resolvers;
