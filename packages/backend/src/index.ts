import 'reflect-metadata';

import axios from 'axios';
import RedisSession from 'connect-redis';
import cors from 'cors';
import crypto from 'crypto';
import express from 'express';
import fileUpload from 'express-fileupload';
import session, { SessionOptions } from 'express-session';
import fs from 'fs';
import { gql, GraphQLClient } from 'graphql-request';
import moment from 'moment';
import cron from 'node-cron';
import path from 'path';
import { createConnection, getRepository } from 'typeorm';

import { getGuestShoppingCartItems } from './api/shopping-cart';
import { createApolloServer } from './create-apollo-server';
import { createGreenLadiesAttributeSet } from './create-attribute-set';
import { User } from './entities/user';
import { initCustomPages, initMegamenu } from './init-db';
import {
	getConfigurableProduct,
	getProductConfiguration,
	syncMagentoProductsAndCategories,
	updateConfigurableProduct,
	updateProductConfiguration,
} from './magento-sync';
import { getRedisCache, getRedisCacheConnection } from './redis-connection';
import typeormConfig from './typeorm-config';
import { base64 } from './utils/base64';
import { domain } from './utils/domain';

const PROTOCOL = process.env.NODE_ENV === 'production' ? 'https://' : 'http://';
const DOMAIN = String(process.env.DOMAIN);

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
		domain: domain(),
	},
	store: new RedisSessionStore({ client: getRedisCacheConnection() }),
};

(async function () {
	const app = express();

	app.use('/static', express.static(path.join(__dirname, '..', 'static')));

	await createConnection(typeormConfig);

	initMegamenu().catch(e => {
		if (process.env.NODE_ENV === 'production') {
			console.log('Could not init megamenu', e);
		} else {
			console.log('Could not init megamenu', e.message);
		}
	});
	initCustomPages().catch(e => {
		if (process.env.NODE_ENV === 'production') {
			console.log('Could not init custom pages', e);
		} else {
			console.log('Could not init custom pages', e.message);
		}
	});

	if (process.env.NODE_ENV === 'production') {
		app.set('trust proxy', 1);
		if (sessionOptions.cookie) {
			sessionOptions.cookie.secure = true;
		}
	}

	app.use(session(sessionOptions));

	app.use(
		fileUpload({
			limits: { fileSize: 50 * 1024 * 1024 },
		}),
	);

	app.use(
		cors({
			credentials: true,
			origin: `${PROTOCOL}${DOMAIN}`,
		}),
	);

	app.post('/upload-image', (req, res) => {
		if (!req.session) {
			throw new Error('No session');
		}

		if (!req.session.auth) {
			throw new Error('Must be logged in to perform action');
		}

		if (!req.files?.image) {
			throw new Error('Image must be provided');
		}

		const image = req.files.image;
		if (Array.isArray(image)) {
			throw new Error('Can only upload one image at a time');
		}

		if (image.mimetype !== 'image/jpeg' && image.mimetype !== 'image/png') {
			throw new Error('Only supports jpeg and png for now');
		}

		try {
			const files = fs.readdirSync(path.join(__dirname, '../static/images'));
			let filename = image.name;
			if (files.includes(image.name)) {
				const name = image.name.slice(0, image.name.lastIndexOf('.'));
				const ext = image.name.slice(image.name.lastIndexOf('.') + 1);
				let i = 0;
				while (files.includes(`${name}_${i}.${ext}`)) {
					i++;
				}
				filename = `${name}_${i}.${ext}`;
			}

			fs.writeFileSync(path.join(__dirname, '../static/images', filename), image.data);

			res.send('Uploaded image successfully');
		} catch (e) {
			res.status(400).send('Something went wrong');
		}
	});

	app.get('/sync-magento', async (_req, res) => {
		try {
			await syncMagentoProductsAndCategories();
			return res.send('OK');
		} catch (error) {
			return res.send(error);
		}
	});

	app.post('/klarna/order-validation', (req, res) => {
		console.log(req);
		// TODO: this is called when the customer presses buy, but before they are redirected, this is where we create the order
		// cannot take more than 3000ms
		return res.status(200);
	});

	app.get('/klarna/order-confirmation/:orderId', async (req, res) => {
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

		const redisCache = getRedisCache();
		const cartId = await redisCache.get<string>('klarnaOrderToCartId:' + order.order_id);

		const items = await getGuestShoppingCartItems(cartId);

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
						cart_id: cartId,
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
						cart_id: cartId,
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
						cart_id: cartId,
						shipping_methods: [
							{
								carrier_code: 'flatrate',
								method_code: 'flatrate',
							},
						],
					},
					setGuestEmailOnCartInput: {
						cart_id: cartId,
						email: order.billing_address.email,
					},
					setPaymentMethodOnCartInput: {
						cart_id: cartId,
						payment_method: {
							code: 'checkmo',
						},
					},
					placeOrderInput: {
						cart_id: cartId,
					},
				},
			);
		} catch (error) {
			// Could not create order
			const PROTOCOL = process.env.NODE_ENV === 'production' ? 'https://' : 'http://';
			const DOMAIN = String(process.env.DOMAIN);
			return res.redirect(`${PROTOCOL}${DOMAIN}/order-failure`);
		}

		await redisCache.set(`klarnaOrderConfirmSnippet:${order.order_id}`, order.html_snippet, 60 * 60 * 24 * 7);

		for (const item of items) {
			const configuration = await getProductConfiguration({ sku: item.sku });
			await updateProductConfiguration({
				...configuration,
				quantity: configuration.quantity - item.qty,
			});
			const product = await getConfigurableProduct({ id: configuration.parentId });
			await updateConfigurableProduct({
				...product,
				totalStock: product.totalStock - item.qty,
			});
		}

		const PROTOCOL = process.env.NODE_ENV === 'production' ? 'https://' : 'http://';
		const DOMAIN = String(process.env.DOMAIN);
		return res.redirect(`${PROTOCOL}${DOMAIN}/order-success/${order.order_id}`);
	});

	syncMagentoProductsAndCategories()
		.then(() => console.log('Successfully synced magento to redis'))
		.catch(() => console.log('Could not sync magento'));
	// .catch(error => console.log('Could not sync magento', error.message, error));

	createGreenLadiesAttributeSet()
		.then(() => console.log('Successfully created attribute set'))
		.catch(() => console.log('Could not create attribute set'));
	// .catch(error => console.log('Could not create attribute set', error.message, error));

	const userRepository = getRepository(User);
	const users = await userRepository.find();
	if (users.length === 0) {
		const password = crypto.randomBytes(32).toString('hex');
		const user = userRepository.create({
			username: 'admin',
			password,
		});
		await userRepository.save(user);
		console.log('Create admin user with password:', password);
	}

	// Every hour
	cron.schedule('*/20 * * * *', () => {
		const asyncRun = async () => {
			try {
				await syncMagentoProductsAndCategories();
				console.log(`[${moment().format()}] Successfully synced magento products`);
			} catch (error) {
				console.log(`[${moment().format()}] Failed to sync magento`, error);
			}
		};

		asyncRun();
	});

	const server = await createApolloServer();
	server.applyMiddleware({
		app,
		path: '/graphql',
		cors: {
			credentials: true,
			origin: `${PROTOCOL}${DOMAIN}`,
		},
	});

	app.listen(3000, () => {
		console.log('Server running');
	});
})();
