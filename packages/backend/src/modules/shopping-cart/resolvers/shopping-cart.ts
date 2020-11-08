import axios from 'axios';

import { ShoppingCartModuleResolversType } from '..';
import { getRedisCache } from '../../../redis-connection';
import { base64 } from '../../../utils/base64';
import { toGlobalId } from '../../../utils/global-id';
import { connectionFromArray } from '../../../utils/relay';
import { ProductProvider } from '../../product/product.provider';
import { ShoppingCartProvider } from '../shopping-cart.provider';

const resolvers: ShoppingCartModuleResolversType = {
	ShoppingCart: {
		id: ({ id }) => toGlobalId('ShoppingCart', id),
		items: async ({ id }, args, { injector }) => {
			const items = await injector.get(ShoppingCartProvider).getGuestShoppingCartItems(id);

			const processedItems = await Promise.all(
				items.map(async item => {
					const product = await injector.get(ProductProvider).getProductConfiguration({ sku: item.sku });
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
		klarnaCartSnippet: async (_parent, _args, { injector, request }) => {
			if (!request.session) {
				throw new Error('There is no session available');
			}

			if (!request.session.guestShoppingCart) {
				throw new Error('There is no cart available');
			}

			const cartId = request.session.guestShoppingCart.cartId;

			if (!request.session.guestShoppingCart.klarna) {
				try {
					const items = await injector.get(ShoppingCartProvider).getGuestShoppingCartItems(cartId);
					const orderItems = items.map(item => {
						const totalAmount = item.price * item.qty * 100;
						const taxAmount = Math.round(totalAmount - (totalAmount * 10000) / (10000 + 2500));

						return {
							type: 'physical',
							reference: item.sku,
							name: item.name.replace('\n', ''),
							quantity: item.qty,
							unit_price: item.price * 100,
							tax_rate: 2500,
							total_amount: totalAmount,
							total_tax_amount: taxAmount,
						};
					});
					const orderAmount = orderItems.reduce((prev, current) => {
						return prev + current.total_amount;
					}, 0);
					const orderTax = orderItems.reduce((prev, current) => {
						return prev + current.total_tax_amount;
					}, 0);

					const KLARNA_USER_ID = String(process.env.KLARNA_USER_ID);
					const KLARNA_PASSWORD = String(process.env.KLARNA_PASSWORD);
					const DOMAIN = String(process.env.DOMAIN);

					const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

					const KLARNA_API = String(process.env.KLARNA_API);
					const { data: order } = await axios.post(
						KLARNA_API + '/checkout/v3/orders',
						{
							purchase_country: 'SE',
							purchase_currency: 'SEK',
							locale: 'sv-SE',
							order_amount: orderAmount,
							order_tax_amount: orderTax,
							order_lines: orderItems,
							merchant_urls: {
								terms: `${protocol}://${DOMAIN}/terms`,
								checkout: `${protocol}://${DOMAIN}/checkout`,
								confirmation: `${protocol}://${DOMAIN}/api/klarna/order-confirmation/{checkout.order.id}`,
								push: `${protocol}://${DOMAIN}/api/push?order_id={checkout.order.id}`,
								validation:
									process.env.NODE_ENV === 'production'
										? `${protocol}://${DOMAIN}/api/klarna/order-validation`
										: undefined,
							},
							shipping_options: [
								orderAmount > 99900
									? {
											id: 'dhl-free',
											name: 'DHL Gratis frakt',
											price: 0,
											tax_amount: 0,
											tax_rate: 2500,
											preselected: true,
											shipping_method: 'Postal',
									  }
									: {
											id: 'dhl',
											name: 'DHL',
											price: 5900,
											tax_amount: Math.round(5900 - (5900 * 10000) / (10000 + 2500)),
											tax_rate: 2500,
											preselected: true,
											shipping_method: 'Postal',
									  },
							],
						},
						{
							headers: {
								Authorization: `Basic ${base64(KLARNA_USER_ID + ':' + KLARNA_PASSWORD)}`,
							},
						},
					);

					const redisCache = getRedisCache();
					redisCache.set('klarnaOrderToCartId:' + order.order_id, request.session.guestShoppingCart.cartId);

					request.session.guestShoppingCart.klarna = {
						orderId: order.order_id,
						cartSnippet: order.html_snippet,
					};
				} catch (error) {
					throw new Error('Could not create Klarna order');
				}
			}

			return request.session.guestShoppingCart.klarna.cartSnippet;
		},
		grandTotal: async ({ id }, _args, { injector }) => {
			const totals = await injector.get(ShoppingCartProvider).getShoppingCartTotals(id);

			return totals.subtotal_with_discount + (totals.subtotal_with_discount > 999 ? 0 : 59);
		},
		subTotal: async ({ id }, _args, { injector }) => {
			const totals = await injector.get(ShoppingCartProvider).getShoppingCartTotals(id);

			return totals.subtotal;
		},
		discountAmount: async ({ id }, _args, { injector }) => {
			const totals = await injector.get(ShoppingCartProvider).getShoppingCartTotals(id);

			return -totals.discount_amount;
		},
		shippingCost: async ({ id }, _args, { injector }) => {
			const totals = await injector.get(ShoppingCartProvider).getShoppingCartTotals(id);

			return totals.subtotal_with_discount > 999 ? 0 : 59;
		},
	},
};

export default resolvers;
