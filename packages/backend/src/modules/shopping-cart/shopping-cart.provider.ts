import { Injectable, ProviderScope } from '@graphql-modules/di';

import {
	addProductToGuestShoppingCart,
	createGuestShoppingCart,
	getGuestShoppingCart,
	getGuestShoppingCartItems,
} from '../../api/shopping-cart';
import { ProductProvider } from '../product/product.provider';

@Injectable({ scope: ProviderScope.Request })
export class ShoppingCartProvider {
	constructor(private productProvider: ProductProvider) {}

	getGuestShoppingCart(cartId: string) {
		return getGuestShoppingCart(cartId);
	}

	getGuestShoppingCartItems(cartId: string) {
		return getGuestShoppingCartItems(cartId);
	}

	createGuestShoppingCart() {
		return createGuestShoppingCart();
	}

	async addProductToGuestShoppingCart({
		cartId,
		productId,
		quantity,
	}: {
		cartId: string;
		productId: string;
		quantity: number;
	}) {
		const product = await this.productProvider.getProductById(productId);

		return addProductToGuestShoppingCart({
			cartId,
			productSku: product.sku,
			quantity,
		});
	}
}
