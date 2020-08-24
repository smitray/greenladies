import 'dotenv/config';

import axios from 'axios';

import { ShoppingCartModuleResolversType } from '..';
import { base64 } from '../../../utils/base64';
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
		klarnaCartSnippet: async (_parent, _args, { injector, request }) => {
			if (!request.session) {
				throw new Error('There is no session available');
			}

			if (!request.session.guestShoppingCart) {
				throw new Error('There is no cart available');
			}

			const cartId = request.session.guestShoppingCart.cartId;

			if (!request.session.guestShoppingCart.klarnaCartSnippet) {
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
					const HOST = String(process.env.HOST);

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
								terms: `${HOST}/terms`,
								checkout: `${HOST}/checkout/{checkout.order.id}`,
								confirmation: `${HOST}/order-confirmation/{checkout.order.id}`,
								push: 'https://www.example.com/api/push?order_id={checkout.order.id}',
							},
						},
						{
							headers: {
								Authorization: `Basic ${base64(KLARNA_USER_ID + ':' + KLARNA_PASSWORD)}`,
							},
						},
					);

					request.session.guestShoppingCart.klarnaCartSnippet = order.html_snippet as string;
				} catch (error) {
					throw new Error('Could not create Klarna order');
				}
			}

			return request.session.guestShoppingCart.klarnaCartSnippet;
		},
	},
};

export default resolvers;
