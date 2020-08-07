import 'dotenv/config';
import 'reflect-metadata';

import express from 'express';

import { createApolloServer } from './create-apollo-server';
import { syncMagentoProductsAndCategories } from './magento-sync';

(async function () {
	const app = express();

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
