import 'dotenv/config';
import 'reflect-metadata';

import express from 'express';
import session, { SessionOptions } from 'express-session';

import { createApolloServer } from './create-apollo-server';
import { syncMagentoProductsAndCategories } from './magento-sync';

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
		.catch(() => console.log('Could not sync magento'));

	const server = await createApolloServer();
	server.applyMiddleware({
		app,
	});

	app.listen(3000, () => {
		console.log('Server running');
	});
})();
