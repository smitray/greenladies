import 'dotenv/config';
import 'reflect-metadata';
import './api/shopping-cart';

import RedisSession from 'connect-redis';
import express from 'express';
import session, { SessionOptions } from 'express-session';

import { createApolloServer } from './create-apollo-server';
import { createGreenLadiesAttributeSet } from './create-attribute-set';
import { syncMagentoProductsAndCategories } from './magento-sync';
import { getRedisCacheConnection } from './redis-connection';

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

	if (process.env.NODE_ENV === 'production') {
		app.set('trust proxy', 1);
		if (sessionOptions.cookie) {
			sessionOptions.cookie.secure = true;
		}
	}

	app.use(session(sessionOptions));

	syncMagentoProductsAndCategories()
		.then(() => console.log('Successfully synced magento to redis'))
		.catch(error => console.log('Could not sync magento', error.message));

	createGreenLadiesAttributeSet()
		.then(() => console.log('Successfully created attribute set'))
		.catch(error => console.log('Could not create attribute set', error.message));

	const server = await createApolloServer();
	server.applyMiddleware({
		app,
		cors: {
			credentials: true,
			origin: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : false,
		},
	});

	app.listen(3000, () => {
		console.log('Server running');
	});
})();
