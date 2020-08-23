import { ShoppingCartModuleResolversType } from '..';
import { connectionFromArray } from '../../../utils/relay';
import { ProductProvider } from '../../product/product.provider';
import { ShoppingCartProvider } from '../shopping-cart.provider';

const resolvers: ShoppingCartModuleResolversType = {
	ShoppingCart: {
		items: async ({ id }, args, { injector }) => {
			const items = await injector.get(ShoppingCartProvider).getGuestShoppingCartItems(id);

			const processedItems = await Promise.all(
				items.map(async item => {
					const product = await injector.get(ProductProvider).getProductBySku(item.sku);
					return {
						id: item.item_id.toString(),
						product: {
							id: product.id,
						},
						amount: item.qty,
					};
				}),
			);

			return connectionFromArray(processedItems, args);
		},
	},
};

export default resolvers;
