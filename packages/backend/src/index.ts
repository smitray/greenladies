import 'reflect-metadata';

import axios from 'axios';
import RedisSession from 'connect-redis';
import express from 'express';
import session, { SessionOptions } from 'express-session';
import { gql, GraphQLClient } from 'graphql-request';
import { createConnection, getRepository } from 'typeorm';

import { getGuestShoppingCartItems } from './api/shopping-cart';
import { createApolloServer } from './create-apollo-server';
import { createGreenLadiesAttributeSet } from './create-attribute-set';
import { Link } from './entities/link';
import { MegamenuSection } from './entities/megamenu-section';
import { MegamenuSectionItem } from './entities/megamenu-section-item';
import { MegamenuToplevelItem } from './entities/megamenu-toplevel-item';
import { getProductConfiguration, syncMagentoProductsAndCategories, updateProductConfiguration } from './magento-sync';
import { getRedisCache, getRedisCacheConnection } from './redis-connection';
import typeormConfig from './typeorm-config';
import { base64 } from './utils/base64';

const RedisSessionStore = RedisSession(session);

const sessionOptions: SessionOptions = {
	secret: String(process.env.APP_SECRET),
	resave: false,
	saveUninitialized: false,
	cookie: {
		httpOnly: true,
		maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
		path: '/',
		sameSite: 'strict',
		secure: false,
	},
	store: new RedisSessionStore({ client: getRedisCacheConnection() }),
};

(async function () {
	const app = express();

	await createConnection(typeormConfig);

	if (process.env.NODE_ENV === 'development') {
		const megamenuToplevelItemRepository = getRepository(MegamenuToplevelItem);
		const megamenuSectionRepository = getRepository(MegamenuSection);
		const megamenuSectionItemRepository = getRepository(MegamenuSectionItem);
		const linkRepository = getRepository(Link);

		const toplevelItems = await megamenuToplevelItemRepository.find();

		const a = [
			{
				name: 'Kläder',
				position: 0,
				link: {
					type: 'category',
					to: '6',
				},
				sections: [
					{
						name: 'Alla kläder',
						position: 0,
						items: [
							{
								name: 'Byxor',
								position: 0,
								link: {
									type: 'category',
									to: '7',
								},
							},
							{
								name: 'Jeans',
								position: 1,
								link: {
									type: 'category',
									to: '8',
								},
							},
							{
								name: 'Mer byxor',
								position: 2,
								link: {
									type: 'category',
									to: '9',
								},
							},
						],
					},
					{
						name: 'Alla 123',
						position: 1,
						items: [
							{
								name: 'Byxor',
								position: 0,
								link: {
									type: 'category',
									to: '7',
								},
							},
							{
								name: 'Jeans',
								position: 1,
								link: {
									type: 'category',
									to: '8',
								},
							},
							{
								name: 'Mer byxor',
								position: 2,
								link: {
									type: 'category',
									to: '9',
								},
							},
							{
								name: 'Byxor',
								position: 3,
								link: {
									type: 'category',
									to: '7',
								},
							},
							{
								name: 'Jeans',
								position: 4,
								link: {
									type: 'category',
									to: '8',
								},
							},
							{
								name: 'Mer byxor',
								position: 5,
								link: {
									type: 'category',
									to: '9',
								},
							},
						],
					},
					{
						name: 'Alla kläder',
						position: 2,
						items: [
							{
								name: 'Byxor',
								position: 0,
								link: {
									type: 'external',
									to: 'http://google.com',
								},
							},
							{
								name: 'Jeans',
								position: 1,
								link: {
									type: 'custom',
									to: '/home/test',
								},
							},
							{
								name: 'Mer byxor',
								position: 2,
								link: {
									type: 'product',
									to: '1058',
								},
							},
						],
					},
					{
						name: 'Alla 123',
						position: 3,
						items: [
							{
								name: 'Byxor',
								position: 0,
								link: {
									type: 'category',
									to: '7',
								},
							},
							{
								name: 'Jeans',
								position: 1,
								link: {
									type: 'category',
									to: '8',
								},
							},
							{
								name: 'Mer byxor',
								position: 2,
								link: {
									type: 'category',
									to: '9',
								},
							},
							{
								name: 'Byxor',
								position: 3,
								link: {
									type: 'category',
									to: '7',
								},
							},
							{
								name: 'Jeans',
								position: 4,
								link: {
									type: 'category',
									to: '8',
								},
							},
							{
								name: 'Mer byxor',
								position: 5,
								link: {
									type: 'category',
									to: '9',
								},
							},
						],
					},
				],
			},
		];
		if (toplevelItems.length === 0) {
			await Promise.all(
				a.map(async toplevelItem => {
					let link = linkRepository.create(toplevelItem.link);
					link = await linkRepository.save(link);

					const sections = await Promise.all(
						toplevelItem.sections.map(async section => {
							const items = await Promise.all(
								section.items.map(async item => {
									let link = linkRepository.create(item.link);
									link = await linkRepository.save(link);

									const r = megamenuSectionItemRepository.create({
										name: item.name,
										position: item.position,
										link,
									});
									return megamenuSectionItemRepository.save(r);
								}),
							);

							const r = megamenuSectionRepository.create({
								name: section.name,
								position: section.position,
								items,
							});
							return megamenuSectionRepository.save(r);
						}),
					);

					const r = megamenuToplevelItemRepository.create({
						name: toplevelItem.name,
						position: toplevelItem.position,
						link,
						sections,
					});
					return megamenuToplevelItemRepository.save(r);
				}),
			);
		}
	}

	if (process.env.NODE_ENV === 'production') {
		app.set('trust proxy', 1);
		if (sessionOptions.cookie) {
			sessionOptions.cookie.secure = true;
		}
	}

	app.use(session(sessionOptions));

	app.post('/api/klarna/order-validation', (req, res) => {
		console.log(req);
		// TODO: this is called when the customer presses buy, but before they are redirected, this is where we create the order
		// cannot take more than 3000ms
		return res.status(200);
	});

	app.get('/api/klarna/order-confirmation/:orderId', async (req, res) => {
		if (!req.session?.guestShoppingCart) {
			return res.send({ error: 'No cart available' });
		}

		const KLARNA_USER_ID = String(process.env.KLARNA_USER_ID);
		const KLARNA_PASSWORD = String(process.env.KLARNA_PASSWORD);
		const KLARNA_API = String(process.env.KLARNA_API);

		let order: any | null = null;
		try {
			const { data } = await axios.get(KLARNA_API + '/checkout/v3/orders/' + req.params.orderId, {
				headers: {
					Authorization: `Basic ${base64(KLARNA_USER_ID + ':' + KLARNA_PASSWORD)}`,
				},
			});
			order = data;
		} catch (error) {
			return res.send({ error: 'Klarna order not found' });
		}

		const items = await getGuestShoppingCartItems(req.session.guestShoppingCart.cartId);

		try {
			const client = new GraphQLClient('http://magento2/graphql');
			await client.request(
				gql`
					mutation PlaceOrderMutation(
						$setShippingAddressesOnCartInput: SetShippingAddressesOnCartInput!
						$setBillingAddressOnCartInput: SetBillingAddressOnCartInput!
						$setShippingMethodsOnCartInput: SetShippingMethodsOnCartInput!
						$setGuestEmailOnCartInput: SetGuestEmailOnCartInput!
						$setPaymentMethodOnCartInput: SetPaymentMethodOnCartInput!
						$placeOrderInput: PlaceOrderInput!
					) {
						setShippingAddressesOnCart(input: $setShippingAddressesOnCartInput) {
							cart {
								shipping_addresses {
									firstname
									lastname
									company
									street
									city
									region {
										code
										label
									}
									postcode
									telephone
									country {
										code
										label
									}
								}
							}
						}
						setBillingAddressOnCart(input: $setBillingAddressOnCartInput) {
							cart {
								billing_address {
									firstname
									lastname
									company
									street
									city
									region {
										code
										label
									}
									postcode
									telephone
									country {
										code
										label
									}
								}
							}
						}
						setShippingMethodsOnCart(input: $setShippingMethodsOnCartInput) {
							cart {
								shipping_addresses {
									selected_shipping_method {
										carrier_code
										method_code
										carrier_title
										method_title
									}
								}
							}
						}
						setGuestEmailOnCart(input: $setGuestEmailOnCartInput) {
							cart {
								email
							}
						}
						setPaymentMethodOnCart(input: $setPaymentMethodOnCartInput) {
							cart {
								selected_payment_method {
									code
								}
							}
						}
						placeOrder(input: $placeOrderInput) {
							order {
								order_number
							}
						}
					}
				`,
				{
					setShippingAddressesOnCartInput: {
						cart_id: req.session.guestShoppingCart.cartId,
						shipping_addresses: [
							{
								address: {
									city: order.billing_address.city,
									country_code: order.purchase_country,
									firstname: order.billing_address.given_name,
									lastname: order.billing_address.family_name,
									postcode: order.billing_address.postal_code,
									street: [order.billing_address.street_address],
									telephone: order.billing_address.phone,
								},
							},
						],
					},
					setBillingAddressOnCartInput: {
						cart_id: req.session.guestShoppingCart.cartId,
						billing_address: {
							address: {
								city: order.billing_address.city,
								country_code: order.purchase_country,
								firstname: order.billing_address.given_name,
								lastname: order.billing_address.family_name,
								postcode: order.billing_address.postal_code,
								street: [order.billing_address.street_address],
								telephone: order.billing_address.phone,
							},
						},
					},
					setShippingMethodsOnCartInput: {
						cart_id: req.session.guestShoppingCart.cartId,
						shipping_methods: [
							{
								carrier_code: 'flatrate',
								method_code: 'flatrate',
							},
						],
					},
					setGuestEmailOnCartInput: {
						cart_id: req.session.guestShoppingCart.cartId,
						email: order.billing_address.email,
					},
					setPaymentMethodOnCartInput: {
						cart_id: req.session.guestShoppingCart.cartId,
						payment_method: {
							code: 'checkmo',
						},
					},
					placeOrderInput: {
						cart_id: req.session.guestShoppingCart.cartId,
					},
				},
			);
		} catch (error) {
			// Could not create order
			return res.redirect('/order-failure');
		}

		const redisCache = getRedisCache();
		await redisCache.set(`klarnaOrderConfirmSnippet:${order.order_id}`, order.html_snippet, 60 * 60 * 24 * 7);

		await Promise.all(
			items.map(async item => {
				const configuration = await getProductConfiguration({ sku: item.sku });
				await updateProductConfiguration({
					...configuration,
					quantity: configuration.quantity - item.qty,
				});
			}),
		);

		req.session.guestShoppingCart = undefined;

		return res.redirect('/order-success/' + order.order_id);
	});

	syncMagentoProductsAndCategories()
		.then(() => console.log('Successfully synced magento to redis'))
		.catch(error => console.log('Could not sync magento', error.message, error));

	createGreenLadiesAttributeSet()
		.then(() => console.log('Successfully created attribute set'))
		.catch(error => console.log('Could not create attribute set', error.message));

	const server = await createApolloServer();
	server.applyMiddleware({
		app,
		path: '/api/graphql',
		cors: {
			credentials: true,
			origin: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : false,
		},
	});

	app.listen(3000, () => {
		console.log('Server running');
	});
})();
